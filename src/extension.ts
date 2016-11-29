import { workspace, window, commands, languages, Disposable, Command, ExtensionContext, Position, Range, Selection, TextDocument, TextEditor, TextEditorEdit, TextEdit } from 'vscode';

import { exec } from 'child_process';
import * as path from 'path';
let open = require('../node_modules/open');
let tmp = require('../node_modules/tmp');
let fs = require('fs');
// import * as fs from 'fs'; // Can't use this because the typed version does not support a property we need. So we're using the require() method instead.

export function activate(context: ExtensionContext): void {
    tmp.setGracefulCleanup();

    // Register the 'phpformatter.fix' command.
    let fixCommand: Disposable =
        commands.registerCommand('phpformatter.fix', () => {
            fix(window.activeTextEditor.document);
        });

    // Register ourselves as a document formatter, so we can do things like FormatOnSave.
    let formattingProvider: Disposable =
        languages.registerDocumentFormattingEditProvider('php', {
            provideDocumentFormattingEdits: (document, options, token) => {
                return fix(document);
            }
        });

    context.subscriptions.push(formattingProvider);
    context.subscriptions.push(fixCommand);
}

function fix(document: TextDocument): TextEdit[] {
    // Makes our code a little more readable by extracting the config properties into their own variables.
    let config = workspace.getConfiguration('phpformatter');
    let _pharPath: string = config.get('pharPath', '');
    let _phpPath: string = config.get('phpPath', '');
    let _composer: boolean = config.get('composer', false);
    let _arguments: Array<string> = config.get('arguments', []);
    let _level: string = config.get('level', '');
    let _fixers: string = config.get('fixers', '');
    let _additionalExtensions: Array<string> = config.get('additionalExtensions', []);
    let _notifications: boolean = config.get('notifications', false);

    if (document.languageId !== 'php') {
        if (Array.isArray(_additionalExtensions) && _additionalExtensions.indexOf(document.languageId) != -1) {
            logDebug('File is in additionalExtensions array, continuing...');
        } else {
            logDebug('This is neither a .php file, nor anything that was set in additionalExtensions. Aborting...');
            return;
        }
    }

    // Variable args will represent the command string.
    // All the arguments for the command will be appended to the array,
    // so they can later be joined and delimited by spaces more easily.
    let args: Array<string> = ['fix'];
    let filePath: string = path.normalize(document.uri.fsPath);

    // Now let's handle anything related to temp files.
    // TODO: Use document.lineCount to warn user about possibly crashing the editor because of having to write the file contents
    logDebug('Creating temp file.');

    let tempFile: any = tmp.fileSync({ prefix: 'phpfmt-' }); // Create temp file itself (empty).
    let tempFileFd: any = tempFile.fd; // File descriptor of temp file
    let prependedPhpTag: boolean = false; // Whether the to-be-fixed content has a '<?php' tag prepended or not. This is important, because if there is not such a tag present, we'll have to prepend it ourselves, otherwise PHP-CS-Fixer won't do anything.
    let fixContent: string = ''; // The content that should be fixed (could be either a selection, or the whole document)
    filePath = tempFile.name;

    logDebug('Tempfile fd: ' + tempFile.fd);
    logDebug('Tempfile name: ' + filePath);
    logDebug('Writing current document content to temp file. Until VSCode will have a way of querying encoding, utf8 will be used for reading and writing.');

    // Get the currently selected document text
    let selection = getSelection();

    // If the user made a selection, then only copy the selected text.
    if (selection !== null) {
        let selectionText = document.getText(selection);

        // If the selected text does not have a PHP opening tag, then
        // prepend one manually. Otherwise PHP-CS-Fixer will not do
        // anything at all.
        if (selectionText.indexOf('<?') == -1) {
            logDebug('No PHP opening tag found, prepending <?php to selection');
            selectionText = '<?php\n' + selectionText;
            prependedPhpTag = true;
        }

        fixContent = selectionText;
    } else {
        fixContent = document.getText();
    }

    // Write the relevant content to the temp file
    fs.writeFileSync(tempFileFd, fixContent, { encoding: 'utf8' });

    // Make sure to put double quotes around our path, otherwise the command
    // (Symfony, actually) will fail when it encounters paths with spaces in them.
    let escapedPath = enquote(filePath);

    args.push(escapedPath);

    // phpformatter.arguments will only be used if neither phpformatter.level
    // nor phpformatter.fixers are set.
    // This will be here until phpformatter.level and phpformatter.fixers are
    // removed from the plugin in a future update.
    if (_level) args.push('--level=' + _level);
    if (_fixers) args.push('--fixers=' + _fixers);

    if (_level == '' && _fixers == '') {
        args = args.concat(_arguments);
    }

    let fixCommand: string = '';
    if (_composer) {
        // If PHP-CS-Fixer was installed using Composer, and it was added to the PATH,
        // then we don't have to prepend the command with 'php' or point to the .phar file.
        fixCommand = 'php-cs-fixer ' + args.join(' ');
    } else if (_pharPath) {
        // If PHP-CS-Fixer was installed manually, then we will have to provide the full
        // .phar file path. And optionally include the php path as well.
        args.unshift(enquote(_pharPath));
        fixCommand = enquote(_phpPath) + ' ' + args.join(' ');
    } else {
        if (_notifications) window.showInformationMessage('Neither a pharPath or use of Composer was specified. Aborting...');
        logDebug('Neither a pharPath or use of Composer was specified. Aborting...');
        return;
    }

    logDebug('Full command being executed: ' + fixCommand);

    let stdout: string = '';
    let stderr: string = '';
    let execResult = exec(fixCommand);

    // Output stdout of the fix command result.
    execResult.stdout.on('data', (buffer: string) => {
        stdout += buffer.toString();
    });

    // Output stderr of the fix command result.
    execResult.stderr.on('data', (buffer: string) => {
        stderr += buffer.toString();
    });

    let textEdit: TextEdit = null;

    // Handle finishing of the fix command.
    execResult.on('close', (code: any) => {
        if (stdout) {
            logDebug('Logging PHP-CS-Fixer command stdout result');
            logDebug(stdout);
        }
        if (stderr) {
            logDebug('Logging PHP-CS-Fixer command stderr result');
            logDebug(stderr);
        }

        // Read the content from the temp file. Pass the encoding as utf8,
        // because we need it to return a string (fs would return buffer
        // otherwise, see https://nodejs.org/docs/latest/api/fs.html#fs_fs_readfilesync_file_options)
        // TODO: Detect current document file encoding so we don't have to
        // assume utf8.
        logDebug('Reading temp file content.');

        // This var will hold the content of the temp file. Every chunk that is read from the ReadStream
        // will be appended to this var.
        let tempFileContent: string = '';

        // The reason we are using fs.createReadStream() instead of simply using fs.readFileSync(),
        // is that the latter does not allow you to set the file descriptor cursor position manually.
        // Doing so is crucial, because otherwise only parts of the file will be read in many cases.
        let readStream = fs.createReadStream(filePath, { fd: tempFileFd, start: 0 });

        // Read the data from the file and append it to the string builder.
        readStream.on('data', (chunk: string) => {
            tempFileContent += chunk;
        });

        // When EOF is reached, copy the results back to the original file.
        readStream.on('end', () => {
            // If we prepended a PHP opening tag manually, we'll have to remove
            // it now, before we overwrite our document.
            if (prependedPhpTag) {
                tempFileContent = tempFileContent.substring(6);
                logDebug('Removed the prepended PHP opening tag from the formatted text.');
            }

            textEdit = handleTempFileFixResults(document, tempFileContent, selection);
        });

        return;
    });

    return new Array<TextEdit>(textEdit);
}

function handleTempFileFixResults(document: TextDocument, fixedContent: string, selection: Range): TextEdit {
    // Determine the active document's end position (last line, last character).
    let documentEndPosition: Position =
        new Position(document.lineCount - 1,
            document.lineAt(new Position(document.lineCount - 1, 0)).range.end.character);
    let editRange: Range = new Range(new Position(0, 0), documentEndPosition);

    // If the user made a selection, save that range so we will only
    // replace that part of code after formatting.
    if (selection !== null) editRange = selection;

    let textEdit: TextEdit = null;

    // Replace either all of the active document's content with that of
    // the temporary file, or, in case there is a selection, replace
    // only the part that the user selected.
    logDebug('Replacing editor content with formatted code.');
    let textEditResult: Thenable<boolean> =
        window.activeTextEditor.edit(
            (textEditorEdit: TextEditorEdit) => {
                textEditorEdit.replace(editRange, fixedContent);
            });

    let numSelectedLines: number = document.lineCount;
    if (selection !== null) {
        numSelectedLines = getNumSelectedLines(selection);
    }

    // Inform the user of the document edits.
    textEditResult.then(
        (success) => {
            if (success) {
                textEdit = new TextEdit(editRange, fixedContent);
                logDebug('Document successfully formatted (' + numSelectedLines + ' lines).');
            } else {
                logDebug('Document failed to format (' + numSelectedLines + ' lines) [from success promise].');
            }
        }, (reason) => {
            logDebug('Document failed to format (' + numSelectedLines + ' lines) [from reason promise].');
        });

    // This does not work for some reason. Keeping this here as a reminder.
    // tempFile.removeCallback();

    return textEdit;
}

function getNumSelectedLines(selection: Range): number {
    return (selection !== null) ? selection.end.line + 1 - selection.start.line : 0;
}

function getSelection(): Range {
    let selection: Range = null;

    if (!window.activeTextEditor.selection.isEmpty) {
        let sel: Selection = window.activeTextEditor.selection;
        selection = new Range(sel.start, sel.end);
        logDebug('User has made a selection in the document ([' + selection.start.line + ', ' + selection.start.character + '], [' + selection.end.line + ', ' + selection.end.character + ']).');
    }

    return selection;
}

// Puts quotes around the given string and returns the resulting string.
function enquote(input: string): string {
    return '"' + input + '"';
}

// Logs a message to the console if the phpformatter.logging setting is set to true.
function logDebug(message: any): void {
    if (workspace.getConfiguration('phpformatter').get('logging', false) === true) {
        console.log('PHPFormatter: ' + message);
    }
}
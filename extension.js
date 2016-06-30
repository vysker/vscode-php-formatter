var vscode = require('vscode');             // Contains the VS Code extensibility API.
var exec = require('child_process').exec;   // Used for executing the php-cs-fixer command
var path = require('path');                 // Used for normalizing the document's path
var open = require('open');                 // Used for opening a browser on the Github page

// This method is called when your extension is activated.
// Your extension is activated the very first time the command is executed.
function activate(context) {
    var saveCommand = vscode.workspace.onDidSaveTextDocument(function(document) {
        fix(document);
    });

    var config = vscode.workspace.getConfiguration('phpformatter');
    if( config.get('notifications', false) &&       // Check whether we are allowed to show notifications
        config.get('pharPath', '') == '' &&         // Did the user not set a .phar path?
        config.get('composer', false) == false      // Did the user not set composer to true?
        ) {
        // If we arrive here, then we can safely say the user has not set up the extension yet. So let's notify them about that.

        // Create a button that opens browser with the Github page at the installation guide anchor
        var guideButton = {
            'title': 'Guide',
            'slug': 'open-guide',
            'action': function() {
                open('https://github.com/Dickurt/vscode-php-formatter#installation-guide');
            }
        };

        // Show a notification to the user with the button that opens a browser
        vscode.window.showInformationMessage('Thanks for using PHP Formatter! There is still some setting up to do, however.', guideButton)
            .then(function(selection) {
                if(selection.hasOwnProperty('slug') && selection.slug == 'open-guide') {
                    selection.action();
                }
            });
    }

    context.subscriptions.push(saveCommand);
}

function fix(document) {
    // Makes our code a little more readable
    var config = vscode.workspace.getConfiguration('phpformatter');
    var _settings = {};
    _settings.pharPath = config.get('pharPath', '');
    _settings.phpPath = config.get('phpPath', '');
    _settings.composer = config.get('composer', false);
    _settings.onSave = config.get('onSave', false);
    _settings.level = config.get('level', '');
    _settings.fixers = config.get('fixers', '');
    _settings.additionalExtensions = config.get('additionalExtensions', []);
    _settings.enableFixerLogging = config.get('enableFixerLogging', false);

    if(_settings.onSave == false) {
        return;
    }
    if(document.languageId != 'php') {
        if(Array.isArray(_settings.additionalExtensions) && _settings.additionalExtensions.indexOf(document.languageId) != -1) {
            // This was set as additional extension.
        } else {
            // This is neither a .php files, nor anything that was set in additionalExtensions.
            return;
        }
    }

    var args = ['fix'];

    // Make sure to put double quotes around our path, otherwise the command
    // (Symfony, actually) will fail when it encounters paths with spaces in them.
    var escapedPath = '"' + path.normalize(document.uri.fsPath) + '"';
    args.push(escapedPath);

    if(_settings.level) {
        args.push('--level=' + _settings.level);
    }
    if(_settings.fixers) {
        args.push('--fixers=' + _settings.fixers);
    }

    var fixCmd = '';
    if(_settings.composer) {
        // If PHP-CS-Fixer was installed using Composer, and it was added to the PATH,
        // then we don't have to prepend the command with 'php' or point to the .phar file.
        fixCmd = 'php-cs-fixer ' + args.join(' ');
    } else if(_settings.pharPath) {
        // If PHP-CS-Fixer was installed manually, then we will have to provide the full
        // .phar file path. And optionally include the php path as well.
        args.unshift('"' + _settings.pharPath + '"');
        fixCmd = '"' + _settings.phpPath + '" ' + args.join(' ');
    } else {
        logDebug('Neither a pharPath or use of Composer was specified. Aborting...');
        return;
    }
    
    logDebug('Full command being executed: ' + fixCmd);

    var stdout = '';
    var stderr = '';
    var execResult = exec(fixCmd);

    execResult.stdout.on('data', function(buffer) {
        stdout += buffer.toString();
    });

    execResult.stderr.on('data', function(buffer) {
        stderr += buffer.toString();
    });

    execResult.on('close', function(code) {
        if(stdout) {
            logDebug(stdout);
        }
        if(stderr) {
            logDebug(stderr);
        }

        // Reopen the window. Since the file is edited externally,
        // the text editor's buffer is not aware of the changes made to the file.
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        vscode.window.showTextDocument(document);

        return;
    });
}

// Logs a message to the console if the phpformatter.enableFixerLogging setting is set to true.
function logDebug(message) {
    if(vscode.workspace.getConfiguration('phpformatter').get('enableFixerLogging', false) != false) {
        console.log('PHPFormatter: ' + message);
    }
}

exports.activate = activate;

// This method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
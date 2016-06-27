// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var exec = require('child_process').exec;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var saveCommand = vscode.workspace.onDidSaveTextDocument(function(document) {
        fix(document);
    });

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

    if(_settings.onSave == false || document.languageId != 'php') {
        return;
    }
    if(Array.isArray(_settings.additionalExtensions) && !_settings.additionalExtensions.inArray(document.languageId)) {
        return;
    }

    var stdout = '';
    var stderr = '';

    var executable = 'php-cs-fixer';
    var args = ['fix', document.uri.fsPath];

    if(_settings.composer == false && _settings.pharPath) {
        executable = _settings.pharPath;
        if(_settings.phpPath) {
            executable = _settings.phpPath + ' ' + executable;
        }
    } else {
        console.log('PHP Formatter: Neither a pharPath or use of Composer was specified. Doing nothing...');
        return;
    }
    if(_settings.level) {
        args.push('--level=' + _settings.level);
    }
    if(_settings.fixers) {
        args.push('--fixers=' + _settings.fixers);
    }

    var fixCmd = executable + ' ' + args.join(' ');
    var execResult = exec(fixCmd);

    execResult.stdout.on('data', function(buffer) {
        stdout += buffer.toString();
    });

    execResult.stderr.on('data', function(buffer) {
        stderr += buffer.toString();
    });

    execResult.on('close', function(code) {
        if(_settings.enableFixerLogging) {
            console.log(stdout);
            console.log(stderr);
        }

        // Reopen the window. Since the file is edited externally,
        // the text editor's buffer is not aware of the changes made to the file.
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        vscode.window.showTextDocument(document);

        return;
    });
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
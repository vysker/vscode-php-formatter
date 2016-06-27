// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var exec = require('child_process').exec;
var _settings = {};
_settings.pharPath = '';
_settings.phpPath = '';
_settings.composer = false;
_settings.onSave = false;
_settings.level = '';
_settings.fixers = '';
_settings.additionalExtensions = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var saveCommand = vscode.workspace.onDidSaveTextDocument(function(document) {
        fix(document);
    });

    var config = vscode.workspace.getConfiguration('phpformatter');
    _settings.pharPath = config.get('pharPath', '');
    _settings.phpPath = config.get('phpPath', '');
    _settings.composer = config.get('composer', false);
    _settings.onSave = config.get('onSave', '');
    _settings.level = config.get('level', '');
    _settings.fixers = config.get('fixers', '');
    _settings.additionalExtensions = config.get('additionalExtensions', []);

    context.subscriptions.push(saveCommand);
}

// https://github.com/FriendsOfPHP/PHP-CS-Fixer
// https://github.com/makao/vscode-phpcsfixer/blob/master/src/extension.ts
// https://code.visualstudio.com/docs/extensionAPI/vscode-api

function fix(document) {
    if(_settings.onSave == false || document.languageId != 'php') {
        return;
    }

    var stdout = '';
    var stderr = '';

    var executable = 'php-cs-fixer';
    var args = ['fix', document.uri.fsPath];

    if(_settings.pharPath != '') {
        executable = pharPath;
    }
    if(_settings.level != '') {
        args.push('--level=' + level);
    }
    if(_settings.fixers != '') {
        args.push('--fixers=' + fixers);
    }

    // var fixCmd = 'php-cs-fixer fix ' + document.uri.fsPath;
    var fixCmd = executable + args.join(' ');
    var execResult = exec(fixCmd);

    execResult.stdout.on('data', function(buffer) {
        stdout += buffer.toString();
    });

    execResult.stderr.on('data', function(buffer) {
        stderr += buffer.toString();
    });

    execResult.on('close', function(code) {
        console.log(stdout);
        console.log(stderr);

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
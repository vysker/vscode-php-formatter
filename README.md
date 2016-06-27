# PHP Formatter README

This is the README for your extension "PHP Formatter". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

Requires installation of the PHP-CS-Fixer. For more info see: https://github.com/FriendsOfPHP/PHP-CS-Fixer.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `phpformatter.pharPath`: Should point to php-cs-fixer.phar file, if you have installed this manually (without Composer). Should include .phar extension.
* `phpformatter.phpPath`: If the pharPath is set, and you are not using Composer, this should point to the php.exe file.
* `phpformatter.composer`: Whether the php-cs-fixer library has been installed using Composer. If true, the extension will override pharPath and assume you have added Composer to your PATH.
* `phpformatter.onSave`: Whether files should be fixed on save.
* `phpformatter.level`: Fixer level to use when fixing a file, e.g. psr0, psr1, psr2, symfony (https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage).
* `phpformatter.fixers`: Fixers to use when fixing a file, e.g. strict, short_array_syntax (https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage).
* `phpformatter.additionalExtensions`: Which additional file extensions, besides PHP, should be fixed as well. E.g. inc, without the leading dot.

## Known Issues

Most issues stem from incorrect installation of the PHP-CS-Fixer.

## Release Notes

Includes auto-save functionality.
Supports different PHP-CS-Fixer installation methods.
Supports level and fixers.
Can be configured to support other extensions than PHP as well.

### 0.0.1

Initial release.

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on OSX or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on OSX or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (OSX) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
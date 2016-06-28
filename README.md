# PHP Formatter

After installing as an extension with Visual Studio Code, this extension automatically formats your PHP code, in accordance with PSR-0, PSR-1, [PSR-2](http://www.php-fig.org/psr/psr-2/) or Symfony style conventions.

## Features

* Includes auto-save functionality.
* Supports different PHP-CS-Fixer installation methods, i.e. Composer vs manual installation.
* Supports level and fixers.
* Can be configured to support other file extensions than PHP as well, i.e. ".inc" files.

## Requirements

Requires installation of the PHP-CS-Fixer. For more info see: https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation.

## Extension Settings

This extension contributes the following settings:

* `phpformatter.pharPath`: Should point to php-cs-fixer.phar file, if you have installed this manually (without Composer). Should include .phar extension.
* `phpformatter.phpPath`: If the pharPath is set, and you are not using Composer, this should point to the php.exe file.
* `phpformatter.composer`: Whether the php-cs-fixer library has been installed using Composer. If true, the extension will override pharPath and assume you have added Composer to your PATH.
* `phpformatter.onSave`: Whether files should be fixed on save.
* `phpformatter.level`: Fixer level to use when fixing a file, e.g. psr0, psr1, psr2, symfony (https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage).
* `phpformatter.fixers`: Fixers to use when fixing a file, e.g. strict, short_array_syntax (https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage).
* `phpformatter.additionalExtensions`: Which additional file extensions, besides PHP, should be fixed as well. E.g. inc, without the leading dot. For this to work you'll also have to configure your VSCode files.associations settings (https://code.visualstudio.com/Docs/languages/overview#_common-questions).
* `phpformatter.enableFixerLogging`: If true, the extension will log all fixer results (including errors) to the console.

## Known Issues

* If you add Composer to your PATH, make sure to restart ALL of your Visual Studio Code instances afterwards. Visual Studio Code only reads out PATH variables during startup.
* Undo history is lost after saving the file.

*Note:* Most issues stem from incorrect installation of the PHP-CS-Fixer, see https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation.

## Release Notes

### 0.0.5

Added working support for multiple file extensions besides .php. See `phpformatter.additionalExtensions` setting for more info.

### 0.0.4

All paths now support spaces (`' '`).

### 0.0.3

Setting `phpformatter.composer` to `true` now actually overrides the use of pharPath.

### 0.0.2

* Code improvements.
* Fixed functionality.
* Improved code readability.
* Added setting to enable fixer logging. Logs all fixer results (including errors) to the console.
* Settings are now read every time the fix function is called. Previously settings were only read during activation.

### 0.0.1

Initial commit.
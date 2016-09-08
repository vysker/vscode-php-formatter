# PHP Formatter

After installing as an extension with Visual Studio Code, this extension automatically formats your PHP code, in accordance with PSR-0, PSR-1, [PSR-2](http://www.php-fig.org/psr/psr-2/) or Symfony style conventions.

## Features

* Format current selection only, or the whole file.
* Trigger formatting with custom keybindings or actions.
* Supports formatting on save.
* Supports different PHP-CS-Fixer installation methods, i.e. Composer vs manual installation.
* Supports level and fixers.
* Can be configured to support other file extensions than PHP as well, i.e. ".inc" files.

## Requirements

Requires installation of the PHP-CS-Fixer. For more info see [their repo](https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation).

## Installation Guide

1. Download this extension by using any of the methods [here](https://code.visualstudio.com/Docs/extensions/install-extension).
2. Install PHP-CS-Fixer using one of the methods [here](https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation).
3. Based on your installation method of PHP-CS-Fixer, use one of the following settings:
  1. **[Composer]** If you installed PHP-CS-Fixer using Composer, then do the following:
    1. Make sure you add Composer to your PATH environment variable. On Windows that is `%APPDATA%\Composer\vendor\bin`. For Linux that is `/.composer/vendor/bin`.
    2. Add this to your user settings `"phpformatter.composer": true`.
  2. **[Manual]** If you installed the php-cs-fixer file manually, then do the following:
    1. Point the `phpformatter.pharPath` setting to where you put the php-cs-fixer file, e.g. `"phpformatter.pharPath" = "C:/php-cs-fixer.phar"` or `"phpformatter.pharPath" = "/usr/local/bin/php-cs-fixer"`.
    2. Make sure PHP is part of your PATH environment variable (test this by typing `php -v` into your terminal). If you don't want PHP in your path variable, then add this setting `"phpformatter.phpPath" = "C:\xampp\php.exe"` and point it to the relevant location.
    3. Make sure the `phpformatter.composer` setting is set to `false`, which it is by default.
4. To format a file with a custom keybinding or action, see [Extension Commands](#commands). To format a file on save, add this to your [user settings](https://code.visualstudio.com/Docs/customization/userandworkspace): `"phpformatter.onSave" = true`.
5. You're done! You might need to restart Visual Studio Code, however.

## Extension Settings

This extension contributes the following settings:

* `phpformatter.pharPath`: Should point to php-cs-fixer.phar file, if you have installed this manually (without Composer). Should include .phar extension.
* `phpformatter.phpPath`: If the pharPath is set, and you are not using Composer, this should point to the php.exe file.
* `phpformatter.composer`: Whether the php-cs-fixer library has been installed using Composer. If true, the extension will override pharPath and assume you have added Composer to your PATH.
* `phpformatter.onSave`: Whether files should be fixed on save.
* `phpformatter.level`: Fixer level to use when fixing a file, e.g. psr0, psr1, psr2, symfony ([More info](https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage)).
* `phpformatter.fixers`: Fixers to use when fixing a file, e.g. strict, short_array_syntax ([More info](https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage)).
* `phpformatter.additionalExtensions`: Which additional file extensions, besides PHP, should be fixed as well. E.g. inc, without the leading dot. For this to work you'll also have to configure your VSCode files.associations settings ([More info](https://code.visualstudio.com/Docs/languages/overview#_common-questions)).
* `phpformatter.enableFixerLogging`: **Deprecated** in favor of `phpformatter.logging`.
* `phpformatter.logging`: If true, the extension will log all sorts of (debug) info to the console. Useful for troubleshooting.
* `phpformatter.notifications`: If true, the extension will show notifications.
* `phpformatter.useTempFiles`: If true, a temp file will be used for the formatter to fix. After formatting the temp file, the contents will be copied back to the original file. This circumvents a lot of issues the original way had. Therefore, this method will be used by default.

## <a name="commands"></a>Extension commands

The extension currently contributes just one command. Your Visual Studio Code environment can be configured to trigger this command with a custom keybinding or other action.

### phpformatter.fix

* Fixes the current file or selection, if there is any.
* Does not save the file after fixing.
* Requires `phpformatter.useTempFiles` to be turned on.

To set this up. Go to `File -> Preferences -> Keyboard Shortcuts` and add the following to `keybindings.json`:

`{"key": "alt+shift+f", "command": "phpformatter.fix", "when": "editorFocus"}`

After saving the file you should be able to format files using the keybinding `alt+shift+f`.

## Known Issues

* If you add Composer to your PATH, make sure to restart ALL of your Visual Studio Code instances afterwards. Visual Studio Code only reads out PATH variables during startup.
* If the setting `phpformatter`.useTempFiles is of, you will lose your undo history after saving the file.
* If you are on Windows, using xampp, and get the error `PHP Warning: PHP Startup: Unable to load dynamic library`, try going to you xampp directory and run `setup_xampp.bat`. After that, restart Visual Studio Code and try again.

**Note:** Most issues stem from incorrect installation of the PHP-CS-Fixer, see [their repo](https://github.com/FriendsOfPHP/PHP-CS-Fixer#installation) for more info.

## Release Notes

### 0.1.2

Solved an issue where fixing a file would erase its contents.

### 0.1.1

New icon.

### 0.1.0

* Added `phpformatter.useTempFiles` setting, which is on by default. This fixes a whole ranges of issues the old method had, and opens up the road other features as well.
* Added `phpformatter.fix` command. This introduces the ability to fix a file or selection by registering a custom keybinding. See [Extension Commands](#commands) for more info.
* Added the ability to fix only the current selection. This requires `phpformatter.useTempFiles` to be turned on.
* Deprecated `phpformatter.enableFixerLogging` in favor of `phpformatter.logging`.
* Added `phpformatter.logging` setting to replace `phpformatter.enableFixerLogging`.
* Improved logging. Added more log messages and added two notifications.

### 0.0.7

* Added `phpformatter.notifications` setting.
* The extension will now show a notification when the required settings are not set.
* The notification has a button that opens up a browser with the installation guide on the Github page.
* Added installation guide and known issue to the readme.

### 0.0.6

Added icon and more meta info in package.json. As well as the first icon!

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
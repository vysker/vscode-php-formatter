Make sure to install all the [prerequisites](https://github.com/Dickurt/vscode-php-formatter/wiki/Prerequisites). Without them, none of this will work.

1. Based on your installation method of PHP-CS-Fixer, use one of the following settings:

   ---

   ### **With Composer**

   Add Composer to your PATH environment variable. E.g. on Windows: `%APPDATA%\Composer\vendor\bin`. E.g. on Linux: `/.composer/vendor/bin`.

   Add `"phpformatter.composer": true` to your VSCode user settings.

   ![VSCode user settings result with Composer](https://github.com/Dickurt/vscode-php-formatter/blob/master/images/install-composer.jpg?raw=true "VSCode user settings result with Composer")

   ---

   ### **Manual**

   Add PHP to your PATH environment variable. I.e. ensure that `php -v` works. Otherwise use `"phpformatter.phpPath" = "/path/to/php/executable"`.

   Point the `phpformatter.pharPath` setting to where you put the php-cs-fixer file.

   ![VSCode user settings result with Manual](https://github.com/Dickurt/vscode-php-formatter/blob/master/images/install-manual.jpg?raw=true "VSCode user settings result with Manual")

   *Not working?* Make sure the `phpformatter.composer` setting is set to `false`, which it is by default.

   ---

2. To format a file with a custom keybinding or action, see [Extension Commands](#commands).
3. Done! Restart all instances of Visual Studio Code.
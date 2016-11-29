This extension contributes the following settings:

### phpformatter.pharPath

Should point to php-cs-fixer.phar file, if you have installed this manually (without Composer). Should include .phar extension.

### phpformatter.phpPath

If the pharPath is set, and you are not using Composer, this should point to the php.exe file.

### phpformatter.composer

Whether the php-cs-fixer library has been installed using Composer. If true, the extension will override pharPath and assume you have added Composer to your PATH.

### phpformatter.arguments

Add arguments to the executed fix command, like so: `phpformatter.arguments = ['--level=psr2', '--fixers=linefeed,short_tag,indentation']`.

### phpformatter.level

**Deprecated** in favor of `phpformatter.arguments`. Will be removed in a future update.

### phpformatter.fixers

**Deprecated** in favor of `phpformatter.arguments`. Will be removed in a future update.

### phpformatter.additionalExtensions

Which additional file extensions, besides PHP, should be fixed as well. E.g. inc, without the leading dot. For this to work you'll also have to configure your VSCode files.associations settings ([More info](https://code.visualstudio.com/Docs/languages/overview#_common-questions)).

Example: `"phpformatter.additionalExtensions": ["inc", "tpl"]`

### phpformatter.logging

If true, the extension will log all sorts of (debug) info to the console. Useful for troubleshooting.

### phpformatter.notifications

If true, the extension will show notifications.
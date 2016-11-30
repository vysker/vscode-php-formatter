Here's how to configure VSCode to your needs.

## User Settings

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

## Custom config file

Because the default settings for the formatting don't do much for the code structure itself, it is recommended to create a custom config file to accommodate all fixers used when formatting your files. A custom config file is home to your formatting settings, which can be included in the PHP CS Fixer command. This way, you won't have to pass in all formatting settings from the VSCode user settings, but instead create a separate file on your system, which you can share with your fellow coders.

### How to set it up

To use this feature:

* Create a file called `config.php_cs` (or any name ending with .php_cs) anywhere on your system.
* Copy the code below, and then paste it into the file.
* Go to your VSCode user/workspace settings and add a reference to the file in your arguments setting like so: `phpformatter.arguments: ["--custom-config=/path/to/file/config.php_cs"]`.

**Example .php_cs file**
```
<?php

$finder = Symfony\Component\Finder\Finder::create()
    ->files()
    ->in(__DIR__)
    ->exclude('vendor')
    ->exclude('resources/views')
    ->exclude('storage')
    ->exclude('public')
    ->notName("*.txt")
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

$fixers = [
    '-psr0',
    '-php_closing_tag',
    'blankline_after_open_tag',
    'double_arrow_multiline_whitespaces',
    'duplicate_semicolon',
    'empty_return',
    'extra_empty_lines',
    'include',
    'join_function',
    'list_commas',
    'multiline_array_trailing_comma',
    'namespace_no_leading_whitespace',
    'no_blank_lines_after_class_opening',
    'no_empty_lines_after_phpdocs',
    'object_operator',
    'operators_spaces',
    'phpdoc_indent',
    'phpdoc_no_access',
    'phpdoc_no_package',
    'phpdoc_scalar',
    'phpdoc_short_description',
    'phpdoc_to_comment',
    'phpdoc_trim',
    'phpdoc_type_to_var',
    'phpdoc_var_without_name',
    'remove_leading_slash_use',
    'remove_lines_between_uses',
    'return',
    'self_accessor',
    'single_array_no_trailing_comma',
    'single_blank_line_before_namespace',
    'single_quote',
    'spaces_before_semicolon',
    'spaces_cast',
    'standardize_not_equal',
    'ternary_spaces',
    'trim_array_spaces',
    'no_useless_else',
    'unalign_equals',
    'unary_operators_spaces',
    'whitespacy_lines',
    'multiline_spaces_before_semicolon',
    'short_array_syntax',
    'short_echo_tag',
    'concat_with_spaces',
    'ordered_use',
];

return Symfony\CS\Config\Config::create()
    ->level(Symfony\CS\FixerInterface::PSR2_LEVEL)
    ->fixers($fixers)
    ->finder($finder)
    ->setUsingCache(true);
```

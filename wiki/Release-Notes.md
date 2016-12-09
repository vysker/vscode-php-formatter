### 0.2.4

* Fixed `phpformatter.fix` command. It stopped working as intended sometimes.
* Fixed `editor.onSave` support. The file got marked as dirty after formatting. Now it no longer does that.

### 0.2.3

* Added `phpformatter.arguments`. Use this setting to add any arguments to the fix command, e.g. `['--level=psr2']`.
* Deprecated `phpformatter.level` and `phpformatter.fixers` settings in favor of `phpformatter.arguments`. If neither `phpformatter.level` nor `phpformatter.fixers` are set, `phpformatter.arguments` will be used.

### 0.2.2

Changed wiki links and page titles.

### 0.2.1

Removed `phpformatter.onSave` setting because it is now a native vscode feature.

### 0.2.0

* Migrated the code to TypeScript!
* Temp files are now the way to go by default, switching back is no longer supported. Therefore, the `phpformatter.useTempFiles` setting got removed.
* Deprecated `phpformatter.enableFixerLogging` setting got removed in favor of `phpformatter.logging`.
* The extension is now categorized as Formatter on the Marketplace.

### 0.1.3

* Disabled onSave command until VSCode supports preSave event.
* Improved Readme.

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
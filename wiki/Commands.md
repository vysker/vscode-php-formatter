The extension currently contributes just one command. Your Visual Studio Code environment can be configured to trigger this command with a custom keybinding or other action.

### phpformatter.fix

* Fixes the current file, or selection, if there is any.
* Does not save the file after fixing.

To set this up. Go to `File -> Preferences -> Keyboard Shortcuts` and add the following to `keybindings.json`:

`{"key": "alt+shift+f", "command": "phpformatter.fix", "when": "editorFocus"}`

After saving the file you should be able to format files using the keybinding `alt+shift+f`.
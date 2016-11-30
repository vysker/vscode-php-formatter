import { window, workspace, Range, Selection } from 'vscode';

export class Helper {
    constructor() { }

    public static getNumSelectedLines(selection: Range): number {
        return (selection !== null) ? selection.end.line + 1 - selection.start.line : 0;
    }

    public static getSelection(): Range {
        let selection: Range = null;

        if (!window.activeTextEditor.selection.isEmpty) {
            let sel: Selection = window.activeTextEditor.selection;
            selection = new Range(sel.start, sel.end);
            this.logDebug('User has made a selection in the document ([' + selection.start.line + ', ' + selection.start.character + '], [' + selection.end.line + ', ' + selection.end.character + ']).');
        }

        return selection;
    }

    // Puts quotes around the given string and returns the resulting string.
    public static enquote(input: string): string {
        return '"' + input + '"';
    }

    // Logs a message to the console if the phpformatter.logging setting is set to true.
    public static logDebug(message: any): void {
        if (workspace.getConfiguration('phpformatter').get('logging', false) === true) {
            console.log('PHPFormatter: ' + message);
        }
    }
}
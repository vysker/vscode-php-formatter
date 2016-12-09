import { window, workspace, Range, Selection, TextDocument } from 'vscode';

export class Helper {
    constructor() { }

    /**
     * Returns the number of selected lines in the given selection.
     * If there is no selection, and a document is passed in, the
     * number of lines the in the given document will be returned.
     * If all else fails, returns 0.
     * 
     * @param selection The selection to count the lines of.
     * @param document The document to get the lineCount of, if there is no selection.
     * @return Number of selected lines as a number. 0 by default.
     */
    public static getNumSelectedLines(selection: Range, document?: TextDocument): number {
        let num: number = 0;

        if (Helper.selectionNotEmpty(selection)) {
            num = selection.end.line + 1 - selection.start.line;
        } else if (document != null) {
            num = document.lineCount;
        }

        return num;
    }

    /**
     * For checking whether a selection is not empty or null.
     * 
     * @param selection The selection to check
     * @return True if selection is null or Range.isEmpty. False otherwise.
     */
    public static selectionNotEmpty(selection: Range): boolean {
        return selection != null && !selection.isEmpty;
    }

    /**
     * Puts quotes around the given string and returns the resulting string.
     * 
     * @param input String to put quotes (") around.
     * @return String with quotes.
     */
    public static enquote(input: string): string {
        return '"' + input + '"';
    }

    /**
     * Logs a message to the console if the phpformatter.logging setting is set to true.
     * 
     * @param message The object to log (anything that console.log can handle).
     */
    public static logDebug(message: any): void {
        if (workspace.getConfiguration('phpformatter').get('logging', false) === true) {
            console.log('PHPFormatter: ' + message);
        }
    }
}
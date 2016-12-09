import { window, commands, languages, ExtensionContext, Disposable } from 'vscode';

import { DOCUMENT_FILTER } from './document_filter';
import { Formatter, PHPDocumentRangeFormattingEditProvider } from './formatter';

export function activate(context: ExtensionContext): void {
    // Register the 'phpformatter.fix' command.
    let fixCommand: Disposable = commands.registerCommand('phpformatter.fix', () => {
        let formatter: Formatter = new Formatter();
        formatter.formatDocument(window.activeTextEditor.document);
    });

    // Register ourselves as a document formatter, so we can do things like FormatOnSave.
    let formattingProvider: Disposable =
        languages.registerDocumentRangeFormattingEditProvider(DOCUMENT_FILTER, new PHPDocumentRangeFormattingEditProvider());

    context.subscriptions.push(fixCommand);
    context.subscriptions.push(formattingProvider);
}

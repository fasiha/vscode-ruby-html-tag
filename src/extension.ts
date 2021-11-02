// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// https://github.com/microsoft/vscode-extension-samples/blob/main/document-editing-sample/src/extension.ts
// https://stackoverflow.com/questions/65248766/does-vs-code-extensions-api-support-changing-cursor-position
// https://code.visualstudio.com/api/references/commands --> `cursorMove`
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
      'ruby-html-tag.addRubyRtTags', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const document = editor.document;
          const selection = editor.selection;
          const text = document.getText(selection);
          editor.edit(editBuilder => {
            editBuilder.replace(
                selection, `<ruby>${text}<rt>RUBY TEXT</rt></ruby>`);
          });
          await vscode.commands.executeCommand(
              'cursorMove', {to: 'right', by: 'character', value: 1});
          await vscode.commands.executeCommand(
              'cursorMove', {to: 'left', by: 'character', value: 12});
          await vscode.commands.executeCommand(
              'cursorMove',
              {to: 'left', by: 'character', value: 9, select: true});
        }
      });

  context.subscriptions.push(disposable);
}
export function deactivate() {}

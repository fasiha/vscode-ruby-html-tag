import * as vscode from 'vscode';

async function moveAndSelect(moveLeft = 12, replaceLeft = 9) {
  await vscode.commands.executeCommand(
      'cursorMove', {to: 'right', by: 'character', value: 1});
  await vscode.commands.executeCommand(
      'cursorMove', {to: 'left', by: 'character', value: moveLeft});
  await vscode.commands.executeCommand(
      'cursorMove',
      {to: 'left', by: 'character', value: replaceLeft, select: true});
}

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
          if (text) {
            // Case A: text selected
            editor.edit(editBuilder => {
              editBuilder.replace(
                  selection, `<ruby>${text}<rt>RUBY TEXT</rt></ruby>`);
            });
            await moveAndSelect()
          } else {
            const range = document.getWordRangeAtPosition(selection.active);
            if (range) {
              // Case B: no selection but there's a word here
              editor.selection = new vscode.Selection(range.start, range.end);
              const text = document.getText(range);
              editor.edit(editBuilder => {
                editBuilder.replace(
                    range, `<ruby>${text}<rt>RUBY TEXT</rt></ruby>`);
              });
              await moveAndSelect()
            } else {
              // Case C: no selection and no word
              editor.edit(editBuilder => {
                editBuilder.replace(
                    selection, `<ruby>RubyBase<rt>RubyText/rt></ruby>`);
              });
              await moveAndSelect(23, 8);
            }
          }
        }
      });

  context.subscriptions.push(disposable);
}
export function deactivate() {}

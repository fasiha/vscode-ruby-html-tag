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

  let copyWithoutRtOnlyRubyCommand = vscode.commands.registerCommand(
      'ruby-html-tag.copyWithoutRtOnlyRuby', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const document = editor.document;
          const selection = editor.selection;
          let text = document.getText(selection);

          // If no selection, use the current line
          if (!text) {
            const line = document.lineAt(selection.active.line);
            text = line.text;
          }

          // Remove <rp> and <rt> tags and their contents
          text = text.replace(/<rp>.*?<\/rp>/g, '');
          text = text.replace(/<rt>.*?<\/rt>/g, '');

          // Remove <ruby> and </ruby> tags but keep contents
          text = text.replace(/<\/?ruby>/g, '');

          // Copy to clipboard
          await vscode.env.clipboard.writeText(text);
          vscode.window.showInformationMessage('Copied to clipboard!');
        }
      });

  context.subscriptions.push(copyWithoutRtOnlyRubyCommand);
}
export function deactivate() {}

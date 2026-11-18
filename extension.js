const vscode = require('vscode');
const { format, lineRange } = require('./format');

function fileOf(doc, relative) {
  if (relative) return vscode.workspace.asRelativePath(doc.uri);
  return doc.uri.scheme === 'file' ? doc.uri.fsPath : doc.uri.toString();
}

function copy(withContent, relative) {
  return async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('Copy Lines: no active editor');
      return;
    }
    const [start, end] = lineRange(editor.selection);
    const lines = [];
    if (withContent) {
      for (let i = start; i <= end; i++) lines.push(editor.document.lineAt(i).text);
    }
    const text = format({
      start: start + 1,
      end: end + 1,
      file: fileOf(editor.document, relative),
      lines: withContent ? lines : undefined,
    });
    await vscode.env.clipboard.writeText(text);
    vscode.window.setStatusBarMessage('Copied line reference', 2000);
  };
}

function activate(context) {
  const cmds = [
    ['copyLines.position.full', false, false],
    ['copyLines.position.relative', false, true],
    ['copyLines.content.full', true, false],
    ['copyLines.content.relative', true, true],
  ];
  for (const [id, content, relative] of cmds) {
    context.subscriptions.push(vscode.commands.registerCommand(id, copy(content, relative)));
  }
}

module.exports = { activate };

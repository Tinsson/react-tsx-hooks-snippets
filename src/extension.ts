import * as path from 'path';
import * as vscode from 'vscode';

type SymbolCandidate = {
  name: string;
  kind: vscode.SymbolKind;
  range: vscode.Range;
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('react-tsx-hooks-snippets.copyAiSourceReference', copyAiSourceReference)
  );
}

export function deactivate() {}

async function copyAiSourceReference() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor to copy from.');
    return;
  }

  const { document, selection } = editor;
  const saved = await saveDocument(document);

  if (!saved) {
    vscode.window.showWarningMessage('Could not save the current document.');
    return;
  }

  const targetRange = selection.isEmpty
    ? document.lineAt(selection.active.line).range
    : new vscode.Range(selection.start, selection.end);
  const code = document.getText(targetRange);
  const symbol = await findNearestSymbol(document, selection.active);
  const reference = formatReference(document, targetRange, code, symbol);

  await vscode.env.clipboard.writeText(reference);
  vscode.window.showInformationMessage('Copied AI source reference.');
}

async function saveDocument(document: vscode.TextDocument) {
  if (!document.isDirty) {
    return true;
  }

  return document.save();
}

async function findNearestSymbol(document: vscode.TextDocument, position: vscode.Position) {
  const symbols = await vscode.commands.executeCommand<Array<vscode.DocumentSymbol | vscode.SymbolInformation>>(
    'vscode.executeDocumentSymbolProvider',
    document.uri
  );

  if (!symbols || symbols.length === 0) {
    return undefined;
  }

  const candidates = flattenSymbols(symbols).filter((symbol) => symbol.range.contains(position));
  candidates.sort((a, b) => rangeSize(a.range) - rangeSize(b.range));

  return candidates[0];
}

function flattenSymbols(symbols: Array<vscode.DocumentSymbol | vscode.SymbolInformation>) {
  const candidates: SymbolCandidate[] = [];

  for (const symbol of symbols) {
    if (isDocumentSymbol(symbol)) {
      candidates.push({
        name: symbol.name,
        kind: symbol.kind,
        range: symbol.range
      });
      candidates.push(...flattenSymbols(symbol.children));
    } else {
      candidates.push({
        name: symbol.name,
        kind: symbol.kind,
        range: symbol.location.range
      });
    }
  }

  return candidates;
}

function isDocumentSymbol(
  symbol: vscode.DocumentSymbol | vscode.SymbolInformation
): symbol is vscode.DocumentSymbol {
  return 'children' in symbol;
}

function formatReference(
  document: vscode.TextDocument,
  range: vscode.Range,
  code: string,
  symbol?: SymbolCandidate
) {
  const relativePath = getRelativePath(document);
  const lineRange = formatLineRange(range);
  const language = getFenceLanguage(document);
  const symbolName = symbol ? symbol.name : 'Unknown';
  const symbolKind = symbol ? getSymbolKindName(symbol.kind) : 'Unknown';

  return [
    `File: ${relativePath}`,
    `Symbol: ${symbolName}`,
    `Kind: ${symbolKind}`,
    `Range: ${lineRange}`,
    '',
    `\`\`\`${language}`,
    code,
    '```'
  ].join('\n');
}

function getRelativePath(document: vscode.TextDocument) {
  if (document.uri.scheme === 'file') {
    return vscode.workspace.asRelativePath(document.uri, false);
  }

  return document.uri.toString();
}

function formatLineRange(range: vscode.Range) {
  const start = range.start.line + 1;
  const end = range.end.line + 1;

  return start === end ? `L${start}` : `L${start}-L${end}`;
}

function getFenceLanguage(document: vscode.TextDocument) {
  const extension = path.extname(document.fileName).replace('.', '');
  const languageByExtension: Record<string, string> = {
    js: 'js',
    jsx: 'jsx',
    ts: 'ts',
    tsx: 'tsx',
    json: 'json',
    md: 'md',
    css: 'css',
    scss: 'scss',
    html: 'html'
  };

  return languageByExtension[extension] || document.languageId;
}

function getSymbolKindName(kind: vscode.SymbolKind) {
  return vscode.SymbolKind[kind] || 'Unknown';
}

function rangeSize(range: vscode.Range) {
  return range.end.line - range.start.line || range.end.character - range.start.character;
}

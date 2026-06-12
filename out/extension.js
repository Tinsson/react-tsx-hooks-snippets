"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('react-tsx-hooks-snippets.copyAiSourceReference', copyAiSourceReference));
}
function deactivate() { }
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
async function saveDocument(document) {
    if (!document.isDirty) {
        return true;
    }
    return document.save();
}
async function findNearestSymbol(document, position) {
    const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
    if (!symbols || symbols.length === 0) {
        return undefined;
    }
    const candidates = flattenSymbols(symbols).filter((symbol) => symbol.range.contains(position));
    candidates.sort((a, b) => rangeSize(a.range) - rangeSize(b.range));
    return candidates[0];
}
function flattenSymbols(symbols) {
    const candidates = [];
    for (const symbol of symbols) {
        if (isDocumentSymbol(symbol)) {
            candidates.push({
                name: symbol.name,
                kind: symbol.kind,
                range: symbol.range
            });
            candidates.push(...flattenSymbols(symbol.children));
        }
        else {
            candidates.push({
                name: symbol.name,
                kind: symbol.kind,
                range: symbol.location.range
            });
        }
    }
    return candidates;
}
function isDocumentSymbol(symbol) {
    return 'children' in symbol;
}
function formatReference(document, range, code, symbol) {
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
function getRelativePath(document) {
    if (document.uri.scheme === 'file') {
        return vscode.workspace.asRelativePath(document.uri, false);
    }
    return document.uri.toString();
}
function formatLineRange(range) {
    const start = range.start.line + 1;
    const end = range.end.line + 1;
    return start === end ? `L${start}` : `L${start}-L${end}`;
}
function getFenceLanguage(document) {
    const extension = path.extname(document.fileName).replace('.', '');
    const languageByExtension = {
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
function getSymbolKindName(kind) {
    return vscode.SymbolKind[kind] || 'Unknown';
}
function rangeSize(range) {
    return range.end.line - range.start.line || range.end.character - range.start.character;
}

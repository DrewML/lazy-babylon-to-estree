const { parse } = require('babylon');
const createASTProxy = require('..');

test('Transforms StringLiteral on access', () => {
    const ast = parse(`a = 'foo';`);
    const proxied = createASTProxy(ast);
    const stringLiteralNode = proxied.body[0].expression.right;

    expect(stringLiteralNode.type).toBe('Literal');
    expect(stringLiteralNode.raw).toBe("'foo'");
});

test('Transforms NumericLiteral on access', () => {
    const ast = parse(`a = 1;`);
    const proxied = createASTProxy(ast);
    const numericLiteralNode = proxied.body[0].expression.right;

    expect(numericLiteralNode.type).toBe('Literal');
    expect(numericLiteralNode.raw).toBe('1');
});

test('Transforms BooleanLiteral on access', () => {
    const ast = parse(`a = true;`);
    const proxied = createASTProxy(ast);
    const booleanLiteralNode = proxied.body[0].expression.right;

    expect(booleanLiteralNode.type).toBe('Literal');
    expect(booleanLiteralNode.raw).toBe('true');
});

test('Transforms NullLiteral on access', () => {
    const ast = parse(`a = null;`);
    const proxied = createASTProxy(ast);
    const nullLiteralNode = proxied.body[0].expression.right;

    expect(nullLiteralNode.type).toBe('Literal');
    expect(nullLiteralNode.raw).toBe('null');
});

test('Transforms RegExpLiteral on access', () => {
    const ast = parse(`a = /lol/i;`);
    const proxied = createASTProxy(ast);
    const regexpLiteralNode = proxied.body[0].expression.right;

    expect(regexpLiteralNode.type).toBe('Literal');
    expect(regexpLiteralNode.regexp.pattern).toBe('lol');
    expect(regexpLiteralNode.regexp.flags).toBe('i');
});

test('Caches replacement nodes and reuses for multiple accesses', () => {
    const ast = parse(`a = 'foo';`);
    const proxied = createASTProxy(ast);

    const firstAccess = proxied.body[0].expression.right;
    const secondAccess = proxied.body[0].expression.right;

    expect(firstAccess === secondAccess).toBeTruthy();
});

module.exports = function createASTProxy(ast) {
    try {
        // Babylon uses a `File` wrapper in the AST above `Program`, ESTree does not
        return new Proxy(ast.type === 'File' ? ast.program : ast, traps);
    } catch (err) {
        throw new Error('ASTProxy is all broken', err);
    }
};

function proxyNode(node) {
    let newNode;

    if (node.type === 'StringLiteral') {
        newNode = {
            type: 'Literal',
            start: node.start,
            end: node.end,
            range: node.range,
            value: node.value,
            raw: node.extra.raw
        };
    }

    if (node.type === 'NumericLiteral') {
        newNode = {
            type: 'Literal',
            start: node.start,
            end: node.end,
            range: node.range,
            value: node.value,
            raw: node.extra.raw
        };
    }

    if (node.type === 'BooleanLiteral') {
        newNode = {
            type: 'Literal',
            start: node.start,
            end: node.end,
            range: node.range,
            value: node.value,
            raw: node.value.toString()
        };
    }

    if (node.type === 'NullLiteral') {
        newNode = {
            type: 'Literal',
            start: node.start,
            end: node.end,
            range: node.range,
            value: node.value,
            raw: 'null' // babylon doesn't include "raw" for NullLiteral
        };
    }

    if (node.type === 'RegExpLiteral') {
        newNode = {
            type: 'Literal',
            start: node.start,
            end: node.end,
            range: node.range,
            value: {}, // babylon uses `undefined` for `value` in `RegExpLiteral`, acorn uses an empty object
            regexp: {
                pattern: node.pattern,
                flags: node.flags
            }
        };
    }

    if (!newNode) newNode = new Proxy(node, traps);
    nodeCache.set(node, newNode);
    return newNode;
}

// Avoid creating new `node` objects or new Proxies for
// nodes we've already seen. This also ensures that wrapped
// values have referential equality if the node is visited > 1 time, since
// some code somewhere might rely on the fact that references in the AST
// don't change
const nodeCache = new WeakMap();

const traps = {
    get(target, prop, receiver) {
        if (!Reflect.has(target, prop)) return;

        const targetVal = Reflect.get(target, prop);

        if (nodeCache.has(targetVal)) return nodeCache.get(targetVal);

        if (Array.isArray(targetVal)) {
            // Arrays in an AST will be homogeneous, so just peek at the first value. If it's
            // a primitive, we can just return that value
            if (!isObj(targetVal[0])) return targetVal;
            // New array of proxied nodes
            return targetVal.map(proxyNode);
        }

        // Likely a primitive value, or a value of a type we don't care about
        if (!isObj(targetVal)) {
            return targetVal;
        }

        return proxyNode(targetVal);
    }
};

const isObj = val => Object.prototype.toString.call(val) === '[object Object]';

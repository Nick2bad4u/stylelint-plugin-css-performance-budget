/**
 * @packageDocumentation
 * Selector-analysis helpers for performance-budget style rules.
 */
import selectorParser, {
    type Node,
    type Selector,
} from "postcss-selector-parser";

/** Complexity score for one selector in a selector list. */
export type SelectorComplexity = Readonly<{
    complexity: number;
    selectorText: string;
}>;

const combinatorWeight = 1;
const idWeight = 3;
const pseudoClassWeight = 2;
const pseudoElementWeight = 1;
const tagOrUniversalWeight = 1;
const classOrAttributeWeight = 2;

/** Analyze each selector inside a selector list and return its complexity score. */
export function analyzeSelectorListComplexity(
    selectorList: string
): readonly SelectorComplexity[] {
    try {
        // eslint-disable-next-line n/no-sync -- postcss-selector-parser provides sync AST APIs only.
        const ast = selectorParser().astSync(selectorList);

        return ast.nodes.map((node) => ({
            complexity: calculateSelectorComplexity(node),
            selectorText: node.toString(),
        }));
    } catch {
        return [];
    }
}

/** Return the number of selectors present in a selector list string. */
export function getSelectorListLength(selectorList: string): number {
    try {
        // eslint-disable-next-line n/no-sync -- postcss-selector-parser provides sync AST APIs only.
        const ast = selectorParser().astSync(selectorList);
        return ast.nodes.length;
    } catch {
        return 0;
    }
}

/** Return true when any selector in a list targets a broad global scope. */
export function selectorListContainsBroadGlobalSelector(
    selectorList: string
): boolean {
    try {
        // eslint-disable-next-line n/no-sync -- postcss-selector-parser provides sync AST APIs only.
        const ast = selectorParser().astSync(selectorList);

        return ast.nodes.some((node) => isBroadGlobalSelector(node));
    } catch {
        return false;
    }
}

function calculateSelectorComplexity(selectorNode: Readonly<Selector>): number {
    let complexity = 0;

    selectorNode.walk((node) => {
        complexity += getNodeWeight(node);
    });

    return complexity;
}

function getNodeWeight(node: Readonly<Node>): number {
    switch (node.type) {
        case "attribute":
        case "class": {
            return classOrAttributeWeight;
        }
        case "combinator": {
            return combinatorWeight;
        }
        case "comment": {
            return 0;
        }
        case "id": {
            return idWeight;
        }
        case "nesting": {
            return 0;
        }
        case "pseudo": {
            return node.value.startsWith("::")
                ? pseudoElementWeight
                : pseudoClassWeight;
        }
        case "root":
        case "selector":
        case "string": {
            return 0;
        }
        case "tag":
        case "universal": {
            return tagOrUniversalWeight;
        }
        default: {
            return 0;
        }
    }
}

function isBroadGlobalSelector(selectorNode: Readonly<Selector>): boolean {
    const selectorText = selectorNode.toString();
    return (
        selectorText.includes(":root") ||
        /\b(?:body|html)\b/v.test(selectorText) ||
        selectorText.includes("*")
    );
}

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

        return ast.nodes.flatMap((node) => {
            if (node.type !== "selector") {
                return [];
            }

            return [
                {
                    complexity: calculateSelectorComplexity(node),
                    selectorText: node.toString(),
                },
            ];
        });
    } catch {
        return [];
    }
}

/** Return the number of selectors present in a selector list string. */
export function getSelectorListLength(selectorList: string): number {
    try {
        // eslint-disable-next-line n/no-sync -- postcss-selector-parser provides sync AST APIs only.
        const ast = selectorParser().astSync(selectorList);
        let selectorCount = 0;

        for (const node of ast.nodes) {
            if (node.type === "selector") {
                selectorCount += 1;
            }
        }

        return selectorCount;
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

        return ast.nodes.some(
            (node) => node.type === "selector" && isBroadGlobalSelector(node)
        );
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

function isBroadGlobalNode(node: Readonly<Node>): boolean {
    if (node.type === "universal") {
        return true;
    }

    if (node.type === "tag") {
        return node.value === "body" || node.value === "html";
    }

    return node.type === "pseudo" && node.value === ":root";
}

function isBroadGlobalSelector(selectorNode: Readonly<Selector>): boolean {
    let hasBroadGlobalNode = false;
    let hasNarrowingNode = false;

    selectorNode.walk((node) => {
        if (isBroadGlobalNode(node)) {
            hasBroadGlobalNode = true;
            return;
        }

        if (isNarrowingSelectorNode(node)) {
            hasNarrowingNode = true;
        }
    });

    return hasBroadGlobalNode && !hasNarrowingNode;
}

function isNarrowingSelectorNode(node: Readonly<Node>): boolean {
    return (
        node.type === "attribute" || node.type === "class" || node.type === "id"
    );
}

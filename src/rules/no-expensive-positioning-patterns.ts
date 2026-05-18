import type { ChildNode, Declaration, Rule as PostcssRule } from "postcss";

import stylelint, { type RuleBase } from "stylelint";
import { isDefined, setHas } from "ts-extras";

import {
    createStylelintRule,
    type StylelintPluginRule,
} from "../_internal/create-stylelint-rule.js";
import {
    paintEffectProperties,
    resetKeywords,
} from "../_internal/performance-value-sets.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-expensive-positioning-patterns");

const messages: {
    expensivePositionedEffect: (
        position: string,
        property: string,
        selector: string
    ) => string;
} = ruleMessages(ruleName, {
    expensivePositionedEffect: (
        position: string,
        property: string,
        selector: string
    ): string =>
        `Avoid "${property}" on ${position}-positioned selector "${selector}". Fixed or sticky paint effects can be expensive during scroll.`,
});

const docs = {
    description:
        "Warn when fixed or sticky positioned rules also apply expensive paint effects.",
    recommended: false,
    url: createRuleDocsUrl("no-expensive-positioning-patterns"),
} as const;

type SecondaryOptions = Readonly<{
    ignoreProperties?: string[];
    positions?: string[];
}>;

const defaultPositions: ReadonlySet<string> = new Set(["fixed", "sticky"]);

const isStringArray = (value: unknown): boolean =>
    Array.isArray(value) && value.every((entry) => typeof entry === "string");

const ruleFunction: RuleBase<boolean, SecondaryOptions> =
    (primary, secondary) => (root, result) => {
        const isValid = validateOptions(
            result,
            ruleName,
            {
                actual: primary,
                possible: [true],
            },
            {
                actual: secondary,
                optional: true,
                possible: {
                    ignoreProperties: [isStringArray],
                    positions: [isStringArray],
                },
            }
        );

        if (!isValid) {
            return;
        }

        const ignoredProperties: ReadonlySet<string> = new Set(
            (secondary?.ignoreProperties ?? []).map((entry) =>
                entry.toLowerCase()
            )
        );
        const positions: ReadonlySet<string> = new Set(
            (secondary?.positions ?? [...defaultPositions]).map((entry) =>
                entry.toLowerCase()
            )
        );

        root.walkRules((ruleNode) => {
            const positionDeclaration = getDirectPositionDeclaration(
                ruleNode,
                positions
            );

            if (!isDefined(positionDeclaration)) {
                return;
            }

            for (const declaration of getDirectPaintEffectDeclarations(
                ruleNode,
                ignoredProperties
            )) {
                report({
                    message: messages.expensivePositionedEffect(
                        positionDeclaration.value.trim().toLowerCase(),
                        declaration.prop.toLowerCase(),
                        ruleNode.selector
                    ),
                    node: declaration,
                    result,
                    ruleName,
                    word: declaration.prop,
                });
            }
        });
    };

const rule: StylelintPluginRule<boolean, SecondaryOptions, typeof messages> =
    createStylelintRule<boolean, SecondaryOptions, typeof messages>({
        docs,
        messages,
        rule: ruleFunction,
        ruleName,
    });

export default rule;

function getDirectPaintEffectDeclarations(
    ruleNode: PostcssRule,
    ignoredProperties: ReadonlySet<string>
): readonly Declaration[] {
    const declarations: Declaration[] = [];

    ruleNode.walkDecls((declaration) => {
        const propertyName = declaration.prop.toLowerCase();

        if (
            declaration.parent === ruleNode &&
            setHas<string, string>(paintEffectProperties, propertyName) &&
            !setHas<string, string>(ignoredProperties, propertyName) &&
            !setHas<string, string>(
                resetKeywords,
                declaration.value.trim().toLowerCase()
            )
        ) {
            declarations.push(declaration);
        }
    });

    return declarations;
}

function getDirectPositionDeclaration(
    ruleNode: PostcssRule,
    positions: ReadonlySet<string>
): Declaration | undefined {
    return ruleNode.nodes?.find(
        (node): node is Declaration =>
            isDeclarationNode(node) &&
            node.prop.toLowerCase() === "position" &&
            setHas<string, string>(positions, node.value.trim().toLowerCase())
    );
}

function isDeclarationNode(node: ChildNode): node is Declaration {
    return node.type === "decl";
}

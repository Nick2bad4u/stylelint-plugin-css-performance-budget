import nickTwoBadFourU from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.all,

    {
        files: ["docs/docusaurus/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "canonical/filename-no-index": "off",
            "n/no-process-env": "off",
            "n/no-sync": "off",
            "perfectionist/sort-imports": "off",
            "perfectionist/sort-jsx-props": "off",
            "perfectionist/sort-object-types": "off",
            "perfectionist/sort-objects": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "unicorn/escape-case": "off",
            "unicorn/filename-case": "off",
            "unicorn/import-style": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-typeof-undefined": "off",
            "unicorn/no-unnecessary-global-this": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/no-useless-fallback-in-spread": "off",
            "unicorn/prefer-short-arrow-method": "off",
            "unicorn/prefer-temporal": "off",
            "unicorn/prefer-unicode-code-point-escapes": "off",
            "unicorn/prefer-url-href": "off",
            "unicorn/relative-url-style": "off",
        },
    },

    {
        files: ["src/**/*.ts"],
        rules: {
            "unicorn/consistent-boolean-name": "off",
        },
    },

    {
        files: ["src/_internal/rules-registry.ts"],
        rules: {
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/prefer-object-from-entries": "off",
        },
    },

    {
        files: ["src/_internal/value-function-analysis.ts", "vite.config.ts"],
        rules: {
            "unicorn/prefer-includes-over-repeated-comparisons": "off",
            "unicorn/prefer-number-coercion": "off",
        },
    },

    {
        files: ["test/**/*.ts"],
        rules: {
            "canonical/no-barrel-import": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/no-break-in-nested-loop": "off",
        },
    },

    {
        files: ["stryker.config.mjs"],
        rules: {
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "unicorn/no-unnecessary-global-this": "off",
        },
    },
];

export default config;

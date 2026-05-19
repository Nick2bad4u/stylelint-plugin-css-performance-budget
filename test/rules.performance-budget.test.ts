import { describe, expect, it } from "vitest";

import {
    getWarningTexts,
    lintWithConfig,
} from "./_internal/stylelint-test-helpers";

describe("css-performance-budget rules", () => {
    it("reports heavy selectors", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: "#app .layout .card > ul li a span { color: red; }",
            config: {
                rules: {
                    "css-performance-budget/no-heavy-selectors": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-heavy-selectors"
        );
    });

    it("reports giant selector lists", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".a, .b, .c, .d, .e { color: red; }",
            config: {
                rules: {
                    "css-performance-budget/no-giant-selector-lists": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-giant-selector-lists"
        );
    });

    it("reports excessive filter effects", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".hero { filter: blur(12px) saturate(120%) contrast(110%); }",
            config: {
                rules: {
                    "css-performance-budget/no-excessive-filter-effects": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-excessive-filter-effects"
        );
    });

    it("reports expensive animation properties", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: [
                ".card { transition: all 160ms ease-out; }",
                "@keyframes pulse-shadow {",
                "  from { box-shadow: 0 0 0 rgb(0 0 0 / 0%); }",
                "  to { box-shadow: 0 12px 28px rgb(0 0 0 / 28%); }",
                "}",
            ].join("\n"),
            config: {
                rules: {
                    "css-performance-budget/no-expensive-animation-properties": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-expensive-animation-properties"
        );
    });

    it("reports broad and expensive will-change targets", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".card { will-change: all, width, box-shadow; }",
            config: {
                rules: {
                    "css-performance-budget/no-will-change-abuse": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-will-change-abuse"
        );
    });

    it("reports render-blocking css imports", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: '@import url("theme.css");\n.button { color: red; }',
            config: {
                rules: {
                    "css-performance-budget/no-render-blocking-import": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-render-blocking-import"
        );
    });

    it("reports fixed background attachment", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".hero { background: url(hero.jpg) center / cover fixed; }",
            config: {
                rules: {
                    "css-performance-budget/no-fixed-background-attachment": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-fixed-background-attachment"
        );
    });

    it("reports global expensive effects", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: "body { filter: blur(2px); }",
            config: {
                rules: {
                    "css-performance-budget/no-global-expensive-effects": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-global-expensive-effects"
        );
    });

    it("reports oversized rendering custom properties", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: [
                ":root {",
                "  --hero-shadow: 0 1px 2px black, 0 2px 4px black, 0 4px 8px black, 0 8px 16px black, 0 16px 32px black;",
                "}",
            ].join("\n"),
            config: {
                rules: {
                    "css-performance-budget/no-oversized-css-custom-property-values": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-oversized-css-custom-property-values"
        );
    });

    it("reports expensive positioning patterns", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".toolbar { position: sticky; top: 0; box-shadow: 0 8px 24px rgb(0 0 0 / 20%); }",
            config: {
                rules: {
                    "css-performance-budget/no-expensive-positioning-patterns": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-expensive-positioning-patterns"
        );
    });

    it("reports expensive motion without reduced-motion override", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".drawer { transition: width 220ms ease; }",
            config: {
                rules: {
                    "css-performance-budget/require-reduced-motion-for-expensive-animations": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/require-reduced-motion-for-expensive-animations"
        );
    });

    it("allows scoped low-cost animation targets", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".chip { transition: opacity 180ms ease, transform 180ms ease; }",
            config: {
                rules: {
                    "css-performance-budget/no-expensive-animation-properties": true,
                },
            },
        });

        expect(getWarningTexts(result)).not.toContain(
            "css-performance-budget/no-expensive-animation-properties"
        );
    });

    it("allows narrow low-cost will-change usage", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".chip { will-change: transform, opacity; }",
            config: {
                rules: {
                    "css-performance-budget/no-will-change-abuse": true,
                },
            },
        });

        expect(getWarningTexts(result)).not.toContain(
            "css-performance-budget/no-will-change-abuse"
        );
    });

    it("allows expensive motion with reduced-motion override", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: [
                ".drawer { transition: width 220ms ease; }",
                "@media (prefers-reduced-motion: reduce) {",
                "  .drawer { transition-duration: 0ms; }",
                "}",
            ].join("\n"),
            config: {
                rules: {
                    "css-performance-budget/require-reduced-motion-for-expensive-animations": true,
                },
            },
        });

        expect(getWarningTexts(result)).not.toContain(
            "css-performance-budget/require-reduced-motion-for-expensive-animations"
        );
    });

    it("reports layout-thrashing properties", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".panel { width: 100%; }",
            config: {
                rules: {
                    "css-performance-budget/no-layout-thrashing-properties": true,
                },
            },
        });

        expect(getWarningTexts(result).join("\n")).toContain(
            "css-performance-budget/no-layout-thrashing-properties"
        );
    });

    it("reports paint-heavy declarations but allows reset values", async () => {
        expect.hasAssertions();

        const problemResult = await lintWithConfig({
            code: ".card { box-shadow: 0 12px 40px rgb(0 0 0 / 30%); }",
            config: {
                rules: {
                    "css-performance-budget/no-paint-heavy-declarations": true,
                },
            },
        });

        expect(getWarningTexts(problemResult).join("\n")).toContain(
            "css-performance-budget/no-paint-heavy-declarations"
        );

        const resetResult = await lintWithConfig({
            code: ".card { box-shadow: none; }",
            config: {
                rules: {
                    "css-performance-budget/no-paint-heavy-declarations": true,
                },
            },
        });

        expect(resetResult.warnings).toHaveLength(0);
    });

    it("does not report lightweight selectors", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: ".button { color: red; }",
            config: {
                rules: {
                    "css-performance-budget/no-heavy-selectors": true,
                },
            },
        });

        expect(getWarningTexts(result)).not.toContain(
            "css-performance-budget/no-heavy-selectors"
        );
    });
});

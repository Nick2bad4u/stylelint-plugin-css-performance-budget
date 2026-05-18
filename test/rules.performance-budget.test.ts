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

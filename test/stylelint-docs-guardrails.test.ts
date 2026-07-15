import * as nodeFs from "node:fs";
import packageJson from "stylelint-plugin-css-performance-budget/package.json" with { type: "json" };
import { describe, expect, it } from "vitest";

describe("docs stylelint guardrails", () => {
    it("keeps docs guardrail test script wired into release verification", () => {
        expect.hasAssertions();

        expect(packageJson.scripts["test:docs-guardrails"]).toBe(
            "npx vitest run test/stylelint-docs-guardrails.test.ts"
        );
        expect(packageJson.scripts["release:verify"]).toContain(
            "npm run test:docs-guardrails"
        );
    });

    it("keeps stylelint config delegated to the shared config", () => {
        expect.hasAssertions();

        const configFileContents = nodeFs.readFileSync(
            "stylelint.config.mjs",
            "utf8"
        );

        expect(configFileContents).toContain(
            'import sharedConfig from "stylelint-config-nick2bad4u";'
        );
        expect(configFileContents).toContain("const stylelintConfig = {");
        expect(configFileContents).toContain("...sharedConfig,");
    });

    it("does not reference the retired docusaurus plugin package name", () => {
        expect.hasAssertions();

        const packageJsonContents = nodeFs.readFileSync("package.json", "utf8");
        const retiredPluginPackageName = [
            "stylelint",
            "plugin",
            "docusaurus",
        ].join("-");

        expect(packageJsonContents).not.toContain(retiredPluginPackageName);
    });
});

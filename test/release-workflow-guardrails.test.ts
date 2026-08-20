import * as nodeFs from "node:fs";
import packageJson from "stylelint-plugin-css-performance-budget/package.json" with { type: "json" };
import { describe, expect, it } from "vitest";

const releaseWorkflow = nodeFs.readFileSync(
    ".github/workflows/release.yml",
    "utf8"
);

describe("release workflow guardrails", () => {
    it("keeps current-tag and explicit-range changelog commands distinct", () => {
        expect.assertions(3);

        expect(packageJson.scripts["changelog:release-notes"]).toContain(
            "--current"
        );
        expect(packageJson.scripts["changelog:release-notes:range"]).toContain(
            "--github-repo Nick2bad4u/stylelint-plugin-css-performance-budget"
        );
        expect(
            packageJson.scripts["changelog:release-notes:range"]
        ).not.toContain("--current");
    });

    it("excludes the unpushed release commit from enriched release notes", () => {
        expect.assertions(5);

        expect(releaseWorkflow).toMatch(
            /SOURCE_SHA: "\$\{\{ steps\.source\.outputs\.source_sha \}\}"/v
        );
        expect(releaseWorkflow).toContain(
            "previous_tag=$(git describe --tags --first-parent --match 'v[0-9]*.[0-9]*.[0-9]*' --abbrev=0 \"$SOURCE_SHA\")"
        );
        expect(releaseWorkflow).toMatch(
            /release_range="\$\{previous_tag\}\.\.\$\{SOURCE_SHA\}"/v
        );
        expect(releaseWorkflow).toContain(
            'changelog:release-notes:range -- --tag "$EXPECTED_TAG"'
        );
        expect(releaseWorkflow).not.toContain(
            'changelog:release-notes -- --output "$RELEASE_NOTES_PATH"'
        );
    });
});

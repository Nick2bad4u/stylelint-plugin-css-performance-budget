import { describe, expect, it, vi } from "vitest";

import { parseNpmPackFilename, runCli } from "../scripts/npm-pack-filename.mjs";

describe("parseNpmPackFilename valid and invalid metadata", () => {
    it("parses the historical array shape", () => {
        expect.assertions(1);

        expect(
            parseNpmPackFilename(
                JSON.stringify([{ filename: "example-package-1.2.3.tgz" }])
            )
        ).toBe("example-package-1.2.3.tgz");
    });

    it("parses the npm 12 package-name-keyed object shape", () => {
        expect.assertions(1);

        expect(
            parseNpmPackFilename(
                JSON.stringify({
                    "@scope/example-package": {
                        filename: "scope-example-package-1.2.3.tgz",
                    },
                })
            )
        ).toBe("scope-example-package-1.2.3.tgz");
    });

    it("throws for malformed JSON", () => {
        expect.assertions(1);

        expect(() => parseNpmPackFilename("not-json")).toThrow(TypeError);
    });

    it.each([
        ["a primitive", JSON.stringify(42)],
        ["no records", JSON.stringify([])],
        [
            "multiple records",
            JSON.stringify([
                { filename: "first-1.0.0.tgz" },
                { filename: "second-1.0.0.tgz" },
            ]),
        ],
        ["a non-object record", JSON.stringify([null])],
        ["a missing filename", JSON.stringify([{}])],
        ["a blank filename", JSON.stringify([{ filename: " " }])],
        ["a parent path", JSON.stringify([{ filename: "../package.tgz" }])],
        ["a child path", JSON.stringify([{ filename: "dir/package.tgz" }])],
        [
            "a Windows path",
            JSON.stringify([{ filename: String.raw`C:\\temp\\package.tgz` }]),
        ],
        ["a non-tarball", JSON.stringify([{ filename: "package.zip" }])],
    ])("rejects %s", (_label, jsonText) => {
        expect.assertions(1);

        expect(() => parseNpmPackFilename(jsonText)).toThrow(TypeError);
    });
});

describe(runCli, () => {
    it("writes only the validated filename", async () => {
        expect.assertions(2);

        const metadata = JSON.stringify({
            example: { filename: "example-1.0.0.tgz" },
        });
        const readText = vi
            .fn<(path: string, encoding: "utf8") => Promise<string>>()
            .mockResolvedValue(metadata);
        const write = vi.fn<(value: string) => void>();

        await expect(
            runCli({
                argumentList: ["pack.json"],
                readText,
                stdout: { write },
            })
        ).resolves.toBe(0);
        expect(write).toHaveBeenCalledExactlyOnceWith("example-1.0.0.tgz");
    });

    it("fails closed when the metadata path is absent", async () => {
        expect.assertions(2);

        const error = vi.fn<(...values: readonly unknown[]) => void>();

        await expect(
            runCli({ argumentList: [], logger: { error } })
        ).resolves.toBe(1);
        expect(error).toHaveBeenCalledExactlyOnceWith(
            "Usage: node scripts/npm-pack-filename.mjs <npm-pack-json-path>"
        );
    });
});

import { describe, expect, it } from "vitest";

import {
    createConsumerInstallCommand,
    resolveNpmCliPath,
} from "../scripts/run-stylelint16-compat.mjs";

const windowsNodeCommand = String.raw`C:\Program Files\nodejs\node.exe`;
const windowsNpmCliPath = String.raw`C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js`;

describe("stylelint 16 compatibility consumer", () => {
    it("accepts only an absolute npm CLI module path", () => {
        expect.assertions(2);

        expect(
            resolveNpmCliPath(
                {
                    npm_execpath: windowsNpmCliPath,
                },
                "win32"
            )
        ).toBe(windowsNpmCliPath);
        expect(
            resolveNpmCliPath(
                {
                    npm_execpath:
                        "/opt/node/lib/node_modules/npm/bin/npm-cli.js",
                },
                "linux"
            )
        ).toBe("/opt/node/lib/node_modules/npm/bin/npm-cli.js");
    });

    it.each([
        [{ npm_execpath: "../npm/bin/npm-cli.js" }, "linux"],
        [{ npm_execpath: "/opt/node/bin/npm" }, "linux"],
        [{ npm_execpath: "npm-cli.js" }, "win32"],
        [{ npm_execpath: String.raw`C:\tools\npm.cmd` }, "win32"],
        [{}, "win32"],
    ] as const)(
        "rejects an invalid npm lifecycle path",
        (environment, platform) => {
            expect.hasAssertions();

            expect(() => resolveNpmCliPath(environment, platform)).toThrow(
                "npm_execpath must be an absolute path to npm-cli.js"
            );
        }
    );

    it("installs the packed candidate without weakening peer resolution", () => {
        expect.assertions(3);

        const command = createConsumerInstallCommand({
            nodeCommand: windowsNodeCommand,
            npmCliPath: windowsNpmCliPath,
            tarballPath: "/workspace/consumer/plugin-2.0.6.tgz",
            workingDirectory: "/workspace/consumer",
        });

        expect(command).toStrictEqual({
            args: [
                windowsNpmCliPath,
                "install",
                "--ignore-scripts",
                "--no-audit",
                "--no-fund",
                "--save-exact",
                "stylelint@^16",
                "/workspace/consumer/plugin-2.0.6.tgz",
            ],
            command: windowsNodeCommand,
            workingDirectory: "/workspace/consumer",
        });
        expect(command.args).not.toContain("--legacy-peer-deps");
        expect(command.args).not.toContain("--force");
    });
});

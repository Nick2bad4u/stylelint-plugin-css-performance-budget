import { describe, expect, it } from "vitest";

import {
    createConsumerInstallCommand,
    getNpmCommand,
} from "../scripts/run-stylelint16-compat.mjs";

describe("Stylelint 16 compatibility consumer", () => {
    it("uses the platform npm launcher", () => {
        expect(getNpmCommand("win32")).toBe("npm.cmd");
        expect(getNpmCommand("linux")).toBe("npm");
    });

    it("installs the packed candidate without weakening peer resolution", () => {
        const command = createConsumerInstallCommand({
            npmCommand: "npm",
            platform: "linux",
            tarballPath: "/workspace/consumer/plugin-2.0.6.tgz",
            workingDirectory: "/workspace/consumer",
        });

        expect(command).toStrictEqual({
            args: [
                "install",
                "--ignore-scripts",
                "--no-audit",
                "--no-fund",
                "--save-exact",
                "stylelint@^16",
                "/workspace/consumer/plugin-2.0.6.tgz",
            ],
            command: "npm",
            shell: false,
            workingDirectory: "/workspace/consumer",
        });
        expect(command.args).not.toContain("--legacy-peer-deps");
        expect(command.args).not.toContain("--force");
    });
});

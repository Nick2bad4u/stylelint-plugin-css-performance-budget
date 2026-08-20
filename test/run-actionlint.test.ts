import { describe, expect, it, vi } from "vitest";

import {
    resolveActionlintAsset,
    runActionlint,
} from "../scripts/run-actionlint.mjs";

describe(resolveActionlintAsset, () => {
    it.each([
        [
            "darwin",
            "arm64",
            "darwin_arm64.tar.gz",
            "actionlint",
        ],
        [
            "darwin",
            "x64",
            "darwin_amd64.tar.gz",
            "actionlint",
        ],
        [
            "linux",
            "arm64",
            "linux_arm64.tar.gz",
            "actionlint",
        ],
        [
            "linux",
            "x64",
            "linux_amd64.tar.gz",
            "actionlint",
        ],
        [
            "win32",
            "arm64",
            "windows_arm64.zip",
            "actionlint.exe",
        ],
        [
            "win32",
            "x64",
            "windows_amd64.zip",
            "actionlint.exe",
        ],
    ] as const)(
        "resolves the %s %s release asset",
        (platform, architecture, filenameSuffix, executableName) => {
            expect.assertions(4);

            const releaseAsset = resolveActionlintAsset(platform, architecture);

            expect(releaseAsset.executableName).toBe(executableName);
            expect(releaseAsset.filename.endsWith(filenameSuffix)).toBe(true);
            expect(releaseAsset.sha256).toMatch(/^[\da-f]{64}$/v);
            expect(releaseAsset.url).toBe(
                `https://github.com/rhysd/actionlint/releases/download/v1.7.12/${releaseAsset.filename}`
            );
        }
    );

    it("fails closed on an unsupported platform combination", () => {
        expect.assertions(1);

        expect(() => resolveActionlintAsset("aix", "ppc64")).toThrow(
            RangeError
        );
    });
});

describe(runActionlint, () => {
    it("passes arguments to the verified executable and returns its status", async () => {
        expect.assertions(3);

        const ensureExecutable = vi.fn<() => Promise<string>>();
        ensureExecutable.mockResolvedValue("/verified/actionlint");
        const execute =
            vi.fn<
                (
                    executablePath: string,
                    arguments_: readonly string[]
                ) => Promise<number>
            >();
        execute.mockResolvedValue(7);

        await expect(
            runActionlint({
                argumentList: ["-version"],
                ensureExecutable,
                execute,
            })
        ).resolves.toBe(7);
        expect(ensureExecutable).toHaveBeenCalledExactlyOnceWith();
        expect(execute).toHaveBeenCalledExactlyOnceWith(
            "/verified/actionlint",
            ["-version"]
        );
    });

    it("fails closed when installation fails", async () => {
        expect.assertions(2);

        const ensureExecutable = vi
            .fn<() => Promise<string>>()
            .mockRejectedValue(new Error("integrity mismatch"));
        const error = vi.fn<(...values: readonly unknown[]) => void>();

        await expect(
            runActionlint({ ensureExecutable, logger: { error } })
        ).resolves.toBe(1);
        expect(error).toHaveBeenCalledExactlyOnceWith("integrity mismatch");
    });
});

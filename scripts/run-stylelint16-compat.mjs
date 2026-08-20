#!/usr/bin/env node

/**
 * @packageDocumentation
 * Pack the plugin and run its Stylelint 16 smoke checks in an isolated
 * consumer project. The repository manifests, lockfile, and installation are
 * never modified by this compatibility check.
 */
// @ts-check

import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

import { parseNpmPackFilename } from "./npm-pack-filename.mjs";

const scriptsDirectoryPath = dirname(fileURLToPath(import.meta.url));
const repositoryRootPath = resolve(scriptsDirectoryPath, "..");
const packageJsonPath = join(repositoryRootPath, "package.json");
const stylelintCompatSmokeScriptPath = join(
    scriptsDirectoryPath,
    "stylelint-compat-smoke.mjs"
);

/** @param {string} value */
const isWindowsAbsolutePath = (value) => /^[A-Za-z]:[\\/]/u.test(value);

/** @param {string} filePath */
const toFileHref = (filePath) => {
    if (isWindowsAbsolutePath(filePath)) {
        return new URL(`file:///${filePath.replaceAll("\\", "/")}`).href;
    }

    return pathToFileURL(resolve(filePath)).href;
};

/** @param {unknown} value */
const isRecord = (value) => typeof value === "object" && value !== null;

/** @param {unknown} error @param {string} fallbackMessage */
const toError = (error, fallbackMessage) =>
    error instanceof Error ? error : new Error(fallbackMessage);

/**
 * @typedef {Readonly<{
 *     args: readonly string[];
 *     captureOutput?: boolean;
 *     command: string;
 *     shell: boolean;
 *     workingDirectory: string;
 * }>} CommandSpec
 */

/** @param {string} [platform] */
export const getNpmCommand = (platform = process.platform) =>
    platform === "win32" ? "npm.cmd" : "npm";

/** @param {NodeJS.ProcessEnv} [environment] */
export const getWindowsCommandShell = (environment = process.env) =>
    environment["ComSpec"] ?? environment["COMSPEC"] ?? "cmd.exe";

/** @param {Readonly<{ argvEntry?: string; currentImportUrl: string }>} input */
export const isDirectExecution = ({ argvEntry, currentImportUrl }) =>
    typeof argvEntry === "string" && toFileHref(argvEntry) === currentImportUrl;

/**
 * Execute one child process synchronously and fail on non-zero exits.
 *
 * @param {CommandSpec & { windowsCommandShell?: string }} input
 *
 * @returns {string} Captured stdout, or an empty string when not requested.
 */
export function runCommand({
    args,
    captureOutput = false,
    command,
    shell,
    workingDirectory,
    windowsCommandShell = getWindowsCommandShell(),
}) {
    const childProcessEnvironment = Object.fromEntries(
        Object.entries(process.env).filter(
            ([name]) => name.toLowerCase() !== "npm_config_allow_scripts"
        )
    );
    const spawnOptions = {
        cwd: workingDirectory,
        encoding: /** @type {const} */ ("utf8"),
        env: childProcessEnvironment,
        shell: false,
        stdio: /** @type {const} */ (
            captureOutput
                ? [
                      "ignore",
                      "pipe",
                      "inherit",
                  ]
                : "inherit"
        ),
        windowsHide: true,
    };
    const shouldUseWindowsCommandShell = process.platform === "win32" && shell;
    const result = shouldUseWindowsCommandShell
        ? spawnSync(
              windowsCommandShell,
              [
                  "/d",
                  "/s",
                  "/c",
                  command,
                  ...args,
              ],
              spawnOptions
          )
        : spawnSync(command, args, spawnOptions);

    if (result.error !== undefined) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(
            `Command failed (${String(result.status)}): ${command} ${args.join(" ")}`
        );
    }

    return captureOutput && typeof result.stdout === "string"
        ? result.stdout
        : "";
}

/**
 * @param {Readonly<{
 *     npmCommand: string;
 *     platform: string;
 *     tarballPath: string;
 *     workingDirectory: string;
 * }>} input
 *
 * @returns {CommandSpec}
 */
export const createConsumerInstallCommand = ({
    npmCommand,
    platform,
    tarballPath,
    workingDirectory,
}) => ({
    args: [
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--save-exact",
        "stylelint@^16",
        tarballPath,
    ],
    command: npmCommand,
    shell: platform === "win32",
    workingDirectory,
});

/**
 * Pack the candidate and exercise it against Stylelint 16 in a fresh consumer.
 *
 * @param {Readonly<{
 *     mkdtempFn?: typeof mkdtemp;
 *     nodeCommand?: string;
 *     npmCommand?: string;
 *     packageJsonPath?: string;
 *     platform?: string;
 *     readFileFn?: typeof readFile;
 *     repositoryRootPath?: string;
 *     rmFn?: typeof rm;
 *     runCommandFn?: typeof runCommand;
 *     stylelintCompatSmokeScriptPath?: string;
 *     tmpDirectoryPath?: string;
 *     windowsCommandShell?: string;
 *     writeFileFn?: typeof writeFile;
 * }>} [input]
 */
export async function runStylelint16Compat({
    mkdtempFn = mkdtemp,
    nodeCommand = process.execPath,
    npmCommand = getNpmCommand(),
    packageJsonPath: targetPackageJsonPath = packageJsonPath,
    platform = process.platform,
    readFileFn = readFile,
    repositoryRootPath: targetRepositoryRootPath = repositoryRootPath,
    rmFn = rm,
    runCommandFn = runCommand,
    stylelintCompatSmokeScriptPath:
        targetSmokeScriptPath = stylelintCompatSmokeScriptPath,
    tmpDirectoryPath = tmpdir(),
    windowsCommandShell = getWindowsCommandShell(),
    writeFileFn = writeFile,
} = {}) {
    const consumerDirectory = await mkdtempFn(
        join(tmpDirectoryPath, "css-performance-budget-stylelint16-")
    );
    /** @type {Error | undefined} */
    let primaryError;

    try {
        const packageManifest = JSON.parse(
            await readFileFn(targetPackageJsonPath, "utf8")
        );
        const packageName = isRecord(packageManifest)
            ? packageManifest["name"]
            : undefined;

        if (typeof packageName !== "string" || packageName.length === 0) {
            throw new TypeError("The package manifest must contain a name.");
        }

        runCommandFn({
            args: ["run", "build"],
            command: npmCommand,
            shell: platform === "win32",
            workingDirectory: targetRepositoryRootPath,
            windowsCommandShell,
        });
        const packJson = runCommandFn({
            args: [
                "pack",
                "--json",
                "--ignore-scripts",
                "--pack-destination",
                consumerDirectory,
            ],
            captureOutput: true,
            command: npmCommand,
            shell: platform === "win32",
            workingDirectory: targetRepositoryRootPath,
            windowsCommandShell,
        });
        const tarballPath = join(
            consumerDirectory,
            parseNpmPackFilename(packJson)
        );

        await writeFileFn(
            join(consumerDirectory, "package.json"),
            `${JSON.stringify({ private: true, type: "module" }, undefined, 2)}\n`,
            "utf8"
        );
        runCommandFn({
            ...createConsumerInstallCommand({
                npmCommand,
                platform,
                tarballPath,
                workingDirectory: consumerDirectory,
            }),
            windowsCommandShell,
        });

        const pluginRootPath = join(
            consumerDirectory,
            "node_modules",
            ...packageName.split("/")
        );
        runCommandFn({
            args: [
                targetSmokeScriptPath,
                "--expect-stylelint-major=16",
                `--plugin-root=${pluginRootPath}`,
            ],
            command: nodeCommand,
            shell: false,
            workingDirectory: consumerDirectory,
            windowsCommandShell,
        });
    } catch (error) {
        primaryError = toError(
            error,
            "Stylelint 16 compatibility check failed."
        );
    }

    try {
        await rmFn(consumerDirectory, { force: true, recursive: true });
    } catch (cleanupError) {
        const normalizedCleanupError = toError(
            cleanupError,
            `Failed to remove compatibility directory: ${consumerDirectory}`
        );

        if (primaryError !== undefined) {
            throw new AggregateError(
                [primaryError, normalizedCleanupError],
                "Stylelint 16 compatibility check and cleanup both failed."
            );
        }

        throw normalizedCleanupError;
    }

    if (primaryError !== undefined) {
        throw primaryError;
    }
}

export async function runCli() {
    await runStylelint16Compat();
}

if (
    isDirectExecution({
        argvEntry: process.argv[1],
        currentImportUrl: import.meta.url,
    })
) {
    try {
        await runCli();
    } catch (error) {
        console.error("Stylelint 16 compatibility check failed:", error);
        process.exitCode = 1;
    }
}

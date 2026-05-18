#!/usr/bin/env node

/**
 * @packageDocumentation
 * Run ATTW with a resilient fallback for environments where the local CLI
 * crashes on tarball filename parsing.
 */
// @ts-check

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const localCliPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "node_modules",
    "@arethetypeswrong",
    "cli",
    "dist",
    "index.js"
);

const knownFilenameCrashText =
    "Cannot read properties of undefined (reading 'filename')";

/**
 * @param {string} command
 * @param {readonly string[]} args
 *
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(command, args) {
    const isWindowsCommandScript =
        process.platform === "win32" &&
        (command.endsWith(".cmd") || command.endsWith(".bat"));

    if (isWindowsCommandScript) {
        const windowsCommandShell =
            process.env["ComSpec"] ?? process.env["COMSPEC"] ?? "cmd.exe";

        return spawnSync(
            windowsCommandShell,
            [
                "/d",
                "/s",
                "/c",
                command,
                ...args,
            ],
            {
                cwd: process.cwd(),
                encoding: "utf8",
                shell: false,
                stdio: "pipe",
                windowsHide: true,
            }
        );
    }

    return spawnSync(command, args, {
        cwd: process.cwd(),
        encoding: "utf8",
        shell: false,
        stdio: "pipe",
        windowsHide: true,
    });
}

/**
 * @param {import("node:child_process").SpawnSyncReturns<string>} result
 *
 * @returns {string}
 */
function getCombinedOutput(result) {
    return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

/**
 * @param {import("node:child_process").SpawnSyncReturns<string>} result
 */
function writeOutput(result) {
    if (result.stdout) {
        process.stdout.write(result.stdout);
    }

    if (result.stderr) {
        process.stderr.write(result.stderr);
    }
}

/**
 * @returns {string}
 */
function getNpmCommand() {
    return process.platform === "win32" ? "npm.cmd" : "npm";
}

/**
 * @returns {string | undefined}
 */
function resolveGlobalAttwPath() {
    const npmPrefixResult = run(getNpmCommand(), ["prefix", "-g"]);

    if (npmPrefixResult.status !== 0) {
        return undefined;
    }

    const prefix = (npmPrefixResult.stdout ?? "").trim();

    if (prefix.length === 0) {
        return undefined;
    }

    const candidate =
        process.platform === "win32"
            ? join(prefix, "attw.cmd")
            : join(prefix, "bin", "attw");

    return existsSync(candidate) ? candidate : undefined;
}

/**
 * @param {readonly string[]} attwArgs
 */
function runAttw(attwArgs) {
    const localResult = run(process.execPath, [localCliPath, ...attwArgs]);

    if (localResult.status === 0) {
        writeOutput(localResult);
        return 0;
    }

    const localOutput = getCombinedOutput(localResult);

    if (!localOutput.includes(knownFilenameCrashText)) {
        writeOutput(localResult);
        return localResult.status ?? 1;
    }

    const globalAttwPath = resolveGlobalAttwPath();

    if (globalAttwPath === undefined) {
        writeOutput(localResult);
        return localResult.status ?? 1;
    }

    const globalResult = run(globalAttwPath, attwArgs);
    writeOutput(globalResult);
    return globalResult.status ?? 1;
}

process.exitCode = runAttw(process.argv.slice(2));

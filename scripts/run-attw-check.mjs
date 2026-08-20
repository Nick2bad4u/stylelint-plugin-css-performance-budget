#!/usr/bin/env node

/**
 * @packageDocumentation
 * Run the repository-locked ATTW CLI without shell or global-command fallback.
 */
// @ts-check

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRootPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    ".."
);
const localCliPath = resolve(
    repositoryRootPath,
    "node_modules",
    "@arethetypeswrong",
    "cli",
    "dist",
    "index.js"
);
const result = spawnSync(
    process.execPath,
    [localCliPath, ...process.argv.slice(2)],
    {
        cwd: repositoryRootPath,
        shell: false,
        stdio: "inherit",
        windowsHide: true,
    }
);

if (result.error !== undefined) {
    throw result.error;
}

process.exitCode = result.status ?? 1;

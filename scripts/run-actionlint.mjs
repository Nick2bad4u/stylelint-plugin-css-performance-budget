import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
    access,
    chmod,
    mkdir,
    readFile,
    rename,
    rm,
    writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ACTIONLINT_VERSION = "1.7.12";
const RELEASE_BASE_URL = `https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}`;
const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const RELEASE_ASSETS = new Map([
    [
        "darwin-arm64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_darwin_arm64.tar.gz`,
            sha256: "aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f",
        },
    ],
    [
        "darwin-x64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_darwin_amd64.tar.gz`,
            sha256: "5b44c3bc2255115c9b69e30efc0fecdf498fdb63c5d58e17084fd5f16324c644",
        },
    ],
    [
        "freebsd-x64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_freebsd_amd64.tar.gz`,
            sha256: "3de1b027d0b749e81d6d972cbf5d14dc708a275248da1ba4eed4a9af707d1339",
        },
    ],
    [
        "linux-arm",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_linux_armv6.tar.gz`,
            sha256: "ae4a0a5227578e66f5d00ee02788d5c64fdae1fa6484ab88ceaeee9359c28fa4",
        },
    ],
    [
        "linux-arm64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_linux_arm64.tar.gz`,
            sha256: "325e971b6ba9bfa504672e29be93c24981eeb1c07576d730e9f7c8805afff0c6",
        },
    ],
    [
        "linux-ia32",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_linux_386.tar.gz`,
            sha256: "72a44b32c2d032700e6d0c23ca2f540b67519ec68db098ddfcfa96059e61f723",
        },
    ],
    [
        "linux-x64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz`,
            sha256: "8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8",
        },
    ],
    [
        "win32-arm64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_windows_arm64.zip`,
            sha256: "cadcf7ea4efe3a68728893813643cebe1185e5b1d4be5b96245f65c9a4d5ea41",
        },
    ],
    [
        "win32-ia32",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_windows_386.zip`,
            sha256: "cdc8643b2c8dc890c76ad16095da97e75f86572805cc3573cc13f31ea0f19127",
        },
    ],
    [
        "win32-x64",
        {
            filename: `actionlint_${ACTIONLINT_VERSION}_windows_amd64.zip`,
            sha256: "6e7241b51e6817ea6a047693d8e6fed13b31819c9a0dd6c5a726e1592d22f6e9",
        },
    ],
]);

/**
 * Resolve the pinned Actionlint asset for an operating system and architecture.
 *
 * @param {NodeJS.Platform} platform - Node.js platform identifier.
 * @param {string} architecture - Node.js architecture identifier.
 *
 * @returns {{
 *     executableName: string;
 *     filename: string;
 *     sha256: string;
 *     url: string;
 * }}
 *   Verified release-asset metadata.
 */
export function resolveActionlintAsset(platform, architecture) {
    const key = `${platform}-${architecture}`;
    const releaseAsset = RELEASE_ASSETS.get(key);

    if (releaseAsset === undefined) {
        throw new RangeError(
            `Actionlint ${ACTIONLINT_VERSION} does not provide a pinned asset for ${key}.`
        );
    }

    return {
        ...releaseAsset,
        executableName: platform === "win32" ? "actionlint.exe" : "actionlint",
        url: `${RELEASE_BASE_URL}/${releaseAsset.filename}`,
    };
}

/**
 * Run the repository-pinned Actionlint binary.
 *
 * @param {object} [input] - CLI dependencies.
 * @param {readonly string[]} [input.argumentList] - Actionlint arguments.
 * @param {() => Promise<string>} [input.ensureExecutable] - Binary installer.
 * @param {(
 *     executablePath: string,
 *     arguments_: readonly string[]
 * ) => Promise<number>} [input.execute]
 *   - Process executor.
 * @param {{ error: (...values: readonly unknown[]) => void }} [input.logger]
 *
 *   - Error logger.
 *
 * @returns {Promise<number>} Actionlint exit code.
 */
export async function runActionlint({
    argumentList = process.argv.slice(2),
    ensureExecutable = ensureActionlintExecutable,
    execute = executeActionlint,
    logger = console,
} = {}) {
    try {
        const executablePath = await ensureExecutable();
        return await execute(executablePath, argumentList);
    } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        return 1;
    }
}

/**
 * Download, verify, and extract Actionlint into the ignored dependency cache.
 *
 * @returns {Promise<string>} Absolute path to the verified executable.
 */
async function ensureActionlintExecutable() {
    const releaseAsset = resolveActionlintAsset(process.platform, process.arch);
    const cacheRoot = resolve(
        REPOSITORY_ROOT,
        "node_modules",
        ".cache",
        "actionlint",
        ACTIONLINT_VERSION
    );
    const archivePath = join(cacheRoot, releaseAsset.filename);
    const installDirectory = join(
        cacheRoot,
        `${process.platform}-${process.arch}`
    );
    const executablePath = join(installDirectory, releaseAsset.executableName);

    await mkdir(cacheRoot, { recursive: true });

    if (!(await hasExpectedHash(archivePath, releaseAsset.sha256))) {
        await rm(archivePath, { force: true });
        await downloadVerifiedArchive(
            releaseAsset.url,
            archivePath,
            releaseAsset.sha256
        );
    }

    await rm(installDirectory, { force: true, recursive: true });
    await mkdir(installDirectory, { recursive: true });
    await executeCommand("tar", [
        "-xf",
        archivePath,
        "-C",
        installDirectory,
        releaseAsset.executableName,
    ]);
    await access(executablePath);

    if (process.platform !== "win32") {
        await chmod(executablePath, 0o755);
    }

    return executablePath;
}

/**
 * Download an archive and install it atomically after SHA-256 verification.
 *
 * @param {string} url - HTTPS release-asset URL.
 * @param {string} archivePath - Final archive path.
 * @param {string} expectedSha256 - Pinned archive digest.
 *
 * @returns {Promise<void>}
 */
async function downloadVerifiedArchive(url, archivePath, expectedSha256) {
    const response = await fetch(url, { redirect: "follow" });

    if (!response.ok) {
        throw new Error(
            `Unable to download Actionlint: HTTP ${response.status} ${response.statusText}.`
        );
    }

    const finalUrl = new URL(response.url);

    if (finalUrl.protocol !== "https:") {
        throw new Error(
            `Actionlint download redirected to a non-HTTPS URL: ${response.url}`
        );
    }

    const archive = Buffer.from(await response.arrayBuffer());
    const actualSha256 = createHash("sha256").update(archive).digest("hex");

    if (actualSha256 !== expectedSha256) {
        throw new Error(
            `Actionlint archive SHA-256 ${actualSha256} does not match pinned digest ${expectedSha256}.`
        );
    }

    const temporaryPath = `${archivePath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, archive, { flag: "wx" });

    try {
        await rename(temporaryPath, archivePath);
    } finally {
        await rm(temporaryPath, { force: true });
    }
}

/**
 * Check a file against an expected SHA-256 digest.
 *
 * @param {string} filePath - File to hash.
 * @param {string} expectedSha256 - Expected lowercase digest.
 *
 * @returns {Promise<boolean>} Whether the file exists and matches.
 */
async function hasExpectedHash(filePath, expectedSha256) {
    try {
        const contents = await readFile(filePath);
        return (
            createHash("sha256").update(contents).digest("hex") ===
            expectedSha256
        );
    } catch (error) {
        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
        ) {
            return false;
        }

        throw error;
    }
}

/**
 * Execute Actionlint with inherited standard streams.
 *
 * @param {string} executablePath - Verified executable path.
 * @param {readonly string[]} arguments_ - Actionlint arguments.
 *
 * @returns {Promise<number>} Process exit code.
 */
async function executeActionlint(executablePath, arguments_) {
    return await executeCommand(executablePath, arguments_);
}

/**
 * Execute a native command without a shell.
 *
 * @param {string} command - Executable path or command name.
 * @param {readonly string[]} arguments_ - Command arguments.
 *
 * @returns {Promise<number>} Process exit code.
 */
function executeCommand(command, arguments_) {
    return new Promise((resolvePromise, rejectPromise) => {
        const childProcess = spawn(command, arguments_, {
            shell: false,
            stdio: "inherit",
            windowsHide: true,
        });

        childProcess.once("error", rejectPromise);
        childProcess.once("exit", (exitCode, signal) => {
            if (signal !== null) {
                rejectPromise(
                    new Error(`${command} terminated from signal ${signal}.`)
                );
                return;
            }

            resolvePromise(exitCode ?? 1);
        });
    });
}

const isDirectExecution =
    typeof process.argv[1] === "string" &&
    pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
    process.exitCode = await runActionlint();
}

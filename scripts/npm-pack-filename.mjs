import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Parse `npm pack --json` output and return its single safe tarball filename.
 *
 * Npm 11 and older returned an array of pack records. npm 12 returns an object
 * keyed by package name. Release automation must accept both shapes without
 * trusting either the package name or an arbitrary filesystem path.
 *
 * @param {string} jsonText - Raw `npm pack --json` output.
 *
 * @returns {string} Safe tarball basename.
 */
export function parseNpmPackFilename(jsonText) {
    /** @type {unknown} */
    let parsedValue;

    try {
        parsedValue = JSON.parse(jsonText);
    } catch (error) {
        throw new TypeError("npm pack did not produce valid JSON.", {
            cause: error,
        });
    }

    const packRecords = Array.isArray(parsedValue)
        ? parsedValue
        : isRecord(parsedValue)
          ? Object.values(parsedValue)
          : [];

    if (packRecords.length !== 1) {
        throw new TypeError(
            `Expected exactly one npm pack record, received ${packRecords.length}.`
        );
    }

    const [packRecord] = packRecords;

    if (!isRecord(packRecord)) {
        throw new TypeError("Expected the npm pack record to be an object.");
    }

    const filename = packRecord["filename"];

    if (typeof filename !== "string" || filename.trim().length === 0) {
        throw new TypeError(
            "Expected the npm pack record to contain a nonblank filename."
        );
    }

    if (
        filename !== filename.trim() ||
        !/^[a-z0-9][a-z0-9._+-]*\.tgz$/iu.test(filename)
    ) {
        throw new TypeError(
            `npm pack returned an unsafe tarball filename: ${filename}`
        );
    }

    return filename;
}

/**
 * Check whether a value is a non-null object record.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is Record<string, unknown>} Whether the value is a record.
 */
function isRecord(value) {
    return typeof value === "object" && value !== null;
}

/**
 * Run the command-line interface.
 *
 * @param {object} [input] - CLI dependencies.
 * @param {readonly string[]} [input.argumentList] - CLI arguments.
 * @param {(path: string, encoding: "utf8") => Promise<string>} [input.readText]
 *   - Text reader.
 * @param {{ error: (...values: readonly unknown[]) => void }} [input.logger]
 *
 *   - Error logger.
 * @param {{ write: (value: string) => void }} [input.stdout] - Standard output.
 *
 * @returns {Promise<number>} Process exit code.
 */
export async function runCli({
    argumentList = process.argv.slice(2),
    logger = console,
    readText,
    stdout = process.stdout,
} = {}) {
    try {
        const [metadataPath, ...extraArguments] = argumentList;

        if (typeof metadataPath !== "string" || extraArguments.length > 0) {
            throw new TypeError(
                "Usage: node scripts/npm-pack-filename.mjs <npm-pack-json-path>"
            );
        }

        const readFile =
            readText ?? (await import("node:fs/promises")).readFile;
        const jsonText = await readFile(metadataPath, "utf8");
        stdout.write(parseNpmPackFilename(jsonText));
        return 0;
    } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        return 1;
    }
}

const isDirectExecution =
    typeof process.argv[1] === "string" &&
    pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
    process.exitCode = await runCli();
}

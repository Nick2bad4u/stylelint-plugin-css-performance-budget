/**
 * @typedef {{
 *     readonly fenceCharacter: "`" | "~";
 *     readonly minimumFenceLength: number;
 * }} FencedCodeBlockState
 */

/**
 * @param {string} line
 *
 * @returns {FencedCodeBlockState | undefined}
 */
function parseOpeningFence(line) {
    const withoutIndent = line.replace(/^ {0,3}/u, "");
    const firstCharacter = withoutIndent[0];

    if (firstCharacter !== "`" && firstCharacter !== "~") {
        return undefined;
    }

    let fenceLength = 0;

    while (withoutIndent[fenceLength] === firstCharacter) {
        fenceLength += 1;
    }

    if (fenceLength < 3) {
        return undefined;
    }

    const rest = withoutIndent.slice(fenceLength);
    const fenceCharacter = /** @type {"`" | "~"} */ (firstCharacter);

    if (fenceCharacter === "`" && rest.includes("`")) {
        return undefined;
    }

    return {
        fenceCharacter,
        minimumFenceLength: fenceLength,
    };
}

/**
 * @param {string} line
 * @param {FencedCodeBlockState} fencedCodeBlockState
 *
 * @returns {boolean}
 */
function isClosingFence(line, fencedCodeBlockState) {
    const withoutIndent = line.replace(/^ {0,3}/u, "");
    const firstCharacter = withoutIndent[0];

    if (firstCharacter !== fencedCodeBlockState.fenceCharacter) {
        return false;
    }

    let fenceLength = 0;

    while (withoutIndent[fenceLength] === firstCharacter) {
        fenceLength += 1;
    }

    if (fenceLength < fencedCodeBlockState.minimumFenceLength) {
        return false;
    }

    return withoutIndent.slice(fenceLength).trim() === "";
}

/**
 * @param {string} content
 *
 * @returns {string}
 */
function stripFencedCodeBlocks(content) {
    const lines = content.split(/(?<=\n)/u);

    /** @type {FencedCodeBlockState | undefined} */
    let fencedCodeBlockState;
    let sanitizedContent = "";

    for (const line of lines) {
        const lineWithoutTrailingLineBreak = line.replace(/\r?\n$/u, "");

        if (fencedCodeBlockState !== undefined) {
            if (
                isClosingFence(
                    lineWithoutTrailingLineBreak,
                    fencedCodeBlockState
                )
            ) {
                fencedCodeBlockState = undefined;
            }

            continue;
        }

        const openingFence = parseOpeningFence(lineWithoutTrailingLineBreak);

        if (openingFence !== undefined) {
            fencedCodeBlockState = openingFence;
            continue;
        }

        sanitizedContent += line;
    }

    return sanitizedContent;
}

/**
 * Remove fenced code blocks and inline code spans so markdown-like text inside
 * examples does not get treated as real prose content.
 *
 * @param {string} content
 *
 * @returns {string}
 */
export function stripMarkdownCode(content) {
    const contentWithoutFencedCodeBlocks = stripFencedCodeBlocks(content);

    let sanitizedContent = "";

    for (
        let characterIndex = 0;
        characterIndex < contentWithoutFencedCodeBlocks.length;
    ) {
        if (contentWithoutFencedCodeBlocks[characterIndex] !== "`") {
            sanitizedContent += contentWithoutFencedCodeBlocks[characterIndex];
            characterIndex += 1;
            continue;
        }

        let tickCount = 1;

        while (
            contentWithoutFencedCodeBlocks[characterIndex + tickCount] === "`"
        ) {
            tickCount += 1;
        }

        const tickSequence = "`".repeat(tickCount);
        const closingTickOffset = contentWithoutFencedCodeBlocks.indexOf(
            tickSequence,
            characterIndex + tickCount
        );

        if (closingTickOffset === -1) {
            sanitizedContent += tickSequence;
            characterIndex += tickCount;
            continue;
        }

        sanitizedContent += " ".repeat(
            closingTickOffset + tickCount - characterIndex
        );
        characterIndex = closingTickOffset + tickCount;
    }

    return sanitizedContent;
}

/**
 * @packageDocumentation
 * CSS value-analysis helpers for filter/backdrop performance rules.
 */

import { isDefined, isFinite as isFiniteNumber, stringSplit } from "ts-extras";

/** One parsed CSS function call, including normalized name and raw args text. */
export type CssFunctionCall = Readonly<{
    args: string;
    name: string;
}>;

const pxPerRem = 16;

/** Return true when a value contains a top-level CSS token outside functions. */
export function containsTopLevelToken(value: string, token: string): boolean {
    const wantedToken = token.toLowerCase();
    let tokenStart = -1;
    let parenthesisDepth = 0;

    for (let index = 0; index <= value.length; index += 1) {
        const character = value[index];

        if (character === "(") {
            parenthesisDepth += 1;
        } else if (character === ")") {
            parenthesisDepth = Math.max(0, parenthesisDepth - 1);
        }

        if (
            parenthesisDepth > 0 ||
            isTokenDelimiter(character) ||
            index === value.length
        ) {
            if (tokenStart !== -1) {
                const currentToken = value
                    .slice(tokenStart, index)
                    .trim()
                    .toLowerCase();

                if (currentToken === wantedToken) {
                    return true;
                }

                tokenStart = -1;
            }
        } else if (tokenStart === -1) {
            tokenStart = index;
        }
    }

    return false;
}

/** Extract blur radii (in px) from `blur()` and `drop-shadow()` functions. */
export function extractBlurRadiiPx(value: string): readonly number[] {
    const functions = parseCssFunctionCalls(value);
    const blurRadii: number[] = [];

    for (const cssFunction of functions) {
        if (cssFunction.name === "blur") {
            const [firstArgument = ""] = stringSplit(cssFunction.args, ",").map(
                (item) => item.trim()
            );
            const radius = toPixels(firstArgument);

            if (isDefined(radius)) {
                blurRadii.push(radius);
            }
        } else if (cssFunction.name === "drop-shadow") {
            const lengthsPx = getLengthTokens(cssFunction.args)
                .map((token) => toPixels(token))
                .filter(isDefined);
            const maybeBlurRadius = lengthsPx[2];

            if (isDefined(maybeBlurRadius)) {
                blurRadii.push(maybeBlurRadius);
            }
        }
    }

    return blurRadii;
}

/** Parse direct CSS function calls in a value string without nested recursion. */
export function parseCssFunctionCalls(
    value: string
): readonly CssFunctionCall[] {
    const calls: CssFunctionCall[] = [];
    let index = 0;

    while (index < value.length) {
        const maybeStart = value[index];

        if (isIdentifierStart(maybeStart)) {
            let identifierEnd = index + 1;

            while (isIdentifierContinue(value[identifierEnd])) {
                identifierEnd += 1;
            }

            const functionName = value.slice(index, identifierEnd);
            const hasOpeningParenthesis = value[identifierEnd] === "(";

            if (hasOpeningParenthesis) {
                const parenthesized = readParenthesizedContent(
                    value,
                    identifierEnd
                );

                if (
                    isDefined(parenthesized.content) &&
                    isDefined(parenthesized.endOffset)
                ) {
                    calls.push({
                        args: parenthesized.content,
                        name: functionName.toLowerCase(),
                    });
                    index = parenthesized.endOffset + 1;
                } else {
                    index = identifierEnd + 1;
                }
            } else {
                index = identifierEnd;
            }
        } else {
            index += 1;
        }
    }

    return calls;
}

/** Convert a CSS length token (`px`, `em`, `rem`) to px. */
export function toPixels(lengthToken: string): number | undefined {
    const normalized = lengthToken.trim().toLowerCase();
    const parsed = parseLengthToken(normalized);

    if (!isDefined(parsed) || !isFiniteNumber(parsed.value)) {
        return undefined;
    }

    switch (parsed.unit) {
        case "em":
        case "rem": {
            return parsed.value * pxPerRem;
        }
        case "px": {
            return parsed.value;
        }
        default: {
            return undefined;
        }
    }
}

function getLengthTokens(value: string): readonly string[] {
    const tokens: string[] = [];
    let tokenStart = -1;

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];

        if (isTokenDelimiter(character)) {
            if (tokenStart !== -1) {
                tokens.push(value.slice(tokenStart, index));
                tokenStart = -1;
            }
        } else if (tokenStart === -1) {
            tokenStart = index;
        }
    }

    if (tokenStart !== -1) {
        tokens.push(value.slice(tokenStart));
    }

    return tokens;
}

function getNumberPrefixLength(value: string): number {
    let index = 0;

    if (value[index] === "+" || value[index] === "-") {
        index += 1;
    }

    let hasDigits = false;

    while (isAsciiDigit(value[index])) {
        hasDigits = true;
        index += 1;
    }

    if (value[index] === ".") {
        index += 1;

        while (isAsciiDigit(value[index])) {
            hasDigits = true;
            index += 1;
        }
    }

    if (hasDigits) {
        return index;
    }

    return 0;
}

function isAsciiDigit(character: string | undefined): boolean {
    return isDefined(character) && character >= "0" && character <= "9";
}

function isIdentifierContinue(character: string | undefined): boolean {
    if (!isDefined(character)) {
        return false;
    }

    return (
        (character >= "a" && character <= "z") ||
        (character >= "0" && character <= "9") ||
        character === "-"
    );
}

function isIdentifierStart(character: string | undefined): boolean {
    return isDefined(character) && character >= "a" && character <= "z";
}

function isTokenDelimiter(character: string | undefined): boolean {
    return (
        !isDefined(character) ||
        character === "," ||
        character === "/" ||
        character === "\t" ||
        character === "\n" ||
        character === "\r" ||
        character === " "
    );
}

function parseLengthToken(token: string):
    | Readonly<{
          unit: "em" | "px" | "rem";
          value: number;
      }>
    | undefined {
    const parsed = Number.parseFloat(token);

    if (!isFiniteNumber(parsed)) {
        return undefined;
    }

    const numberPrefixLength = getNumberPrefixLength(token);

    if (numberPrefixLength === 0) {
        return undefined;
    }

    const unit = token.slice(numberPrefixLength);

    if (unit === "px" || unit === "em" || unit === "rem") {
        return { unit, value: parsed };
    }

    return undefined;
}

function readParenthesizedContent(
    value: string,
    openParenthesisOffset: number
): Readonly<{
    content: string | undefined;
    endOffset: number | undefined;
}> {
    let depth = 0;
    let contentStart = -1;
    let characterOffset = openParenthesisOffset;

    while (characterOffset < value.length) {
        const character = value[characterOffset];

        if (character === "(") {
            depth += 1;

            if (contentStart === -1) {
                contentStart = characterOffset + 1;
            }
        } else if (character === ")") {
            depth -= 1;

            if (depth === 0) {
                return {
                    content:
                        contentStart === -1
                            ? ""
                            : value.slice(contentStart, characterOffset),
                    endOffset: characterOffset,
                };
            }

            if (depth < 0) {
                return { content: undefined, endOffset: undefined };
            }
        }

        characterOffset += 1;
    }

    return { content: undefined, endOffset: undefined };
}

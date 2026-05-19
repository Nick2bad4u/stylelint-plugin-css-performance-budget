/**
 * Shared Vitest setup for repository tests.
 */
export const vitestSetupSentinel = true;

if (!vitestSetupSentinel) {
    throw new Error("Vitest setup sentinel must remain true.");
}

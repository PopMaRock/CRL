export function resp(body: any, status: number) {
    return new Response(JSON.stringify(body), { status: status, headers: { 'Content-Type': 'application/json' } });
}
export const er = {
	badRequest: {
		missing: 'Request item missing or invalid.',
		nonObject: 'Payload must be an object'
	},
    serverFail: {
        db: 'Unable to fetch database'
    }
}
/**
 * Checks if a string is valid based on specific criteria.
 * OVERKILL: This function is overkill for the current use case but 'fail to prepare' et al.
 * @param {string} str - The string to be checked.
 * @returns {boolean} - Returns true if the string is invalid, otherwise false.
 */
export function checkString(str: string): boolean {
    const invalidChars = [
        '.', '/', '\\', ' ', 'á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', ',', '_', '-', '?', '<', '>', ':', '*', '|', '"'
    ];
    const controlChars = [...Array.from(Array(0x20).keys()), ...Array.from(Array(0x20).keys()).map(i => i + 0x80)];
    const windowsReservedFilenames = [
        'CON', 'PRN', 'AUX', 'NUL',
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
        'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];
    return (
        !str ||
        str.length < 3 ||
        str.length > 255 ||
        str !== str.toLowerCase() ||
        invalidChars.some(char => str.includes(char)) ||
        controlChars.some(char => str.includes(String.fromCharCode(char))) ||
        windowsReservedFilenames.includes(str.toUpperCase())
    );
}
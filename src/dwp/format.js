export const DWP_MAGIC = "DwPr";

export const DWP_REFERENCE = {
    magic: DWP_MAGIC,
    endian: "little"
};

export function stringToBytes(value) {
    return new TextEncoder().encode(value);
}

export function writeU32LE(value) {
    const bytes = new Uint8Array(4);

    bytes[0] = value & 0xff;
    bytes[1] = (value >>> 8) & 0xff;
    bytes[2] = (value >>> 16) & 0xff;
    bytes[3] = (value >>> 24) & 0xff;

    return bytes;
}

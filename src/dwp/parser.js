export function readU32LE(bytes, offset) {
    return (
        bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)
    ) >>> 0;
}

export function readI32LE(bytes, offset) {
    return (
        bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)
    );
}

export function readF32LE(bytes, offset) {
    const view = new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength
    );

    return view.getFloat32(offset, true);
}

export function readString(bytes, offset, length) {
    return new TextDecoder().decode(
        bytes.slice(offset, offset + length)
    );
}

export function findBytes(bytes, needle) {
    const results = [];

    outer:
    for (let i = 0; i <= bytes.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) {
            if (bytes[i + j] !== needle[j]) {
                continue outer;
            }
        }

        results.push(i);
    }

    return results;
}

export function findAsciiStrings(bytes, minimumLength = 4) {
    const results = [];
    let start = -1;

    for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];

        const printable =
            c >= 32 &&
            c <= 126;

        if (printable) {
            if (start === -1) {
                start = i;
            }
        } else if (start !== -1) {
            const length = i - start;

            if (length >= minimumLength) {
                results.push({
                    offset: start,
                    length,
                    value: new TextDecoder().decode(
                        bytes.slice(start, i)
                    )
                });
            }

            start = -1;
        }
    }

    return results;
}

export function inspectDWP(buffer) {
    const bytes = new Uint8Array(buffer);

    const magic = new TextDecoder().decode(
        bytes.slice(0, 4)
    );

    return {
        size: bytes.length,
        magic,
        validMagic: magic === "DwPr"
    };
}

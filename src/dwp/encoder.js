import { DWP_MAGIC } from "./format.js";

export function createDWP() {
    throw new Error(
        `${DWP_MAGIC} encoder is not implemented yet. ` +
        `The reference DWP must be mapped first.`
    );
}

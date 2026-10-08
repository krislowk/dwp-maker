import { decodeAudio } from "./dwp/audio.js";

const audioInput = document.getElementById("audioInput");
const audioInfo = document.getElementById("audioInfo");
const fileName = document.getElementById("fileName");
const status = document.getElementById("status");
const createButton = document.getElementById("createButton");
const dwpName = document.getElementById("dwpName");

let selectedFile = null;
let decodedAudio = null;

audioInput.addEventListener("change", async () => {
    const file = audioInput.files?.[0];

    selectedFile = null;
    decodedAudio = null;
    createButton.disabled = true;

    if (!file) {
        fileName.textContent = "None";
        audioInfo.textContent =
            "Select an audio file to inspect it.";
        status.textContent = "Waiting for audio.";
        return;
    }

    fileName.textContent = file.name;
    status.textContent = "Analyzing audio...";

    try {
        const result = await decodeAudio(file);

        selectedFile = file;
        decodedAudio = result;

        audioInfo.innerHTML = `
            <div>Type: ${escapeHTML(file.type || "Unknown")}</div>
            <div>Size: ${formatBytes(file.size)}</div>
            <div>Duration: ${result.duration.toFixed(2)}s</div>
            <div>Sample rate: ${result.sampleRate} Hz</div>
            <div>Channels: ${result.channels}</div>
        `;

        createButton.disabled = false;
        status.textContent = "Audio ready.";
    } catch (error) {
        console.error(error);

        audioInfo.textContent =
            "This audio file could not be decoded.";

        status.textContent =
            "Could not decode this audio file.";

        createButton.disabled = true;
    }
});

createButton.addEventListener("click", async () => {
    if (!selectedFile || !decodedAudio) {
        status.textContent = "Select an audio file first.";
        return;
    }

    createButton.disabled = true;
    status.textContent = "Preparing DWP...";

    try {
        /*
         * The actual DirectWave encoder will be connected here.
         * We do not generate a fake .dwp by renaming the WAV.
         */

        status.textContent =
            "Audio loaded successfully. DWP encoder is next.";
    } catch (error) {
        console.error(error);
        status.textContent = "DWP creation failed.";
    } finally {
        createButton.disabled = false;
    }
});

function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

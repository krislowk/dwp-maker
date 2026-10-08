import { decodeAudio } from "./dwp/audio.js";
import { inspectDWP } from "./dwp/parser.js";

const audioInput =
    document.getElementById("audioInput");

const audioInfo =
    document.getElementById("audioInfo");

const fileName =
    document.getElementById("fileName");

const status =
    document.getElementById("status");

audioInput.addEventListener("change", async () => {
    const file = audioInput.files?.[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;
    status.textContent = "Analyzing audio...";

    try {
        const result = await decodeAudio(file);

        audioInfo.innerHTML = `
            <div>Type: ${escapeHTML(file.type || "Unknown")}</div>
            <div>Size: ${formatBytes(file.size)}</div>
            <div>Duration: ${result.duration.toFixed(2)}s</div>
            <div>Sample rate: ${result.sampleRate} Hz</div>
            <div>Channels: ${result.channels}</div>
        `;

        status.textContent = "Audio ready.";
    } catch (error) {
        console.error(error);

        status.textContent =
            "Could not decode this audio file.";
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
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

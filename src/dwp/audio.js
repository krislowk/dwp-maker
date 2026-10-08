export async function decodeAudio(file) {
    const arrayBuffer = await file.arrayBuffer();

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {
        throw new Error(
            "Web Audio API is not available in this browser."
        );
    }

    const context = new AudioContext();

    try {
        const audioBuffer =
            await context.decodeAudioData(
                arrayBuffer.slice(0)
            );

        return {
            buffer: audioBuffer,
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            duration: audioBuffer.duration,
            length: audioBuffer.length
        };
    } finally {
        await context.close();
    }
}

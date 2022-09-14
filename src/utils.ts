const SAMPLING_RATE = 44100;
const audioCtx = new window.AudioContext();

export function playPCMWeb(incomingData: Float32Array) {
  return new Promise((resolve) => {
    if (incomingData && incomingData.length > 0) {
      const channelBuffer = audioCtx.createBuffer(
        1,
        incomingData.length,
        SAMPLING_RATE
      );
      const nowBuffering = channelBuffer.getChannelData(0);

      for (let i = 0; i < channelBuffer.length; i++) {
        nowBuffering[i] = incomingData[i];
      }
      console.log(nowBuffering);
      const source = audioCtx.createBufferSource();
      source.buffer = channelBuffer;
      source.connect(audioCtx.destination);
      source.onended = resolve;
      source.start();
    }
  });
}

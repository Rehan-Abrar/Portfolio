import { useEffect, useRef } from "react";
import { getAudioGraph } from "../../utils/audioGraph.js";

const AudioVisualizer = ({ audioRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const { audioCtx, analyser } = getAudioGraph(audioRef.current);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const sampleRate = audioCtx.sampleRate;
    const binSize = sampleRate / analyser.fftSize;
    const minFreq = 20;
    const maxFreq = 8000;
    const minBin = Math.floor(minFreq / binSize);
    const maxBin = Math.min(bufferLength - 1, Math.ceil(maxFreq / binSize));

    let lastDrawTime = 0;
    const fpsInterval = 1000 / 30;

    const draw = (timestamp) => {
      requestAnimationFrame(draw);
      if (timestamp - lastDrawTime < fpsInterval) return;
      lastDrawTime = timestamp;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeBinCount = maxBin - minBin + 1;
      const barWidth = canvas.width / activeBinCount;
      let x = 0;

      for (let i = minBin; i <= maxBin; i++) {
        const barHeight = dataArray[i];
        // Scale the bar height to fit the canvas height
        const scaledHeight = (barHeight / 255) * canvas.height;

        ctx.fillStyle = `rgb(${barHeight},0,0)`;
        ctx.fillRect(x, canvas.height - scaledHeight, barWidth, scaledHeight);
        x += barWidth;
      }
    };

    draw();
  }, [audioRef]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default AudioVisualizer;

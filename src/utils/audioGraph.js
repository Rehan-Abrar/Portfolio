let audioCtx = null;
let analyser = null;
let sourceNode = null;

export function getAudioGraph(audioEl) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (!analyser) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
  }

  if (!sourceNode) {
    sourceNode = audioCtx.createMediaElementSource(audioEl);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  return { audioCtx, analyser };
}

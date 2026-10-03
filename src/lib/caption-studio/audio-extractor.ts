export async function extractAudioFromVideo(file: File): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Standardize on 16kHz for Whisper
  const targetSampleRate = 16000;
  
  // Use the standard browser AudioContext (webkit prefix for Safari fallback)
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('AudioContext is not supported in this browser.');
  }

  const ctx = new AudioContextClass({ sampleRate: targetSampleRate });
  
  try {
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (decodeErr: any) {
      console.error('Audio decode error:', decodeErr);
      throw new Error('Could not find or decode an audio track in this video. Please ensure your video contains spoken audio or sound.');
    }

    if (!audioBuffer || audioBuffer.numberOfChannels === 0 || audioBuffer.length === 0) {
      throw new Error('This video contains no audio data to transcribe.');
    }
    
    // In many browsers, providing sampleRate to the constructor resamples it correctly.
    // However, if the output sampleRate isn't 16000, we'd need an explicit resampler.
    // For V1, the browser's native resampling during decode is preferred and highly optimized.
    if (audioBuffer.sampleRate !== targetSampleRate) {
      console.warn(`Browser ignored AudioContext sampleRate. Expected ${targetSampleRate}, got ${audioBuffer.sampleRate}. Resampling not implemented yet.`);
    }

    // Extract mono (channel 0)
    const channelData = audioBuffer.getChannelData(0);
    
    return channelData;
  } finally {
    // Clean up AudioContext to prevent memory leaks
    if (ctx.state !== 'closed') {
      await ctx.close();
    }
  }
}

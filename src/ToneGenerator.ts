/*
 * ToneGenerator for node.js
 * generates raw PCM data for a tone,
 * specify frequency, length, volume and sampling rate
 */

type Shape = "sine" | "triangle" | "saw" | "square";

const shapes = {
  sine: function (i: number, cycle: number, volume: number): number {
    // i / cycle => value between 0 and 1
    // 0 = beginning of cycle
    // 0.25 Math.sin = 1
    // 0.5 Math.sin = 0
    // 0.75 Math.sin = -1
    // 1 Math.sin = 1
    return Math.min(volume * Math.sin((i / cycle) * Math.PI * 2), volume - 1);
  },
  triangle: function (i: number, cycle: number, volume: number): number {
    const halfCycle = cycle / 2;
    let level;

    if (i < halfCycle) {
      level = volume * 2 * (i / halfCycle) - volume;
    } else {
      i = i - halfCycle;
      level = -(volume * 2) * (i / halfCycle) + volume;
    }

    return Math.min(level, volume - 1);
  },
  saw: function (i: number, cycle: number, volume: number): number {
    return Math.min(volume * 2 * (i / cycle) - volume, volume - 1);
  },
  square: function (i: number, cycle: number, volume: number): number {
    if (i > cycle / 2) {
      return volume - 1;
    }

    return -volume;
  },
};

function generateCycle(cycle: number, volume: number, shape: Shape) {
  let data = [];
  let tmp;
  const generator = typeof shape == "function" ? shape : shapes[shape];

  for (let i = 0; i < cycle; i++) {
    tmp = generator(i, cycle, volume);
    data[i] = Math.round(tmp);
  }

  return data;
}

type Options = {
  freq?: number;
  rate?: number;
  lengthInSecs?: number;
  volume?: number;
  shape?: Shape;
};

function generateWaveForm(opts: Options) {
  opts = opts || {};
  const freq = opts.freq || 440;
  const rate = opts.rate || 44100;
  const lengthInSecs = opts.lengthInSecs || 2.0;
  const volume = opts.volume || 10;
  const shape = opts.shape || "sine";

  const cycle = Math.floor(rate / freq);
  const samplesLeft = lengthInSecs * rate;
  const cycles = samplesLeft / cycle;
  let ret: number[] = [];

  for (let i = 0; i < cycles; i++) {
    ret = ret.concat(generateCycle(cycle, volume, shape));
  }

  return ret;
}

export function ToneGenerator(opts: Options) {
  return generateWaveForm(opts);
}

export const MAX_16 = 32768;
export const MAX_8 = 128;

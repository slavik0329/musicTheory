import {
  Accidental,
  FlatHalfTone,
  HalfTone,
  SharpableTone,
  SharpHalfTone,
  Tone,
  UnSharpableTone,
  VirtualTone,
} from "./types.js";
import { ToneGenerator } from "./ToneGenerator";
import header from "waveheader";
import { Buffer } from "buffer/";

const context = new AudioContext();

const SAMPLING_RATE = 44100;
const allTones: Tone[] = ["A", "B", "C", "D", "E", "F", "G"];
const allSharps: SharpHalfTone[] = ["A#", "C#", "D#", "F#", "G#"];

type ChordTypeConfig = {
  type: ChordType;
  intervals: number[];
};

export type ChordType =
  | "Minor"
  | "Major"
  | "Diminished"
  | "Major_Seventh"
  | "Minor_Seventh"
  | "Dominant_Seventh"
  | "Sus_2"
  | "Sus_4"
  | "Augmented";

export type ScaleType =
  | "Major"
  | "Minor"
  | "Pentatonic_Major"
  | "Pentatonic_Minor"
  | "Mixolydian";

type ScaleConfig = {
  type: ScaleType;
  intervals: number[];
};

export const scaleConfigs: ScaleConfig[] = [
  {
    type: "Major",
    intervals: [0, 2, 4, 5, 7, 9, 11],
  },
  {
    type: "Minor",
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  {
    // R, M2, M3, P5, M6
    type: "Pentatonic_Major",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    type: "Pentatonic_Minor",
    // R, m3, P4, P5, m7
    intervals: [0, 3, 5, 7, 10],
  },
  {
    type: "Mixolydian",
    intervals: [0, 2, 4, 5, 7, 9, 10, 12],
  },
];

export const allScales = scaleConfigs.map((scale) => scale.type);

export const chordTypeConfigs: ChordTypeConfig[] = [
  {
    type: "Major",
    intervals: [0, 4, 7],
  },
  {
    type: "Major_Seventh",
    intervals: [0, 4, 7, 11],
  },
  {
    type: "Minor",
    intervals: [0, 3, 7],
  },
  {
    type: "Minor_Seventh",
    intervals: [0, 3, 7, 10],
  },
  {
    type: "Diminished",
    intervals: [0, 3, 6],
  },
  {
    type: "Dominant_Seventh",
    intervals: [0, 4, 7, 10],
  },
  {
    type: "Sus_2",
    intervals: [0, 2, 7],
  },
  {
    type: "Sus_4",
    intervals: [0, 5, 7],
  },
  {
    type: "Augmented",
    intervals: [0, 4, 8],
  },
];

export const allChords = chordTypeConfigs.map((config) => config.type);

export const allHalfTones: HalfTone[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

type HalfToneWithOctave = `${HalfTone}${number}`;

let bigHalfToneList: HalfToneWithOctave[] = [];

for (let i = 0; i < 9; i++) {
  allHalfTones.forEach((tone) => {
    bigHalfToneList.push(`${tone}${i}`);
  });
}

const naturallySharpableTones: SharpableTone[] = ["A", "C", "D", "F", "G"];

export function playPCMData(tone: number[]): Promise<void> {
  return new Promise((resolve) => {
    const headerBuffer = header(tone.length, {
      bitDepth: 8,
      sampleRate: SAMPLING_RATE,
    });

    const data = Uint8Array.from(tone, function (val) {
      return val + 128;
    });

    const dataBuffer = Buffer.from(data);
    const buffer = Buffer.concat([headerBuffer, dataBuffer]);
    const base64Url = "data:audio/wav;base64," + buffer.toString("base64");
    const audio = new Audio(base64Url);
    audio.play();
    const totalLengthSecs = tone.length / SAMPLING_RATE;
    setTimeout(resolve, totalLengthSecs * 1000);
  });
}

export class Note {
  private readonly tone: Tone;
  private readonly adjustment: 1 | -1 | 0;
  private readonly octave: number;

  constructor(halfTone: HalfTone | FlatHalfTone, octave: number) {
    const [tone, accidental] = Note.splitNote(halfTone);

    if (accidental) {
      this.adjustment = accidental === "#" ? 1 : -1;
    } else {
      this.adjustment = 0;
    }

    this.tone = tone;
    this.octave = octave;
  }

  static combineNote(
    tone: Tone,
    accidental?: Accidental | ""
  ): HalfTone | FlatHalfTone {
    if (accidental) {
      return `${tone as SharpableTone}${accidental as "#"}`;
    } else {
      return `${tone}`;
    }
  }

  static splitNote(HalfTone: VirtualTone): [Tone, Accidental | ""] {
    const strings = HalfTone.split("");
    return [strings[0] as Tone, strings[1] as Accidental];
  }

  static isToneSharpable(
    tone: SharpableTone | UnSharpableTone
  ): tone is SharpableTone {
    return naturallySharpableTones.includes(tone as SharpableTone);
  }

  static isFlatHalfTone(
    halfTone: HalfTone | FlatHalfTone
  ): halfTone is FlatHalfTone {
    return halfTone.includes("b");
  }

  createAudioTone(lengthInSecs = 0.3, volume = 30): number[] {
    return ToneGenerator({
      freq: this.getFrequency(),
      lengthInSecs,
      volume,
      shape: "sine",
    });
  }

  async playAudio(lengthInSecs?: number): Promise<void> {
    const sample = await fetch("/440.mp3")
      .then((response) => response.arrayBuffer())
      .then((buffer) => context.decodeAudioData(buffer));

    const source = context.createBufferSource();
    source.buffer = sample;
    source.connect(context.destination);
    source.start(0);

    const distanceFromConcertA = this.getHalfToneCountAwayAway(CONCERT_A_NOTE);
    source.playbackRate.value = 2 ** (distanceFromConcertA / 12);
  }

  getVirtualHalfToneName(): VirtualTone {
    let accidental: Accidental | "" = "";
    if (this.adjustment > 0) {
      accidental = "#";
    } else if (this.adjustment < 0) {
      accidental = "b";
    }

    return `${this.tone}${accidental}`;
  }

  getFrequency(): number {
    const distanceFromConcertA = this.getHalfToneCountAwayAway(CONCERT_A_NOTE);
    return Math.pow(2, distanceFromConcertA / 12) * CONCERT_A_FREQ;
  }

  getHalfToneCountAwayAway(destinationTone: Note): number {
    const sourceIndex = bigHalfToneList.indexOf(
      `${this.getRealHalfToneName()}${this.octave}`
    );

    const destinationIndex = bigHalfToneList.indexOf(
      `${destinationTone.getRealHalfToneName()}${destinationTone.octave}`
    );

    return sourceIndex - destinationIndex;
  }

  isSharpable(): boolean {
    return Note.isToneSharpable(this.tone);
  }

  isSharp(): boolean {
    return allSharps.includes(this.getRealHalfToneName() as SharpHalfTone);
  }

  /** Returns new Tone with given relative adjustment */
  getRelativeTone(number: number): Tone {
    const currentToneIndex = allTones.indexOf(this.tone);
    const newToneIndex = (currentToneIndex + number) % allTones.length;
    return allTones[newToneIndex];
  }

  getRealHalfToneName(): HalfTone {
    let accidental: Accidental | "" = "";
    let tone: Tone = this.tone;

    if (this.adjustment > 0) {
      if (Note.isToneSharpable(tone)) {
        accidental = "#";
      } else {
        tone = this.getRelativeTone(1);
      }
    } else if (this.adjustment < 0) {
      tone = this.getRelativeTone(-1);
    }

    if (Note.isToneSharpable(tone)) {
      return Note.combineNote(tone, accidental) as HalfTone;
    } else {
      return `${tone}`;
    }
  }

  display() {
    console.log(this.getVirtualHalfToneName());
  }

  /** Returns new Note (halfTone) with given relative adjustment */
  getRelativeHalfTone(number: number, withOctave?: boolean): Note {
    const newHalfTone = this.getRelativeHalfToneName(number, undefined);

    const currentHalfToneIndex = allHalfTones.indexOf(
      this.getRealHalfToneName()
    );

    let octavesMoved = 0;

    if (currentHalfToneIndex + number >= allHalfTones.length) {
      octavesMoved = Math.ceil(number / 12);
    }

    return new Note(newHalfTone, this.octave + octavesMoved);
  }

  private getRelativeHalfToneName(
    number: number,
    forceTone?: Tone
  ): HalfTone | FlatHalfTone {
    const currentHalfTone = this.getRealHalfToneName();

    const currentHalfToneIndex = allHalfTones.indexOf(currentHalfTone);
    const newHalfToneIndex =
      (currentHalfToneIndex + number) % allHalfTones.length;
    const realHalfTone =
      allHalfTones[
        newHalfToneIndex > -1
          ? newHalfToneIndex
          : allHalfTones.length + newHalfToneIndex
      ];
    let [realTone, realAccidental] = Note.splitNote(realHalfTone);

    if (forceTone) {
      if (forceTone !== realTone) {
        const forceToneIndex = allHalfTones.indexOf(forceTone);
        const realToneIndex = allHalfTones.indexOf(realTone);
        const difference = realToneIndex - forceToneIndex;
        if (difference < 0) {
          if (["E", "B"].includes(realTone)) {
          } else {
            realAccidental = "b";
          }
          realTone = forceTone;
        }
      }
    }

    return Note.combineNote(realTone, realAccidental);
  }

  createScale(type: ScaleType): Chord {
    const configToUse = scaleConfigs.find(
      (config) => config.type === type
    ) as ScaleConfig;

    const notes = configToUse.intervals.map((interval) =>
      this.getRelativeHalfTone(interval)
    );

    return new Chord(notes);
  }

  createChord(type: ChordType): Chord {
    const configToUse = chordTypeConfigs.find(
      (config) => config.type === type
    ) as ChordTypeConfig;

    const notes = configToUse.intervals.map((interval) =>
      this.getRelativeHalfTone(interval)
    );

    return new Chord(notes);
  }

  createTriad(type: ChordType): Chord {
    const first = new Note(this.getRealHalfToneName(), this.octave);
    const thirdTone = first.getRelativeTone(
      type === "Sus_2" ? 1 : type === "Sus_4" || type === "Augmented" ? 3 : 2
    );
    const fifthTone = first.getRelativeTone(4);
    const seventhTone = first.getRelativeTone(6);

    const config = chordTypeConfigs.find(
      (chord) => chord.type === type
    ) as ChordTypeConfig;

    const relativeThirdHalfToneName = this.getRelativeHalfToneName(
      config.intervals[1],
      thirdTone
    );
    const relativeFifthHalfToneName = this.getRelativeHalfToneName(
      config.intervals[2],
      fifthTone
    );

    const third = new Note(relativeThirdHalfToneName, this.octave);
    const fifth = new Note(relativeFifthHalfToneName, this.octave);

    let notes = [first, third, fifth];

    if (config.intervals.length > 3) {
      const relativeSeventhHalfToneName = this.getRelativeHalfToneName(
        config.intervals[3],
        seventhTone
      );

      const seventh = new Note(relativeSeventhHalfToneName, this.octave);
      notes.push(seventh);
    }

    return new Chord(notes);
  }
}

const CONCERT_A_NOTE = new Note("A", 4);
const CONCERT_A_FREQ = 440;

export class Chord {
  notes: Note[];

  constructor(notes: Note[]) {
    this.notes = notes;
  }

  display() {
    this.notes.forEach((note) => {
      note.display();
    });
  }

  async play(lengthInSecs: number = 2) {
    const promises = this.notes.map((note) => note.playAudio(lengthInSecs));

    await Promise.all(promises);
  }
}

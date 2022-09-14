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

const SAMPLING_RATE = 44100;
const allTones: Tone[] = ["A", "B", "C", "D", "E", "F", "G"];
const allSharps: SharpHalfTone[] = ["A#", "C#", "D#", "F#", "G#"];

type ChordTypeConfig = {
  type: ChordType;
  intervals: number[];
};

export type ScaleType = "Major" | "Minor" | "Pentatonic_Major";
export type ChordType = "Minor" | "Major" | "Diminished";
export const allScales: ScaleType[] = ["Major", "Minor", "Pentatonic_Major"];
export const allChords: ChordType[] = ["Major", "Minor", "Diminished"];

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
    type: "Pentatonic_Major",
    intervals: [0, 2, 4, 7, 9],
  },
];

export const chordTypeConfigs: ChordTypeConfig[] = [
  {
    type: "Major",
    intervals: [0, 4, 7],
  },
  {
    type: "Minor",
    intervals: [0, 3, 7],
  },
  {
    type: "Diminished",
    intervals: [0, 3, 6],
  },
];

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
    const data = Uint8Array.from(tone, function (val) {
      return val + 128;
    });

    let buffer: Buffer;

    if (Buffer.from) {
      // Node 5+
      buffer = Buffer.from(data);
    } else {
      buffer = new Buffer(data);
    }
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

  async playAudio(lengthInSecs: number): Promise<void> {
    const tone = this.createAudioTone(lengthInSecs);
    await playPCMData(tone);
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
  getRelativeHalfTone(number: number): Note {
    const newHalfTone = this.getRelativeHalfToneName(number);

    return new Note(newHalfTone, this.octave);
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
          realTone = forceTone;
          realAccidental = "b";
        }
      }
    }

    return Note.combineNote(realTone, realAccidental);
  }

  createAllTriads() {
    return {
      Major: this.createTriad("Major"),
      Minor: this.createTriad("Minor"),
      Diminished: this.createTriad("Diminished"),
    };
  }

  displayAllTriads() {
    const chordTypes: ChordType[] = ["Major", "Minor", "Diminished"];

    const triads = this.createAllTriads();

    chordTypes.forEach((chordType) => {
      console.log(`----${chordType} ${this.tone}----`);
      triads[chordType].display();
    });
  }

  createScale(type: ScaleType): Chord {
    const configToUse = scaleConfigs.find(
      (config) => config.type == type
    ) as ScaleConfig;

    const notes = configToUse.intervals.map((interval) =>
      this.getRelativeHalfTone(interval)
    );

    return new Chord(notes);
  }

  createChord(type: ChordType): Chord {
    const configToUse = chordTypeConfigs.find(
      (config) => config.type == type
    ) as ChordTypeConfig;

    const notes = configToUse.intervals.map((interval) =>
      this.getRelativeHalfTone(interval)
    );

    return new Chord(notes);
  }

  createTriad(type: ChordType): Chord {
    const first = new Note(this.getRealHalfToneName(), this.octave);
    const thirdTone = first.getRelativeTone(2);
    const fifthTone = first.getRelativeTone(4);

    const relativeThirdHalfToneName = this.getRelativeHalfToneName(
      type === "Minor" || type === "Diminished" ? 3 : 4,
      thirdTone
    );
    const relativeFifthHalfToneName = this.getRelativeHalfToneName(
      type === "Diminished" ? 6 : 7,
      fifthTone
    );

    const third = new Note(relativeThirdHalfToneName, this.octave);
    const fifth = new Note(relativeFifthHalfToneName, this.octave);

    return new Chord([first, third, fifth]);
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
    let allTones: number[] = [];

    const firstTone = this.notes[0].createAudioTone(lengthInSecs);
    const thirdTone = this.notes[1].createAudioTone(lengthInSecs);
    const fifthTone = this.notes[2].createAudioTone(lengthInSecs);

    for (let i = 0; i < SAMPLING_RATE * lengthInSecs; i++) {
      allTones.push(firstTone[i] + thirdTone[i] + fifthTone[i]);
    }

    await playPCMData(allTones);
  }
}

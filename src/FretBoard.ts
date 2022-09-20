import { Note } from "./Note";
import { TuningItem } from "./types";

export class GuitarString {
  public notes: Note[];

  constructor(tuningItem: TuningItem) {
    const rootNote = new Note(tuningItem.tone, tuningItem.octave);
    this.notes = [rootNote];

    for (let i = 1; i < 18; i++) {
      this.notes.push(rootNote.getRelativeHalfTone(i));
    }
  }
}

export class FretBoard {
  public strings: GuitarString[];

  constructor() {
    const standardTuning: TuningItem[] = [
      {
        tone: "E",
        octave: 4,
      },
      {
        tone: "B",
        octave: 3,
      },
      {
        tone: "G",
        octave: 3,
      },
      {
        tone: "D",
        octave: 3,
      },
      {
        tone: "A",
        octave: 2,
      },
      {
        tone: "E",
        octave: 2,
      },
    ];

    this.strings = standardTuning.map((str) => new GuitarString(str));
  }
}

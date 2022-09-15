import { allHalfTones, Note } from "./Note";
import { HalfTone, TuningItem } from "./types";

export class GuitarString {
  public notes: Note[];

  constructor(tuningItem: TuningItem) {
    const rootNote = new Note(tuningItem.tone, tuningItem.octave);
    this.notes = [rootNote];

    for (let i = 1; i < 13; i++) {
      this.notes.push(rootNote.getRelativeHalfTone(i));
    }
  }

  display(showAccidentals?: boolean, showOnlyHalfTones?: HalfTone[]) {
    const noteNames = this.notes.map((note, index) => {
      const realHalfToneName = note.getRealHalfToneName();
      if (index === 0) {
        return `${realHalfToneName}|`;
      }

      if (
        (note.isSharp() && !showAccidentals) ||
        (showOnlyHalfTones &&
          !showOnlyHalfTones.includes(
            note.getRelativeHalfTone(0).getRealHalfToneName()
          ))
      ) {
        return `|-------|`;
      } else {
        return `|---${realHalfToneName}${
          realHalfToneName.length === 1 ? "-" : ""
        }--|`;
      }
    });
    console.log(noteNames.join(""));
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

  display(showAccidentals?: boolean, showOnlyHalfTones?: HalfTone[]) {
    this.strings.forEach((str) =>
      str.display(showAccidentals, showOnlyHalfTones)
    );
    FretBoard.drawAnchors();
  }

  private static drawAnchors() {
    let strArr: string[] = [];
    for (let i = 0; i < allHalfTones.length; i++) {
      if ([2, 4, 6, 8].includes(i)) {
        strArr.push(`    X    `);
      } else if ([11].includes(i)) {
        strArr.push(`    XX   `);
      } else {
        strArr.push(`         `);
      }
    }

    console.log("  " + strArr.join(""));
  }
}

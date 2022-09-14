import { allHalfTones, Note } from "./Note";
import { HalfTone } from "./types";

export class GuitarString {
  public notes: Note[];

  constructor(stringHalfTone: HalfTone) {
    const rootNote = new Note(stringHalfTone, 1);
    this.notes = [rootNote];

    for (let i = 1; i < allHalfTones.length + 1; i++) {
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
          realHalfToneName.length == 1 ? "-" : ""
        }--|`;
      }
    });
    console.log(noteNames.join(""));
  }
}

export class FretBoard {
  public strings: GuitarString[];

  constructor() {
    const standardTuning: HalfTone[] = ["E", "B", "G", "D", "A", "E"];

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

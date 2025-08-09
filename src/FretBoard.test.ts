import { FretBoard, GuitarString } from './FretBoard';

describe('GuitarString Class', () => {
  test('creates correct number of notes (18 frets)', () => {
    const string = new GuitarString({ tone: 'E', octave: 4 });
    expect(string.notes).toHaveLength(18);
  });

  test('first note matches tuning', () => {
    const string = new GuitarString({ tone: 'E', octave: 4 });
    expect(string.notes[0].getRealHalfToneName()).toBe('E');
  });

  test('generates chromatic sequence of notes', () => {
    const string = new GuitarString({ tone: 'E', octave: 2 });
    
    // Check first few notes of low E string
    const noteNames = string.notes.slice(0, 13).map(n => n.getRealHalfToneName());
    expect(noteNames).toEqual([
      'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'
    ]);
  });

  test('handles different starting notes correctly', () => {
    const aString = new GuitarString({ tone: 'A', octave: 2 });
    const noteNames = aString.notes.slice(0, 5).map(n => n.getRealHalfToneName());
    expect(noteNames).toEqual(['A', 'A#', 'B', 'C', 'C#']);
  });

  test('maintains correct octave progression', () => {
    const bString = new GuitarString({ tone: 'B', octave: 3 });
    
    // B3 should become C4 after one half step
    expect(bString.notes[0].getRealHalfToneName()).toBe('B');
    expect(bString.notes[1].getRealHalfToneName()).toBe('C');
    // After 12 half steps, should be B4
    expect(bString.notes[12].getRealHalfToneName()).toBe('B');
  });
});

describe('FretBoard Class', () => {
  test('creates 6 strings', () => {
    const fretboard = new FretBoard();
    expect(fretboard.strings).toHaveLength(6);
  });

  test('uses standard tuning (E-A-D-G-B-E)', () => {
    const fretboard = new FretBoard();
    
    // Check open string notes (index 0 of each string)
    const openStringNotes = fretboard.strings.map(string => 
      string.notes[0].getRealHalfToneName()
    );
    
    expect(openStringNotes).toEqual(['E', 'B', 'G', 'D', 'A', 'E']);
  });

  test('strings have correct octaves in standard tuning', () => {
    const fretboard = new FretBoard();
    
    // High E string (1st string) - E4
    expect(fretboard.strings[0].notes[0].getRealHalfToneName()).toBe('E');
    
    // B string (2nd string) - B3
    expect(fretboard.strings[1].notes[0].getRealHalfToneName()).toBe('B');
    
    // G string (3rd string) - G3
    expect(fretboard.strings[2].notes[0].getRealHalfToneName()).toBe('G');
    
    // D string (4th string) - D3
    expect(fretboard.strings[3].notes[0].getRealHalfToneName()).toBe('D');
    
    // A string (5th string) - A2
    expect(fretboard.strings[4].notes[0].getRealHalfToneName()).toBe('A');
    
    // Low E string (6th string) - E2
    expect(fretboard.strings[5].notes[0].getRealHalfToneName()).toBe('E');
  });

  test('all strings have 18 notes each', () => {
    const fretboard = new FretBoard();
    
    fretboard.strings.forEach(string => {
      expect(string.notes).toHaveLength(18);
    });
  });

  test('12th fret is an octave higher than open string', () => {
    const fretboard = new FretBoard();
    
    fretboard.strings.forEach(string => {
      const openNote = string.notes[0].getRealHalfToneName();
      const twelfthFretNote = string.notes[12].getRealHalfToneName();
      
      // 12th fret should be the same note name as open string (one octave higher)
      expect(twelfthFretNote).toBe(openNote);
    });
  });

  test('common chord shapes are possible', () => {
    const fretboard = new FretBoard();
    
    // Check for C major chord shape (x32010)
    // 5th string (A), 3rd fret = C
    expect(fretboard.strings[4].notes[3].getRealHalfToneName()).toBe('C');
    
    // 4th string (D), 2nd fret = E
    expect(fretboard.strings[3].notes[2].getRealHalfToneName()).toBe('E');
    
    // 3rd string (G), open = G
    expect(fretboard.strings[2].notes[0].getRealHalfToneName()).toBe('G');
    
    // 2nd string (B), 1st fret = C
    expect(fretboard.strings[1].notes[1].getRealHalfToneName()).toBe('C');
    
    // 1st string (E), open = E
    expect(fretboard.strings[0].notes[0].getRealHalfToneName()).toBe('E');
  });

  test('power chord intervals are correct', () => {
    const fretboard = new FretBoard();
    
    // E5 power chord (E-B) - 6th string open and 5th string 2nd fret
    const lowE = fretboard.strings[5].notes[0].getRealHalfToneName();
    const B = fretboard.strings[4].notes[2].getRealHalfToneName();
    
    expect(lowE).toBe('E');
    expect(B).toBe('B');
    
    // A5 power chord (A-E) - 5th string open and 4th string 2nd fret
    const A = fretboard.strings[4].notes[0].getRealHalfToneName();
    const E = fretboard.strings[3].notes[2].getRealHalfToneName();
    
    expect(A).toBe('A');
    expect(E).toBe('E');
  });

  test('barre chord positions are correct', () => {
    const fretboard = new FretBoard();
    
    // F major barre chord (1st fret barre)
    // 6th string, 1st fret = F
    expect(fretboard.strings[5].notes[1].getRealHalfToneName()).toBe('F');
    
    // 5th string, 3rd fret = C
    expect(fretboard.strings[4].notes[3].getRealHalfToneName()).toBe('C');
    
    // 4th string, 3rd fret = F
    expect(fretboard.strings[3].notes[3].getRealHalfToneName()).toBe('F');
    
    // 3rd string, 2nd fret = A
    expect(fretboard.strings[2].notes[2].getRealHalfToneName()).toBe('A');
    
    // 2nd string, 1st fret = C
    expect(fretboard.strings[1].notes[1].getRealHalfToneName()).toBe('C');
    
    // 1st string, 1st fret = F
    expect(fretboard.strings[0].notes[1].getRealHalfToneName()).toBe('F');
  });
});
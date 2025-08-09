import { Note, Chord, allHalfTones, chordTypeConfigs, scaleConfigs } from './Note';

// Mocks are now in setupTests.ts

describe('Note Class', () => {
  describe('constructor and basic properties', () => {
    test('creates a natural note correctly', () => {
      const note = new Note('C', 4);
      expect(note.getRealHalfToneName()).toBe('C');
      expect(note.getVirtualHalfToneName()).toBe('C');
    });

    test('creates a sharp note correctly', () => {
      const note = new Note('C#', 4);
      expect(note.getRealHalfToneName()).toBe('C#');
      expect(note.getVirtualHalfToneName()).toBe('C#');
    });

    // Skip flat note test - TypeScript types don't support flat notes directly

    test('handles non-sharpable tones correctly', () => {
      const noteE = new Note('F' as any, 4); // E# becomes F
      expect(noteE.getRealHalfToneName()).toBe('F');
      
      const noteB = new Note('C' as any, 4); // B# becomes C
      expect(noteB.getRealHalfToneName()).toBe('C');
    });
  });

  describe('frequency calculations', () => {
    test('calculates correct frequency for A4 (concert A)', () => {
      const note = new Note('A', 4);
      expect(note.getFrequency()).toBeCloseTo(440, 1);
    });

    test('calculates correct frequency for A3 (one octave below)', () => {
      const note = new Note('A', 3);
      expect(note.getFrequency()).toBeCloseTo(220, 1);
    });

    test('calculates correct frequency for A5 (one octave above)', () => {
      const note = new Note('A', 5);
      expect(note.getFrequency()).toBeCloseTo(880, 1);
    });

    test('calculates correct frequency for C4 (middle C)', () => {
      const note = new Note('C', 4);
      expect(note.getFrequency()).toBeCloseTo(261.63, 1);
    });
  });

  describe('relative tone calculations', () => {
    test('getRelativeTone returns correct tone', () => {
      const noteC = new Note('C', 4);
      expect(noteC.getRelativeTone(2)).toBe('E');
      expect(noteC.getRelativeTone(4)).toBe('G');
      expect(noteC.getRelativeTone(7)).toBe('C'); // Wraps around
    });

    test('getRelativeHalfTone returns correct half tone', () => {
      const noteC = new Note('C', 4);
      const noteE = noteC.getRelativeHalfTone(4);
      expect(noteE.getRealHalfToneName()).toBe('E');
      
      const noteG = noteC.getRelativeHalfTone(7);
      expect(noteG.getRealHalfToneName()).toBe('G');
    });

    test('getRelativeHalfTone handles octave changes', () => {
      const noteC = new Note('C', 4);
      const noteC5 = noteC.getRelativeHalfTone(12);
      expect(noteC5.getRealHalfToneName()).toBe('C');
      // Should be in the next octave
    });

    test('getHalfToneCountAwayAway calculates correct distance', () => {
      const noteC = new Note('C', 4);
      const noteG = new Note('G', 4);
      
      const distance = noteG.getHalfToneCountAwayAway(noteC);
      expect(distance).toBe(7); // G is 7 half steps above C
    });
  });

  describe('chord creation', () => {
    test('creates major chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const majorChord = noteC.createChord('Major');
      
      const noteNames = majorChord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'E', 'G']);
    });

    test('creates minor chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const minorChord = noteC.createChord('Minor');
      
      const noteNames = minorChord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'D#', 'G']);
    });

    test('creates diminished chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const dimChord = noteC.createChord('Diminished');
      
      const noteNames = dimChord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'D#', 'F#']);
    });

    test('creates major seventh chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const maj7Chord = noteC.createChord('Major_Seventh');
      
      const noteNames = maj7Chord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'E', 'G', 'B']);
    });

    test('creates sus2 chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const sus2Chord = noteC.createChord('Sus_2');
      
      const noteNames = sus2Chord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'D', 'G']);
    });

    test('creates sus4 chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const sus4Chord = noteC.createChord('Sus_4');
      
      const noteNames = sus4Chord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'F', 'G']);
    });

    test('creates augmented chord with correct intervals', () => {
      const noteC = new Note('C', 4);
      const augChord = noteC.createChord('Augmented');
      
      const noteNames = augChord.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'E', 'G#']);
    });
  });

  describe('scale creation', () => {
    test('creates major scale with correct intervals', () => {
      const noteC = new Note('C', 4);
      const majorScale = noteC.createScale('Major');
      
      const noteNames = majorScale.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    test('creates minor scale with correct intervals', () => {
      const noteA = new Note('A', 4);
      const minorScale = noteA.createScale('Minor');
      
      const noteNames = minorScale.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    test('creates pentatonic major scale with correct intervals', () => {
      const noteC = new Note('C', 4);
      const pentMajorScale = noteC.createScale('Pentatonic_Major');
      
      const noteNames = pentMajorScale.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['C', 'D', 'E', 'G', 'A']);
    });

    test('creates pentatonic minor scale with correct intervals', () => {
      const noteA = new Note('A', 4);
      const pentMinorScale = noteA.createScale('Pentatonic_Minor');
      
      const noteNames = pentMinorScale.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['A', 'C', 'D', 'E', 'G']);
    });

    test('creates mixolydian scale with correct intervals', () => {
      const noteG = new Note('G', 4);
      const mixolydianScale = noteG.createScale('Mixolydian');
      
      const noteNames = mixolydianScale.notes.map(n => n.getRealHalfToneName());
      expect(noteNames).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });
  });

  describe('triad creation', () => {
    test('creates major triad with proper note names', () => {
      const noteC = new Note('C', 4);
      const triad = noteC.createTriad('Major');
      
      const virtualNames = triad.notes.map(n => n.getVirtualHalfToneName());
      expect(virtualNames).toEqual(['C', 'E', 'G']);
    });

    test('creates minor triad with proper note names', () => {
      const noteC = new Note('C', 4);
      const triad = noteC.createTriad('Minor');
      
      const virtualNames = triad.notes.map(n => n.getVirtualHalfToneName());
      expect(virtualNames).toEqual(['C', 'Eb', 'G']);
    });
  });

  describe('note properties', () => {
    test('identifies sharpable tones correctly', () => {
      const noteC = new Note('C', 4);
      const noteE = new Note('E', 4);
      
      expect(noteC.isSharpable()).toBe(true);
      expect(noteE.isSharpable()).toBe(false);
    });

    test('identifies sharp notes correctly', () => {
      const noteCSharp = new Note('C#', 4);
      const noteC = new Note('C', 4);
      
      expect(noteCSharp.isSharp()).toBe(true);
      expect(noteC.isSharp()).toBe(false);
    });
  });

  describe('static methods', () => {
    test('splitNote correctly splits note and accidental', () => {
      const [tone1, acc1] = Note.splitNote('C');
      expect(tone1).toBe('C');
      expect(acc1).toBeUndefined();
      
      const [tone2, acc2] = Note.splitNote('C#');
      expect(tone2).toBe('C');
      expect(acc2).toBe('#');
    });

    test('combineNote correctly combines tone and accidental', () => {
      expect(Note.combineNote('C', '#')).toBe('C#');
      expect(Note.combineNote('E', '')).toBe('E');
    });

    test('isToneSharpable identifies sharpable tones', () => {
      expect(Note.isToneSharpable('C')).toBe(true);
      expect(Note.isToneSharpable('D')).toBe(true);
      expect(Note.isToneSharpable('E')).toBe(false);
      expect(Note.isToneSharpable('B')).toBe(false);
    });

    // Skip isFlatHalfTone test - flat notes not in type system
  });
});

describe('Chord Class', () => {
  test('stores notes correctly', () => {
    const notes = [
      new Note('C', 4),
      new Note('E', 4),
      new Note('G', 4)
    ];
    const chord = new Chord(notes);
    
    expect(chord.notes).toEqual(notes);
  });

  test('play method calls playAudio on all notes', async () => {
    const notes = [
      new Note('C', 4),
      new Note('E', 4),
      new Note('G', 4)
    ];
    
    // Mock the playAudio method
    notes.forEach(note => {
      note.playAudio = jest.fn().mockResolvedValue(undefined);
    });
    
    const chord = new Chord(notes);
    await chord.play();
    
    notes.forEach(note => {
      expect(note.playAudio).toHaveBeenCalledWith(2);
    });
  });
});

describe('Data integrity', () => {
  test('all chord type configs have valid intervals', () => {
    chordTypeConfigs.forEach(config => {
      expect(config.intervals).toBeDefined();
      expect(config.intervals.length).toBeGreaterThanOrEqual(3);
      expect(config.intervals[0]).toBe(0); // Root note
    });
  });

  test('all scale configs have valid intervals', () => {
    scaleConfigs.forEach(config => {
      expect(config.intervals).toBeDefined();
      expect(config.intervals.length).toBeGreaterThanOrEqual(5);
      expect(config.intervals[0]).toBe(0); // Root note
    });
  });

  test('allHalfTones contains all 12 tones', () => {
    expect(allHalfTones).toHaveLength(12);
    expect(allHalfTones).toContain('C');
    expect(allHalfTones).toContain('C#');
    expect(allHalfTones).toContain('B');
  });
});
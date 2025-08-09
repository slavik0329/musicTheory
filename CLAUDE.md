# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
```bash
yarn start       # Start dev server on localhost:3000
yarn build      # Build production bundle to ./build
yarn test       # Run tests in watch mode
```

## Architecture

This is a React TypeScript music theory application that provides interactive chord and scale visualization on a virtual guitar fretboard.

### Core Domain Models

**Note System (`src/Note.ts`):**
- `Note` class represents musical notes with halfTone and octave
- Handles tone generation, chord/scale creation, and audio playback via Web Audio API
- Supports major/minor scales, pentatonic scales, and various chord types (major, minor, diminished, augmented, seventh chords)
- Uses intervals to calculate relative notes and build musical structures

**Guitar Implementation (`src/FretBoard.ts`, `src/Guitar.tsx`):**
- `FretBoard` class models a guitar with 6 strings in standard tuning (E-A-D-G-B-E)
- `GuitarString` class generates all notes for each string across 18 frets
- Visual guitar component displays interactive fretboard with note highlighting

**Audio Generation (`src/ToneGenerator.ts`):**
- Generates raw PCM data for different waveforms (sine, triangle, saw, square)
- Creates WAV file headers and audio buffers for Web Audio API playback
- Handles frequency-to-sample conversion for accurate pitch generation

### Key Interactions

1. User selects a root note from the tone bar → updates all chord/scale displays
2. Clicking a chord/scale → highlights constituent notes on the fretboard
3. Chord selection → triggers audio playback of the chord
4. Fretboard notes are clickable for individual note playback

### Type System

- Strict TypeScript with comprehensive type definitions in `src/types.ts`
- Custom types for musical concepts: `HalfTone`, `Tone`, `Accidental`, etc.
- Styled-components theme typing via `styled.d.ts`
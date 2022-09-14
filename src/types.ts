import { z } from "zod";

export type Tone = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type UnSharpableTone = "B" | "E";
export type SharpableTone = Exclude<Tone, UnSharpableTone>;
export type HalfTone = `${SharpableTone}#` | `${Tone}`;
export type SharpHalfTone = `${SharpableTone}#`;
export type VirtualTone = `${Tone}#` | `${Tone}` | `${Tone}b`;
export type FlatHalfTone = `${Tone}b`;

export const HalfToneTypeValidator = z.union([
  z.literal("A"),
  z.literal("A#"),
  z.literal("B"),
  z.literal("C"),
  z.literal("C#"),
  z.literal("D"),
  z.literal("D#"),
  z.literal("E"),
  z.literal("F"),
  z.literal("F#"),
  z.literal("G"),
  z.literal("G#"),
]);
export const AccidentalValidator = z.union([z.literal("#"), z.literal("b")]);
export type Accidental = z.infer<typeof AccidentalValidator>;

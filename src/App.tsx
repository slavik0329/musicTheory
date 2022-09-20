import { Buffer } from "buffer";
import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import {
  allChords,
  allHalfTones,
  allScales,
  ChordType,
  Note,
  ScaleType,
} from "./Note";
import { theme } from "./theme";
import { HalfTone, VirtualTone } from "./types";
import { Guitar } from "./Guitar";
import { Chord, Scale } from "@tonaljs/tonal";
global.Buffer = Buffer;

const Outer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid ${theme.neutrals["cool-grey-200"]};
  padding: 20px;
`;

const ChordContainer = styled.div`
  display: flex;
`;
const Left = styled.div`
  margin-right: 20px;
`;
const Right = styled.div``;

type SelectedType = {
  selected: boolean;
};

const HalfToneItem = styled.div<SelectedType>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 40px;
  border-left: 1px solid ${theme.neutrals["cool-grey-200"]};
  color: ${({ selected }) =>
    selected ? "#FFF" : theme.neutrals["cool-grey-500"]};
  cursor: pointer;
  background-color: ${({ selected }) =>
    selected ? theme.primary["indigo-600"] : "#FFF"};

  :hover {
    background-color: ${theme.primary["indigo-100"]};
  }
`;

const ToneBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  ${HalfToneItem}:last-child {
    border-right: 1px solid #ccc;
  }
`;

const Title = styled.div`
  color: ${theme.neutrals["cool-grey-600"]};
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
`;
const NoteBox = styled.div`
  margin-left: 10px;
`;

const Block = styled.div`
  cursor: pointer;
`;

const ScaleItem = styled.div`
  display: inline-flex;
  align-items: center;
  width: 50px;
  height: 28px;
  color: ${theme.neutrals["cool-grey-500"]};
`;

function getTonalScale(note: Note, scaleType: ScaleType): VirtualTone[] {
  return Scale.get(
    `${note.getRealHalfToneName().toLowerCase()} ${scaleType
      .replace("_", " ")
      .toLowerCase()}`
  ).notes.map((noteName) => noteName) as VirtualTone[];
}

function getTonalChord(note: Note, chordType: ChordType): VirtualTone[] {
  return Chord.get(
    `${note.getRealHalfToneName().toLowerCase()} ${chordType
      .replace("_", " ")
      .toLowerCase()}`
  ).notes.map((noteName) => noteName) as VirtualTone[];
}

function App() {
  const [selectedHalfTone, setSelectedHalfTone] = useState<HalfTone>("C");
  const [showOnlyNotes, setShowOnlyNotes] = useState<HalfTone[] | undefined>([
    "C",
  ]);

  const note = new Note(selectedHalfTone, 4);

  return (
    <Outer>
      <ToneBar>
        {allHalfTones.map((halfTone) => (
          <HalfToneItem
            key={halfTone}
            selected={selectedHalfTone === halfTone}
            onClick={() => {
              setSelectedHalfTone(halfTone);
              setShowOnlyNotes([halfTone]);
            }}
          >
            {halfTone}
          </HalfToneItem>
        ))}
      </ToneBar>

      <ChordContainer>
        <Left>
          {allChords.map((chordType) => (
            <Block
              key={chordType}
              onClick={() => {
                const chord = note.createChord(chordType);
                chord.play();
                setShowOnlyNotes(
                  chord.notes.map((note) => note.getRealHalfToneName())
                );
              }}
            >
              <Title>
                "{selectedHalfTone}" {chordType.replace("_", " ")} Chord
              </Title>
              <NoteBox>
                {getTonalChord(note, chordType).map((chordItem, i) => (
                  <ScaleItem key={i}>{chordItem}</ScaleItem>
                ))}
              </NoteBox>
            </Block>
          ))}
        </Left>
        <Right>
          {allScales.map((scaleType) => (
            <Block
              key={scaleType}
              onClick={() => {
                const chord = note.createScale(scaleType);
                setShowOnlyNotes(
                  chord.notes.map((note) => note.getRealHalfToneName())
                );
              }}
            >
              <Title>
                "{selectedHalfTone}" {scaleType.replace("_", " ")} Scale
              </Title>
              <NoteBox>
                {getTonalScale(note, scaleType).map((noteName, i) => (
                  <ScaleItem key={i}>{noteName}</ScaleItem>
                ))}
              </NoteBox>
            </Block>
          ))}
        </Right>
      </ChordContainer>

      <Guitar showOnlyNotes={showOnlyNotes} />
    </Outer>
  );
}

export default App;

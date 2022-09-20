import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "./theme";
import { FretBoard } from "./FretBoard";
import { HalfTone } from "./types";
import { Fret } from "./Fret";
import { allHalfTones, Note } from "./Note";

const Container = styled.div`
  display: inline-block;
  background: #be975b url("/images/wood-pattern.png");
  padding: 8px;
  border-radius: 0 4px 4px 0;
`;

const FretboardContainer = styled.div`
  display: flex;
`;

const Nut = styled.div`
  border-radius: 4px 0 0 4px;
  width: 20px;
  background-color: ${theme.neutrals["cool-grey-700"]};
`;

const Outer = styled.div`
  margin-top: 20px;
  user-select: none;
`;

const String = styled.div`
  display: flex;
`;

const Anchors = styled.div`
  display: flex;
  margin-top: 6px;
  margin-left: 28px;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 30px;
  margin: 0 6px;
  background-color: ${theme.primary["orange-vivid-200"]};
`;

type NoteProps = {
  isPlaying: boolean;
};

const NoteName = styled.div<NoteProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  text-align: center;
  color: ${({ isPlaying }) =>
    isPlaying ? theme.primary["orange-vivid-400"] : "#FFF"};
  font-weight: bold;
  font-size: 14px;
  width: 20px;
  height: 18px;
  border-radius: 20px;
  margin-top: 8px;
`;

const Anchor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
`;

const Numbering = styled.div`
  display: flex;
  margin-left: 30px;
  align-items: center;
  margin-bottom: 6px;
`;

const Number = styled.div`
  display: flex;
  width: 60px;
  color: ${theme.neutrals["cool-grey-300"]};
  font-weight: bold;
  justify-content: center;
  align-items: center;
`;

type Props = {
  showOnlyNotes?: HalfTone[];
};

function NutNote({ note }: { note: Note }) {
  const [isPlaying, setIsPlaying] = useState(false);

  async function play() {
    setIsPlaying(true);
    await note.playAudio(0.3);
    setIsPlaying(false);
  }

  return (
    <NoteName
      isPlaying={isPlaying}
      onClick={async () => {
        await play();
      }}
      onMouseOver={async (event) => {
        if (event.buttons === 1) {
          await play();
        }
      }}
    >
      {note.getRealHalfToneName()}
    </NoteName>
  );
}

export function Guitar({ showOnlyNotes }: Props) {
  const fretboard = new FretBoard();

  let anchors: string[] = [];

  for (let i = 0; i < 15; i++) {
    if ([2, 4, 6, 8, 14].includes(i)) {
      anchors.push("x");
    } else if ([11].includes(i)) {
      anchors.push("XX");
    } else {
      anchors.push("");
    }
  }

  return (
    <Outer>
      <Numbering>
        {new Array(17).fill(0).map((n, index) => (
          <Number key={index}>{index + 1}</Number>
        ))}
      </Numbering>
      <FretboardContainer>
        <Nut>
          {fretboard.strings.map((string, index) => (
            <NutNote key={index} note={string.notes[0]} />
          ))}
        </Nut>
        <Container>
          {fretboard.strings.map((string, stringIndex) => (
            <String key={stringIndex}>
              {string.notes.map(
                (note, i) =>
                  i !== 0 && (
                    <Fret
                      key={i}
                      note={note}
                      hide={
                        !!showOnlyNotes &&
                        !showOnlyNotes.includes(note.getRealHalfToneName())
                      }
                    />
                  )
              )}
            </String>
          ))}
        </Container>
      </FretboardContainer>
      <Anchors>
        {anchors.map((anchor, i) => (
          <Anchor key={i}>
            {new Array(anchor.length).fill(1).map((dot, i) => (
              <Dot key={i} />
            ))}
          </Anchor>
        ))}
      </Anchors>
    </Outer>
  );
}

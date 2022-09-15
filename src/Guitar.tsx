import React from "react";
import styled from "styled-components";
import { theme } from "./theme";
import { FretBoard } from "./FretBoard";
import { HalfTone } from "./types";
import { Fret } from "./Fret";
import { allHalfTones } from "./Note";

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
`;

const String = styled.div`
  display: flex;
`;

const Anchors = styled.div`
  display: flex;
  margin-top: 4px;
  margin-left: 28px;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 30px;
  margin: 0 4px;
  background-color: ${theme.primary["orange-vivid-200"]};
`;

const NoteName = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  text-align: center;
  color: #fff;
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

type Props = {
  showOnlyNotes?: HalfTone[];
};

export function Guitar({ showOnlyNotes }: Props) {
  const fretboard = new FretBoard();

  let anchors: string[] = [];

  for (let i = 0; i < allHalfTones.length; i++) {
    if ([2, 4, 6, 8].includes(i)) {
      anchors.push("x");
    } else if ([11].includes(i)) {
      anchors.push("XX");
    } else {
      anchors.push("");
    }
  }

  return (
    <Outer>
      <FretboardContainer>
        <Nut>
          {fretboard.strings.map((string, index) => (
            <NoteName
              onClick={() => string.notes[0].playAudio(0.3)}
              key={index}
            >
              {string.notes[0].getRealHalfToneName()}
            </NoteName>
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

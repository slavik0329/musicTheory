import React from "react";
import styled from "styled-components";
import { theme } from "./theme";
import { FretBoard } from "./FretBoard";
import { HalfTone } from "./types";
import { Fret } from "./Fret";
import { allHalfTones } from "./Note";

const Container = styled.div`
  margin-top: 20px;
`;

const String = styled.div`
  display: flex;
`;

const Anchors = styled.div`
  display: flex;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 30px;
  margin: 0 4px;
  background-color: ${theme.primary["orange-vivid-900"]};
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
    <Container>
      {fretboard.strings.map((string, stringIndex) => (
        <String key={stringIndex}>
          {string.notes.map((note) => (
            <Fret
              note={note}
              hide={
                !!showOnlyNotes &&
                !showOnlyNotes.includes(note.getRealHalfToneName())
              }
            />
          ))}
        </String>
      ))}

      <Anchors>
        {anchors.map((anchor) => (
          <Anchor>
            {new Array(anchor.length).fill(1).map((dot) => (
              <Dot />
            ))}
          </Anchor>
        ))}
      </Anchors>
    </Container>
  );
}

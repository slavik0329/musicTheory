import { Note } from "./Note";
import React from "react";
import styled from "styled-components";
import { theme } from "./theme";

const StringLine = styled.div`
  position: absolute;
  top: 8px;
  width: 100%;
  height: 3px;
  background-color: ${theme.supporting["yellow-vivid-200"]};
  display: flex;
  z-index: 1;
`;

const StringStartCap = styled.div`
  position: absolute;
  top: 8px;
  left: 0;
  width: 4px;
  height: 3px;
  background-color: ${theme.supporting["yellow-vivid-800"]};
  display: flex;
  z-index: 3;
`;

const StringEndCap = styled.div`
  position: absolute;
  top: 8px;
  width: 4px;
  height: 3px;
  background-color: ${theme.supporting["yellow-vivid-800"]};
  display: flex;
  z-index: 1;
`;

const FretContainer = styled.div`
  position: relative;
  text-align: center;
  width: 60px;
  height: 20px;
`;

const NoteName = styled.div`
  position: relative;
  text-align: center;
  z-index: 2;
  color: ${theme.primary["indigo-600"]};
  font-weight: bold;
`;

export function Fret({ note, hide }: { note: Note; hide: boolean }) {
  return (
    <FretContainer>
      <StringLine />
      <StringStartCap />
      <StringEndCap />
      {!hide && <NoteName>{note.getRealHalfToneName()}</NoteName>}
    </FretContainer>
  );
}

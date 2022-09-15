import { Note } from "./Note";
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "./theme";

const FretContainer = styled.div`
  cursor: pointer;
  position: relative;
  text-align: center;
  width: 60px;
  height: 26px;
`;

type LineProps = {
  isPlaying: boolean;
};

const StringLine = styled.div<LineProps>`
  position: absolute;
  background: ${({ isPlaying }) =>
    isPlaying ? `linear-gradient(#F00, #00F)` : `linear-gradient(#eee, #999);`};
  box-shadow: 0 3px 10px #806233;
  top: 8px;
  width: 100%;
  height: 3px;
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

const NoteName = styled.div<LineProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  z-index: 2;
  background-color: ${({ isPlaying }) =>
    isPlaying
      ? theme.primary["orange-vivid-900"]
      : theme.neutrals["cool-grey-700"]};
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  width: 22px;
  height: 22px;
  border-radius: 20px;
`;

type Props = { note: Note; hide: boolean };

export function Fret({ note, hide }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <FretContainer
      onMouseDown={async () => {
        setIsPlaying(true);
        await note.playAudio(0.3);
        setIsPlaying(false);
      }}
    >
      <StringLine isPlaying={isPlaying} />
      <StringStartCap />
      <StringEndCap />
      {!hide && (
        <NoteName isPlaying={isPlaying}>{note.getRealHalfToneName()}</NoteName>
      )}
    </FretContainer>
  );
}

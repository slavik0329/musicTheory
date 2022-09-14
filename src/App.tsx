import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import { allHalfTones, Note } from "./Note";
import { theme } from "./theme";
import { HalfTone } from "./types";

const Outer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid ${theme.neutrals["cool-grey-200"]};
`;

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

  ${HalfToneItem}:last-child {
    border-right: 1px solid #ccc;
  }
`;

function App() {
  const [selectedHalfTone, setSelectedHalfTone] = useState<HalfTone>("C");

  const note = new Note(selectedHalfTone, 4);

  return (
    <Outer>
      <ToneBar>
        {allHalfTones.map((halfTone) => (
          <HalfToneItem
            selected={selectedHalfTone === halfTone}
            onClick={() => setSelectedHalfTone(halfTone)}
          >
            {halfTone}
          </HalfToneItem>
        ))}
      </ToneBar>
    </Outer>
  );
}

export default App;

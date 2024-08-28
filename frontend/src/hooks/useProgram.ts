// src/hooks/useProgram.ts

import { useContext } from "react";
import { ProgramContext } from "../context/ProgramContext";

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};

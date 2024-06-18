"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export const JotaiProvider = ({ children }: ProvidersProps) => {
  return (
    <Provider>
      {children}
      <DevTools />
    </Provider>
  );
};

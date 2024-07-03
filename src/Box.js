import { useState } from "react";
import { ToogleButton } from "./ToogleButton";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToogleButton onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </ToogleButton>
      {isOpen && children}
    </div>
  );
}

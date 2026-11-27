import React from "react";
import { ExperienceStickyNote, ExperienceStickyNoteTone } from "../../types";
import "./ExperienceStickyNotes.css";

type Props = {
  notes: ExperienceStickyNote[];
  variant?: "default" | "hub";
};

const TONE_CYCLE: ExperienceStickyNoteTone[] = [
  "yellow",
  "sky",
  "coral",
  "mint",
];

const ExperienceStickyNotes: React.FC<Props> = ({ notes, variant = "hub" }) => {
  if (notes.length === 0) return null;

  return (
    <section
      className={`exp-sticky-notes exp-sticky-notes--${variant}`}
      aria-label="Role highlights"
    >
      <p className="exp-sticky-notes__label">Notes</p>
      <ul className="exp-sticky-notes__grid">
        {notes.map((note, index) => {
          const tone = note.tone ?? TONE_CYCLE[index % TONE_CYCLE.length];
          return (
            <li
              key={`${tone}-${note.text.slice(0, 48)}`}
              className={`exp-sticky-notes__note exp-sticky-notes__note--${tone}`}
              style={{ "--sticky-rotate": `${index % 2 === 0 ? -1.25 : 1.1}deg` } as React.CSSProperties}
            >
              {note.text}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ExperienceStickyNotes;
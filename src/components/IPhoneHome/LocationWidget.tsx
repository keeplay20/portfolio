import React, { useEffect, useState } from "react";
import { personalInfo } from "../../data/portfolio";

const TYPE_MS = 85;

function TypewriterName({ text }: { text: string }) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setVisible(text);
      setDone(true);
      return;
    }

    setVisible("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        window.clearInterval(id);
      }
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <p
      className="iphone-widget__name iphone-brand-gradient-text"
      aria-label={text}
    >
      <span aria-hidden="true">{visible}</span>
      {!done ? (
        <span className="iphone-widget__name-cursor" aria-hidden="true" />
      ) : null}
    </p>
  );
}

const MAP_BBOX = {
  west: 77.52,
  south: 12.91,
  east: 77.67,
  north: 13.02,
};

const mapEmbedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  `${MAP_BBOX.west},${MAP_BBOX.south},${MAP_BBOX.east},${MAP_BBOX.north}`
)}&layer=mapnik`;

const LocationWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div
      className={`iphone-widget${compact ? " iphone-widget--compact" : ""}`}
    >
      <div className="iphone-widget__map" aria-hidden="true">
        <iframe
          className="iphone-widget__map-frame"
          title="Map of Bangalore"
          src={mapEmbedSrc}
          loading="lazy"
          tabIndex={-1}
        />
        <div className="iphone-widget__map-shade" />
        <div className="iphone-widget__meta">
          <TypewriterName text={personalInfo.name} />
        </div>
      </div>

      <a
        className="iphone-widget__attrib-sr"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
};

export default LocationWidget;
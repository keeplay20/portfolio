import React, { useEffect, useState } from "react";
import { usePhoneShellSettings } from "../../theme/PhoneShellSettingsProvider";
import LoadingDots from "./LoadingDots";

type PhoneInAppIframeProps = {
  title: string;
  src: string;
};

const PhoneInAppIframe: React.FC<PhoneInAppIframeProps> = ({ title, src }) => {
  const { display } = usePhoneShellSettings();
  const [loaded, setLoaded] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFading(false);
  }, [src]);

  const onLoad = () => {
    setLoaded(true);
    setFading(true);
    window.setTimeout(() => setFading(false), 220);
  };

  const showLoader = !loaded || fading;

  return (
    <div className="iphone-inapp__iframe-wrap">
      {showLoader ? (
        <div
          className={`iphone-inapp__iframe-loader${
            loaded ? " iphone-inapp__iframe-loader--out" : ""
          }`}
          aria-busy={!loaded}
          aria-live="polite"
        >
          <LoadingDots size={100} reduceMotion={display.reduceMotion} />
        </div>
      ) : null}
      <iframe
        title={title}
        className="iphone-inapp__iframe"
        src={src}
        onLoad={onLoad}
      />
    </div>
  );
};

export default PhoneInAppIframe;
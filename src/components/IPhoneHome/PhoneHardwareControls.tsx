import React from "react";
import { usePhoneShellAudio } from "./PhoneShellAudioProvider";

type PhoneHardwareControlsProps = {
  onLock: () => void;
  lockEnabled: boolean;
};

const PhoneHardwareControls: React.FC<PhoneHardwareControlsProps> = ({
  onLock,
  lockEnabled,
}) => {
  const { volumeUp, volumeDown, toggleMute } = usePhoneShellAudio();

  return (
    <>
      <button
        type="button"
        className="iphone-device__control iphone-device__control--mute iphone-device__control--interactive"
        aria-label="Ring / silent switch"
        onClick={toggleMute}
      />
      <button
        type="button"
        className="iphone-device__control iphone-device__control--volume-up iphone-device__control--interactive"
        aria-label="Volume up"
        onClick={volumeUp}
      />
      <button
        type="button"
        className="iphone-device__control iphone-device__control--volume-down iphone-device__control--interactive"
        aria-label="Volume down"
        onClick={volumeDown}
      />
      <button
        type="button"
        className="iphone-device__control iphone-device__control--power iphone-device__control--interactive"
        aria-label="Side button — lock screen"
        onClick={onLock}
        disabled={!lockEnabled}
      />
    </>
  );
};

export default PhoneHardwareControls;
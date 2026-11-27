import React, { useCallback } from "react";
import { warrantyVaultTeaser } from "../../data/warrantyVaultTeaser";
import "./LockScreenNotification.css";

type LockScreenNotificationProps = {
  onOpen: () => void;
};

const LockScreenNotification: React.FC<LockScreenNotificationProps> = ({
  onOpen,
}) => {
  const { notification } = warrantyVaultTeaser;

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onOpen();
    },
    [onOpen]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen();
      }
    },
    [onOpen]
  );

  return (
    <button
      type="button"
      className="iphone-lock-notif"
      aria-label={`${notification.title}. ${notification.body}. Tap to open.`}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <span className="iphone-lock-notif__icon" aria-hidden="true">
        <span className="iphone-lock-notif__icon-mark">WV</span>
      </span>
      <span className="iphone-lock-notif__copy">
        <span className="iphone-lock-notif__header">
          <span className="iphone-lock-notif__app">{notification.appLabel}</span>
          <time className="iphone-lock-notif__time">{notification.timeLabel}</time>
        </span>
        <span className="iphone-lock-notif__title">{notification.title}</span>
        <span className="iphone-lock-notif__body">{notification.body}</span>
      </span>
    </button>
  );
};

export default LockScreenNotification;
import React, { useCallback, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { personalInfo } from "../../data/portfolio";
import LockScreenNotification from "./LockScreenNotification";
import "./LockScreenNotification.css";

const UNLOCK_THRESHOLD_PX = 72;
const TAP_MOVEMENT_THRESHOLD_PX = 10;

type PhoneLockScreenProps = {
  time: string | null;
  dateLabel: string | null;
  onUnlock: () => void;
  showNotification?: boolean;
  onOpenNotification?: () => void;
};

const PhoneLockScreen: React.FC<PhoneLockScreenProps> = ({
  time,
  dateLabel,
  onUnlock,
  showNotification = false,
  onOpenNotification,
}) => {
  const dragY = useMotionValue(0);
  const hintOpacity = useTransform(dragY, [0, -90], [1, 0.25]);
  const hintLift = useTransform(dragY, (y) => Math.min(0, y));

  const startYRef = useRef(0);
  const activeRef = useRef(false);
  const movedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const showIdleMotion = !reduceMotion && !isDragging;

  const resetDrag = useCallback(
    (withSpring = false) => {
      setIsDragging(false);
      activeRef.current = false;
      if (withSpring && !reduceMotion && dragY.get() !== 0) {
        void animate(dragY, 0, {
          type: "spring",
          stiffness: 420,
          damping: 36,
          mass: 0.82,
        });
        return;
      }
      dragY.set(0);
    },
    [dragY, reduceMotion]
  );

  const finishGesture = useCallback(
    (deltaY: number, didMove: boolean) => {
      if (deltaY <= -UNLOCK_THRESHOLD_PX) {
        onUnlock();
        return;
      }
      if (!didMove && Math.abs(deltaY) <= TAP_MOVEMENT_THRESHOLD_PX) {
        onUnlock();
        return;
      }
      resetDrag(true);
    },
    [onUnlock, resetDrag]
  );

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    activeRef.current = true;
    movedRef.current = false;
    setIsDragging(true);
    startYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!activeRef.current) return;
      const delta = event.clientY - startYRef.current;
      if (Math.abs(delta) > TAP_MOVEMENT_THRESHOLD_PX) {
        movedRef.current = true;
      }
      if (delta > 8) {
        dragY.set(0);
        return;
      }
      dragY.set(Math.max(delta, -120));
    },
    [dragY]
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!activeRef.current) return;
      const delta = event.clientY - startYRef.current;
      const didMove = movedRef.current;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishGesture(delta, didMove);
    },
    [finishGesture]
  );

  const onPointerCancel = useCallback(() => {
    resetDrag(true);
  }, [resetDrag]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onUnlock();
      }
    },
    [onUnlock]
  );

  return (
    <motion.div
      className={`iphone-lock${isDragging ? " iphone-lock--dragging" : ""}`}
      role="dialog"
      aria-label={`${personalInfo.name}, ${personalInfo.title}. Portfolio lock screen. Swipe or click to unlock.`}
      style={{ y: dragY }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="iphone-lock__ambient" aria-hidden="true">
        <span className="iphone-lock__glow iphone-lock__glow--top" />
        <span className="iphone-lock__glow iphone-lock__glow--bottom" />
        <span className="iphone-lock__sheen" />
      </div>

      <motion.div
        className="iphone-lock__clock"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <time
          className="iphone-lock__time"
          dateTime={time ?? undefined}
          suppressHydrationWarning
        >
          {time ?? "\u00a0"}
        </time>
        <p className="iphone-lock__date" suppressHydrationWarning>
          {dateLabel ?? "\u00a0"}
        </p>
        {showNotification && onOpenNotification ? (
          <div className="iphone-lock__notif-stack">
            <LockScreenNotification onOpen={onOpenNotification} />
          </div>
        ) : null}
      </motion.div>

      <motion.div
        className="iphone-lock__profile"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="iphone-lock__kicker" aria-hidden="true">
          Portfolio
        </p>
        <p className="iphone-lock__name">
          <span className="iphone-brand-gradient-text">
            {personalInfo.name}
          </span>
        </p>
        <p className="iphone-lock__role">{personalInfo.title}</p>
        <p className="iphone-lock__intro">{personalInfo.summary}</p>
      </motion.div>

      <motion.div
        className="iphone-lock__swipe"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      >
        <motion.div
          className="iphone-lock__swipe-cue"
          aria-hidden={false}
          animate={
            showIdleMotion ? { y: [0, -14, 0] } : isDragging ? undefined : { y: 0 }
          }
          transition={
            showIdleMotion
              ? { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          style={isDragging ? { y: hintLift } : undefined}
        >
          <motion.div
            className="iphone-lock__resume-track"
            aria-hidden="true"
            animate={
              showIdleMotion ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }
            }
            transition={
              showIdleMotion
                ? { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          />
          <motion.p
            className="iphone-lock__hint"
            animate={
              showIdleMotion
                ? { opacity: [0.45, 1, 0.45] }
                : isDragging
                  ? undefined
                  : { opacity: 1 }
            }
            transition={
              showIdleMotion
                ? { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
            style={isDragging ? { opacity: hintOpacity } : undefined}
          >
            Swipe or click to unlock
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PhoneLockScreen;
import React, { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const UNLOCK_THRESHOLD_PX = 72;

type PhoneLockScreenProps = {
  time: string;
  dateLabel: string;
  onUnlock: () => void;
};

const PhoneLockScreen: React.FC<PhoneLockScreenProps> = ({
  time,
  dateLabel,
  onUnlock,
}) => {
  const dragY = useMotionValue(0);
  const hintOpacity = useTransform(dragY, [0, -90], [1, 0.25]);
  const hintLift = useTransform(dragY, (y) => Math.min(0, y));

  const startYRef = useRef(0);
  const activeRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const showIdleMotion = !reduceMotion && !isDragging;

  const resetDrag = useCallback(() => {
    dragY.set(0);
    setIsDragging(false);
    activeRef.current = false;
  }, [dragY]);

  const finishSwipe = useCallback(
    (deltaY: number) => {
      if (deltaY <= -UNLOCK_THRESHOLD_PX) {
        onUnlock();
        return;
      }
      resetDrag();
    },
    [onUnlock, resetDrag]
  );

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    activeRef.current = true;
    setIsDragging(true);
    startYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!activeRef.current) return;
      const delta = event.clientY - startYRef.current;
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
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishSwipe(delta);
    },
    [finishSwipe]
  );

  const onPointerCancel = useCallback(() => {
    resetDrag();
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
      aria-label="Locked. Swipe up to unlock."
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

      {showIdleMotion ? (
        <motion.span
          className="iphone-lock__ring"
          aria-hidden="true"
          style={{ x: "-50%" }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ) : null}

      <motion.div
        className="iphone-lock__clock"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <time className="iphone-lock__time" dateTime={time}>
          {time}
        </time>
        <p className="iphone-lock__date">{dateLabel}</p>
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
          <div className="iphone-lock__chevrons" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
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
            Swipe to unlock
          </motion.p>
        </motion.div>
        <motion.span
          className="iphone-lock__home-bar"
          aria-hidden="true"
          animate={
            showIdleMotion
              ? { scaleX: [1, 1.14, 1], opacity: [0.75, 1, 0.75] }
              : { scaleX: 1, opacity: 1 }
          }
          transition={
            showIdleMotion
              ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        />
      </motion.div>
    </motion.div>
  );
};

export default PhoneLockScreen;
import { useLayoutEffect, type RefObject } from "react";

/** Layout height of the scaled phone frame (screen + bezel padding), in CSS px at scale 1. */
const PHONE_FRAME_WIDTH = 390;
const PHONE_FRAME_HEIGHT = 830;
const SCALE_EPSILON = 0.002;

function readViewportSize() {
  const vv = window.visualViewport;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
  };
}

function measureHintBlock(root: HTMLElement): number {
  const hint = root.querySelector<HTMLElement>(".iphone-device__hint");
  if (!hint) return 48;
  const styles = getComputedStyle(hint);
  const marginTop = parseFloat(styles.marginTop) || 0;
  const marginBottom = parseFloat(styles.marginBottom) || 0;
  return hint.offsetHeight + marginTop + marginBottom;
}

const STAGE_SHADOW_BLEED_PX = 10;

export function useIphoneStageScale(
  homeRef: RefObject<HTMLElement | null>,
  remeasureDeps: unknown[] = []
) {
  useLayoutEffect(() => {
    const root = homeRef.current;
    if (!root) return;

    const update = () => {
      const { width: vw, height: vh } = readViewportSize();
      const styles = getComputedStyle(root);
      const padTop = parseFloat(styles.paddingTop) || 0;
      const padBottom = parseFloat(styles.paddingBottom) || 0;
      const padLeft = parseFloat(styles.paddingLeft) || 0;
      const padRight = parseFloat(styles.paddingRight) || 0;
      const stageGap = parseFloat(styles.getPropertyValue("--iphone-stage-gap")) || 0;

      const hintBlock = measureHintBlock(root);
      const chromeBelowPhone =
        stageGap + hintBlock + STAGE_SHADOW_BLEED_PX;

      const availWidth = Math.max(0, vw - padLeft - padRight);
      const availHeight = Math.max(0, vh - padTop - padBottom - chromeBelowPhone);

      const scale = Math.min(
        1,
        availWidth / PHONE_FRAME_WIDTH,
        availHeight / PHONE_FRAME_HEIGHT
      );

      const clamped = Math.max(0.32, scale);
      root.style.setProperty("--iphone-scale", clamped.toFixed(4));

      const stage = root.querySelector<HTMLElement>(".iphone-home__phone-stage");
      const stageHeight = stage?.getBoundingClientRect().height ?? 0;
      const pageBudget = vh - padTop - padBottom;
      const overflow = stageHeight > pageBudget + SCALE_EPSILON;
      root.classList.toggle("iphone-home--page-overflow", overflow);

      const screenScroll = root.querySelector<HTMLElement>(".iphone-screen__scroll");
      if (screenScroll) {
        const canScroll = screenScroll.scrollHeight > screenScroll.clientHeight + 2;
        screenScroll.classList.toggle("iphone-screen__scroll--overflow", canScroll);
      }
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(root);

    const stage = root.querySelector<HTMLElement>(".iphone-home__phone-stage");
    if (stage) ro.observe(stage);

    const hint = root.querySelector<HTMLElement>(".iphone-device__hint");
    if (hint) ro.observe(hint);

    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [homeRef, ...remeasureDeps]);
}
import { useLayoutEffect, type RefObject } from "react";

/** Layout height of the scaled phone frame (screen + bezel padding), in CSS px at scale 1. */
const PHONE_FRAME_WIDTH = 390;
const PHONE_FRAME_HEIGHT = 836;
const MAX_PHONE_SCALE = 1.58;
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
  if (!hint || getComputedStyle(hint).display === "none") return 0;
  const styles = getComputedStyle(hint);
  const marginTop = parseFloat(styles.marginTop) || 0;
  const marginBottom = parseFloat(styles.marginBottom) || 0;
  return hint.offsetHeight + marginTop + marginBottom;
}

const STAGE_SHADOW_BLEED_PX = 10;
const MOBILE_MAX_WIDTH = 768;

export function useIphoneStageScale(
  homeRef: RefObject<HTMLElement | null>,
  isUnlocked: boolean,
  view: string
) {
  useLayoutEffect(() => {
    const root = homeRef.current;
    if (!root) return;

    const update = () => {
      const { width: vw, height: vh } = readViewportSize();
      const isMobile = vw <= MOBILE_MAX_WIDTH;
      root.classList.toggle("iphone-home--mobile", isMobile);

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
      const stageEl = root.querySelector<HTMLElement>(".iphone-home__phone-stage");
      const stageWidth =
        stageEl && stageEl.clientWidth > 0 ? stageEl.clientWidth : availWidth;

      const maxScale = isMobile ? 1.12 : MAX_PHONE_SCALE;
      const widthBudget = isMobile ? stageWidth - 8 : stageWidth;
      const scale = Math.min(
        maxScale,
        widthBudget / PHONE_FRAME_WIDTH,
        availHeight / PHONE_FRAME_HEIGHT
      );

      const clamped = Math.max(isMobile ? 0.72 : 0.32, scale);
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

    const layout = root.querySelector<HTMLElement>(".iphone-home__layout");
    if (layout) ro.observe(layout);

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
  }, [homeRef, isUnlocked, view]);
}
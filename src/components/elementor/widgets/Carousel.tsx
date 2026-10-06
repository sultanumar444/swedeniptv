"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Settings = Record<string, unknown>;

const num = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : Number(v));

/** Elementor breakpoints: mobile ≤ 767px, tablet ≤ 1024px. */
function perViewFor(width: number, s: Settings) {
  const desktop = num(s.slides_to_show) ?? 3;
  const tablet = num(s.slides_to_show_tablet) ?? desktop;
  const mobile = num(s.slides_to_show_mobile) ?? tablet;
  if (width <= 767) return mobile;
  if (width <= 1024) return tablet;
  return desktop;
}

/**
 * Replacement for Elementor's Swiper-based image carousel, with the same
 * markup/classes so the original carousel styles apply.
 */
export default function Carousel({
  slides,
  settings,
  prevIcon,
  nextIcon,
}: {
  slides: ReactNode[];
  settings: Settings;
  prevIcon: ReactNode;
  nextIcon: ReactNode;
}) {
  const [perView, setPerView] = useState(() => num(settings.slides_to_show) ?? 3);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const gap = num((settings.image_spacing_custom as { size?: unknown } | undefined)?.size) ?? 0;
  const maxIndex = Math.max(0, slides.length - perView);
  const showArrows = settings.navigation === "arrows" || settings.navigation === "both";
  const speed = num(settings.speed) ?? 500;

  useEffect(() => {
    const update = () => setPerView(perViewFor(window.innerWidth, settings));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [settings]);

  // Clamp when the slides-per-view grows on resize.
  const current = Math.min(index, maxIndex);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => {
        const next = Math.min(i, maxIndex) + dir;
        if (next > maxIndex) return settings.infinite === "yes" ? 0 : maxIndex;
        if (next < 0) return settings.infinite === "yes" ? maxIndex : 0;
        return next;
      }),
    [maxIndex, settings.infinite],
  );

  useEffect(() => {
    if (settings.autoplay !== "yes" || maxIndex === 0) return;
    const t = window.setInterval(() => {
      if (!paused.current) go(1);
    }, num(settings.autoplay_speed) ?? 5000);
    return () => window.clearInterval(t);
  }, [go, maxIndex, settings.autoplay, settings.autoplay_speed]);

  const slideWidth = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;

  return (
    <div
      className="elementor-image-carousel-wrapper swiper swiper-initialized swiper-horizontal"
      dir="ltr"
      role="region"
      aria-roledescription="carousel"
      aria-label="Image Carousel"
      onMouseEnter={() => {
        if (settings.pause_on_hover === "yes") paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div
        className="elementor-image-carousel swiper-wrapper"
        aria-live="off"
        style={{
          transform: `translateX(calc(-${current} * (${slideWidth} + ${gap}px)))`,
          transitionDuration: `${speed}ms`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="swiper-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            style={{ width: slideWidth, marginRight: i < slides.length - 1 ? gap : 0 }}
          >
            {slide}
          </div>
        ))}
      </div>
      {showArrows && maxIndex > 0 && (
        <>
          <div className="elementor-swiper-button elementor-swiper-button-prev" role="button" tabIndex={0} aria-label="Previous" onClick={() => go(-1)}>
            {prevIcon}
          </div>
          <div className="elementor-swiper-button elementor-swiper-button-next" role="button" tabIndex={0} aria-label="Next" onClick={() => go(1)}>
            {nextIcon}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { keepKanalerUnlocked, lockKanaler } from "./actions";

const IDLE_MS = 60_000;
const HEARTBEAT_MS = 15_000;
const CHECK_MS = 2_000;

/**
 * The unlocked channel list. Locks the page again after 60 seconds without
 * activity, or when the visitor has been away (other tab, minimised, left
 * the page) for 60 seconds. Leaving the page stops the heartbeat, so the
 * server-side unlock simply expires.
 */
export default function ChannelList() {
  const router = useRouter();
  const lastActivity = useRef(0);
  const lastBeat = useRef(0);
  const hiddenAt = useRef<number | null>(null);
  const overList = useRef(false);
  const locked = useRef(false);

  const lock = useCallback(async () => {
    if (locked.current) return;
    locked.current = true;
    await lockKanaler();
    router.refresh();
  }, [router]);

  const beat = useCallback(async () => {
    lastBeat.current = Date.now();
    if (!(await keepKanalerUnlocked())) await lock();
  }, [lock]);

  useEffect(() => {
    const now = Date.now();
    lastActivity.current = now;
    lastBeat.current = now;

    const activity = () => {
      lastActivity.current = Date.now();
    };
    // Clicking into the channel list moves focus into the iframe (window blur).
    const onBlur = () => {
      if (document.activeElement?.tagName === "IFRAME") activity();
    };
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
        void beat(); // the unlock now runs 60 s from the moment the visitor left
      } else {
        const awayFor = hiddenAt.current ? Date.now() - hiddenAt.current : 0;
        hiddenAt.current = null;
        if (awayFor >= IDLE_MS) void lock();
        else {
          activity();
          void beat();
        }
      }
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, activity, { passive: true }));
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const t = Date.now();
      // Browsing inside the list (pointer over it) counts as activity; the
      // parent page can't see events inside the iframe.
      if (overList.current) lastActivity.current = t;
      if (t - lastActivity.current >= IDLE_MS) void lock();
      else if (t - lastBeat.current >= HEARTBEAT_MS) void beat();
    }, CHECK_MS);

    return () => {
      events.forEach((e) => window.removeEventListener(e, activity));
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(timer);
    };
  }, [beat, lock]);

  return (
    <div
      onPointerEnter={() => {
        overList.current = true;
      }}
      onPointerLeave={() => {
        overList.current = false;
        lastActivity.current = Date.now();
      }}
    >
      <iframe
        src="https://m3ueditor-five.vercel.app/"
        title="TV Channels"
        style={{ width: "100%", height: "700px", border: 0, borderRadius: "8px" }}
        loading="lazy"
      />
      <p className="kanaler-lock__note">Sidan låses automatiskt efter 60 sekunders inaktivitet.</p>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";

type Preferences = {
  essential: true;
  analytics: boolean;
  personalization: boolean;
};

const KEY = "JesusBabyPod_consent";
const defaults: Preferences = {
  essential: true,
  analytics: false,
  personalization: false,
};

function readConsent(): Preferences | null {
  const item = document.cookie.split("; ").find((v) => v.startsWith(KEY + "="));
  if (!item) return null;
  try {
    const value = JSON.parse(decodeURIComponent(item.slice(KEY.length + 1)));
    return value.version === 1
      ? {
          essential: true,
          analytics: !!value.analytics,
          personalization: !!value.personalization,
        }
      : null;
  } catch {
    return null;
  }
}

function writeConsent(p: Preferences) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify({ ...p, version: 1, updatedAt: new Date().toISOString() }))}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  useEffect(() => {
    setVisible(!readConsent());
    const handler = () => {
      setPrefs(readConsent() ?? defaults);
      setSettings(true);
      setVisible(true);
    };
    window.addEventListener("JesusBabyPod:open-cookie-settings", handler);
    return () =>
      window.removeEventListener("JesusBabyPod:open-cookie-settings", handler);
  }, []);
  const save = (next: Preferences) => {
    writeConsent(next);
    setVisible(false);
    setSettings(false);
    window.dispatchEvent(
      new CustomEvent("JesusBabyPod:consent-updated", { detail: next }),
    );
  };
  if (!visible)
    return (
      <button
        onClick={() => {
          setPrefs(readConsent() ?? defaults);
          setSettings(true);
          setVisible(true);
        }}
        className="fixed bottom-23.5 right-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-[#191919] px-3 py-2 text-xs text-white/65 shadow-xl hover:text-white"
      >
        <Cookie size={14} /> Cookie settings
      </button>
    );
  return (
    <dialog
      className="fixed inset-x-0 bottom-0 z-60 p-3 sm:p-5"
      // role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#202020] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d7fb66]/10 text-[#d7fb66]">
            <Cookie size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="cookie-title" className="text-base font-semibold">
                Your privacy, your call.
              </h2>
              <button
                onClick={() => setVisible(false)}
                aria-label="Close cookie notice"
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">
              We use cookies to save your audio quality preferences and improve
              your streaming experience. Essential cookies keep JesusBabyPod
              working. Optional analytics and personalization cookies help us
              improve your experience. You can change your choice at any time.
            </p>
            {settings && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Essential cookies</p>
                    <p className="text-xs text-white/40">
                      Required for core functionality.
                    </p>
                  </div>
                  <span className="text-xs text-[#d7fb66]">Always on</span>
                </div>
                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm">Analytics cookies</span>
                    <span className="text-xs text-white/40">
                      Aggregate usage and performance.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="size-4 accent-[#d7fb66]"
                    checked={prefs.analytics}
                    onChange={(e) =>
                      setPrefs((v) => ({ ...v, analytics: e.target.checked }))
                    }
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm">
                      Personalization cookies
                    </span>
                    <span className="text-xs text-white/40">
                      Remember preferences and tailor recommendations.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="size-4 accent-[#d7fb66]"
                    checked={prefs.personalization}
                    onChange={(e) =>
                      setPrefs((v) => ({
                        ...v,
                        personalization: e.target.checked,
                      }))
                    }
                  />
                </label>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {!settings ? (
                <>
                  <button
                    onClick={() =>
                      save({
                        essential: true,
                        analytics: true,
                        personalization: true,
                      })
                    }
                    className="rounded-full bg-[#d7fb66] px-4 py-2.5 text-xs font-bold text-black"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={() => save(defaults)}
                    className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/80"
                  >
                    Reject optional
                  </button>
                  <button
                    onClick={() => setSettings(true)}
                    className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/80"
                  >
                    <Settings2 size={14} /> Customize
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => save(prefs)}
                    className="rounded-full bg-[#d7fb66] px-4 py-2.5 text-xs font-bold text-black"
                  >
                    Save preferences
                  </button>
                  <button
                    onClick={() => save(defaults)}
                    className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/80"
                  >
                    Reject optional
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

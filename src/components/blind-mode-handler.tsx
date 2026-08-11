import { useEffect, useState, useRef } from "react";
import { useAppState } from "@/lib/app-state";
import { Eye } from "lucide-react";

export function speakText(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.95;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  } catch (err) {
    console.error("Speech synthesis error:", err);
  }
}

export function BlindModeHandler() {
  const { blindMode, toggleBlindMode } = useAppState();
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<{ text: string; role: string } | null>(null);
  const lastClickRef = useRef<{ el: HTMLElement | null; time: number }>({ el: null, time: 0 });

  const hasInitialized = useRef(false);

  // Announce mode changes ONLY when user actively toggles (not on first page load)
  useEffect(() => {
    if (!hasInitialized.current) {
      // Skip first render — only mark as initialized
      hasInitialized.current = true;
      return;
    }
    if (blindMode) {
      speakText("تم تفعيل نمط سَمَر الشامل للمكفوفين. انقر مرتين على أي عنصر للتنفيذ.");
    } else {
      speakText("تم إيقاف نمط سَمَر الشامل.");
      if (selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.style.outlineOffset = "";
      }
      setSelectedEl(null);
      setSelectedInfo(null);
    }
  }, [blindMode]);

  // Handle global click interception for Screen Reader behavior
  useEffect(() => {
    if (!blindMode) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Don't intercept clicks inside the Blind Mode status banner itself
      if (target.closest("#blind-mode-banner")) return;

      // Find the most relevant container
      const container =
        (target.closest(
          "button, a, [role='button'], [role='switch'], [role='tab'], input, textarea, select, h1, h2, h3, h4, img, [data-blind-target], .place-card, li, p"
        ) as HTMLElement | null) || target;

      const now = Date.now();
      const last = lastClickRef.current;
      const isSameElement = last.el === container || (last.el && container && last.el.contains(container));
      const isDoubleTap = isSameElement && now - last.time < 650;

      if (!isDoubleTap) {
        // --- FIRST TAP: SELECT & READ (PREVENT IMMEDIATE ACTION) ---
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Clear previous highlight
        if (selectedEl) {
          selectedEl.style.outline = "";
          selectedEl.style.outlineOffset = "";
        }

        // Apply new high-contrast focus ring
        container.style.outline = "4px solid #f59e0b";
        container.style.outlineOffset = "3px";
        container.scrollIntoView({ behavior: "smooth", block: "nearest" });

        setSelectedEl(container);
        lastClickRef.current = { el: container, time: now };

        // Inspect element name & role ONLY (without repeating "انقر مرتين")
        const info = inspectElement(container);
        setSelectedInfo(info);

        // Speak ONLY the element text and its role
        const parts: string[] = [];
        if (info.text) parts.push(info.text);
        if (info.role) parts.push(info.role);

        const phrase = parts.join("، ");
        speakText(phrase || "عنصر محدد");
      } else {
        // --- DOUBLE TAP: EXECUTE ACTION ---
        lastClickRef.current = { el: null, time: 0 };
        
        // Remove outline
        container.style.outline = "";
        container.style.outlineOffset = "";

        // Trigger native navigation or action silently and directly
        if (container.tagName.toLowerCase() === "a" && (container as HTMLAnchorElement).href) {
          const href = (container as HTMLAnchorElement).getAttribute("href");
          if (href && !href.startsWith("#")) {
            window.location.href = href;
          }
        }
      }
    };

    // Keyboard navigation (Tab, Arrow keys, Enter/Space for double-tap)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!blindMode) return;

      if (e.key === "Enter" || e.key === " ") {
        if (selectedEl) {
          e.preventDefault();
          selectedEl.click();
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        navigateReadableElements(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        navigateReadableElements(-1);
      }
    };

    window.addEventListener("click", handleGlobalClick, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("click", handleGlobalClick, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [blindMode, selectedEl]);

  // Navigate through all readable elements sequentially
  const navigateReadableElements = (dir: 1 | -1) => {
    const all = Array.from(
      document.querySelectorAll<HTMLElement>(
        "button, a, [role='button'], [role='switch'], [role='tab'], input, textarea, select, h1, h2, h3, h4, img, p, .place-card"
      )
    ).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
    });

    if (all.length === 0) return;

    let idx = selectedEl ? all.indexOf(selectedEl) : -1;
    if (idx === -1) {
      idx = dir === 1 ? 0 : all.length - 1;
    } else {
      idx = (idx + dir + all.length) % all.length;
    }

    const nextEl = all[idx];
    if (nextEl) {
      nextEl.click(); // Triggers the first-tap selection logic
    }
  };

  if (!blindMode) return null;

  return (
    <div
      id="blind-mode-banner"
      dir="rtl"
      className="fixed top-0 inset-x-0 z-[9999] bg-amber-500 text-amber-950 px-4 py-2.5 shadow-xl flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center gap-2 truncate">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-950 text-amber-400">
          <Eye className="h-4 w-4" />
        </span>
        <div className="flex flex-col truncate">
          <span className="font-extrabold text-sm">نمط سَمَر الشامل 🔊</span>
          <span className="text-[11px] opacity-90 truncate">
            {selectedInfo ? `${selectedInfo.text || "عنصر"} (${selectedInfo.role || "عنصر"})` : "محدد القراءة"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => toggleBlindMode()}
        className="shrink-0 rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-100 hover:bg-amber-900 transition-colors shadow-sm cursor-pointer"
      >
        إيقاف
      </button>
    </div>
  );
}

// Helper: Inspect element to generate Arabic label and role ONLY
function inspectElement(el: HTMLElement): { text: string; role: string } {
  const customLabel = el.getAttribute("data-blind-label");
  const customRole = el.getAttribute("data-blind-role");

  let text =
    customLabel ||
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    (el as HTMLImageElement).alt ||
    el.innerText?.trim() ||
    "";

  // Cleanup text to keep it short and clean
  text = text.replace(/\s+/g, " ").slice(0, 100);

  const tag = el.tagName.toLowerCase();
  const ariaRole = el.getAttribute("role");

  let role = customRole || "";

  if (!role) {
    if (tag === "button" || ariaRole === "button") {
      role = "زر";
    } else if (tag === "a") {
      role = "رابط";
    } else if (tag === "input" || tag === "textarea") {
      role = "حقل إدخال";
    } else if (ariaRole === "switch") {
      const isChecked = el.getAttribute("aria-checked") === "true";
      role = `مفتاح (${isChecked ? "مفعّل" : "معطل"})`;
    } else if (ariaRole === "tab") {
      role = "علامة تبويب";
    } else if (el.classList.contains("place-card") || el.closest(".place-card")) {
      role = "معلم تاريخي";
    } else if (tag.startsWith("h")) {
      role = "عنوان";
    } else if (tag === "img") {
      role = "صورة";
    } else {
      const interactiveParent = el.closest("button, a, [role='button']");
      if (interactiveParent) {
        role = "زر";
      } else {
        role = "";
      }
    }
  }

  return { text, role };
}

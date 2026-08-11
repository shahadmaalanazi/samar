import { useAppState } from "@/lib/app-state";
import { Volume2, VolumeX, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlindModeButton({ className }: { className?: string }) {
  const { blindMode, toggleBlindMode } = useAppState();

  return (
    <button
      type="button"
      onClick={toggleBlindMode}
      aria-pressed={blindMode}
      aria-label="نمط سَمَر الشامل للمكفوفين"
      className={cn(
        "w-full flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer border",
        blindMode
          ? "bg-amber-500 text-amber-950 border-amber-600 shadow-md ring-2 ring-amber-400"
          : "bg-[#f4ebe1] hover:bg-[#ebdccf] dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-foreground border-amber-300/40 dark:border-amber-700/40",
        className
      )}
    >
      <Volume2 className={cn("h-4.5 w-4.5 shrink-0", blindMode ? "text-amber-950 animate-pulse" : "text-amber-800 dark:text-amber-400")} />
      <span>نمط سَمَر الشامل (للمكفوفين)</span>
      {blindMode ? (
        <span className="ms-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-950 text-amber-400 text-[10px]">
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </button>
  );
}

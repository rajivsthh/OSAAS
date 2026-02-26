import { useState, useEffect, useCallback, useRef } from "react";
import { Timer } from "lucide-react";

interface SelfDestructTimerProps {
  isActive?: boolean; // Controls if timer should start ticking
}

const TOTAL_SECONDS = 15; // 15 seconds

// Play beep sound once using Web Audio API
const playBeep = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // 800 Hz beep
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log("Audio context not available");
  }
};

export default function SelfDestructTimer({ isActive = false }: SelfDestructTimerProps) {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [hasExpired, setHasExpired] = useState(false);
  const beepPlayedRef = useRef(false);

  // Trigger code removal notification
  const handleExpiration = useCallback(() => {
    setHasExpired(true);
    
    // Play beep only once
    if (!beepPlayedRef.current) {
      beepPlayedRef.current = true;
      playBeep();
    }
    
    // Dispatch custom event to notify code removal (don't clear report)
    const event = new CustomEvent("codeRemovedFromServer", { 
      detail: { action: "codeRemoved" } 
    });
    window.dispatchEvent(event);
    
    // Clear localStorage markers
    localStorage.removeItem("lastUploadedCode");
  }, []);

  // Reset timer when isActive changes to true
  useEffect(() => {
    if (isActive && !hasExpired) {
      setSeconds(TOTAL_SECONDS);
    }
  }, [isActive, hasExpired]);

  useEffect(() => {
    // Only run timer if isActive is true and not expired
    if (!isActive || hasExpired) return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          handleExpiration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(id);
  }, [isActive, hasExpired, handleExpiration]);

  // Don't show timer if not active
  if (!isActive && !hasExpired) {
    return null;
  }

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pct = (seconds / TOTAL_SECONDS) * 100;
  const isUrgent = seconds < 5;
  const isExpired = seconds === 0 && hasExpired;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-600 bg-amber-100/80 dark:bg-amber-900/40 px-3 py-1.5 text-xs font-medium tabular-nums">
        <Timer className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
        <span className="text-amber-700 dark:text-amber-300 font-semibold">Code removed from cloud</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors ${
      isUrgent 
        ? "border-destructive bg-destructive/10" 
        : "border-border bg-card"
    }`}>
      <Timer className={`h-3.5 w-3.5 ${isUrgent ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
      <div className="flex items-center gap-2">
        <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"}>
          {m}:{s.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

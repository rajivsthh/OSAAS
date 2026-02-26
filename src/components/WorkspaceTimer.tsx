import { useEffect, useState } from "react";
import { Timer, Zap } from "lucide-react";

interface WorkspaceTimerProps {
  workspaceId?: string;
  autoDestruct?: boolean;
}

export default function WorkspaceTimer({ workspaceId = "default", autoDestruct = false }: WorkspaceTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour default
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (autoDestruct) {
            handleAutoDestruct();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, autoDestruct]);

  const handleAutoDestruct = () => {
    console.log("Workspace auto-destruct triggered");
    // In a real implementation, this would clear workspace data
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getWarningLevel = () => {
    if (timeRemaining < 300) return "text-destructive"; // < 5 min
    if (timeRemaining < 900) return "text-severity-high"; // < 15 min
    if (timeRemaining < 1800) return "text-severity-medium"; // < 30 min
    return "text-muted-foreground";
  };

  if (!autoDestruct) return null;

  return (
    <div className={`flex items-center gap-2 text-xs ${getWarningLevel()}`}>
      {timeRemaining > 0 ? (
        <>
          <Timer className="h-3.5 w-3.5" />
          <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          <span className="text-muted-foreground">workspace expires</span>
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5 text-destructive" />
          <span className="font-medium text-destructive">Workspace Expired</span>
        </>
      )}
    </div>
  );
}

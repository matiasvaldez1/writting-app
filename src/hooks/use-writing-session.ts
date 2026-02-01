import { useCallback, useEffect, useRef, useState } from "react";

export default function useWritingSession(
  onSessionEnd: (duration: number) => Promise<void>
) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const onSessionEndRef = useRef(onSessionEnd);
  onSessionEndRef.current = onSessionEnd;

  const startTracking = () => {
    if (!isTracking) {
      setStartTime(Date.now());
      setIsTracking(true);
    }
  };

  const stopTracking = useCallback(async () => {
    if (isTracking && startTime) {
      const duration = Date.now() - startTime;
      await onSessionEndRef.current(duration);
      setIsTracking(false);
    }
  }, [isTracking, startTime]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return { startTracking };
}

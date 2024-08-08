import { useEffect, useState } from "react";

export default function useWritingSession(onSessionEnd: (duration: number) => Promise<void>) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const startTracking = () => {
    if (!isTracking) {
      setStartTime(Date.now());
      setIsTracking(true);
    }
  };
  const stopTracking = async () => {
    if (isTracking && startTime) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      await onSessionEnd(duration);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopTracking()
    };
  }, [isTracking, startTime]);

  return { startTracking };
}

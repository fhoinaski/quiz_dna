export interface TimedScore {
    basePoints: number;
    timeBonus: number;
    total: number;
  }
  
  export const calculateTimedScore = (
    timeLeft: number,
    maxTime: number = 1000,
    basePoints: number = 100
  ): TimedScore => {
    // Time bonus calculation (0-900 points based on remaining time)
    const timeBonus = Math.floor((timeLeft / maxTime) * 900);
    
    return {
      basePoints,
      timeBonus,
      total: basePoints + timeBonus
    };
  };
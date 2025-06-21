
import { useState, useEffect } from 'react';

interface UsageData {
  date: string;
  apiCalls: number;
  modelUsage: number;
}

interface ModelUsage {
  model: string;
  usage: number;
}

interface UsageStats {
  totalApiCalls: number;
  totalModelUsage: number;
  usageData: UsageData[];
  modelUsageData: ModelUsage[];
  avgDailyUsage: number;
}

export const useUsageTracking = () => {
  const [stats, setStats] = useState<UsageStats>({
    totalApiCalls: 0,
    totalModelUsage: 0,
    usageData: [],
    modelUsageData: [],
    avgDailyUsage: 0
  });

  useEffect(() => {
    // Load existing stats from localStorage
    const savedStats = localStorage.getItem('nexora-usage-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const trackApiCall = (modelId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const modelName = getModelName(modelId);
    
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update total API calls
      newStats.totalApiCalls += 1;
      
      // Update daily usage data
      const todayIndex = newStats.usageData.findIndex(day => day.date === today);
      if (todayIndex >= 0) {
        newStats.usageData[todayIndex].apiCalls += 1;
      } else {
        newStats.usageData.push({ date: today, apiCalls: 1, modelUsage: 0 });
      }
      
      // Keep only last 7 days
      newStats.usageData = newStats.usageData
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
        .reverse();
      
      // Update model usage
      const modelIndex = newStats.modelUsageData.findIndex(m => m.model === modelName);
      if (modelIndex >= 0) {
        newStats.modelUsageData[modelIndex].usage += 1;
      } else {
        newStats.modelUsageData.push({ model: modelName, usage: 1 });
      }
      
      // Update average daily usage
      newStats.avgDailyUsage = Math.round(newStats.totalApiCalls / Math.max(newStats.usageData.length, 1));
      
      // Save to localStorage
      localStorage.setItem('nexora-usage-stats', JSON.stringify(newStats));
      
      return newStats;
    });
  };

  const trackModelUsage = (modelId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update total model usage
      newStats.totalModelUsage += 1;
      
      // Update daily model usage
      const todayIndex = newStats.usageData.findIndex(day => day.date === today);
      if (todayIndex >= 0) {
        newStats.usageData[todayIndex].modelUsage += 1;
      } else {
        const existingDay = newStats.usageData.find(day => day.date === today);
        if (existingDay) {
          existingDay.modelUsage += 1;
        } else {
          newStats.usageData.push({ date: today, apiCalls: 0, modelUsage: 1 });
        }
      }
      
      // Save to localStorage
      localStorage.setItem('nexora-usage-stats', JSON.stringify(newStats));
      
      return newStats;
    });
  };

  const getModelName = (modelId: string): string => {
    const modelMap: Record<string, string> = {
      'accounts/fireworks/models/qwen2p5-72b-instruct': 'PetalFlow',
      'accounts/fireworks/models/llama4-maverick-instruct-basic': 'Casanova Scout',
      'accounts/fireworks/models/llama-v3p1-8b-instruct': 'Lip Instruct',
      'accounts/fireworks/models/deepseek-r1-basic': 'Fluxborn Adaptive',
      'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b': 'RogueMini 8B'
    };
    return modelMap[modelId] || 'Unknown Model';
  };

  return {
    stats,
    trackApiCall,
    trackModelUsage
  };
};

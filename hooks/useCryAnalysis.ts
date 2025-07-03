import { useState, useCallback } from 'react';

export interface CryAnalysisResult {
  id: string;
  timestamp: Date;
  emotions: {
    hungry: number;
    tired: number;
    uncomfortable: number;
    needsAttention: number;
  };
  confidence: number;
  duration: number;
  recommendation: string;
}

export function useCryAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<CryAnalysisResult | null>(null);

  const analyzeAudio = useCallback(async (): Promise<CryAnalysisResult> => {
    setIsAnalyzing(true);
    
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis results with realistic data
    const mockResults = [
      {
        emotions: { hungry: 75, tired: 15, uncomfortable: 5, needsAttention: 5 },
        confidence: 0.87,
        recommendation: 'Your baby seems hungry. Try feeding or checking if it\'s time for the next meal.',
      },
      {
        emotions: { tired: 65, hungry: 20, uncomfortable: 10, needsAttention: 5 },
        confidence: 0.82,
        recommendation: 'Your baby appears tired. Consider creating a calm environment for sleep.',
      },
      {
        emotions: { uncomfortable: 60, needsAttention: 25, hungry: 10, tired: 5 },
        confidence: 0.79,
        recommendation: 'Your baby seems uncomfortable. Check diaper, clothing, or room temperature.',
      },
      {
        emotions: { needsAttention: 70, hungry: 15, tired: 10, uncomfortable: 5 },
        confidence: 0.85,
        recommendation: 'Your baby wants attention and comfort. Try gentle interaction or cuddling.',
      },
    ];

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    
    const result: CryAnalysisResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      emotions: randomResult.emotions,
      confidence: randomResult.confidence,
      duration: Math.random() * 20 + 10, // 10-30 seconds
      recommendation: randomResult.recommendation,
    };

    setLastResult(result);
    setIsAnalyzing(false);
    
    return result;
  }, []);

  return {
    analyzeAudio,
    isAnalyzing,
    lastResult,
  };
}
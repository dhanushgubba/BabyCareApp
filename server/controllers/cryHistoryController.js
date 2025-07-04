const CryHistory = require('../models/CryHistory');

// Get all cry history entries for a user
exports.getCryHistory = async (req, res) => {
  try {
    const cryHistory = await CryHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 });
    
    res.status(200).json(cryHistory);
  } catch (error) {
    console.error('Error fetching cry history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new cry history entry
exports.addCryHistory = async (req, res) => {
  try {
    const { emotions, confidence, duration, recommendation, audioUrl, language } = req.body;
    
    const newCryHistory = new CryHistory({
      emotions,
      confidence,
      duration,
      recommendation,
      audioUrl,
      userId: req.user ? req.user.id : null,
      language,
    });
    
    const savedCryHistory = await newCryHistory.save();
    res.status(201).json(savedCryHistory);
  } catch (error) {
    console.error('Error adding cry history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get insights based on cry history
exports.getInsights = async (req, res) => {
  try {
    const cryHistory = await CryHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);
    
    // Process data to generate insights
    const totalEntries = cryHistory.length;
    
    if (totalEntries === 0) {
      return res.status(200).json({
        message: 'Not enough data to generate insights',
        insights: [],
      });
    }
    
    // Aggregate emotion data
    const emotionTotals = {
      hungry: 0,
      tired: 0,
      uncomfortable: 0,
      needsAttention: 0,
    };
    
    cryHistory.forEach(entry => {
      emotionTotals.hungry += entry.emotions.hungry;
      emotionTotals.tired += entry.emotions.tired;
      emotionTotals.uncomfortable += entry.emotions.uncomfortable;
      emotionTotals.needsAttention += entry.emotions.needsAttention;
    });
    
    // Calculate percentages
    const emotionPercentages = {
      hungry: (emotionTotals.hungry / totalEntries).toFixed(2),
      tired: (emotionTotals.tired / totalEntries).toFixed(2),
      uncomfortable: (emotionTotals.uncomfortable / totalEntries).toFixed(2),
      needsAttention: (emotionTotals.needsAttention / totalEntries).toFixed(2),
    };
    
    // Time-based patterns
    const timePatterns = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    
    cryHistory.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      
      if (hour >= 5 && hour < 12) timePatterns.morning++;
      else if (hour >= 12 && hour < 17) timePatterns.afternoon++;
      else if (hour >= 17 && hour < 21) timePatterns.evening++;
      else timePatterns.night++;
    });
    
    // Generate insights
    const insights = [
      {
        title: 'Primary Emotion',
        description: `Your baby most frequently expresses ${getHighestEmotion(emotionPercentages)}.`,
        type: 'emotion',
        data: emotionPercentages,
      },
      {
        title: 'Time Patterns',
        description: `Your baby tends to cry most during the ${getHighestTimePeriod(timePatterns)}.`,
        type: 'time',
        data: timePatterns,
      },
      {
        title: 'Consistency',
        description: getConsistencyInsight(cryHistory),
        type: 'consistency',
      },
    ];
    
    res.status(200).json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions
function getHighestEmotion(emotionPercentages) {
  const highest = Object.entries(emotionPercentages).reduce((a, b) => 
    parseFloat(a[1]) > parseFloat(b[1]) ? a : b
  );
  
  return highest[0];
}

function getHighestTimePeriod(timePatterns) {
  const highest = Object.entries(timePatterns).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );
  
  return highest[0];
}

function getConsistencyInsight(cryHistory) {
  // Implement logic to detect consistency in crying patterns
  // For now, return a simple insight
  return 'Your baby\'s crying patterns are relatively consistent.';
}

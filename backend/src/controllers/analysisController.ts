import { Response } from 'express';
import AIAnalysis from '../models/AIAnalysis';
import BehaviorPattern from '../models/BehaviorPattern';
import { AuthRequest } from '../middleware/auth';
import { generateEvidence, analyzeWithAI } from '../services/aiService';

export const getAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const analysis = await AIAnalysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};

export const getLatestAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analysis = await AIAnalysis.findOne({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ analysis });
  } catch (error) {
    console.error('Get latest analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch latest analysis' });
  }
};

export const generateAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const currentDate = new Date();
    
    // Generate evidence from user data
    const evidence = await generateEvidence(req.userId.toString(), currentDate);
    
    // Analyze with AI
    const aiResult = await analyzeWithAI(evidence);
    
    // Store analysis in database
    const analysis = new AIAnalysis({
      userId: req.userId,
      date: currentDate,
      dailyGrowthAnalysis: aiResult.dailyGrowthAnalysis,
      rootCause: aiResult.rootCause,
      confidenceScore: aiResult.confidenceScore,
      personalizedRecommendation: aiResult.personalizedRecommendation,
      behavioralPatterns: aiResult.behavioralPatterns,
      recommendations: aiResult.recommendations,
      efficiencyFactors: aiResult.efficiencyFactors,
      evidence
    });
    
    await analysis.save();
    
    res.json({ 
      success: true, 
      message: 'AI analysis completed successfully',
      analysis 
    });
  } catch (error) {
    console.error('Generate analysis error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
};

export const getBehaviorPatterns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patterns = await BehaviorPattern.find({
      userId: req.userId,
      isActive: true
    }).sort({ confidenceScore: -1 });

    res.json({ patterns });
  } catch (error) {
    console.error('Get behavior patterns error:', error);
    res.status(500).json({ error: 'Failed to fetch behavior patterns' });
  }
};

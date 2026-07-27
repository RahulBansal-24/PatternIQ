import { Response } from 'express';
import Reflection from '../models/Reflection';
import AIAnalysis from '../models/AIAnalysis';
import { AuthRequest } from '../middleware/auth';
import { generateEvidence, analyzeWithAI } from '../services/aiService';

export const createReflection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { text, mood, energy, motivation, productiveMinutes, entertainmentMinutes } = req.body;

    if (!text || !mood || !energy || !motivation) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingReflection = await Reflection.findOne({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    if (existingReflection) {
      res.status(400).json({ error: 'You can only submit one reflection per day' });
      return;
    }

    const reflection = new Reflection({
      userId: req.userId,
      text,
      mood,
      energy,
      motivation
    });

    await reflection.save();

    // Save screen time if provided
    if (productiveMinutes || entertainmentMinutes) {
      const ScreenTime = (await import('../models/ScreenTime')).default;
      const productiveMins = parseInt(productiveMinutes) || 0;
      const entertainmentMins = parseInt(entertainmentMinutes) || 0;
      const totalMins = productiveMins + entertainmentMins;
      
      const existingScreenTime = await ScreenTime.findOne({
        userId: req.userId,
        date: today
      });

      if (existingScreenTime) {
        existingScreenTime.totalMinutes = totalMins;
        existingScreenTime.productiveMinutes = productiveMins;
        existingScreenTime.entertainmentMinutes = entertainmentMins;
        await existingScreenTime.save();
      } else {
        const newScreenTime = new ScreenTime({
          userId: req.userId,
          date: today,
          totalMinutes: totalMins,
          productiveMinutes: productiveMins,
          entertainmentMinutes: entertainmentMins
        });
        await newScreenTime.save();
      }
    }

    // Generate AI analysis
    let aiAnalysis = null;
    try {
      const evidence = await generateEvidence(req.userId.toString(), today);
      const aiResult = await analyzeWithAI(evidence);
      
      const analysis = new AIAnalysis({
        userId: req.userId,
        date: today,
        dailyGrowthAnalysis: aiResult.dailyGrowthAnalysis,
        rootCause: aiResult.rootCause,
        confidenceScore: aiResult.confidenceScore,
        behavioralPatterns: aiResult.behavioralPatterns,
        recommendations: aiResult.recommendations,
        efficiencyFactors: aiResult.efficiencyFactors,
        evidence
      });
      
      await analysis.save();
      aiAnalysis = analysis;
    } catch (aiError) {
      console.error('AI analysis generation error:', aiError);
      // Continue without failing the reflection submission
    }

    res.status(201).json({ 
      reflection,
      aiAnalysis,
      message: 'Reflection submitted successfully.'
    });
  } catch (error) {
    console.error('Create reflection error:', error);
    res.status(500).json({ error: 'Failed to create reflection' });
  }
};

export const getReflections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const reflections = await Reflection.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ reflections });
  } catch (error) {
    console.error('Get reflections error:', error);
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
};

export const getTodayReflection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reflection = await Reflection.findOne({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    res.json({ reflection });
  } catch (error) {
    console.error('Get today reflection error:', error);
    res.status(500).json({ error: 'Failed to fetch today reflection' });
  }
};

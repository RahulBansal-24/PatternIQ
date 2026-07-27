import { Response } from 'express';
import ScreenTime from '../models/ScreenTime';
import { AuthRequest } from '../middleware/auth';

export const createScreenTime = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { totalMinutes, productiveMinutes, entertainmentMinutes, date } = req.body;

    if (!totalMinutes || totalMinutes < 0) {
      res.status(400).json({ error: 'Valid total minutes are required' });
      return;
    }

    const screenDate = date ? new Date(date) : new Date();
    screenDate.setHours(0, 0, 0, 0);

    const existingScreenTime = await ScreenTime.findOne({
      userId: req.userId,
      date: screenDate
    });

    if (existingScreenTime) {
      existingScreenTime.totalMinutes = totalMinutes;
      existingScreenTime.productiveMinutes = productiveMinutes || 0;
      existingScreenTime.entertainmentMinutes = entertainmentMinutes || 0;
      await existingScreenTime.save();

      res.json({ screenTime: existingScreenTime });
      return;
    }

    const screenTime = new ScreenTime({
      userId: req.userId,
      date: screenDate,
      totalMinutes,
      productiveMinutes: productiveMinutes || 0,
      entertainmentMinutes: entertainmentMinutes || 0
    });

    await screenTime.save();

    res.status(201).json({ screenTime });
  } catch (error) {
    console.error('Create screen time error:', error);
    res.status(500).json({ error: 'Failed to create screen time' });
  }
};

export const getTodayScreenTimeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const screenTime = await ScreenTime.findOne({
      userId: req.userId,
      date: today
    });

    res.json({ 
      hasRecordedToday: !!screenTime,
      screenTime
    });
  } catch (error) {
    console.error('Get today screen time status error:', error);
    res.status(500).json({ error: 'Failed to check today screen time status' });
  }
};

export const getScreenTime = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const filter: any = { userId: req.userId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const screenTimeData = await ScreenTime.find(filter).sort({ date: -1 });

    res.json({ screenTime: screenTimeData });
  } catch (error) {
    console.error('Get screen time error:', error);
    res.status(500).json({ error: 'Failed to fetch screen time' });
  }
};

export const getTodayScreenTime = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const screenTime = await ScreenTime.findOne({
      userId: req.userId,
      date: today
    });

    res.json({ screenTime });
  } catch (error) {
    console.error('Get today screen time error:', error);
    res.status(500).json({ error: 'Failed to fetch today screen time' });
  }
};

export const getWeeklyScreenTime = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const screenTimeData = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: weekAgo }
    }).sort({ date: 1 });

    res.json({ screenTime: screenTimeData });
  } catch (error) {
    console.error('Get weekly screen time error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly screen time' });
  }
};

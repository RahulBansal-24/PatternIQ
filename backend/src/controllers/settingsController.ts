import { Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest } from '../middleware/auth';

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne({ userId: req.userId });

    if (!settings) {
      settings = new Settings({ userId: req.userId });
      await settings.save();
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { theme, notifications, privacy, preferences } = req.body;

    let settings = await Settings.findOne({ userId: req.userId });

    if (!settings) {
      settings = new Settings({ userId: req.userId });
    }

    if (theme !== undefined) settings.theme = theme;
    if (notifications !== undefined) settings.notifications = { ...settings.notifications, ...notifications };
    if (privacy !== undefined) settings.privacy = { ...settings.privacy, ...privacy };
    if (preferences !== undefined) settings.preferences = { ...settings.preferences, ...preferences };

    await settings.save();

    res.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

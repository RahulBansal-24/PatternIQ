import { Request, Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';
import Reflection from '../models/Reflection';
import ScreenTime from '../models/ScreenTime';
import AIAnalysis from '../models/AIAnalysis';
import DailyMetrics from '../models/DailyMetrics';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken, generateRefreshToken, AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const token = generateToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshToken');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Delete all user data from all collections
    await Task.deleteMany({ userId: req.userId });
    await Reflection.deleteMany({ userId: req.userId });
    await ScreenTime.deleteMany({ userId: req.userId });
    await AIAnalysis.deleteMany({ userId: req.userId });
    await DailyMetrics.deleteMany({ userId: req.userId });
    
    // Delete the user account
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

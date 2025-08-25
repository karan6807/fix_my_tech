// src/lib/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './supabase';
import { generateOTP } from './email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Create user
export const createUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, error: 'User already exists with this email' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
          email_verified: false
        }
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Authenticate user
export const authenticateUser = async (email, password) => {
  try {
    // Get user by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check if email is verified
    if (!user.email_verified) {
      return { success: false, error: 'Please verify your email first', needsVerification: true };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified
      },
      token
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create and store OTP
export const createOTP = async (email, userId, purpose) => {
  try {
    // Delete any existing OTPs for this email and purpose
    await supabaseAdmin
      .from('otp_codes')
      .delete()
      .eq('email', email)
      .eq('purpose', purpose);

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .insert([
        {
          user_id: userId,
          email,
          code: otp,
          purpose,
          expires_at: expiresAt.toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, otp, otpId: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verify OTP
export const verifyOTP = async (email, otp, purpose) => {
  try {
    // Find valid OTP
    const { data: otpRecord, error } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', otp)
      .eq('purpose', purpose)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !otpRecord) {
      return { success: false, error: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpRecord.id);

    return { success: true, userId: otpRecord.user_id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark email as verified
export const markEmailAsVerified = async (userId) => {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
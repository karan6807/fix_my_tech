-- Create admin_otps table for password reset OTP functionality
CREATE TABLE IF NOT EXISTS admin_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- 'password_reset', 'login', etc.
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_otps_email ON admin_otps(email);
CREATE INDEX IF NOT EXISTS idx_admin_otps_otp ON admin_otps(otp);
CREATE INDEX IF NOT EXISTS idx_admin_otps_expires_at ON admin_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_otps_used ON admin_otps(used);

-- Clean up expired OTPs (optional - can be run periodically)
-- DELETE FROM admin_otps WHERE expires_at < NOW();
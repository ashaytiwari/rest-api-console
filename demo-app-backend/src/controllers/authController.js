import jwt from 'jsonwebtoken';

// Test credentials
const TEST_EMAIL = 'test@gmail.com';
const TEST_PASSWORD = 'test@123';

// @desc    Test login endpoint to generate JWT token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Use test@gmail.com / test@123',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: TEST_EMAIL,
        role: 'admin',
      },
      process.env.JWT_SECRET || 'super_secret_jwt_key_demo_app_2026',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: TEST_EMAIL,
        role: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

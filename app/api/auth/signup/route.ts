import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import bcrypt from "bcryptjs";

interface SignupRequest {
  email: string;
  password: string;
  referralCode?: string;
  agreeToTerms: boolean;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Initialize table if it doesn't exist
async function initTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        referral_code TEXT,
        verified BOOLEAN DEFAULT FALSE,
        otp TEXT,
        otp_expiry TIMESTAMP,
        phone_number TEXT,
        phone_otp TEXT,
        phone_otp_expiry TIMESTAMP,
        phone_verified BOOLEAN DEFAULT FALSE,
        username TEXT,
        firstname TEXT,
        lastname TEXT,
        dob DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
  } catch (error) {
    // Table might already exist, that's okay
    console.log("Table init:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await initTable();

    const body: SignupRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!body.agreeToTerms) {
      return NextResponse.json(
        { error: "You must agree to the terms and conditions" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase();

    // Check if email exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const userId = crypto.randomUUID();

    // Insert user with hashed password
    await sql`
      INSERT INTO users (id, email, password, referral_code, verified, otp, otp_expiry)
      VALUES (${userId}, ${email}, ${hashedPassword}, ${
      body.referralCode || null
    }, false, ${otp}, ${otpExpiry.toISOString()})
    `;

    return NextResponse.json(
      {
        message: "Account created successfully. OTP sent to your email.",
        user: {
          id: userId,
          email: email,
          verified: false,
        },
        debug: {
          otp: otp,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}

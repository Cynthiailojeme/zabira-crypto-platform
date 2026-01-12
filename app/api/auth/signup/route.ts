// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Type definitions
interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  referralCode?: string;
  verified: boolean;
  otp: string;
  otpExpiry: string;
  createdAt: string;
}

interface SignupRequest {
  email: string;
  password: string;
  referralCode?: string;
  agreeToTerms: boolean;
}

// Helper to get the data file path
const getDataFilePath = () => {
  return path.join(process.cwd(), "data", "users.json");
};

// Helper to read users from file
async function readUsers(): Promise<User[]> {
  try {
    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper to write users to file
async function writeUsers(users: User[]): Promise<void> {
  const filePath = getDataFilePath();
  const dirPath = path.dirname(filePath);

  // Ensure directory exists
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }

  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

// Helper to generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // Simulate network delay (realistic API behavior)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const body: SignupRequest = await request.json();

    // Validation
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation (basic)
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Read existing users
    const users = await readUsers();

    // Check if email already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === body.email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate OTP and set expiry (5 minutes from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email: body.email.toLowerCase(),
      password: body.password, // In production, hash this with bcrypt
      referralCode: body.referralCode,
      verified: false,
      otp,
      otpExpiry,
      createdAt: new Date().toISOString(),
    };

    // Add user to array and save
    users.push(newUser);
    await writeUsers(users);

    // In a real app, send OTP via email here
    console.log(`OTP for ${body.email}: ${otp} (expires: ${otpExpiry})`);

    // Return success response
    return NextResponse.json(
      {
        message: "Account created successfully. OTP sent to your email.",
        user: {
          id: newUser.id,
          email: newUser.email,
          verified: newUser.verified,
        },
        // In development only - to be removed in production
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

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface User {
  id: string;
  email: string;
  password: string;
  referralCode?: string;
  verified: boolean;
  otp: string;
  otpExpiry: string;
  createdAt: string;
  phoneNumber?: string;
  phoneOtp?: string;
  phoneOtpExpiry?: string;
  phoneVerified?: boolean;
}

const getDataFilePath = () => {
  return path.join(process.cwd(), "data", "users.json");
};

async function readUsers(): Promise<User[]> {
  try {
    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  const filePath = getDataFilePath();
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

// Helper to generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send OTP to phone number
export async function POST(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const { email, phoneNumber, method } = body; // method: 'whatsapp' or 'sms'

    if (!email || !phoneNumber) {
      return NextResponse.json(
        { error: "Email and phone number are required" },
        { status: 400 }
      );
    }

    // Read users
    const users = await readUsers();

    // Find user by email
    const userIndex = users.findIndex(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP and set expiry (5 minutes from now)
    const phoneOtp = generateOTP();
    const phoneOtpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Update user with phone number and OTP
    users[userIndex].phoneNumber = phoneNumber;
    users[userIndex].phoneOtp = phoneOtp;
    users[userIndex].phoneOtpExpiry = phoneOtpExpiry;
    users[userIndex].phoneVerified = false;

    await writeUsers(users);

    // In production, send OTP via SMS/WhatsApp here
    console.log(
      `Phone OTP for ${phoneNumber} via ${method}: ${phoneOtp} (expires: ${phoneOtpExpiry})`
    );

    return NextResponse.json(
      {
        message: `OTP sent to ${phoneNumber} via ${method}`,
        // In development only - remove in production
        debug: {
          otp: phoneOtp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

// PUT - Verify phone OTP
export async function PUT(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format. Must be 6 digits." },
        { status: 400 }
      );
    }

    // Read users
    const users = await readUsers();

    // Find user by email
    const userIndex = users.findIndex(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[userIndex];

    // Check if phone is already verified
    if (user.phoneVerified) {
      return NextResponse.json(
        { message: "Phone already verified" },
        { status: 200 }
      );
    }

    // Check if OTP has expired
    if (!user.phoneOtpExpiry || new Date(user.phoneOtpExpiry) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.phoneOtp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark phone as verified
    users[userIndex].phoneVerified = true;
    await writeUsers(users);

    return NextResponse.json(
      {
        message: "Phone number verified successfully",
        phoneNumber: user.phoneNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}

// GET - Resend phone OTP
export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const method = searchParams.get("method") || "whatsapp";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[userIndex];

    if (user.phoneVerified) {
      return NextResponse.json(
        { message: "Phone already verified" },
        { status: 200 }
      );
    }

    if (!user.phoneNumber) {
      return NextResponse.json(
        { error: "No phone number on file" },
        { status: 400 }
      );
    }

    // Generate new OTP and update expiry
    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    users[userIndex].phoneOtp = newOtp;
    users[userIndex].phoneOtpExpiry = newExpiry;
    await writeUsers(users);

    // In production, send OTP via SMS/WhatsApp here
    console.log(
      `Resend phone OTP for ${user.phoneNumber}: ${newOtp} (expires: ${newExpiry})`
    );

    return NextResponse.json(
      {
        message: `New OTP sent to ${user.phoneNumber} via ${method}`,
        // In development only - remove in production
        debug: {
          otp: newOtp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "An error occurred while resending OTP" },
      { status: 500 }
    );
  }
}

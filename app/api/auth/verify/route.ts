// app/api/auth/verify/route.ts
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

// POST - Verify OTP
export async function POST(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

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

    // Check if already verified
    if (user.verified) {
      return NextResponse.json(
        {
          message: "Email already verified",
          user: {
            id: user.id,
            email: user.email,
            verified: true,
          },
        },
        { status: 200 }
      );
    }

    // Check if OTP has expired
    if (new Date(user.otpExpiry) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark user as verified
    users[userIndex].verified = true;
    await writeUsers(users);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: users[userIndex].id,
          email: users[userIndex].email,
          verified: true,
        },
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

// GET - Resend OTP
export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[userIndex];

    if (user.verified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Generate new OTP and update expiry
    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    users[userIndex].otp = newOtp;
    users[userIndex].otpExpiry = newExpiry;
    await writeUsers(users);

    // In a real app, OTP would be sent via email here
    console.log(`New OTP for ${email}: ${newOtp} (expires: ${newExpiry})`);

    return NextResponse.json(
      {
        message: "New OTP sent to your email",
        // In development only - to be removed in production
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

// PUT - Change email (generates new OTP for new email)
export async function PUT(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const { oldEmail, newEmail } = body;

    if (!oldEmail || !newEmail) {
      return NextResponse.json(
        { error: "Both old and new email are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const users = await readUsers();

    // Find user with old email
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === oldEmail.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if new email already exists
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === newEmail.toLowerCase()
    );

    if (emailExists) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    // Update email and generate new OTP
    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    users[userIndex].email = newEmail.toLowerCase();
    users[userIndex].otp = newOtp;
    users[userIndex].otpExpiry = newExpiry;
    users[userIndex].verified = false; // Reset verification status

    await writeUsers(users);

    return NextResponse.json(
      {
        message: "Email updated successfully. New OTP sent.",
        user: {
          id: users[userIndex].id,
          email: users[userIndex].email,
          verified: users[userIndex].verified,
        },
        // In development only - to be removed in production
        debug: {
          otp: newOtp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json(
      { error: "An error occurred while changing email" },
      { status: 500 }
    );
  }
}

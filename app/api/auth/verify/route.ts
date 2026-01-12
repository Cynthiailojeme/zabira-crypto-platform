import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Helper to generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Verify OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format. Must be 6 digits." },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT *, (otp_expiry > NOW()) as is_valid 
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    if (user.verified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Check if OTP has expired using DB comparison
    if (!user.is_valid) {
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

    // Mark as verified
    await sql`
      UPDATE users SET verified = true WHERE email = ${email.toLowerCase()}
    `;

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user.id,
          email: user.email,
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
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    if (user.verified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await sql`
      UPDATE users 
      SET otp = ${newOtp}, otp_expiry = ${newExpiry}
      WHERE email = ${email.toLowerCase()}
    `;

    // In a real app, OTP would be sent via email here
    console.log(`Resend OTP for ${email}: ${newOtp}`);

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
    const body = await request.json();
    const { oldEmail, newEmail } = body;

    if (!oldEmail || !newEmail) {
      return NextResponse.json(
        { error: "Both old and new email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const userResult = await sql`
      SELECT * FROM users WHERE email = ${oldEmail.toLowerCase()}
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if new email exists
    const emailCheck = await sql`
      SELECT * FROM users WHERE email = ${newEmail.toLowerCase()}
    `;

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await sql`
      UPDATE users 
      SET email = ${newEmail.toLowerCase()}, 
          otp = ${newOtp}, 
          otp_expiry = ${newExpiry},
          verified = false
      WHERE email = ${oldEmail.toLowerCase()}
    `;

    return NextResponse.json(
      {
        message: "Email updated successfully. New OTP sent.",
        user: {
          id: userResult.rows[0].id,
          email: newEmail.toLowerCase(),
          verified: false,
        },
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

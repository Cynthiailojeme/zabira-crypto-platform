import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Helper to generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send OTP to phone number
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phoneNumber, method } = body; // method: 'whatsapp' or 'sms'

    if (!email || !phoneNumber) {
      return NextResponse.json(
        { error: "Email and phone number are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP and set expiry (5 minutes from now)
    const phoneOtp = generateOTP();
    const phoneOtpExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Update user with phone number and OTP
    await sql`
      UPDATE users 
      SET phone_number = ${phoneNumber}, 
          phone_otp = ${phoneOtp}, 
          phone_otp_expiry = ${phoneOtpExpiry},
          phone_verified = false
      WHERE email = ${email.toLowerCase()}
    `;

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
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// PUT - Verify phone OTP
export async function PUT(request: NextRequest) {
  try {
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

    // Find user and check OTP validity using DB timezone
    const result = await sql`
      SELECT *, (phone_otp_expiry > NOW()) as is_valid 
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    // Check if phone is already verified
    if (user.phone_verified) {
      return NextResponse.json(
        { message: "Phone already verified" },
        { status: 200 }
      );
    }

    // Check if OTP has expired (using DB comparison)
    if (!user.is_valid) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.phone_otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark phone as verified
    await sql`
      UPDATE users 
      SET phone_verified = true 
      WHERE email = ${email.toLowerCase()}
    `;

    return NextResponse.json(
      {
        message: "Phone number verified successfully",
        phoneNumber: user.phone_number,
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
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const method = searchParams.get("method") || "whatsapp";

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

    if (user.phone_verified) {
      return NextResponse.json(
        { message: "Phone already verified" },
        { status: 200 }
      );
    }

    if (!user.phone_number) {
      return NextResponse.json(
        { error: "No phone number on file" },
        { status: 400 }
      );
    }

    // Generate new OTP and update expiry
    const newOtp = generateOTP();
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await sql`
      UPDATE users 
      SET phone_otp = ${newOtp}, 
          phone_otp_expiry = ${newExpiry}
      WHERE email = ${email.toLowerCase()}
    `;

    // In production, send OTP via SMS/WhatsApp here
    console.log(
      `Resend phone OTP for ${user.phone_number}: ${newOtp} (expires: ${newExpiry})`
    );

    return NextResponse.json(
      {
        message: `New OTP sent to ${user.phone_number} via ${method}`,
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

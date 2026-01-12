import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

// POST - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const loggedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phone_number,
      phoneVerified: user.phone_verified,
      referralCode: user.referral_code,
    };

    // Successful login - return user data (excluding sensitive info)
    return NextResponse.json(
      {
        message: "Login successful",
        user: loggedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

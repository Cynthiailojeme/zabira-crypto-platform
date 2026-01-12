import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// POST - Save personal information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, firstname, lastname, dob } = body;

    // Validation
    if (!email || !username || !firstname || !lastname) {
      return NextResponse.json(
        { error: "Email, username, firstname, and lastname are required" },
        { status: 400 }
      );
    }

    // Validate username (must contain letter and number)
    const hasLetter = /[a-zA-Z]/.test(username);
    const hasNumber = /\d/.test(username);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json(
        { error: "Username must contain both a letter and a number" },
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

    // Check if username is already taken by another user
    const usernameCheck = await sql`
      SELECT * FROM users 
      WHERE LOWER(username) = ${username.toLowerCase()} 
      AND email != ${email.toLowerCase()}
    `;

    if (usernameCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Update user's personal information
    await sql`
      UPDATE users 
      SET username = ${username}, 
          firstname = ${firstname}, 
          lastname = ${lastname},
          dob = ${dob || null}
      WHERE email = ${email.toLowerCase()}
    `;

    return NextResponse.json(
      {
        message: "Personal information saved successfully",
        user: {
          username,
          firstname,
          lastname,
          dob: dob || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Personal info error:", error);
    return NextResponse.json(
      { error: "An error occurred while saving personal information" },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's personal information
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sql`
      SELECT username, firstname, lastname, dob, phone_number, phone_verified 
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json(
      {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        dob: user.dob,
        phoneNumber: user.phone_number,
        phoneVerified: user.phone_verified,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get personal info error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

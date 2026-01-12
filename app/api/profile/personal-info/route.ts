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
  phoneVerified?: boolean;
  username?: string;
  firstname?: string;
  lastname?: string;
  dob?: string;
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

// POST - Save personal information
export async function POST(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

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

    // Read users
    const users = await readUsers();

    // Find user by email
    const userIndex = users.findIndex(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username is already taken by another user
    const usernameExists = users.some(
      (user, index) =>
        index !== userIndex &&
        user.username?.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Update user's personal information
    users[userIndex].username = username;
    users[userIndex].firstname = firstname;
    users[userIndex].lastname = lastname;
    if (dob) {
      users[userIndex].dob = dob;
    }

    await writeUsers(users);

    return NextResponse.json(
      {
        message: "Personal information saved successfully",
        user: {
          username: users[userIndex].username,
          firstname: users[userIndex].firstname,
          lastname: users[userIndex].lastname,
          dob: users[userIndex].dob,
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
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const users = await readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        phoneVerified: user.phoneVerified,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get personal info error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

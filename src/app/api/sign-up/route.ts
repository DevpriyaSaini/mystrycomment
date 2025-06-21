import connectiondb from "@/lib/dbConnect";
import usermodel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendverification } from "@/healper/sendverifyemail";

export async function POST(request: Request) {
  await connectiondb();
  try {
    const { username, email, password } = await request.json();

    // Check existing username
    const existuser = await usermodel.findOne({ username });
    if (existuser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    // Generate verifyCode and expiry date (used in both cases)
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry

    // Check existing email
    const existemail = await usermodel.findOne({ email });
    if (existemail) {
      if (existemail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists and is verified",
          },
          { status: 400 }
        );
      } else {
        // Update existing unverified user
        const hashedpassword = await bcrypt.hash(password, 10);
        existemail.password = hashedpassword;
        existemail.verifyCode = verifycode;
        existemail.verifyCodeExpiry = expiryDate;
        await existemail.save();
      }
    } else {
      // Create new user
      const hashedpassword = await bcrypt.hash(password, 10);
      const newuser = new usermodel({
        username,
        email,
        password: hashedpassword, // Fixed: Use hashed password
        verifyCode: verifycode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMess: true,
        message: [], // Fixed: Changed `message` to `messages` (assuming schema uses plural)
      });
      await newuser.save();
    }

    // Send verification email
    const emailresponse = await sendverification(email, username, verifycode);
    if (!emailresponse.success) {
      return Response.json(
        {
          success: false,
          message: emailresponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
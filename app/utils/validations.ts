import * as Yup from "yup";

export const signupSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/\d/, "Must contain a number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Must contain special character"
    )
    .required("Password is required"),
  referralCode: Yup.string(),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms")
    .required("You must agree to the terms"),
});

export const changeEmailSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const verificationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP should be 6 characters")
    .required("OTP is required"),
});

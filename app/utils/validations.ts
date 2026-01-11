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

export const phoneVerificationSchema = Yup.object({
  phonenumber: Yup.string().trim().required("Phone number is required"),
});

export const personalInfoSchema = Yup.object({
  username: Yup.string()
    .matches(/[a-zA-Z]/, "Must contain at least one letter")
    .matches(/\d/, "Must contain at least one number")
    .min(3, "Minimum of 3 characters")
    .required("Username is required"),

  firstname: Yup.string().min(2, "Too short").required("Firstname is required"),

  lastname: Yup.string().min(2, "Too short").required("Lastname is required"),

  dob: Yup.date().nullable().max(new Date(), "Date cannot be in the future"),
});

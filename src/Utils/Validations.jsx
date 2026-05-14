export const validateSignup = (form) => {
  const errors = {};

  // Full Name
  if (!form.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (form.fullName.length < 3) {
    errors.fullName = "Minimum 3 characters required";
  }

  // Email
  if (!form.email) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email";
  }

  // School Name
  // if (!form.schoolName?.trim()) {
  //   errors.schoolName = "School name is required";
  // }

  // // Designation
  // if (!form.designation?.trim()) {
  //   errors.designation = "Designation is required";
  // }

  // Phone Number (India)
  // if (!form.phoneNumber) {
  //   errors.phoneNumber = "Phone number is required";
  // } else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
  //   errors.phoneNumber = "Enter a valid 10-digit number";
  // }

  // Password
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Minimum 6 characters required";
  }

  // Confirm Password
  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
import { useState } from "react";
import InputField from "../InputFields";
import myLogo from "../../assets/high-resolution-color-logo (2).png";
import { Link } from "react-router-dom";
import useForm from "../../Utils/UseForm";
import { validateSignup } from "../../Utils/Validations";
import { useNavigate } from "react-router-dom";
// import client from "../../api/client";
import toast from "react-hot-toast";
import { authAPI } from "../../api/services";

const StudentSignupForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const initialValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",

  institution: "",
  course: "",
  semester: "",
  batch: "",
  enrollmentNumber: "",
};

  const onSubmit = async (data) => {
  const loadingToast = toast.loading("Creating account...");

  try {
    setLoading(true);

    const payload = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,

      role: "student",

      institution: data.institution,
      course: data.course,
      semester: data.semester,
      batch: data.batch,
      enrollmentNumber: data.enrollmentNumber,
    };

    const response = await authAPI.register(payload);

    console.log(response);

    if (response.success) {
      toast.success("Account created successfully!", {
        id: loadingToast,
      });

      navigate("/login");
    }
  } catch (error) {
    console.log(error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Signup failed. Please try again.";

    toast.error(message, {
      id: loadingToast,
    });
  } finally {
    setLoading(false);
  }
};

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm(initialValues, validateSignup, onSubmit);

  return (
    <>
      {/* Logo */}
      <div className="w-full flex items-center px-6 justify-center md:justify-start my-2 ">
        <img
          src={myLogo}
          className="w-50 h-12 object-cover rounded-full"
          alt="Logo"
        />
      </div>

      <div className="w-full px-6 flex justify-start">
       <div className="w-full max-w-[460px] mx-auto">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
              Let’s get you onboarded!
            </h2>

            <p className="mb-2 text-gray-500">
              Create your Braingauge account to begin your project journey.
            </p>

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
  {/* Personal Details */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <InputField
      label="Full Name"
      name="fullName"
      value={values.fullName}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Enter your full name"
      error={errors.fullName}
      touched={touched.fullName}
    />

    <InputField
      label="Email Address"
      name="email"
      type="email"
      value={values.email}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Enter your email"
      error={errors.email}
      touched={touched.email}
    />
  </div>

  {/* Contact + Password */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <InputField
      label="Phone Number"
      name="phoneNumber"
      type="number"
      value={values.phoneNumber}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Enter your phone number"
      error={errors.phoneNumber}
      touched={touched.phoneNumber}
    />

    <InputField
      label="Password"
      name="password"
      type={showPass ? "text" : "password"}
      value={values.password}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Enter your password"
      error={errors.password}
      touched={touched.password}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="text-sm text-gray-500 cursor-pointer"
        >
          {showPass ? "Hide" : "Show"}
        </button>
      }
    />
  </div>

  {/* Confirm Password */}
  <InputField
    label="Confirm Password"
    name="confirmPassword"
    type={showPass ? "text" : "password"}
    value={values.confirmPassword}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder="Confirm your password"
    error={errors.confirmPassword}
    touched={touched.confirmPassword}
    rightElement={
      <button
        type="button"
        onClick={() => setShowPass(!showPass)}
        className="text-sm text-gray-500 cursor-pointer"
      >
        {showPass ? "Hide" : "Show"}
      </button>
    }
  />

  {/* Academic Section */}
  <div className="pt-3 border-t border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">
      Academic Details
    </h3>

    <p className="text-sm text-gray-500 mb-5">
      Optional — you can complete these later.
    </p>

    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Institution"
          name="institution"
          value={values.institution}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your institution"
          error={errors.institution}
          touched={touched.institution}
        />

        <InputField
          label="Course"
          name="course"
          value={values.course}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your course"
          error={errors.course}
          touched={touched.course}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Semester"
          name="semester"
          type="number"
          value={values.semester}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter semester"
          error={errors.semester}
          touched={touched.semester}
        />

        <InputField
          label="Batch"
          name="batch"
          value={values.batch}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="2024-2026"
          error={errors.batch}
          touched={touched.batch}
        />
      </div>

      <InputField
        label="Enrollment Number"
        name="enrollmentNumber"
        value={values.enrollmentNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter enrollment number"
        error={errors.enrollmentNumber}
        touched={touched.enrollmentNumber}
      />
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-lt)] transition-all duration-200 cursor-pointer text-white p-3 rounded-xl font-semibold mt-3 shadow-md"
  >
    {loading ? "Creating Account..." : "Create Account"}
  </button>

  {/* Footer */}
  <div className="text-center pt-2">
    <p className="text-gray-600 text-sm">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-[var(--color-primary)] font-semibold hover:underline"
      >
        Sign in
      </Link>
    </p>
  </div>
</form>
          </div>
        </div>
      </div>
    </>
  );
};
export default StudentSignupForm;

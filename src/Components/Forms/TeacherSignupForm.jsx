import { useState } from "react";
import InputField from "../InputFields";
import { Link } from "react-router-dom";
// import client from "../../api/client";
import { authAPI } from "../../api/services";
import { useNavigate } from "react-router-dom";
import useForm from "../../Utils/UseForm";
import { validateSignup } from "../../Utils/Validations";
import toast from "react-hot-toast";

const TeacherSignupForm = () => {
  const initialValues = {
    fullName: "",
    email: "",
    institution: "",
    department: "",
    designation: "",
    employeeId: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating account...");

    try {
      setLoading(true);

      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phoneNumber,

        role: "teacher",

        institution: data.institution,
        department: data.department,
        designation: data.designation,
        employeeId: data.employeeId,

        // optional
        subjects: data.subjects || [],
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
      <div className="w-full ">
        <div className="lg:text-left md:text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Signup as an Teacher
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mt-4 w-full"
          >
            {/* Name + Email */}
            <div className="flex relative flex-col md:flex-row gap-4 justify-between items-center">
              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                value={values.fullName}
                onBlur={handleBlur}
                error={errors.fullName}
                touched={touched.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="Work/Official Email"
                name="email"
                type="email"
                value={values.email}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Institution + Department */}
            <div className="flex flex-col md:flex-row relative gap-4 justify-between items-center">
              <InputField
                label="Institution"
                name="institution"
                type="text"
                value={values.institution}
                onBlur={handleBlur}
                error={errors.institution}
                touched={touched.institution}
                onChange={handleChange}
                placeholder="Enter your institution name"
                required
              />

              <InputField
                label="Department"
                name="department"
                type="text"
                value={values.department}
                onBlur={handleBlur}
                error={errors.department}
                touched={touched.department}
                onChange={handleChange}
                placeholder="Enter your department"
                required
              />
            </div>

            {/* Designation + Employee ID */}
            <div className="flex flex-col md:flex-row relative gap-4 justify-between items-center">
              <InputField
                label="Designation"
                name="designation"
                type="text"
                value={values.designation}
                onBlur={handleBlur}
                error={errors.designation}
                touched={touched.designation}
                onChange={handleChange}
                placeholder="Enter your designation"
                required
              />

              <InputField
                label="Employee ID"
                name="employeeId"
                type="text"
                value={values.employeeId}
                onBlur={handleBlur}
                error={errors.employeeId}
                touched={touched.employeeId}
                onChange={handleChange}
                placeholder="Enter employee ID (optional)"
              />
            </div>

            {/* Phone */}
            <div>
              <InputField
                label="Phone Number"
                name="phone"
                type="text"
                value={values.phone}
                onBlur={handleBlur}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col md:flex-row relative gap-4 justify-between items-center">
              <InputField
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="Enter your password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-sm text-gray-500"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                }
              />

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showPass ? "text" : "password"}
                value={values.confirmPassword}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-sm text-gray-500"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                }
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-lt)] cursor-pointer text-white p-3 rounded-lg font-semibold"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {/* Login link */}
            <div className="text-center mt-2">
              <p className="text-gray-600 text-sm">
                Already a member?{" "}
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
    </>
  );
};

export default TeacherSignupForm;

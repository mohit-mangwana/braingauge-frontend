import { useState } from "react";
import InputField from "../InputFields";
import myLogo from "../../assets/high-resolution-color-logo (2).png";
import { Link } from "react-router-dom";



const StudentSignupForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    schoolName: "",
    designation: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data:", form);

    // simulate API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
  <>
  {/* Logo */}
  <div className="w-full flex items-center px-6 justify-center md:justify-start mb-6">
    <img
      src={myLogo}
      className="w-50 h-12 object-cover rounded-full"
      alt="Logo"
    />
  </div>

  <div className="w-full px-6 flex justify-start">
    <div className="w-full max-w-3xl">
      <div className="text-left  ">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Let’s get you onboarded!
        </h2>

        <p className="mb-2 text-gray-500">
          Create your Braingauge account to begin your project journey.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4"
        >
          {/* Full Name + Email */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="flex-1 min-w-0">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password + Phone */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <InputField
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
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
            </div>

            <div className="flex-1 min-w-0">
              <InputField
                label="Phone Number"
                name="phoneNumber"
                type="number"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Confirm Password + Button */}
        <div className="flex flex-col md:flex-row gap-6">
  <div className="flex-1 min-w-0">
    <InputField
      label="Confirm Password"
      name="confirmPassword"
      type={showPass ? "text" : "password"}
      value={form.confirmPassword}
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

  {/*  Button now same width */}
  <div className="flex-1 min-w-0 flex items-end">
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-lt)] cursor-pointer text-white p-3 rounded-lg font-semibold"
    >
      {loading ? "Signing up..." : "Sign Up"}
    </button>
  </div>
</div>

          {/* Footer */}
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
  </div>
</>
  );
};

export default StudentSignupForm;

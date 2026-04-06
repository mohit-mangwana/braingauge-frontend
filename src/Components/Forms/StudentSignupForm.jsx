import { useState } from "react";
import InputField from "../InputFields";
import myLogo from "../../assets/high-resolution-color-logo (2).png";



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
     <div className="w-full flex items-center justify-center lg:justify-start mb-6">
              <img
                src={myLogo}
                className="w-54 h-14 object-cover rounded-full"
                alt="Logo"
              />
            </div>
      <div className="w-full bg-blue-800">
        <div className="lg:text-left md:text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
           Let’s get you onboarded!
          </h2>
    <p className="mb-2 text-gray-500">Create your Qollabb account to begin your project journey.</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mt-4 lg:w-5xl bg-green-900"
          >
            <div className=" flex relative gap-8 justify-between items-center">
              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="Work/Official Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex relative justify-between items-center">
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

            <div className="flex relative justify-between items-center">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--color-primary)] text-white p-3 rounded-lg font-semibold"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <div className="text-center mt-2">
              <p className="text-gray-600 text-sm">
                Already a member ?{" "}
                <a
                  href="#"
                  className="text-[var(--color-primary)] font-semibold hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentSignupForm;

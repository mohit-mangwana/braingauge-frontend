import { useState } from "react";
import InputField from "../InputFields";
import {Link} from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    
      <div className="lg:text-left md:text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Login</h2>
        <p className="mb-2 text-gray-500">
          Welcome back! please login into your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <div className="relative">
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

            <Link
              href="#"
              className="absolute right-0 top-0 text-sm text-[var(--color-primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-lt)] shadow-lg cursor-pointer text-white p-3 rounded-lg transition font-semibold disabled:bg-[var(--color-primary)]"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="relative flex items-center py-2 mt-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
              or continue with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            GOOGLE
          </button>

          <div className="text-center mt-2">
            <p className="text-gray-600 text-sm">
              Do not have an account? Sign Up as
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                to="/onboard/student"
                className="text-[var(--color-primary)] font-semibold hover:underline"
              >
                Student
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/signup/teacher"
                className="text-[var(--color-primary)] font-semibold hover:underline"
              >
                Teacher
              </Link>
            </div>
            <div className="w-full mt-2 text-center text-gray-500 text-sm pointer-events-none">
              &copy; {new Date().getFullYear()} Braingauge. All rights reserved.
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;

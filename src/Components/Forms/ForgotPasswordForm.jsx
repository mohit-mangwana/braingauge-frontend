import { useState } from "react";
import InputField from "../InputFields";

const ForgotPasswordForm = () => {
  const [form, setForm] = useState({
    email: "",
  });

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
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        Forgot Password?
      </h2>
      <p className="mb-2 text-gray-500">
        Enter the email address you used when you joined and we'll send you
        instructions to reset your password.
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[var(--color-primary)] text-white p-3 rounded-lg font-semibold"
        >
          {loading ? "Sending instructions..." : "Send Instructions"}
        </button>
        <div className="p-2 text-center">
          <a
            href="#"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Back to Login
          </a>
        </div>

        <div className="w-full mt-2 text-center text-gray-500 text-sm pointer-events-none">
          &copy; {new Date().getFullYear()} Braingauge. All rights reserved.
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;

import React from 'react'
import ForgotPasswordForm from '../Components/Forms/ForgotPasswordForm'
import AuthLayout from '../Components/AuthLayout'
import myLogo from "../assets/high-resolution-color-logo (2).png";

const features = [
  {
    icon: "✅",
    text: "Secure recovery process",
  },
  {
    icon: "✅",
    text: "Instant email verification",
  },
  {
    icon: "✅",
    text: "24/7 Support assistance",
  },
];

export default function ForgotPassword() {
  return (
    <div>
     <AuthLayout
      logo={myLogo}
      title="Recover Your"
      highlight="Account Access."
      features={features}
      description="Don't worry, it happens to the best of us. Enter your email and we'll help you reset your password.."
    >
      <ForgotPasswordForm />
    </AuthLayout>
    </div>
  )
}

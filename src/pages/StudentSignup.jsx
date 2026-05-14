import StudentSignupForm from "../Components/Forms/StudentSignupForm";
import AuthLayout from "../Components/AuthLayout";
import { Helmet } from "react-helmet-async";

export default function StudentSignup() {
  return (
    <>
      <Helmet>
        <title>Sign Up to Braingauge | Student Account</title>
        <meta name="description" content="Create your account on Brainguage" />
      </Helmet>

      <AuthLayout
        showLeft={false}
      >
        <StudentSignupForm/>
      </AuthLayout>
    </>
  );
}

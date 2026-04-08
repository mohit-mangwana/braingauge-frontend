import TeacherSignupForm from '../Components/Forms/TeacherSignupForm';
import AuthLayout from '../Components/AuthLayout'
import myLogo from "../assets/high-resolution-color-logo (2).png";
import { Helmet } from 'react-helmet-async';

const features = [
  {
    icon: "✅",
    text: "Mentor top-performing students from leading universities and shape their career paths",
  },
  {
    icon: "✅",
    text: "Bridge the gap between academic theory and practical industry requirements",
  },
  {
    icon: "✅",
    text: "Showcase your expertise while managing projects seamlessly through the platform",
  },
];

export default function TeacherSignup() {
  return (
    <>
    <Helmet>
        <title>Sign Up to Braingauge | Teacher Account</title>
        <meta name="description" content="Create your account on Brainguage" />
      </Helmet> 
     <AuthLayout
      logo={myLogo}
      title="Join Our Community"
      highlight="of Expert Educators."
      features={features}
      description="Empower the next generation of talent by guiding students through real-world industry challenges.."
    >
      <TeacherSignupForm />
    </AuthLayout>
    </>
  )
}

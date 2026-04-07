import React from 'react'
import AuthLayout from '../Components/AuthLayout'
import StudentSignupForm from '../Components/Forms/StudentSignupForm'
import { Helmet } from 'react-helmet-async';

export default function StudentSignup() {
  return (
    <div>
    <Helmet>
        <title>Sign Up to Braingauge</title>
        <meta name="description" content="Create your account on Qollabb" />
      </Helmet>
       <AuthLayout
    //   logo={myLogo}
      showLeft={false}
    >
      <StudentSignupForm />
    </AuthLayout>
    </div>
  )
}

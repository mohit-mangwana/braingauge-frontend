import React from 'react'
import AuthLayout from '../Components/AuthLayout'
import StudentSignupForm from '../Components/Forms/StudentSignupForm'

export default function StudentSignup() {
  return (
    <div>
       <AuthLayout
    //   logo={myLogo}
      showLeft={false}
    >
      <StudentSignupForm />
    </AuthLayout>
    </div>
  )
}

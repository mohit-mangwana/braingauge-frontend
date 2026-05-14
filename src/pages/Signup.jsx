import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();

  return (
    // Changed to 100dvh (dynamic viewport height) and reduced outer padding
    <div className="min-h-[100dvh] bg-bg flex items-center justify-center p-4 text-text overflow-hidden">
      <div className="max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8"> {/* Reduced from mb-12 */}
          <div className="flex justify-center mb-4"> {/* Reduced from mb-6 */}
            <div className="w-14 h-14 bg-primary-bg rounded-lg border border-border flex items-center justify-center shadow-sm">
              <FaBrain className="text-primary w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
            Welcome to BrainGauge
          </h1>
          <p className="text-muted text-base max-w-lg mx-auto">
            Join our platform and unlock opportunities. Choose your role to get started.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-stretch max-w-3xl mx-auto">
          
          {/* Student Card */}
          <div className="flex-1 bg-surface rounded-xl border border-border p-6 flex flex-col items-center text-center transition-all hover:border-primary hover:shadow-md hover:-translate-y-1">
            <div className="w-14 h-14 bg-primary-bg text-primary rounded-full flex items-center justify-center mb-4">
              <FaUserGraduate className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-text">Student</h2>
            <p className="text-muted text-sm mb-6 flex-grow">
              Take AI-driven adaptive quizzes, track your performance, and master new concepts at your own pace.
            </p>
            <button 
              onClick={() => navigate('/onboard/student')}
              className="w-full bg-primary text-surface hover:bg-primary-lt font-semibold py-2.5 px-4 rounded-md transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Teacher Card */}
          <div className="flex-1 bg-surface rounded-xl border border-border p-6 flex flex-col items-center text-center transition-all hover:border-primary hover:shadow-md hover:-translate-y-1">
            <div className="w-14 h-14 bg-accent-bg text-accent rounded-full flex items-center justify-center mb-4">
              <FaChalkboardTeacher className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-text">Teacher</h2>
            <p className="text-muted text-sm mb-6 flex-grow">
              Create custom assessments, monitor class progress, and leverage insights to enhance student learning.
            </p>
            <button 
              onClick={() => navigate('/signup/teacher')}
              className="w-full bg-primary text-surface hover:bg-primary-lt font-semibold py-2.5 px-4 rounded-md transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
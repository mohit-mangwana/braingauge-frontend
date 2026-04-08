import { useNavigate } from "react-router-dom";
import myLogo from "../../assets/high-resolution-color-logo (2).png";
import {Helmet} from "react-helmet-async";

const features = [
  {
    text: "Put Your Knowledge to the Ultimate Test! ",
  },
  {
    text: "Challenge Yourself with Braingauge's Engaging Quizzes and Interactive Learning. Unleash Your Potential and Elevate Your Skills Today!",
  },
  {
    text: "Experience a new standard of assessment with AI-powered quizzes designed to measure your true potential. Challenge yourself with dynamic content that adapts to your skill level, ensuring every session is both a rigorous test and a valuable learning opportunity.",
  },
];

const Onboard = () => {
  
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
        <title>Welcome to Braingauge</title>
        <meta name="description" content="Discover the future of learning with our AI-powered quizzes." />
    </Helmet>
      <div className="min-h-screen overflow-hidden bg-[var(--color-bg)] relative flex items-start justify-center p-6 md:px-16">
        <div className=" bg-[var(--color-surface)] shadow-xl border border-[var(--color-border)] rounded-xl flex flex-col items-start justify-center w-full h-full p-3 md:py-8 md:px-12">
          <div className="content-section text-start p-3">
           <div className="logo-section">
            <img
              src={myLogo}
              alt="Logo"
              className="w-46 h-14 md:w-64 object-cover rounded-full mb-6"
            />
          </div> 
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              👋🏻 Welcome to Braingauge!
            </h1>
            <p className="text-lg mb-4">
              Discover the future of learning with our AI-powered quizzes.
            </p>
            {features.length > 0 && (
              <ul className="flex flex-col gap-4 items-start text-[var(--color-text)]">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <p>{feature.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-center mt-2">
              <div className="flex justify-start gap-2 mt-4">
                <p className="text-[var(--color-primary)] font-semibold">
                  Real Challenges
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-[var(--color-primary)] font-semibold">
                  Real Insights
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-[var(--color-primary)] font-semibold">
                  Real Growth
                </p>
              </div>
            </div>

            <div className="mt-12">
              <button
                type="button"
                onClick={() => navigate("/signup/student")}
                className=" mt-4 bg-[var(--color-primary)] shadow-lg text-white p-3 px-6 rounded-md cursor-pointer hover:bg-[var(--color-primary-lt)] transition font-semibold disabled:bg-[var(--color-primary)]"
              >
                 Let's Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboard;

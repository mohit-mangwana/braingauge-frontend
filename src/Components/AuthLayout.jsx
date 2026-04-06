const AuthLayout = ({
  logo,
  title,
  highlight,
  description,
  features = [],
  showLeft = true,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white flex items-start justify-center overflow-y-auto">
      <div
        className={`flex w-full max-w-7xl mx-auto p-4 ${
          showLeft ? "flex-col lg:flex-row gap-12 lg:gap-6" : "justify-center"
        }`}
      >
        {/* LEFT SECTION */}
        {showLeft && (
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            {/* Logo */}
            <div className="w-full flex items-center justify-center lg:justify-start">
              <img
                src={logo}
                className="w-64 h-14 object-cover rounded-full"
                alt="Logo"
              />
            </div>

            {/* Text Content */}
            <div className="hidden md:block mt-10 lg:mt-20 font-medium text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {title}{" "}
                {highlight && (
                  <span className="text-[var(--color-primary)]">
                    {highlight}
                  </span>
                )}
              </h1>

              {description && (
                <p className="w-full lg:w-3/4 mt-6 mb-6 text-lg text-gray-600">
                  {description}
                </p>
              )}

              {features.length > 0 && (
                <ul className="flex flex-col gap-4 items-center lg:items-start">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.icon && (
                        <span className="text-2xl mr-3">{feature.icon}</span>
                      )}
                      <p>{feature.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* RIGHT SECTION */}
        <div
          className={`w-full flex flex-col items-center justify-center ${
            showLeft ? "lg:w-1/2 lg:items-end" : "w-full"
          }`}
        >
          <div className="w-full bg-green-800 lg:w-full p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

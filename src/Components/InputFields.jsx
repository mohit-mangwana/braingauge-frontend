const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  rightElement,
  error,
  touched,
}) => {
  const showError = error && touched;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block mb-2 font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full p-3 border rounded-lg bg-[var(--color-primary-bg)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
            focus:shadow-lg
            ${showError ? "border-red-500" : "border-[var(--color-border)]"}
          `}
        />

        {/* Right Element */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
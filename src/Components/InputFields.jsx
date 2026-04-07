const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  rightElement, // e.g. show/hide password button
}) => {
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
          className="w-full p-3 border bg-[var(--color-primary-bg)] border-[var(--color-border)] rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] 
                     focus:shadow-lg"
        />

        {/* Right Element (like show/hide password) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
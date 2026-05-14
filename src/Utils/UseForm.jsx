import { useState } from "react";

const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);

    // mark as touched
    // setTouched((prev) => ({
    //   ...prev,
    //   [name]: true,
    // }));

    // validate live
    const validationErrors = validate(updatedValues);
    setErrors(validationErrors);
  };

  // handle blur
  const handleBlur = (e) => {
  const { name } = e.target;

  setTouched((prev) => ({
    ...prev,
    [name]: true,
  }));
};

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(values);

     console.log("Validation errors:", validationErrors); // ← add this
  console.log("Values:", values); 
    setErrors(validationErrors);

    // mark all as touched
    const allTouched = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

export default useForm;
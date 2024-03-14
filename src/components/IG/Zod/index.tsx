import React from "react";
import { useState } from "react";





import { z } from "zod";
import yup from 'yup'


// Schema Definition

// Primitive Value
const firstName = z.string()

// Object Value
const User = z.object({
  firstName: z.string().max(10).min(4),
  lastName: z.string().min(1),
  email: z.string().email(),
})

const UserYup = yup.object({
  firstName: yup.string().max(10).min(4),
  lastName: yup.string().min(1),
  email: yup.string().email(),
})


const FormComponent = () => {












  type ZodInfer = z.infer<typeof User>






  type YupInfer = yup.InferType<typeof UserYup>






  const [formDataZod, setFormDataZod] = useState<ZodInfer>({
    firstName: "",
    lastName: "",
    email: "",
  });




  const [formData, setFormData] = useState<YupInfer>({
    firstName: "",
    lastName: undefined,
    email: "",
  });






  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
  });

  // console.log('debug errors', errors);

































  const handleChange = (e) => {
    const { name, value } = e.target;

    const dataComing = {
      ...formData,
      [name]: value
    }

    setFormData(dataComing)

    // VALIDATION START
    const result = User.safeParse(dataComing)

    if (!result.success) {
      const errorData = result.error.format();
      const currentError = errorData[name]._errors.join(", ")
      setErrors({
        ...errors,
        [name]: currentError,
      });
    }

    // VALIDATION END

  }










  const handleChangex = (e) => {
    const { name, value } = e.target.value;

    let error = "";

    if (name === "firstName" && value === null) {
      error = "First Name is Required";
    }

    if (name === "firstName" && value.length < 10) {
      error = "First Name max 10 character";
    }

    if (name === "lastName" && value === null) {
      error = "Last Name is Required";
    }

    if (name === "email") {
      if (value === null) {
        error = "Email is Required";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        error = "Invalid email";
      }
    }

    setErrors({
      ...errors,
      [name]: error,
    });
  };







  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform additional actions on form submission
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div> */}

      {/* <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div> */}

      <div>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {/* <div>
        <label htmlFor="phone">Phone: </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.email}</span>}
      </div> */}


      {/* <button type="submit">Submit</button> */}
    </form>
  );
};

export default FormComponent;

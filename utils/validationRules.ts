export const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Enter a valid email address",
    },
  },

  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
  },

  required: (fieldName: string = "This field") => ({
    required: `${fieldName} is required`,
  }),
};

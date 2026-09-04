const result = (isValid, errorMessage = "") => ({ isValid, errorMessage });

// EMAIL
export const validateEmail = (email) => {
  if (!email) return result(false, "Email is required");

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  return isValid
    ? result(true)
    : result(false, "Enter a valid email address");
};

// PHONE
export const validatePhone = (phone) => {
  if (!phone) return result(false, "Phone number is required");

  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.length < 10 || cleaned.length > 15) {
    return result(false, "Phone must be between 10–15 digits");
  }

  return result(true);
};

// ZIP
export const validateZip = (zip) => {
  if (!zip) return result(false, "ZIP/Postal code is required");

  const isValid =
    /^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zip);

  return isValid
    ? result(true)
    : result(false, "Enter a valid ZIP/Postal code");
};

// PASSWORD (enhanced with specific error messages)
export const validatePassword = (password) => {
  if (!password) return result(false, "Password is required");

  if (password.length < 9 ) {
    return result(false, "Password must be 9–20 characters long");
  }

  if (!/[a-z]/.test(password)) {
    return result(false, "Password must include at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    return result(false, "Password must include at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    return result(false, "Password must include at least one number");
  }

  if (!/[@$!%*?&]/.test(password)) {
    return result(false, "Password must include at least one special character (@$!%*?&)");
  }

  return result(true);
};

export const validateConfirmEmail = (confirmEmail, formData) => {
  if (!confirmEmail) return result(false, "Please confirm your email");

  if (confirmEmail !== formData.email) {
    return result(false, "Emails do not match");
  }

  return result(true);
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === "") {
    return result(false, `${fieldName} is required`);
  }

  return result(true);
};
export const validateOperationHoursEnd = (endTime, formData) => {
  if (!endTime) return result(false, "End time is required");

  const startTime = formData.operationHoursStart;

  if (!startTime) return result(false, "Start time is required");

  if (endTime <= startTime) {
    return result(false, "Closing time must be after opening time");
  }

  return result(true);
};
export const validateOperationHoursStart = (startTime) => {
  if (!startTime) return result(false, "Start time is required");
  return result(true);
};
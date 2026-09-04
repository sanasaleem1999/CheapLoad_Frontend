import { validateRequired,validateEmail,validateOperationHoursStart,validateConfirmEmail,validateOperationHoursEnd, validatePassword, validateZip, validatePhone } from "../../Utils/DataValidation";

// export const signupvalidationMap = {
//     email: validateEmail,
//     password: validatePassword,
//     zipCode: validateZip,
//     businessPhone: validatePhone
// }

export const signupvalidationMap = {
  name: (val) => validateRequired(val, "Name"),
  email: validateEmail,
  confirmEmail: validateConfirmEmail,
  password: validatePassword,
  businessType: (val) => validateRequired(val, "Business type"),
  companyLegalName: (val) => validateRequired(val, "Company legal name"),
  country: (val) => validateRequired(val, "Country"),
  state: (val) => validateRequired(val, "State"),
  city: (val) => validateRequired(val, "City"),
  companyAddress: (val) => validateRequired(val, "Company address"),
  zipCode: validateZip,
  operationHoursStart: validateOperationHoursStart,
  operationHoursEnd: validateOperationHoursEnd,
  businessPhone: validatePhone,
};
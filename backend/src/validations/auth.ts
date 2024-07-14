import * as EmailValidator from "email-validator";

export function validateEmail(email: string) {
  return EmailValidator.validate(email);
}

export function validatePassword(password: string) {
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}

export function validateName(name: string) {
  if (name && name.trim().length === 0) {
    return false;
  } else {
    return true;
  }
}

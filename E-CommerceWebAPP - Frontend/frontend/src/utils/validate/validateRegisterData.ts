import { userRole } from "../../types/UserType";

interface FormErrors {
  [key: string]: string;
}

export const validateRegistrationData = (formData: any, userRole: userRole): FormErrors => {
  const errors: FormErrors = {};

  
  const isEmpty = (value: string) => !value || value.trim() === '';

 
  if (isEmpty(formData.email)) {
    errors.email = 'Email is required';
  } 


  if (isEmpty(formData.password)) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  if (isEmpty(formData.confirm_password)) {
    errors.confirm_password = 'Confirm password is required';
  }else if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }

  if (userRole === 'customer') {
    
    if (isEmpty(formData.first_name)) {
      errors.first_name = 'First name is required';
    }
    if (isEmpty(formData.last_name)) {
      errors.last_name = 'Last name is required';
    }
  } else if (userRole === 'distributor') {
   
    if (isEmpty(formData.name)) {
      errors.name = 'Company name is required';
    }
    if (isEmpty(formData.CUI)) {
      errors.CUI = 'CUI is required';
    }
    if (isEmpty(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    
    if (formData.address) {
      if (isEmpty(formData.address.country)) {
        errors['address.country'] = 'Country is required';
      }
      if (isEmpty(formData.address.county)) {
        errors['address.county'] = 'County is required';
      }
      if (isEmpty(formData.address.city)) {
        errors['address.city'] = 'City is required';
      }
      if (isEmpty(formData.address.street)) {
        errors['address.street'] = 'Street is required';
      }
      if (isEmpty(formData.address.number)) {
        errors['address.number'] = 'Street number is required';
      }
      if (isEmpty(formData.address.zip)) {
        errors['address.zip'] = 'ZIP code is required';
      }
    } else {
      errors.address = 'Address information is required';
    }
  }

  return errors;
};
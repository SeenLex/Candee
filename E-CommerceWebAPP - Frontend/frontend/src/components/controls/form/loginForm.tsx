import React, { useState } from 'react';
import Button from '../button/button';
import FormField from './form-field';
import { NavLink } from 'react-router-dom';
import { validateLoginData } from '../../../utils/validate/validateLoginData';
import toast from 'react-hot-toast';

interface LoginFormProps {
    onSubmit: (data: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});


  const handleChange = (field: keyof typeof formData) => (value: string | boolean) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors: any) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLoginData(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(validationErrors[Object.keys(validationErrors)[0]]);
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange('email')}
        icon="email"
      />
      <FormField
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange('password')}
        icon="key"
        showVisibilityIcon
      />
    
      <Button
        text="Login"
        type="submit"
        disabled={!formData.email || !formData.password}
      />

    </form>
  );
};

export default LoginForm;
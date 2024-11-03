import React, { useState } from 'react';
import Button from '../button/button';
import FormField from './form-field';
import { NavLink } from 'react-router-dom';
import { userRole } from '../../../types/UserType';
import { validateRegistrationData } from '../../../utils/validate/validateRegisterData';
import { toast } from 'react-hot-toast';
interface RegisterFormProps {
  onSubmit: (data: any) => void;
  userRole: userRole;

}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, userRole }) => {
  const [formData, setFormData] = useState<any>({});
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string) => (value: string | boolean) => {
    setFormData((prevData: any) => ({ ...prevData, [field]: value }));
   
    setErrors((prevErrors: any) => ({ ...prevErrors, [field]: undefined }));
  }

  const handleAddressChange = (field: string) => (value: string | boolean) => {
    setFormData((prevData: any) => ({
      ...prevData,
      address: { ...prevData.address, [field]: value }
    }));
    
    setErrors((prevErrors: any) => ({ ...prevErrors, [`address.${field}`]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegistrationData(formData, userRole);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(validationErrors[Object.keys(validationErrors)[0]]);
      setErrors(validationErrors);
    
    } else {
      onSubmit(formData);
    }
  };

  const isDistributor = userRole === 'distributor';

  return (
    <form onSubmit={handleSubmit}>
      {isDistributor ? (
        <div className="distributor-form-grid">
          <div className="distributor-form-column">
            <FormField
              type="text"
              placeholder="Company Name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              icon="business"
            />
            <FormField
              type="text"
              placeholder="CUI"
              value={formData.CUI || ''}
              onChange={handleChange('CUI')}
              icon="description"
            />
            <FormField
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber || ''}
              onChange={handleChange('phoneNumber')}
              icon="phone"
            />
            <FormField
              type="email"
              placeholder="Your Email"
              value={formData.email || ''}
              onChange={handleChange('email')}
              icon="email"
            />
            <FormField
              type="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleChange('password')}
              icon="key"
              showVisibilityIcon
            />
            <FormField
              type="password"
              placeholder="Confirm Password"
              value={formData.confirm_password || ''}
              onChange={handleChange('confirm_password')}
              icon="key"
              showVisibilityIcon
            />
            
          </div>
          <div className="distributor-form-column">
            <FormField
                type="text"
                placeholder="Country"
                value={formData.address?.country || ''}
                onChange={handleAddressChange('country')}
                  icon='flag'
              />
              <FormField
                type="text"
                placeholder="County"
                value={formData.address?.county || ''}
                onChange={handleAddressChange('county')}
                icon="county"
            
              />
              <FormField
                type="text"
                placeholder="City"
                value={formData.address?.city || ''}
                onChange={handleAddressChange('city')}
                icon="city"
              />
            <FormField
              type="text"
              placeholder="Street"
              value={formData.address?.street || ''}
              onChange={handleAddressChange('street')}
              icon="street"
            />
            <FormField
              type="text"
              placeholder="Number"
              value={formData.address?.number || ''}
              onChange={handleAddressChange('number')}
              icon="pin"
            />
            <FormField
              type="text"
              placeholder="Zip"
              value={formData.address?.zip || ''}
              onChange={handleAddressChange('zip')}
              icon="mailbox"
            />
            
            
          </div>
        </div>
      ) : (
        <>
          <FormField
            type="text"
            placeholder="First Name"
            value={formData.first_name || ''}
            onChange={handleChange('first_name')}
            icon="person"
          />
          <FormField
            type="text"
            placeholder="Last Name"
            value={formData.last_name || ''}
            onChange={handleChange('last_name')}
            icon="person"
          />
          <FormField
            type="email"
            placeholder="Your Email"
            value={formData.email || ''}
            onChange={handleChange('email')}
            icon="email"
          />
          <FormField
            type="password"
            placeholder="Password"
            value={formData.password || ''}
            onChange={handleChange('password')}
            icon="key"
            showVisibilityIcon
          />
          <FormField
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password || ''}
            onChange={handleChange('confirm_password')}
            icon="key"
            showVisibilityIcon
          />
        </>
      )}
      <div className='form-group'>
        <input
          type="checkbox"
          id="terms"
          checked={terms}
          onChange={() => setTerms(!terms)}
        />
        <label htmlFor="terms">I agree to the 
          <NavLink to="/terms"> Terms of Service</NavLink> and
          <NavLink to="/privacy"> Privacy Policy</NavLink>
        </label>
      </div>
       <div className='form-button'>
        <Button
          disabled={!terms}
          text="Sign Up"
          type="submit"
        />
       
      </div>
     
    </form>
  );
};

export default RegisterForm;
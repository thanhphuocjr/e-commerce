import React, { useState } from 'react';
import { apiRegister } from '../../../Api/auth';
import { showAlert } from '../../../Helper/alert';
import {
  validateEmail,
  validatePassword,
  validateFullName,
} from '../../../Helper/validation';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import PasswordRequirements from './PasswordRequirements';
import SocialLogin from './SocialLogin';

const RegisterForm = ({ setAlert, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation for password
    if (name === 'password' && value) {
      const { isValid } = validatePassword(value);
      setFieldErrors((prev) => ({
        ...prev,
        password: isValid ? '' : 'Password must meet all requirements below',
      }));
    }

    // Real-time validation for confirm password
    if (name === 'confirmPassword' && value) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? 'Passwords do not match!' : '',
      }));
    }

    // Clear other field errors
    if (
      name !== 'password' &&
      name !== 'confirmPassword' &&
      fieldErrors[name]
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    // Validate full name
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required!';
      hasErrors = true;
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName =
        'Full name can only contain letters, spaces, hyphens, apostrophes, and dots!';
      hasErrors = true;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required!';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address!';
      hasErrors = true;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required!';
      hasErrors = true;
    } else {
      const { isValid } = validatePassword(formData.password);
      if (!isValid) {
        newErrors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!';
        hasErrors = true;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required!';
      hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
      hasErrors = true;
    }

    // Check terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service!';
      hasErrors = true;
    }

    setFieldErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert(
        setAlert,
        'error',
        'Please fix the errors below and try again.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRegister({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response);
      showAlert(setAlert, 'success', 'Registration successful!');

      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false,
        });
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const responseMessage = error.response.data?.message || '';
        const responseError = error.response.data?.error || '';

        switch (status) {
          case 422:
            if (
              responseMessage.includes('Email has already exists') ||
              responseError.includes('Email has already exists')
            ) {
              errorMessage = 'An account with this email already exists!';
            } else {
              errorMessage =
                responseMessage || 'Please check your input and try again.';
            }
            break;
          case 400:
            if (
              responseMessage.includes('Email') ||
              responseMessage.includes('email')
            ) {
              errorMessage = 'Email address is invalid or already in use.';
            } else {
              errorMessage =
                responseMessage ||
                'Invalid request. Please check your information.';
            }
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage =
              responseMessage ||
              responseError ||
              'An unexpected error occurred.';
        }
      } else if (error.request) {
        errorMessage =
          'Unable to connect to server. Please check your internet connection.';
      }

      showAlert(setAlert, 'error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="register-form-grid">
        {/* Left Column */}
        <div className="register-left-col">
          <FormInput
            label="Full Name"
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Ex: Nguyen Thanh Phuoc"
            value={formData.fullName}
            onChange={handleInputChange}
            error={fieldErrors.fullName}
            disabled={isLoading}
            required
          />

          <FormInput
            label="Email address"
            type="email"
            id="email"
            name="email"
            placeholder="Ex: thanhphuoc@example.com"
            value={formData.email}
            onChange={handleInputChange}
            error={fieldErrors.email}
            disabled={isLoading}
            required
          />
        </div>

        {/* Right Column */}
        <div className="register-right-col">
          <PasswordInput
            label="Password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            error={fieldErrors.password}
            disabled={isLoading}
            required
          />

          {formData.password && (
            <PasswordRequirements password={formData.password} />
          )}

          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={fieldErrors.confirmPassword}
            disabled={isLoading}
            required
            showMatchError={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
            }
          />
        </div>
      </div>

      {/* Terms and Privacy */}
      <div className="form-check ml-2 mb-2">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          className={`form-check-input signin-checkbox ${
            fieldErrors.agreeTerms ? 'error' : ''
          }`}
          checked={formData.agreeTerms}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
        <label htmlFor="agreeTerms" className="form-check-label ml-3">
          I agree to the{' '}
          <a href="#" className="link-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="link-primary">
            Privacy Policy
          </a>{' '}
          *
        </label>
        {fieldErrors.agreeTerms && (
          <small className="text-danger d-block mt-1">
            {fieldErrors.agreeTerms}
          </small>
        )}
      </div>

      <button
        type="submit"
        className="btn signin-button w-100 register-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <SocialLogin disabled={isLoading} buttonText="Sign up with Google" />
    </form>
  );
};

export default RegisterForm;

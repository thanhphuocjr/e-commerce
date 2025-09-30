import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiLogin, getRefreshToken, getToken } from '../../../Api/auth';
import { showAlert } from '../../../Helper/alert';
import { validateEmail } from '../../../Helper/validation';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';

const LoginForm = ({ setAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    if (!formData.email) {
      newErrors.email = 'Email is required!';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address!';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required!';
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
        'Please fix the errors above and try again.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiLogin(formData.email, formData.password);

      if (response.data.accessToken && response.data.refreshToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      showAlert(setAlert, 'success', 'Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const responseMessage = error.response.data?.message || '';

        switch (status) {
          case 401:
            if (responseMessage.includes('Account does not exists')) {
              errorMessage = 'No account found with this email address.';
            } else if (responseMessage.includes('Password is not correct')) {
              setFormData((prev) => ({ ...prev, password: '' }));
              errorMessage = 'Incorrect password. Please try again.';
            } else if (responseMessage.includes('Account inactive')) {
              errorMessage =
                'Your account is inactive. Please contact support.';
            } else {
              errorMessage =
                'Invalid email or password. Please check your credentials.';
            }
            break;
          case 422:
            errorMessage = 'Please check your input and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = responseMessage || 'An unexpected error occurred.';
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
      <FormInput
        label="Email address"
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={fieldErrors.email}
        disabled={isLoading}
        required
      />

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

      <button
        type="submit"
        className="btn signin-button w-100"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Logging in...
          </>
        ) : (
          'Log in'
        )}
      </button>

      <div className="text-center mt-3">
        <Link to="/forgot-password" className="forgot-password">
          Lost your password?
        </Link>
      </div>

      <SocialLogin disabled={isLoading} buttonText="Sign in with Google" />
    </form>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import './SignIn.scss';
import { Link } from 'react-router-dom';

//Open eyes
import { FaRegEye } from 'react-icons/fa';
//Close eyes
import { IoMdEyeOff } from 'react-icons/io';
// Import your API login function (adjust the path as needed)
import {
  apiLogin,
  apiRegister,
  getRefreshToken,
  getToken,
} from '../../Api/auth';
import { showAlert } from '../../Helper/alert';
const SignIn = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',

    regEmail: '',
    regPassword: '',
    regConfirmPassword: '',
    fullName: '',
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',

    regPassword: '',
    regConfirmPassword: '',
    fullName: '',
    agreeTerms: '',
  });

  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const isValid = Object.values(requirements).every((req) => req);
    return { requirements, isValid };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Real-time password validation for register password
    if (name === 'regPassword' && value) {
      const { isValid } = validatePassword(value);
      if (!isValid) {
        setFieldErrors((prev) => ({
          ...prev,
          regPassword: 'Password must meet all requirements below',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          regPassword: '',
        }));
      }
    }

    // Real-time validation for confirm password
    if (name === 'regConfirmPassword' && value) {
      if (value !== formData.regPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          regConfirmPassword: 'Passwords do not match!',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          regConfirmPassword: '',
        }));
      }
    }

    // Clear other field errors when user starts typing
    if (
      fieldErrors[name] &&
      name !== 'regPassword' &&
      name !== 'regConfirmPassword'
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Hide alert when user starts interacting
    if (alert.show) {
      setAlert({ show: false, type: 'info', message: '' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear previous errors and alerts
    setFieldErrors({
      email: '',
      password: '',
      regEmail: '',
      regPassword: '',
      regConfirmPassword: '',
      fullName: '',
      agreeTerms: '',
    });
    setAlert({ show: false, type: 'info', message: '' });

    let hasErrors = false;
    const newErrors = {};

    // Validate required fields
    if (!formData.email) {
      newErrors.email = 'Email is required!';
      hasErrors = true;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required!';
      hasErrors = true;
    }

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address!';
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      setAlert({
        show: true,
        type: 'error',
        message: 'Please fix the errors above and try again.',
      });
      setIsLoading(false);
      return;
    }

    console.log('Da di dc den day login......');

    // In your SignIn.jsx file, replace the error handling in handleLoginSubmit with this:

    try {
      const response = await apiLogin(formData.email, formData.password);
      console.log('response LOGIN :', response);

      if (response.data.accessToken && response.data.refreshToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      console.log('accessToken: ', getToken());
      console.log('refreshToken: ', getRefreshToken());
      console.log('user: ', JSON.stringify(response.data.user));

      setAlert({
        show: true,
        type: 'success',
        message: 'Login successful! Redirecting...',
      });

      // Redirect after success
      setTimeout(() => {
        setAlert({ show: false, type: 'info', message: '' });
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error types based on status codes and response data
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        console.log('error.response :', error.response);
        const status = error.response.status;
        const responseMessage = error.response.data?.message || '';

        switch (status) {
          case 401:
            // Check the actual error message from server
            if (
              responseMessage.includes('Account does not exists') ||
              responseMessage.includes('not found')
            ) {
              errorMessage = 'No account found with this email address.';
            } else if (
              responseMessage.includes('Password is not correct') ||
              responseMessage.includes('password')
            ) {
              setFormData((prev) => ({ ...prev, password: '' }));
              errorMessage = 'Incorrect password. Please try again.';
            } else if (
              responseMessage.includes('Account inactive') ||
              responseMessage.includes('inactive')
            ) {
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
        // Network error
        errorMessage =
          'Unable to connect to server. Please check your internet connection.';
      }

      showAlert(setAlert, 'error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear previous errors and alerts
    setFieldErrors({
      email: '',
      password: '',
      regEmail: '',
      regPassword: '',
      regConfirmPassword: '',
      fullName: '',
      agreeTerms: '',
    });
    setAlert({ show: false, type: 'info', message: '' });

    let hasErrors = false;
    const newErrors = {};

    // Validate required fields
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required!';
      hasErrors = true;
    }
    if (!formData.regEmail) {
      newErrors.regEmail = 'Email is required!';
      hasErrors = true;
    }
    if (!formData.regPassword) {
      newErrors.regPassword = 'Password is required!';
      hasErrors = true;
    }
    if (!formData.regConfirmPassword) {
      newErrors.regConfirmPassword = 'Confirm password is required!';
      hasErrors = true;
    }

    // Validate full name (letters with accents, spaces, and common punctuation)
    // eslint-disable-next-line no-useless-escape
    const nameRegex = /^[\p{L}\s\-'\.]+$/u;
    if (formData.fullName && !nameRegex.test(formData.fullName)) {
      newErrors.fullName =
        'Full name can only contain letters, spaces, hyphens, apostrophes, and dots!';
      hasErrors = true;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.regEmail && !emailRegex.test(formData.regEmail)) {
      newErrors.regEmail = 'Please enter a valid email address!';
      hasErrors = true;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.regPassword && !passwordRegex.test(formData.regPassword)) {
      newErrors.regPassword =
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!';
      hasErrors = true;
    }

    // Validate passwords match
    if (
      formData.regPassword &&
      formData.regConfirmPassword &&
      formData.regPassword !== formData.regConfirmPassword
    ) {
      newErrors.regConfirmPassword = 'Passwords do not match!';
      hasErrors = true;
    }

    // Check terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service!';
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      setAlert({
        show: true,
        type: 'error',
        message: 'Please fix the errors bottom and try again.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call register API
      console.log('Start call api Register');
      const response = await apiRegister({
        fullName: formData.fullName,
        email: formData.regEmail, // Map regEmail to email
        password: formData.regPassword, // Map regPassword to password
        // agreeTerms and agreeMarketing removed as backend doesn't handle them
      });

      console.log('Registration successful:', response);

      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: 'Registration successful!',
      });

      // Clear form after successful registration
      setTimeout(() => {
        setFormData({
          email: '',
          password: '',
          regEmail: '',
          regPassword: '',
          regConfirmPassword: '',
          fullName: '',
          agreeTerms: false,
          agreeMarketing: false,
        });
        setAlert({ show: false, type: 'info', message: '' });
        setActiveTab('login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);

      let errorMessage = 'Registration failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const responseMessage = error.response.data?.message || '';
        const responseError = error.response.data?.error || '';

        console.log('Status:', status);
        console.log('Response message:', responseMessage);
        console.log('Response error:', responseError);

        switch (status) {
          case 422:
            // Unprocessable Entity - validation errors
            if (
              responseMessage.includes('Email has already exists') ||
              responseMessage.includes('already exists') ||
              responseError.includes('Email has already exists')
            ) {
              errorMessage = 'An account with this email already exists!';
            } else {
              errorMessage =
                responseMessage || 'Please check your input and try again.';
            }
            break;
          case 400:
            // Bad Request
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
        // Network error
        errorMessage =
          'Unable to connect to server. Please check your internet connection.';
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }

      showAlert(setAlert, 'error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Google login logic
    setAlert({
      show: true,
      type: 'info',
      message: 'Google login !',
    });

    setTimeout(() => {
      setAlert({ show: false, type: 'info', message: '' });
    }, 3000);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <section className="section signin-section">
      <div className="container">
        <div className="row justify-content-center">
          <div
            className={`${
              activeTab === 'login'
                ? 'col-lg-5 col-md-7 col-sm-9'
                : 'col-lg-7 col-md-9 col-sm-11'
            }`}
          >
            <div className="signin-container">
              {/* Alert Section */}
              {alert.show && (
                <div
                  className={`alert alert-${
                    alert.type === 'error' ? 'danger' : alert.type
                  } alert-dismissible fade show`}
                >
                  {alert.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setAlert({ show: false, type: 'info', message: '' })
                    }
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Tab Container */}
              <div className="tab-container">
                <div
                  className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  LOGIN
                </div>
                <div
                  className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  REGISTER
                </div>
              </div>

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group mb-4">
                    <label htmlFor="email" className="form-label">
                      Email address *
                    </label>
                    <input
                      placeholder="Enter your email"
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control signin-input ${
                        fieldErrors.email ? 'error' : ''
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    {fieldErrors.email && (
                      <small className="text-danger">{fieldErrors.email}</small>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label">
                      Password *
                    </label>
                    <div className="password-input-container">
                      <input
                        placeholder="Enter password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className={`form-control signin-input ${
                          fieldErrors.password ? 'error' : ''
                        }`}
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={togglePassword}
                        disabled={isLoading}
                      >
                        {showPassword ? <FaRegEye /> : <IoMdEyeOff />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <small className="text-danger">
                        {fieldErrors.password}
                      </small>
                    )}
                  </div>

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

                  {/* Google Sign In */}
                  <div className="social-login-section">
                    <div className="divider">
                      <span>Or continue with social account</span>
                    </div>

                    <button
                      type="button"
                      className="btn google-btn w-100"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="google-icon"
                      />
                      Sign in with Google
                    </button>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="register-form-grid">
                    {/* Left Column */}
                    <div className="register-left-col">
                      <div className="form-group mb-3">
                        <label htmlFor="reg-fullname" className="form-label">
                          Full Name *
                        </label>
                        <input
                          placeholder="Ex: Nguyen Thanh Phuoc"
                          type="text"
                          id="reg-fullname"
                          name="fullName"
                          className={`form-control signin-input ${
                            fieldErrors.fullName ? 'error' : ''
                          }`}
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                        {fieldErrors.fullName && (
                          <small className="text-danger">
                            {fieldErrors.fullName}
                          </small>
                        )}
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="reg-email" className="form-label">
                          Email address *
                        </label>
                        <input
                          placeholder="Ex: thanhphuoc@example.com"
                          type="email"
                          id="reg-email"
                          name="regEmail"
                          className={`form-control signin-input ${
                            fieldErrors.regEmail ? 'error' : ''
                          }`}
                          value={formData.regEmail}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                        {fieldErrors.regEmail && (
                          <small className="text-danger">
                            {fieldErrors.regEmail}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="register-right-col">
                      <div className="form-group mb-3">
                        <label htmlFor="reg-password" className="form-label">
                          Password *
                        </label>
                        <div className="password-input-container">
                          <input
                            placeholder="Enter password"
                            type={showPassword ? 'text' : 'password'}
                            id="reg-password"
                            name="regPassword"
                            className={`form-control signin-input ${
                              fieldErrors.regPassword ? 'error' : ''
                            }`}
                            value={formData.regPassword}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={togglePassword}
                            disabled={isLoading}
                          >
                            {showPassword ? <FaRegEye /> : <IoMdEyeOff />}
                          </button>
                        </div>

                        {fieldErrors.regPassword && (
                          <small className="text-danger">
                            {fieldErrors.regPassword}
                          </small>
                        )}

                        {/* Password Requirements Display */}
                        {formData.regPassword && (
                          <div className="password-requirements mt-2">
                            <small className="text-muted d-block mb-1">
                              Password must contain:
                            </small>
                            {(() => {
                              const { requirements } = validatePassword(
                                formData.regPassword
                              );
                              return (
                                <div className="requirements-list">
                                  <small
                                    className={`requirement-item ${
                                      requirements.length
                                        ? 'text-success'
                                        : 'text-danger'
                                    }`}
                                  >
                                    {requirements.length ? '✓' : '✗'} At least 8
                                    characters
                                  </small>
                                  <small
                                    className={`requirement-item ${
                                      requirements.uppercase
                                        ? 'text-success'
                                        : 'text-danger'
                                    }`}
                                  >
                                    {requirements.uppercase ? '✓' : '✗'} One
                                    uppercase letter (A-Z)
                                  </small>
                                  <small
                                    className={`requirement-item ${
                                      requirements.lowercase
                                        ? 'text-success'
                                        : 'text-danger'
                                    }`}
                                  >
                                    {requirements.lowercase ? '✓' : '✗'} One
                                    lowercase letter (a-z)
                                  </small>
                                  <small
                                    className={`requirement-item ${
                                      requirements.number
                                        ? 'text-success'
                                        : 'text-danger'
                                    }`}
                                  >
                                    {requirements.number ? '✓' : '✗'} One number
                                    (0-9)
                                  </small>
                                  <small
                                    className={`requirement-item ${
                                      requirements.special
                                        ? 'text-success'
                                        : 'text-danger'
                                    }`}
                                  >
                                    {requirements.special ? '✓' : '✗'} One
                                    special character (@$!%*?&)
                                  </small>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div className="form-group mb-3">
                        <label
                          htmlFor="reg-confirm-password"
                          className="form-label"
                        >
                          Confirm Password *
                        </label>
                        <div className="password-input-container">
                          <input
                            placeholder="Re-enter password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="reg-confirm-password"
                            name="regConfirmPassword"
                            className={`form-control signin-input ${
                              fieldErrors.regConfirmPassword ? 'error' : ''
                            }`}
                            value={formData.regConfirmPassword}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={toggleConfirmPassword}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <FaRegEye />
                            ) : (
                              <IoMdEyeOff />
                            )}
                          </button>
                        </div>
                        {fieldErrors.regConfirmPassword ? (
                          <small className="text-danger">
                            {fieldErrors.regConfirmPassword}
                          </small>
                        ) : (
                          formData.regConfirmPassword &&
                          formData.regPassword !==
                            formData.regConfirmPassword && (
                            <small className="text-danger">
                              Passwords do not match
                            </small>
                          )
                        )}
                      </div>

                      {fieldErrors.agreeTerms && (
                        <small className="text-danger mb-2 d-block">
                          {fieldErrors.agreeTerms}
                        </small>
                      )}
                    </div>
                  </div>
                  {/* Terms and Privacy */}
                  <div className="form-check ml-2 mb-2 ">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      name="agreeTerms"
                      className={`form-check-input signin-checkbox ${
                        fieldErrors.agreeTerms ? 'error' : ''
                      }`}
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    <label
                      htmlFor="agree-terms"
                      className="form-check-label ml-3"
                    >
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
                  </div>

                  {/* Button spans full width */}
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

                  {/* Google Sign Up */}
                  <div className="social-login-section">
                    <div className="divider">
                      <span>Or continue with social account</span>
                    </div>

                    <button
                      type="button"
                      className="btn google-btn w-100"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="google-icon"
                      />
                      Sign up with Google
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

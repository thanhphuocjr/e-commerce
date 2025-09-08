import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaRegEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import '../SignIn/SignIn.scss';
import { apiResetPassword } from '../../Api/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Error states
  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Alert states
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
  });

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setAlert({
        show: true,
        type: 'error',
        message:
          'Invalid or missing reset token. Please request a new password reset.',
      });
    }
  }, [token]);

  // Real-time password validation
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time password validation
    if (name === 'password' && value) {
      const { isValid } = validatePassword(value);
      if (!isValid) {
        setFieldErrors((prev) => ({
          ...prev,
          password: 'Password must meet all requirements below',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          password: '',
        }));
      }
    }

    // Real-time validation for confirm password
    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match!',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: '',
        }));
      }
    }

    // Clear other field errors when user starts typing
    if (
      fieldErrors[name] &&
      name !== 'password' &&
      name !== 'confirmPassword'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear previous errors and alerts
    setFieldErrors({
      password: '',
      confirmPassword: '',
    });
    setAlert({ show: false, type: 'info', message: '' });

    let hasErrors = false;
    const newErrors = {};

    // Validate required fields
    if (!formData.password) {
      newErrors.password = 'Password is required!';
      hasErrors = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required!';
      hasErrors = true;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!';
      hasErrors = true;
    }

    // Validate passwords match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match!';
      hasErrors = true;
    }

    // Check if token exists
    if (!token) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Invalid or missing reset token.',
      });
      setIsLoading(false);
      return;
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

    try {
      // Simulate API call for reset password

      const result = await apiResetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      console.log(result)
      console.log('Resetting password with token:', token);
      console.log('New password:', formData.password);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: 'Password reset successfully! Redirecting to login...',
      });

      // Clear form
      setFormData({
        password: '',
        confirmPassword: '',
      });

      // Redirect to sign in after success
      setTimeout(() => {
        navigate('/signIn');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);

      if (error.message.includes('Token expired')) {
        setAlert({
          show: true,
          type: 'error',
          message:
            'Reset token has expired. Please request a new password reset.',
        });
      } else if (error.message.includes('Invalid token')) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Invalid reset token. Please request a new password reset.',
        });
      } else {
        setAlert({
          show: true,
          type: 'error',
          message:
            error.message || 'Failed to reset password. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="col-lg-6 col-md-8 col-sm-10">
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

              {/* Header */}
              <div className="signin-header text-center mb-4">
                <h2 className="signin-title">Reset Password</h2>
                <p className="text-muted">Enter your new password below.</p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      placeholder="Enter new password"
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

                  {/* Password Requirements Display */}
                  {formData.password && (
                    <div className="password-requirements mt-2">
                      <small className="text-muted d-block mb-1">
                        Password must contain:
                      </small>
                      {(() => {
                        const { requirements } = validatePassword(
                          formData.password
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
                              {requirements.uppercase ? '✓' : '✗'} One uppercase
                              letter (A-Z)
                            </small>
                            <small
                              className={`requirement-item ${
                                requirements.lowercase
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              {requirements.lowercase ? '✓' : '✗'} One lowercase
                              letter (a-z)
                            </small>
                            <small
                              className={`requirement-item ${
                                requirements.number
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              {requirements.number ? '✓' : '✗'} One number (0-9)
                            </small>
                            <small
                              className={`requirement-item ${
                                requirements.special
                                  ? 'text-success'
                                  : 'text-danger'
                              }`}
                            >
                              {requirements.special ? '✓' : '✗'} One special
                              character (@$!%*?&)
                            </small>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      placeholder="Re-enter new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control signin-input ${
                        fieldErrors.confirmPassword ? 'error' : ''
                      }`}
                      value={formData.confirmPassword}
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
                      {showConfirmPassword ? <FaRegEye /> : <IoMdEyeOff />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword ? (
                    <small className="text-danger">
                      {fieldErrors.confirmPassword}
                    </small>
                  ) : (
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <small className="text-danger">
                        Passwords do not match
                      </small>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  className="btn signin-button w-100 mb-3"
                  disabled={isLoading || !token}
                  style={{
                    backgroundColor: '#f5c842',
                    border: 'none',
                    color: '#000',
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                {/* Back to Sign In Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => navigate('/signIn')}
                    disabled={isLoading}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

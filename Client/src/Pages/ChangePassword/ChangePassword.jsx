// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import '../../Pages/SignIn/SignIn.scss';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import { apiChangePassword } from '../../Api/auth';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'newPassword' && value) {
      const { isValid } = validatePassword(value);
      if (!isValid) {
        setFieldErrors((prev) => ({
          ...prev,
          newPassword: 'Password must meet all requirements below',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          newPassword: '',
        }));
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.newPassword) {
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

    if (
      fieldErrors[name] &&
      name !== 'newPassword' &&
      name !== 'confirmPassword'
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (alert.show) {
      setAlert({ show: false, type: 'info', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setFieldErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setAlert({ show: false, type: 'info', message: '' });

    let hasErrors = false;
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required!';
      hasErrors = true;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required!';
      hasErrors = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required!';
      hasErrors = true;
    }

    if (
      formData.newPassword &&
      !validatePassword(formData.newPassword).isValid
    ) {
      newErrors.newPassword =
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!';
      hasErrors = true;
    }

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match!';
      hasErrors = true;
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        'New password must be different from current password!';
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

    try {
      const response = await apiChangePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      console.log('Change password successful:', response);

      setAlert({
        show: true,
        type: 'success',
        message: 'Password changed successfully! Redirecting to profile...',
      });

      setTimeout(() => {
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setAlert({ show: false, type: 'info', message: '' });
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Change password error:', error);

      if (
        error.message.includes('Current password is incorrect') ||
        error.message.includes('Wrong current password') ||
        error.message.includes('Mat khau hien tai khong dung')
      ) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Current password is incorrect. Please try again.',
        });
      } else if (error.message.includes('New password must be different')) {
        setAlert({
          show: true,
          type: 'error',
          message: 'New password must be different from current password.',
        });
      } else if (error.message.includes('Weak password')) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Password is too weak. Please choose a stronger password.',
        });
      } else if (error.message.includes('No token found')) {
        setAlert({
          show: true,
          type: 'error',
          message: 'Session expired. Please login again.',
        });
        setTimeout(() => {
          navigate('/signIn');
        }, 2000);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: error.message || 'Change password failed. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBack = () => {
    navigate('/profile');
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
              <div className="text-center mb-4">
                <h2 className="signin-title">Change Password</h2>
                <p className="text-muted">Update your account password</p>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="form-group mb-4">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password *
                  </label>
                  <div className="password-input-container">
                    <input
                      placeholder="Enter current password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      className={`form-control signin-input ${
                        fieldErrors.currentPassword ? 'error' : ''
                      }`}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={toggleCurrentPassword}
                      disabled={isLoading}
                    >
                      {showCurrentPassword ? <FaRegEye /> : <IoMdEyeOff />}
                    </button>
                  </div>
                  {fieldErrors.currentPassword && (
                    <small className="text-danger">
                      {fieldErrors.currentPassword}
                    </small>
                  )}
                </div>

                {/* New Password */}
                <div className="form-group mb-4">
                  <label htmlFor="newPassword" className="form-label">
                    New Password *
                  </label>
                  <div className="password-input-container">
                    <input
                      placeholder="Enter new password"
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      className={`form-control signin-input ${
                        fieldErrors.newPassword ? 'error' : ''
                      }`}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={toggleNewPassword}
                      disabled={isLoading}
                    >
                      {showNewPassword ? <FaRegEye /> : <IoMdEyeOff />}
                    </button>
                  </div>

                  {fieldErrors.newPassword && (
                    <small className="text-danger">
                      {fieldErrors.newPassword}
                    </small>
                  )}

                  {/* Password Requirements Display */}
                  {formData.newPassword && (
                    <div className="password-requirements mt-2">
                      <small className="text-muted d-block mb-1">
                        Password must contain:
                      </small>
                      {(() => {
                        const { requirements } = validatePassword(
                          formData.newPassword
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

                {/* Confirm New Password */}
                <div className="form-group mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password *
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
                    formData.newPassword !== formData.confirmPassword && (
                      <small className="text-danger">
                        Passwords do not match
                      </small>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  className="btn signin-button w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back to Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;

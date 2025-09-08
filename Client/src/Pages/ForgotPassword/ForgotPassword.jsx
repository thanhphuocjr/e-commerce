import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SignIn/SignIn.scss';

import { apiForgotPassword } from '../../Api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  // Error states
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
  });

  // Alert states
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field errors when user starts typing
    if (fieldErrors[name]) {
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
    setFieldErrors({ email: '' });
    setAlert({ show: false, type: 'info', message: '' });

    let hasErrors = false;
    const newErrors = {};

    // Validate required fields
    if (!formData.email) {
      newErrors.email = 'Email is required!';
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

    try {
      // Replace this with your actual forgot password API call
      await apiForgotPassword(formData.email);
      console.log('Sending reset password email to:', formData.email);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message:
          'Password reset instructions have been sent to your email address.',
      });

      // Clear form
      setFormData({ email: '' });

      // Optional: Redirect back to sign in after a delay
      setTimeout(() => {
        navigate('/signIn');
      }, 3000);
    } catch (error) {
      console.error('Forgot password error:', error);

      setAlert({
        show: true,
        type: 'error',
        message:
          error.message || 'Failed to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section signin-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
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
                <h2 className="signin-title">Forgot Password</h2>
                <p className="text-muted">
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </p>
              </div>

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    placeholder="Enter your email or username"
                    type="text"
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

                <button
                  type="submit"
                  className="btn signin-button w-100 mb-3"
                  disabled={isLoading}
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
                      Sending...
                    </>
                  ) : (
                    'Forgot Password'
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

export default ForgotPassword;

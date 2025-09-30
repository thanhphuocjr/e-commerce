import React from 'react';

const SocialLogin = ({
  disabled = false,
  buttonText = 'Sign in with Google',
}) => {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Google login logic sẽ được implement ở đây
  };

  return (
    <div className="social-login-section">
      <div className="divider">
        <span>Or continue with social account</span>
      </div>

      <button
        type="button"
        className="btn google-btn w-100"
        onClick={handleGoogleLogin}
        disabled={disabled}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="google-icon"
        />
        {buttonText}
      </button>
    </div>
  );
};

export default SocialLogin;

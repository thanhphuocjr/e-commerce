import React, { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';

const PasswordInput = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  showMatchError = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`form-group mb-4 ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && '*'}
      </label>
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          placeholder={placeholder}
          className={`form-control signin-input ${error ? 'error' : ''}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={togglePassword}
          disabled={disabled}
        >
          {showPassword ? <FaRegEye /> : <IoMdEyeOff />}
        </button>
      </div>
      {error ? (
        <small className="text-danger">{error}</small>
      ) : (
        showMatchError && (
          <small className="text-danger">Passwords do not match</small>
        )
      )}
    </div>
  );
};

export default PasswordInput;

import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
}) => {
  return (
    <div className={`form-group mb-4 ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={`form-control signin-input ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

export default FormInput;

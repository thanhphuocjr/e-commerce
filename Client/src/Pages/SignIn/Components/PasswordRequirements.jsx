import React from 'react';
import { validatePassword } from '../../../Helper/validation';

const PasswordRequirements = ({ password }) => {
  const { requirements } = validatePassword(password);

  const requirementItems = [
    { key: 'length', text: 'At least 8 characters' },
    { key: 'uppercase', text: 'One uppercase letter (A-Z)' },
    { key: 'lowercase', text: 'One lowercase letter (a-z)' },
    { key: 'number', text: 'One number (0-9)' },
    { key: 'special', text: 'One special character (@$!%*?&)' },
  ];

  return (
    <div className="password-requirements mt-2">
      <small className="text-muted d-block mb-1">Password must contain:</small>
      <div className="requirements-list">
        {requirementItems.map(({ key, text }) => (
          <small
            key={key}
            className={`requirement-item ${
              requirements[key] ? 'text-success' : 'text-danger'
            }`}
          >
            {requirements[key] ? '✓' : '✗'} {text}
          </small>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;

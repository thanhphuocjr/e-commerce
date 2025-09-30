import React, { useState } from 'react';
import './SignIn.scss';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import { showAlert } from '../../Helper/alert';

const SignIn = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    message: '',
  });

  const handleAlertClose = () => {
    setAlert({ show: false, type: 'info', message: '' });
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
                    onClick={handleAlertClose}
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

              {/* Forms */}
              {activeTab === 'login' ? (
                <LoginForm setAlert={setAlert} />
              ) : (
                <RegisterForm
                  setAlert={setAlert}
                  onSuccess={() => setActiveTab('login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

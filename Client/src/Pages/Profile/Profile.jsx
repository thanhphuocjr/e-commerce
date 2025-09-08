import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetProfile, apiLogout } from '../../Api/auth';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiGetProfile();
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // If unauthorized, redirect to signin
        if (err.response?.status === 401) {
          navigate('/signIn');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      console.log('Initiating logout...');
      await apiLogout();
      console.log('Logout successful');
    } catch (err) {
      console.error('Error during logout:', err);
      // Even if logout API fails, we still want to clear local tokens
      // The apiLogout function already handles this in the catch block
    } finally {
      // Always navigate to signin page and reset logout state
      setIsLoggingOut(false);
      navigate('/signIn', { replace: true }); // Use replace to prevent going back
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  if (!profile) {
    return (
      <div className="container mt-5" style={{ maxWidth: '500px' }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">My Profile</h2>
      <div className="card shadow p-4">
        <p>
          <strong>Full Name:</strong> {profile.fullName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Status:</strong> {profile.status}
        </p>
        <p>
          <strong>Last Login:</strong>{' '}
          {new Date(profile.lastLogin).toLocaleString()}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(profile.createdAt).toLocaleString()}
        </p>

        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleChangePassword}
          disabled={isLoggingOut}
        >
          Change Password
        </button>

        <button
          className="btn btn-danger mt-3 w-100"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </div>
  );
}

export default Profile;

// Import or define setAlert before using it
// Example: If setAlert is passed as a prop or imported from context, update accordingly
// import { setAlert } from './alertContext'; // Uncomment and update path if needed

export const showAlert = (setAlert, type, message, duration = 3000) => {
  setAlert({ show: true, type, message });
  setTimeout(() => {
    setAlert({ show: false, type: '', message: '' });
  }, duration);
};

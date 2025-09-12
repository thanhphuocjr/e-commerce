import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { createContext, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Listing from './Pages/Listing/Listing';
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import Cart from './Pages/Cart/Cart';
import SignIn from './Pages/SignIn/SignIn';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ForgotPassword/ResetPassword';
import ChangePassword from './Pages/ChangePassword/ChangePassword';
import Profile from './Pages/Profile/Profile';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import AdminDashboard from './Pages/Admin/Admin';

const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  useEffect(() => {
    getCountry('https://countriesnow.space/api/v0.1/countries/');
  }, []);

  const values = { countryList };

  // Layout cho user
  function UserLayout({ children }) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  // Layout cho admin
  function AdminLayout({ children }) {
    return <div className="admin-layout">{children}</div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyContext.Provider value={values}>
        <Routes>
          {/* User routes */}
          <Route
            path="/"
            element={
              <UserLayout>
                <Home />
              </UserLayout>
            }
          />
          <Route
            path="/cat/:id"
            element={
              <UserLayout>
                <Listing />
              </UserLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <UserLayout>
                  <Cart />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <UserLayout>
                <ProductDetail />
              </UserLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserLayout>
                  <Profile />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/signIn"
            element={
              <UserLayout>
                <SignIn />
              </UserLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <UserLayout>
                <ForgotPassword />
              </UserLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <UserLayout>
                <ResetPassword />
              </UserLayout>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <UserLayout>
                  <ChangePassword />
                </UserLayout>
              </PrivateRoute>
            }
          />

          {/* Admin routes (không có Header/Footer) */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };

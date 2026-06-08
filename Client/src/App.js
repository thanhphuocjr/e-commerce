import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createContext } from 'react';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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

const MyContext = createContext({ countryList: [] });

function App() {
  function UserLayout({ children }) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  function AdminLayout({ children }) {
    return <div className="admin-layout">{children}</div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />

        <Route
          path="/products"
          element={
            <UserLayout>
              <Listing />
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

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Header from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import PropertyPage from './pages/PropertyPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminRoute from './components/AdminRoute';
import AdminProfilePage from './pages/AdminProfilePage'; 
import BookingSuccessPage from './pages/BookingSuccessPage';

const Layout = ({ children }) => (
  <>
    <Header />
    <main className="py-3">
      <Container>{children}</Container>
    </main>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  return userInfo ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className="text-center">
            <h1 className="text-danger">Something went wrong</h1>
            <p className="text-muted">{this.state.error.message}</p>
            <button onClick={this.handleRetry} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

// Define routes
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout><LandingPage /></Layout>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/login',
      element: <Layout><LoginPage /></Layout>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/register',
      element: <Layout><RegistrationPage /></Layout>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/hotels/:id',
      element: <Layout><PropertyPage /></Layout>,
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/booking/:id',
      element: (
        <Layout>
          <PrivateRoute>
            <BookingPage />
          </PrivateRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/booking-details/:id',
      element: (
        <Layout>
          <PrivateRoute>
            <BookingSuccessPage />
          </PrivateRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/profile',
      element: (
        <Layout>
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/admin/login',
      element: (
        <Layout>
          <AdminLoginPage />
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/admin',
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: '/admin/dashboard',
      element: (
        <Layout>
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/admin/profile',
      element: (
        <Layout>
          <AdminRoute>
            <AdminProfilePage />
          </AdminRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/admin/register',
      element: (
        <Layout>
          <AdminRegisterPage />
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/admin-request',
      element: (
        <Layout>
          <PrivateRoute>
            <AdminRegisterPage />
          </PrivateRoute>
        </Layout>
      ),
      errorElement: <ErrorBoundary />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }
  }
);

// App Component
function App() {
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    console.log('Current user info:', userInfo);
  }, [userInfo]);


  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (adminInfo && !adminInfo.admin?._id) {
      localStorage.removeItem('adminInfo');
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
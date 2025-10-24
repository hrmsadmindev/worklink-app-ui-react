// Updated App.jsx - Add token expiration checks and enhanced security
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { Dashboard } from './components/Dashboard';
import { Employees } from './components/Employees';
// import { Recruitment } from './components/Recruitment';
import { Performance } from './components/Performance';
import { Payroll } from './components/Payroll';
import { Attendance } from './components/Attendance';
import { Leave } from './components/Leave';
import { Admin } from './components/Admin';
import { LoginForm } from './components/LoginForm';
import { authService } from './services/auth';
import { employeeService } from './services/employeeService';
import { useAuth } from "./context/AuthContext";
import { isModuleEnabled } from './config/clientConfig';

const PAGES = ['dashboard', 'employees', 'attendance', 'leave', 'performance', 'payroll', 'admin'];

// Styled Components
const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  overflow-y: auto;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SessionWarning = styled.div`
  background: ${({ theme }) => theme.colors.warning};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

function App() {
  // State management
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user: currentUser, login, logout, error, loading, refreshSession } = useAuth();

  // Employee data now comes from API - these are just for dashboard stats
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);

  // Session warning state
  const [sessionWarning, setSessionWarning] = useState(false);

  // Other module data (keep these until you integrate their APIs)
  const [jobs, setJobs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payrollData, setPayrollData] = useState([]);

  // Load employees for dashboard statistics
  useEffect(() => {
    const loadEmployeesForDashboard = async () => {
      if (currentUser && currentUser.email) {
        try {
          console.log('[App] Loading employees for dashboard...');
          const result = await employeeService.getAllEmployees();
          if (result.success) {
            console.log('[App] Employees loaded for dashboard:', result.data);
            setEmployees(result.data || []);
          } else {
            console.error('[App] Failed to load employees for dashboard:', result.error);
            setEmployeesError(result.error);
          }
        } catch (error) {
          console.error('[App] Error loading employees for dashboard:', error);
          setEmployeesError('Failed to load employee data');
        } finally {
          setEmployeesLoading(false);
        }
      }
    };

    loadEmployeesForDashboard();
  }, [currentUser]);

  // Enhanced token validation on window focus
  useEffect(() => {
    const handleWindowFocus = () => {
      if (currentUser) {
        const token = localStorage.getItem('accessToken');
        if (token && !authService.isTokenValid(token)) {
          console.log('[App] Token expired on window focus - forcing logout');
          handleLogout();
        } else if (token && authService.willExpireWithin(token, 5)) {
          // Show warning if token will expire within 5 minutes
          setSessionWarning(true);
        }
      }
    };

    const handleWindowBlur = () => {
      setSessionWarning(false);
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [currentUser]);

  // Check for session expiry warning
  useEffect(() => {
    if (currentUser) {
      const checkSessionWarning = () => {
        const token = localStorage.getItem('accessToken');
        if (token && authService.willExpireWithin(token, 5)) {
          setSessionWarning(true);
        } else {
          setSessionWarning(false);
        }
      };

      // Check immediately
      checkSessionWarning();

      // Check every minute
      const intervalId = setInterval(checkSessionWarning, 60000);

      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  // Enhanced authentication check on app load
  useEffect(() => {
    const performSecurityCheck = () => {
      console.log('[App] Performing enhanced security check...');

      try {
        // Debug current auth status
        const authStatus = authService.debugAuthStatus();

        // If we have an authenticated user but invalid token, force logout
        if (currentUser && !authStatus.isAuthenticated) {
          console.log('[App] User authenticated but token invalid - forcing logout');
          handleLogout();
        }

        // Clear any orphaned data
        const token = localStorage.getItem('accessToken');
        const user = authService.getCurrentUser();

        if ((token && !user) || (user && !token)) {
          console.log('[App] Inconsistent auth state - clearing all data');
          localStorage.clear();
          if (currentUser) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('[App] Security check error:', error);
        localStorage.clear();
      }
    };

    performSecurityCheck();
  }, [currentUser]);

  // Authentication handlers
  const handleLogin = async (credentials) => {
    console.log('[App] Login handler called with:', credentials);
    try {
      const result = await login(credentials);
      console.log('[App] Login result:', result);
      if (result.success) {
        console.log('[App] Login successful, setting user:', result.user);
        setCurrentPage('dashboard');
        setSessionWarning(false);
      } else {
        console.log('[App] Login failed:', result.error);
      }
      return result;
    } catch (error) {
      console.error('[App] Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    console.log('[App] Logout initiated');
    try {
      await logout();
      setCurrentPage('dashboard');
      setSessionWarning(false);

      // Clear employee data on logout
      setEmployees([]);
      setEmployeesLoading(true);
      setEmployeesError(null);
    } catch (error) {
      console.error('[App] Logout error:', error);
      // Force cleanup even if logout fails
      localStorage.clear();
      setSessionWarning(false);
    }
  };

  // Navigation handler
  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  // Session extension handler
  const handleExtendSession = () => {
    setSessionWarning(false);
    refreshSession();
  };

  // Data handlers for other modules (keep these until you integrate their APIs)
  const addJob = (jobData) => {
    const newJob = {
      id: jobs.length + 1,
      ...jobData,
      applicants: 0,
      status: 'active'
    };
    setJobs([...jobs, newJob]);
  };

  const addReview = (reviewData) => {
    const newReview = {
      id: reviews.length + 1,
      ...reviewData,
      rating: 0,
      status: 'pending',
      date: null
    };
    setReviews([...reviews, newReview]);
  };

  const runPayroll = () => {
    const updatedPayroll = payrollData.map(item => ({
      ...item,
      status: 'processed'
    }));
    setPayrollData(updatedPayroll);
  };

  // Render current page - with client module restrictions
  const renderCurrentPage = () => {
    const pageProps = {
      employees,
      jobs,
      goals,
      reviews,
      payrollData,
      currentUser,
      onAddJob: addJob,
      onAddReview: addReview,
      onRunPayroll: runPayroll,
      employeesLoading,
      employeesError,
      onNavigate: navigateToPage
    };

    // Check if the current page module is enabled for this client
    if (!isModuleEnabled(currentPage)) {
      // If module is disabled, redirect to dashboard
      console.log(`[App] Module '${currentPage}' is disabled for this client, redirecting to dashboard`);
      setCurrentPage('dashboard');
      return <Dashboard {...pageProps} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} />;
      case 'employees':
        return <Employees />; // No props needed - component manages its own data
      case 'attendance':
        return <Attendance {...pageProps} />;
      case 'leave':
        return <Leave {...pageProps} />;
      case 'performance':
        return <Performance {...pageProps} />;
      case 'payroll':
        return <Payroll {...pageProps} />;
      case 'admin':
        return <Admin {...pageProps} />;
      default:
        return <Dashboard {...pageProps} />;
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <LoadingScreen>
        Verifying your session...
      </LoadingScreen>
    );
  }

  // If not logged in, show login form
  if (!currentUser || !currentUser.email) {
    console.log('[App] Showing login form - currentUser:', currentUser);
    return (
      <div>
        <LoginForm
          onLogin={handleLogin}
          error={error}
          loading={loading}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
    );
  }

  // Main app layout
  console.log('[App] Rendering main app for user:', currentUser);
  return (
    <AppLayout>
      {/* Session expiry warning */}
      {sessionWarning && (
        <SessionWarning>
          ⚠️ Your session will expire soon.
          <button
            onClick={handleExtendSession}
            style={{
              background: 'none',
              border: '1px solid white',
              color: 'white',
              marginLeft: '10px',
              padding: '2px 8px',
              cursor: 'pointer'
            }}
          >
            Extend Session
          </button>
        </SessionWarning>
      )}

      <SideNav
        pages={PAGES}
        currentPage={currentPage}
        onNavigate={navigateToPage}
        currentUser={currentUser}
      />

      <MainContent>
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <ContentArea>
          {renderCurrentPage()}
        </ContentArea>
      </MainContent>
    </AppLayout>
  );
}

export default App;

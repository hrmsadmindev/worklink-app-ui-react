import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { Dashboard } from './components/Dashboard';
import { Employees } from './components/Employees';
import { Recruitment } from './components/Recruitment';
import { Performance } from './components/Performance';
import { Payroll } from './components/Payroll';
import { Admin } from './components/Admin';
import { LoginForm } from './components/LoginForm';
import { authService } from './services/auth';

// Mock data (replace with real API calls later)
const initialEmployees = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', department: 'Engineering', position: 'Software Engineer', status: 'active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com', department: 'Marketing', position: 'Marketing Manager', status: 'active' },
  { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@company.com', department: 'Sales', position: 'Sales Representative', status: 'active' },
  { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@company.com', department: 'HR', position: 'HR Specialist', status: 'active' },
  { id: 5, firstName: 'David', lastName: 'Brown', email: 'david.brown@company.com', department: 'Finance', position: 'Financial Analyst', status: 'inactive' }
];

const initialJobs = [
  { id: 1, title: 'Senior Software Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'We are looking for an experienced software developer...', applicants: 15, status: 'active' },
  { id: 2, title: 'Marketing Coordinator', department: 'Marketing', location: 'New York', type: 'Full-time', description: 'Join our marketing team to coordinate campaigns...', applicants: 8, status: 'active' },
  { id: 3, title: 'Data Analyst', department: 'Analytics', location: 'San Francisco', type: 'Contract', description: 'Analyze data to provide business insights...', applicants: 22, status: 'active' }
];

const initialGoals = [
  { id: 1, employee: 'John Doe', title: 'Complete React Training', description: 'Complete advanced React development course', deadline: '2024-02-15', status: 'in-progress', progress: 75 },
  { id: 2, employee: 'Jane Smith', title: 'Launch Marketing Campaign', description: 'Launch Q1 marketing campaign for new product', deadline: '2024-01-30', status: 'pending', progress: 25 },
  { id: 3, employee: 'Mike Johnson', title: 'Achieve Sales Target', description: 'Reach monthly sales target of $50k', deadline: '2024-01-31', status: 'completed', progress: 100 }
];

const initialReviews = [
  { id: 1, employee: 'John Doe', reviewer: 'Tech Lead', period: 'Q4 2023', rating: 4.5, status: 'completed', date: '2023-12-15' },
  { id: 2, employee: 'Jane Smith', reviewer: 'Marketing Director', period: 'Q4 2023', rating: 4.2, status: 'completed', date: '2023-12-20' },
  { id: 3, employee: 'Mike Johnson', reviewer: 'Sales Manager', period: 'Q4 2023', rating: 0, status: 'pending', date: null }
];

const initialPayroll = [
  { id: 1, employee: 'John Doe', department: 'Engineering', grossPay: 8000, deductions: 1200, netPay: 6800, status: 'processed' },
  { id: 2, employee: 'Jane Smith', department: 'Marketing', grossPay: 7500, deductions: 1100, netPay: 6400, status: 'processed' },
  { id: 3, employee: 'Mike Johnson', department: 'Sales', grossPay: 6500, deductions: 950, netPay: 5550, status: 'pending' },
  { id: 4, employee: 'Sarah Williams', department: 'HR', grossPay: 7000, deductions: 1000, netPay: 6000, status: 'processed' },
  { id: 5, employee: 'David Brown', department: 'Finance', grossPay: 7200, deductions: 1080, netPay: 6120, status: 'pending' }
];

const PAGES = ['dashboard', 'employees', 'recruitment', 'performance', 'payroll', 'admin'];

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

function App() {
  // State management
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null); // This will be a user object: { email, role }
  const [employees, setEmployees] = useState(initialEmployees);
  const [jobs, setJobs] = useState(initialJobs);
  const [goals, setGoals] = useState(initialGoals);
  const [reviews, setReviews] = useState(initialReviews);
  const [payrollData, setPayrollData] = useState(initialPayroll);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[App] Checking authentication...');
      
      try {
        const token = localStorage.getItem('accessToken');
        const user = authService.getCurrentUser();
        
        console.log('[App] Token exists:', !!token);
        console.log('[App] User from localStorage:', user);
        
        // If we have token but no valid user, clear everything and show login
        if (token && !user) {
          console.log('[App] Found token but no valid user - clearing corrupted data');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }
        
        // If we have both token and valid user, restore session
        if (token && user && user.email) {
          console.log('[App] Valid session found, restoring user:', user);
          setCurrentUser(user);
        } else {
          console.log('[App] No valid session found');
        }
        
      } catch (error) {
        console.error('[App] Error during auth check:', error);
        // Clear any corrupted data
        localStorage.clear();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Authentication handlers
  const handleLogin = async (credentials) => {
    console.log('[App] Login handler called with:', credentials);
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      console.log('[App] Login result:', result);
      
      if (result.success && result.user) {
        console.log('[App] Login successful, setting user:', result.user);
        setCurrentUser(result.user); // Set the full user object
        setCurrentPage('dashboard');
        setSuccess('Login successful!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        console.log('[App] Login failed:', result.error);
        setError(result.error || 'Login failed');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('[App] Login error:', error);
      setError('Network error. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    console.log('[App] Logout initiated');
    setLoading(true);
    
    try {
      await authService.logout();
      setCurrentUser(null);
      setCurrentPage('dashboard');
      setSuccess('Logged out successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('[App] Logout error:', error);
    }
    
    setLoading(false);
  };

  // Navigation handler
  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  // Data handlers (keep your existing handlers)
  const addEmployee = (employeeData) => {
    const newEmployee = {
      id: employees.length + 1,
      ...employeeData,
      status: 'active'
    };
    setEmployees([...employees, newEmployee]);
    setSuccess('Employee added successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const addJob = (jobData) => {
    const newJob = {
      id: jobs.length + 1,
      ...jobData,
      applicants: 0,
      status: 'active'
    };
    setJobs([...jobs, newJob]);
    setSuccess('Job posted successfully!');
    setTimeout(() => setSuccess(null), 3000);
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
    setSuccess('Performance review created successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const runPayroll = () => {
    const updatedPayroll = payrollData.map(item => ({
      ...item,
      status: 'processed'
    }));
    setPayrollData(updatedPayroll);
    setSuccess('Payroll processed successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Render current page
  const renderCurrentPage = () => {
    const pageProps = {
      employees,
      jobs,
      goals,
      reviews,
      payrollData,
      currentUser,
      onAddEmployee: addEmployee,
      onAddJob: addJob,
      onAddReview: addReview,
      onRunPayroll: runPayroll
    };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} />;
      case 'employees':
        return <Employees {...pageProps} />;
      case 'recruitment':
        return <Recruitment {...pageProps} />;
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
        Loading...
      </LoadingScreen>
    );
  }

  // If not logged in, show login form
  if (!currentUser || !currentUser.email) {
    console.log('[App] Showing login form - currentUser:', currentUser);
    return (
      <AppLayout>
        <LoginForm onLogin={handleLogin} error={error} loading={loading} />
      </AppLayout>
    );
  }

  // Main app layout
  console.log('[App] Rendering main app for user:', currentUser);
  return (
    <AppLayout>
      <SideNav 
        pages={PAGES}
        currentPage={currentPage}
        onNavigate={navigateToPage}
        currentUser={currentUser} // Pass full user object: { email, role }
      />
      <MainContent>
        <Header 
          currentUser={currentUser} // Pass full user object: { email, role }
          onLogout={handleLogout}
        />
        <ContentArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {renderCurrentPage()}
        </ContentArea>
      </MainContent>
    </AppLayout>
  );
}

export default App;

// Updated App.jsx - Add leave module to the application
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { Dashboard } from './components/Dashboard';
import { Employees } from './components/Employees';
import { Recruitment } from './components/Recruitment';
import { Performance } from './components/Performance';
import { Payroll } from './components/Payroll';
import { Attendance } from './components/Attendance';
import { Leave } from './components/Leave'; // Add leave import
import { Admin } from './components/Admin';
import { LoginForm } from './components/LoginForm';
import { authService } from './services/auth';
import { employeeService } from './services/employeeService';
import { useAuth } from "./context/AuthContext";

// Mock data for other modules (keep these until you integrate their APIs)
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

// Add 'leave' to the PAGES array
const PAGES = ['dashboard', 'employees', 'attendance', 'leave', 'recruitment', 'performance', 'payroll', 'admin'];

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
 const { user: currentUser, login, logout, error, loading } = useAuth();

 // Employee data now comes from API - these are just for dashboard stats
 const [employees, setEmployees] = useState([]);
 const [employeesLoading, setEmployeesLoading] = useState(true);
 const [employeesError, setEmployeesError] = useState(null);

 // Other module data (keep these until you integrate their APIs)
 const [jobs, setJobs] = useState(initialJobs);
 const [goals, setGoals] = useState(initialGoals);
 const [reviews, setReviews] = useState(initialReviews);
 const [payrollData, setPayrollData] = useState(initialPayroll);

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
 return;
 }

 // If we have both token and valid user, session is valid
 if (token && user && user.email) {
 console.log('[App] Valid session found, user:', user);
 } else {
 console.log('[App] No valid session found');
 }

 } catch (error) {
 console.error('[App] Error during auth check:', error);
 // Clear any corrupted data
 localStorage.clear();
 }
 };

 checkAuth();
 }, []);

 // Authentication handlers
 const handleLogin = async (credentials) => {
 console.log('[App] Login handler called with:', credentials);

 try {
 const result = await login(credentials);
 console.log('[App] Login result:', result);

 if (result.success && result.user) {
 console.log('[App] Login successful, setting user:', result.user);
 setCurrentPage('dashboard');
 } else {
 console.log('[App] Login failed:', result.error);
 }
 } catch (error) {
 console.error('[App] Login error:', error);
 }
 };

 const handleLogout = async () => {
 console.log('[App] Logout initiated');

 try {
 await logout();
 setCurrentPage('dashboard');
 // Clear employee data on logout
 setEmployees([]);
 setEmployeesLoading(true);
 setEmployeesError(null);
 } catch (error) {
 console.error('[App] Logout error:', error);
 }
 };

 // Navigation handler
 const navigateToPage = (page) => {
 setCurrentPage(page);
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

 // Render current page
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

 switch (currentPage) {
 case 'dashboard':
 return <Dashboard {...pageProps} />;
 case 'employees':
 return <Employees />; // No props needed - component manages its own data
 case 'attendance':
 return <Attendance currentUser={currentUser} />;
 case 'leave':
 return <Leave currentUser={currentUser} />; // Add leave case
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
 <MainContent>
 {error && <ErrorMessage>{error}</ErrorMessage>}
 <LoginForm onLogin={handleLogin} />
 </MainContent>
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
 currentUser={currentUser}
 />
 <MainContent>
 <Header currentUser={currentUser} onLogout={handleLogout} />
 <ContentArea>
 {renderCurrentPage()}
 </ContentArea>
 </MainContent>
 </AppLayout>
 );
}

export default App;
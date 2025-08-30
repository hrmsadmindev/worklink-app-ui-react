// components/Dashboard.jsx - With Clickable Navigation Cards
import React from 'react';
import styled from 'styled-components';
import Card, { CardTitle, CardContent } from './Card';

const DashboardContainer = styled.div`
 max-width: 1200px;
 margin: 0 auto;
`;

const PageTitle = styled.h2`
 color: ${({ theme }) => theme.colors.textPrimary};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 font-size: ${({ theme }) => theme.fontSize.xxxl};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const StatsGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
 gap: ${({ theme }) => theme.spacing.lg};
 margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

// Updated StatCard to be clickable
const StatCard = styled(Card)`
 text-align: center;
 padding: ${({ theme }) => theme.spacing.xl};
 cursor: pointer;
 transition: all 0.3s ease;
 position: relative;

 &:hover {
   transform: translateY(-4px);
   box-shadow: ${({ theme }) => theme.shadows.lg};
   border: 1px solid ${({ theme }) => theme.colors.primary};
 }

 &:active {
   transform: translateY(-2px);
 }
`;

const StatNumber = styled.div`
 font-size: ${({ theme }) => theme.fontSize.xxxl};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 font-weight: bold;
 color: ${({ theme }) => theme.colors.primary};
 margin-bottom: ${({ theme }) => theme.spacing.sm};
 transition: color 0.3s ease;
`;

const StatLabel = styled.div`
 color: ${({ theme }) => theme.colors.textSecondary};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 transition: color 0.3s ease;

 ${StatCard}:hover & {
   color: ${({ theme }) => theme.colors.primary};
 }
`;

// Add click indicator
const ClickIndicator = styled.div`
 position: absolute;
 top: ${({ theme }) => theme.spacing.sm};
 right: ${({ theme }) => theme.spacing.sm};
 color: ${({ theme }) => theme.colors.textSecondary};
 font-size: ${({ theme }) => theme.fontSize.sm};
 opacity: 0;
 transition: opacity 0.3s ease;

 ${StatCard}:hover & {
   opacity: 1;
   color: ${({ theme }) => theme.colors.primary};
 }
`;

const WelcomeCard = styled(Card)`
 background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryHover} 100%);
 color: ${({ theme }) => theme.colors.white};
 margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const WelcomeTitle = styled.h3`
 margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
 font-size: ${({ theme }) => theme.fontSize.xxl};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const WelcomeText = styled.p`
 margin: 0;
 opacity: 0.9;
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const RecentActivities = styled.div`
 margin-top: ${({ theme }) => theme.spacing.xxl};
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const ActivityList = styled.div`
 display: flex;
 flex-direction: column;
 gap: ${({ theme }) => theme.spacing.md};
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const ActivityItem = styled.div`
 background: ${({ theme }) => theme.colors.white};
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 padding: ${({ theme }) => theme.spacing.lg};
 display: flex;
 align-items: center;
 gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityIcon = styled.div`
 width: 40px;
 height: 40px;
 border-radius: 50%;
 background: ${({ theme }) => theme.colors.secondary};
 display: flex;
 align-items: center;
 justify-content: center;
 color: ${({ theme }) => theme.colors.primary};
 font-weight: bold;
 flex-shrink: 0;
`;

const ActivityContent = styled.div`
 flex: 1;
`;

const ActivityTitle = styled.div`
 font-weight: 600;
 color: ${({ theme }) => theme.colors.textPrimary};
 margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActivityDescription = styled.div`
 color: ${({ theme }) => theme.colors.textSecondary};
 font-size: ${({ theme }) => theme.fontSize.sm};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

export function Dashboard({ employees, jobs, reviews, payrollData, currentUser, onNavigate }) {
 const totalEmployees = employees.length;
 const openJobs = jobs.filter(job => job.status === 'active').length;
 const pendingReviews = reviews.filter(review => review.status === 'pending').length;
 const processedPayroll = payrollData
   .filter(p => p.status === 'processed')
   .reduce((sum, p) => sum + p.netPay, 0);

 const getRoleBasedWelcome = () => {
   switch (currentUser?.role) {
     case 'ADMIN':
       return 'Complete system overview and management tools';
     case 'MANAGER':
       return 'Team performance and management overview';
     case 'EMPLOYEE':
       return 'Your personal dashboard and tasks';
     default:
       return 'Welcome to your HRMS dashboard';
   }
 };

 // Navigation handlers for each card
 const handleEmployeesClick = () => {
   if (onNavigate) {
     onNavigate('employees');
   }
 };

 const handleRecruitmentClick = () => {
   if (onNavigate) {
     onNavigate('recruitment');
   }
 };

 const handlePerformanceClick = () => {
   if (onNavigate) {
     onNavigate('performance');
   }
 };

 const handlePayrollClick = () => {
   if (onNavigate) {
     onNavigate('payroll');
   }
 };

 const recentActivities = [
   {
     icon: '👤',
     title: 'New Employee Added',
     description: 'Sarah Johnson joined Engineering department',
     time: '2 hours ago'
   },
   {
     icon: '📊',
     title: 'Performance Review Completed',
     description: 'Q4 review for Marketing team completed',
     time: '4 hours ago'
   },
   {
     icon: '💼',
     title: 'Job Posted',
     description: 'Senior Developer position posted',
     time: '1 day ago'
   }
 ];

 return (
   <DashboardContainer>
     <PageTitle>Dashboard</PageTitle>

     <WelcomeCard>
       <WelcomeTitle>Welcome {currentUser?.name}!</WelcomeTitle>
       <WelcomeText>{getRoleBasedWelcome()}</WelcomeText>
     </WelcomeCard>

     <StatsGrid>
       <StatCard onClick={handleEmployeesClick} title="Click to view all employees">
         <StatNumber>{totalEmployees}</StatNumber>
         <StatLabel>Total Employees</StatLabel>
       </StatCard>

       <StatCard onClick={handleRecruitmentClick} title="Click to view recruitment">
         <StatNumber>{openJobs}</StatNumber>
         <StatLabel>Open Positions</StatLabel>
       </StatCard>

       <StatCard onClick={handlePerformanceClick} title="Click to view performance reviews">
         <StatNumber>{pendingReviews}</StatNumber>
         <StatLabel>Pending Reviews</StatLabel>
       </StatCard>

       <StatCard onClick={handlePayrollClick} title="Click to view payroll">
         <StatNumber>₹{processedPayroll.toLocaleString()}</StatNumber>
         <StatLabel>Processed Payroll</StatLabel>
       </StatCard>
     </StatsGrid>

     {/* <RecentActivities>
       <CardTitle>Recent Activities</CardTitle>
       <ActivityList>
         {recentActivities.map((activity, index) => (
           <ActivityItem key={index}>
             <ActivityIcon>{activity.icon}</ActivityIcon>
             <ActivityContent>
               <ActivityTitle>{activity.title}</ActivityTitle>
               <ActivityDescription>
                 {activity.description} - {activity.time}
               </ActivityDescription>
             </ActivityContent>
           </ActivityItem>
         ))}
       </ActivityList>
     </RecentActivities> */}
   </DashboardContainer>
 );
}

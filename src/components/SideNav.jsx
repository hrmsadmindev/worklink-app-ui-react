// Updated SideNav.jsx - Role-based navigation using RolesContext
import React from 'react';
import styled from 'styled-components';
import { useRoles } from '../context/RolesContext';

const Sidebar = styled.nav`
 background: ${({ theme }) => theme.colors.secondary};
 min-width: 240px;
 min-height: 100vh;
 padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
 display: flex;
 flex-direction: column;
 border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavButton = styled.button`
 background: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
 color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.textPrimary)};
 border: none;
 border-radius: ${({ theme }) => theme.borderRadius.md};
 padding: ${({ theme }) => theme.spacing.md};
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 margin-bottom: ${({ theme }) => theme.spacing.sm};
 text-align: left;
 cursor: pointer;
 transition: all 0.2s ease;
 font-weight: ${({ active }) => (active ? '600' : '400')};
 display: flex;
 align-items: center;
 gap: ${({ theme }) => theme.spacing.sm};

 &:hover {
 background: ${({ theme }) => theme.colors.primaryHover};
 color: ${({ theme }) => theme.colors.white};
 }

 &:disabled {
 opacity: 0.5;
 cursor: not-allowed;
 }
`;

const NavIcon = styled.i`
 font-size: ${({ theme }) => theme.fontSize.lg};
`;

const NavTitle = styled.h3`
 color: ${({ theme }) => theme.colors.textPrimary};
 margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
 padding: 0 ${({ theme }) => theme.spacing.md};
 font-size: ${({ theme }) => theme.fontSize.xxl};
 font-family: ${({ theme }) => theme.typography.fonts.heading};
`;

export function SideNav({ pages, currentPage, onNavigate, currentUser }) {
 const { getNavigationItems } = useRoles();

 const navigationItems = getNavigationItems();

 const getPageLabel = (page) => {
 const labels = {
 dashboard: 'Dashboard',
 employees: 'Employees',
 attendance: 'Attendance',
 leave: 'Leave Management',
 performance: 'Performance',
 payroll: 'Payroll',
 admin: 'Administration'
 };
 return labels[page] || page.charAt(0).toUpperCase() + page.slice(1);
 };

 return (
 <Sidebar>
 <NavTitle>Navigation</NavTitle>
 {navigationItems.map(item => (
 <NavButton
 key={item.key}
 active={currentPage === item.key}
 onClick={() => onNavigate(item.key)}
 >
 <NavIcon className={item.icon} />
 {item.label}
 </NavButton>
 ))}
 </Sidebar>
 );

}

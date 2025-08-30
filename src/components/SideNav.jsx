import React from 'react';
import styled from 'styled-components';

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

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-family: ${({ theme }) => theme.typography.fonts.heading};
`;

export function SideNav({ pages, currentPage, onNavigate, currentUser }) {
  // Filter pages based on user role
  const getVisiblePages = () => {
    const roleBasedPages = {
      'ADMIN': pages,
      'MANAGER': pages.filter(page => page !== 'admin'),
      'EMPLOYEE': pages.filter(page => !['admin', 'employees', 'recruitment'].includes(page))
    };
    
    return roleBasedPages[currentUser?.role] || ['dashboard'];
  };

  const visiblePages = getVisiblePages();

  const getPageLabel = (page) => {
    const labels = {
      dashboard: 'Dashboard',
      employees: 'Employees',
      recruitment: 'Recruitment',
      performance: 'Performance',
      payroll: 'Payroll',
      admin: 'Administration'
    };
    return labels[page] || page.charAt(0).toUpperCase() + page.slice(1);
  };

  return (
  <Sidebar>
    <NavTitle>Navigation</NavTitle>
    {visiblePages.map(page => (
      <NavButton
        key={page}
        $active={currentPage === page}  // ← Add $ prefix
        onClick={() => onNavigate(page)}
      >
        {getPageLabel(page)}
      </NavButton>
    ))}
  </Sidebar>
);

}
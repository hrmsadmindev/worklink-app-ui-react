import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import useRoles from '../useRole';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Brand = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const WelcomeText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const LogoutButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export function Header({ currentUser, onLogout }) {
  const role = useRoles();
  console.log('role', role);

  return (
    <HeaderContainer>
      <Brand>HRMS Dashboard</Brand>
      <UserInfo>
        <WelcomeText>
          Welcome, {currentUser.name} ({currentUser.role})
        </WelcomeText>
        <LogoutButton onClick={onLogout}>
          Logout
        </LogoutButton>
      </UserInfo>
    </HeaderContainer>
  );
}
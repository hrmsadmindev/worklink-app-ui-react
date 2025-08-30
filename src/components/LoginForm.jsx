import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    background-color: ${({ theme }) => theme.colors.light};
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const DemoCredentials = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DemoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const DemoList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  
  li {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-family: monospace;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export function LoginForm({ onLogin, error, loading }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(credentials);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const fillDemo = (email, password) => {
    setCredentials({ email, password });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>HRMS Login</LoginTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        
        <DemoCredentials>
          <DemoTitle>Demo Credentials (click to fill):</DemoTitle>
          <DemoList>
            <li onClick={() => fillDemo('admin@company.com', 'admin123')}>
              Admin: admin@company.com / admin123
            </li>
            <li onClick={() => fillDemo('manager@company.com', 'manager123')}>
              Manager: manager@company.com / manager123
            </li>
            <li onClick={() => fillDemo('employee@company.com', 'employee123')}>
              Employee: employee@company.com / employee123
            </li>
          </DemoList>
        </DemoCredentials>
      </LoginCard>
    </LoginContainer>
  );
}
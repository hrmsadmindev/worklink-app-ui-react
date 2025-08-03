import React from 'react';
import styled from 'styled-components';
import Card, { CardTitle, CardContent } from './Card';
import Button from './Button';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.xxxl};
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AdminCard = styled(Card)`
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const AdminCardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AdminCardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const AdminCardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: 1.6;
`;

const AdminStats = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AccessDeniedIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AccessDeniedTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AccessDeniedText = styled.p`
  margin: 0;
`;

export function Admin({ currentUser }) {
  // Check if user has admin access
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <AdminContainer>
        <AccessDenied>
          <AccessDeniedIcon>🔒</AccessDeniedIcon>
          <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
          <AccessDeniedText>
            You don't have permission to access the administration panel.
            <br />
            Please contact your system administrator.
          </AccessDeniedText>
        </AccessDenied>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <PageTitle>Administration</PageTitle>

      <AdminGrid>
        <AdminCard>
          <AdminCardIcon>👥</AdminCardIcon>
          <AdminCardTitle>User Management</AdminCardTitle>
          <AdminCardDescription>
            Manage system users and permissions. Create, edit, and deactivate user accounts.
          </AdminCardDescription>
          <AdminStats>15 Active Users</AdminStats>
          <Button fullWidth>Manage Users</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>⚙️</AdminCardIcon>
          <AdminCardTitle>System Settings</AdminCardTitle>
          <AdminCardDescription>
            Configure system preferences, email settings, and security options.
          </AdminCardDescription>
          <AdminStats>Last updated: Today</AdminStats>
          <Button fullWidth variant="secondary">View Settings</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>📊</AdminCardIcon>
          <AdminCardTitle>Reports</AdminCardTitle>
          <AdminCardDescription>
            Generate and download comprehensive system reports and analytics.
          </AdminCardDescription>
          <AdminStats>12 Reports available</AdminStats>
          <Button fullWidth variant="outline">Generate Reports</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>🏢</AdminCardIcon>
          <AdminCardTitle>Departments</AdminCardTitle>
          <AdminCardDescription>
            Manage company departments and organizational structure.
          </AdminCardDescription>
          <AdminStats>5 Departments</AdminStats>
          <Button fullWidth>Manage Departments</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>🔐</AdminCardIcon>
          <AdminCardTitle>Security</AdminCardTitle>
          <AdminCardDescription>
            Monitor security logs, manage access controls and audit trails.
          </AdminCardDescription>
          <AdminStats>All systems secure</AdminStats>
          <Button fullWidth variant="secondary">Security Center</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>📋</AdminCardIcon>
          <AdminCardTitle>Audit Logs</AdminCardTitle>
          <AdminCardDescription>
            View system activity logs and user action history for compliance.
          </AdminCardDescription>
          <AdminStats>Latest: 2 hours ago</AdminStats>
          <Button fullWidth variant="outline">View Logs</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>💾</AdminCardIcon>
          <AdminCardTitle>Data Backup</AdminCardTitle>
          <AdminCardDescription>
            Manage system backups and data recovery procedures.
          </AdminCardDescription>
          <AdminStats>Last backup: Yesterday</AdminStats>
          <Button fullWidth>Backup Settings</Button>
        </AdminCard>

        <AdminCard>
          <AdminCardIcon>📈</AdminCardIcon>
          <AdminCardTitle>Analytics</AdminCardTitle>
          <AdminCardDescription>
            View system usage statistics and performance metrics.
          </AdminCardDescription>
          <AdminStats>Uptime: 99.9%</AdminStats>
          <Button fullWidth variant="secondary">View Analytics</Button>
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
}
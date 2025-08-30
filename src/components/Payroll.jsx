import React from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';

const PayrollContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SummaryCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SummaryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-weight: 500;
`;

const SummaryAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SummarySubtext = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.secondary};
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    background: rgba(24, 102, 215, 0.05);
  }
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'processed':
        return `
          background: rgba(40, 167, 69, 0.1);
          color: ${theme.colors.success};
        `;
      case 'pending':
        return `
          background: rgba(255, 193, 7, 0.1);
          color: ${theme.colors.warning};
        `;
      default:
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export function Payroll({ payrollData, onRunPayroll }) {
  const processedPayroll = payrollData.filter(p => p.status === 'processed');
  const pendingPayroll = payrollData.filter(p => p.status === 'pending');
  
  const totalProcessed = processedPayroll.reduce((sum, p) => sum + p.netPay, 0);
  const totalPending = pendingPayroll.reduce((sum, p) => sum + p.netPay, 0);
  const totalGross = payrollData.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + p.deductions, 0);

  return (
    <PayrollContainer>
      <PageHeader>
        <PageTitle>Payroll Management</PageTitle>
        <Button onClick={onRunPayroll} variant="success">
          Run Payroll
        </Button>
      </PageHeader>

      <SummaryGrid>
        <SummaryCard>
          <SummaryTitle>This Month</SummaryTitle>
          <SummaryAmount>₹{totalProcessed.toLocaleString()}</SummaryAmount>
          <SummarySubtext>{processedPayroll.length} employees processed</SummarySubtext>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle>Pending</SummaryTitle>
          <SummaryAmount>₹{totalPending.toLocaleString()}</SummaryAmount>
          <SummarySubtext>{pendingPayroll.length} employees pending</SummarySubtext>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle>Total Gross</SummaryTitle>
          <SummaryAmount>₹{totalGross.toLocaleString()}</SummaryAmount>
          <SummarySubtext>Before deductions</SummarySubtext>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryTitle>Total Deductions</SummaryTitle>
          <SummaryAmount>₹{totalDeductions.toLocaleString()}</SummaryAmount>
          <SummarySubtext>Taxes & benefits</SummarySubtext>
        </SummaryCard>
      </SummaryGrid>

      <Card>
        <CardTitle>Payroll Details</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Employee</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Gross Pay</TableHeaderCell>
              <TableHeaderCell>Deductions</TableHeaderCell>
              <TableHeaderCell>Net Pay</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {payrollData.map(payroll => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.employee}</TableCell>
                <TableCell>{payroll.department}</TableCell>
                <TableCell>${payroll.grossPay.toLocaleString()}</TableCell>
                <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                <TableCell>${payroll.netPay.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={payroll.status}>
                    {payroll.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button size="small" variant="outline">
                      View Details
                    </Button>
                    <Button size="small" variant="secondary">
                      Edit
                    </Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </PayrollContainer>
  );
}
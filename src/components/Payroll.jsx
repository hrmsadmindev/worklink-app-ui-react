// components/Payroll.jsx - Updated for employeeId database column
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';
import { payrollService } from '../services/payrollService';
import { employeeService } from '../services/employeeService';

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
    switch (status?.toLowerCase()) {
      case 'processed':
      case 'paid':
        return `
          background: rgba(40, 167, 69, 0.1);
          color: ${theme.colors.success};
        `;
      case 'pending':
        return `
          background: rgba(255, 193, 7, 0.1);
          color: ${theme.colors.warning};
        `;
      case 'cancelled':
        return `
          background: rgba(220, 53, 69, 0.1);
          color: ${theme.colors.danger};
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

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const PayrollForm = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  align-items: end;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FormLabel = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  background: white;
`;

export function Payroll() {
  const [payrollData, setPayrollData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);

  // Load employees and initial payroll data
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      console.log('[Payroll] Loading employees...');

      const result = await employeeService.getAllEmployees();
      if (result.success) {
        console.log('[Payroll] Employees loaded:', result.data);
        setEmployees(result.data || []);
        console.log('[Payroll] Employees loaded:', result.data?.length);

        // Load payroll data for all employees (this might need optimization for large datasets)
        await loadAllPayrollData(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('[Payroll] Error loading employees:', error);
      setError('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllPayrollData = async (employeeList) => {
    try {
      console.log('[Payroll] Loading payroll data for', employeeList.length, 'employees');
      const allPayrollData = [];

      // Note: This approach loads payroll for each employee individually
      // In a production system, you'd want a backend endpoint to get all payroll data at once
      for (const employee of employeeList.slice(0, 10)) { // Limit to first 10 for performance
        try {
          console.log('[Payroll] Loading payroll for employeeId:', employee.employeeId);

          // FIXED: Use employeeId instead of id
          const payrollResult = await payrollService.getPayrollByEmployeeId(employee.employeeId);

          if (payrollResult.success && payrollResult.data) {
            // Transform backend data to match frontend expectations
            const transformedData = payrollResult.data.map(payroll => ({
              id: payroll.id,
              employee: `${employee.firstName} ${employee.lastName}`,
              employeeId: employee.employeeId, // FIXED: Use employeeId
              department: employee.department,
              grossPay: (payroll.basicSalary || 0) + (payroll.allowances || 0) + (payroll.overtime || 0) + (payroll.bonuses || 0),
              deductions: (payroll.deductions || 0) + (payroll.taxDeductions || 0),
              netPay: payroll.netSalary || 0,
              status: payroll.status?.toLowerCase() || 'pending',
              payDate: payroll.payDate,
              payPeriodMonth: payroll.payPeriodMonth,
              payPeriodYear: payroll.payPeriodYear,
              basicSalary: payroll.basicSalary,
              allowances: payroll.allowances,
              overtime: payroll.overtime,
              bonuses: payroll.bonuses,
              taxDeductions: payroll.taxDeductions
            }));
            allPayrollData.push(...transformedData);
          }
        } catch (error) {
          console.warn('[Payroll] Failed to load payroll for employee', employee.employeeId, error);
        }
      }

      setPayrollData(allPayrollData);
      console.log('[Payroll] Total payroll records loaded:', allPayrollData.length);
    } catch (error) {
      console.error('[Payroll] Error loading payroll data:', error);
      // Don't set error here as we want to allow the component to function even without payroll data
    }
  };

  const handleGeneratePayroll = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      console.log('[Payroll] Generating payroll for employee:', selectedEmployee);

      // FIXED: selectedEmployee now contains employeeId, not id
      const result = await payrollService.generatePayroll(
        parseInt(selectedEmployee), // This is already employeeId from the dropdown
        selectedMonth,
        selectedYear
      );

      if (result.success) {
        setSuccess(`Payroll generated successfully for ${selectedMonth}/${selectedYear}`);
        // Reload payroll data to show the new record
        await loadAllPayrollData(employees);
        // Clear form
        setSelectedEmployee('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('[Payroll] Error generating payroll:', error);
      setError('Failed to generate payroll');
    } finally {
      setGenerating(false);
    }
  };

  const handleRunPayroll = async () => {
    try {
      setGenerating(true);
      setError(null);
      console.log('[Payroll] Running payroll for all employees');

      // Get all active employees
      const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE');

      if (activeEmployees.length === 0) {
        setError('No active employees found');
        return;
      }

      // FIXED: Use employeeId instead of id
      const result = await payrollService.batchGeneratePayroll(
        activeEmployees.map(emp => emp.employeeId), // FIXED: Use employeeId
        selectedMonth,
        selectedYear
      );

      if (result.success) {
        setSuccess(`Batch payroll generated: ${result.data.successful}/${result.data.total} employees processed`);
        // Reload payroll data
        await loadAllPayrollData(employees);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('[Payroll] Error running batch payroll:', error);
      setError('Failed to run batch payroll');
    } finally {
      setGenerating(false);
    }
  };

  // Calculate summary statistics
  const processedPayroll = payrollData.filter(p => p.status === 'processed' || p.status === 'paid');
  const pendingPayroll = payrollData.filter(p => p.status === 'pending');
  const totalProcessed = processedPayroll.reduce((sum, p) => sum + (p.netPay || 0), 0);
  const totalPending = pendingPayroll.reduce((sum, p) => sum + (p.netPay || 0), 0);
  const totalGross = payrollData.reduce((sum, p) => sum + (p.grossPay || 0), 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + (p.deductions || 0), 0);

  // Auto-clear success and error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <PayrollContainer>
        <LoadingScreen>Loading payroll data...</LoadingScreen>
      </PayrollContainer>
    );
  }

  return (
    <PayrollContainer>
      <PageHeader>
        <PageTitle>Payroll Management</PageTitle>
        <Button 
          onClick={handleRunPayroll} 
          disabled={generating || employees.length === 0}
        >
          {generating ? 'Processing...' : 'Run Payroll'}
        </Button>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

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

      <PayrollForm>
        <h3>Generate Payroll</h3>
        <FormRow>
          <FormField>
            <FormLabel>Employee</FormLabel>
            <FormSelect 
              value={selectedEmployee} 
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.firstName} {employee.lastName} - {employee.department}
                </option>
              ))}
            </FormSelect>
          </FormField>
          <FormField>
            <FormLabel>Month</FormLabel>
            <FormSelect 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </FormSelect>
          </FormField>
          <FormField>
            <FormLabel>Year</FormLabel>
            <FormInput 
              type="number" 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
            />
          </FormField>
          <Button 
            onClick={handleGeneratePayroll} 
            disabled={generating || !selectedEmployee}
          >
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </FormRow>
      </PayrollForm>

      <Card>
        <CardTitle>Payroll Details</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Employee</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Period</TableHeaderCell>
              <TableHeaderCell>Gross Pay</TableHeaderCell>
              <TableHeaderCell>Deductions</TableHeaderCell>
              <TableHeaderCell>Net Pay</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {payrollData.length > 0 ? (
              payrollData.map(payroll => (
                <TableRow key={payroll.id}>
                  <TableCell>{payroll.employee}</TableCell>
                  <TableCell>{payroll.department}</TableCell>
                  <TableCell>
                    {payroll.payPeriodMonth}/{payroll.payPeriodYear}
                  </TableCell>
                  <TableCell>₹{(payroll.grossPay || 0).toLocaleString()}</TableCell>
                  <TableCell>₹{(payroll.deductions || 0).toLocaleString()}</TableCell>
                  <TableCell>₹{(payroll.netPay || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={payroll.status}>
                      {payroll.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Button size="sm">View</Button>
                      <Button size="sm" variant="secondary">Print</Button>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No payroll records found. Generate payroll for employees to see data here.
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </Card>
    </PayrollContainer>
  );
}

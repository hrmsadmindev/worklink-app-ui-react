import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardHeader, CardTitle, CardContent, CardActions } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalTitle, CloseButton } from './Modal';
import { leaveService } from '../services/leaveService';
import { employeeService } from '../services/employeeService';

// Styled Components
const LeaveContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BalanceCard = styled(Card)`
  position: relative;
  overflow: hidden;
`;

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BalanceTitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BalanceValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const BalanceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ percentage }) => {
    if (percentage >= 80) return '#dc3545'; // Red
    if (percentage >= 60) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }};
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  transition: width 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: white;
  background: ${({ status, theme }) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return theme.colors.success;
      case 'PENDING':
        return theme.colors.warning;
      case 'REJECTED':
        return theme.colors.danger;
      case 'CANCELLED':
        return theme.colors.textSecondary;
      case 'WITHDRAWN':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.light};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const ActionButton = styled(Button)`
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;

const WarningMessage = styled.div`
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

export function Leave({ currentUser }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [currentLeaveForApproval, setCurrentLeaveForApproval] = useState(null);
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    leaveTypeId: 1 // Default leave type
  });

  const [approvalData, setApprovalData] = useState({
    comments: '',
    action: 'approve' // 'approve' or 'reject'
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [currentUser]);

  // Load employees for admin/manager view
  useEffect(() => {
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER') {
      loadEmployees();
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (currentUser?.role === 'ADMIN') {
        // Admin doesn't load specific employee data initially
        setLoading(false);
        return;
      }

      const employeeId = currentUser?.id;
      if (!employeeId) {
        setError('Employee ID not found');
        setLoading(false);
        return;
      }

      // Load employee's data
      await Promise.all([
        loadLeaveRequests(employeeId),
        loadLeaveBalances(employeeId),
        // If user is a manager, load pending approvals
        ...(currentUser?.role === 'MANAGER' ? [loadPendingApprovals(employeeId)] : [])
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees();
      if (result.success) {
        setEmployees(result.data || []);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadLeaveRequests = async (employeeId) => {
    try {
      const result = await leaveService.getEmployeeLeaveRequests(employeeId);
      if (result.success) {
        setLeaveRequests(result.data?.content || []);
      }
    } catch (error) {
      console.error('Error loading leave requests:', error);
    }
  };

  const loadLeaveBalances = async (employeeId) => {
    try {
      const result = await leaveService.getEmployeeLeaveBalances(employeeId);
      if (result.success) {
        setLeaveBalances(result.data || []);
      }
    } catch (error) {
      console.error('Error loading leave balances:', error);
    }
  };

  const loadPendingApprovals = async (managerId) => {
    try {
      const result = await leaveService.getPendingApprovals(managerId);
      if (result.success) {
        setPendingApprovals(result.data?.content || []);
      }
    } catch (error) {
      console.error('Error loading pending approvals:', error);
    }
  };

  const handleEmployeeSelect = async (employee) => {
    setSelectedEmployee(employee);
    setLoading(true);
    
    try {
      await Promise.all([
        loadLeaveRequests(employee.id),
        loadLeaveBalances(employee.id)
      ]);
    } catch (error) {
      setError('Failed to load employee leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate days when dates change
    if (field === 'startDate' || field === 'endDate') {
      const newData = { ...formData, [field]: value };
      if (newData.startDate && newData.endDate) {
        const days = leaveService.calculateDaysRequested(newData.startDate, newData.endDate);
        setFormData(prev => ({ ...prev, daysRequested: days }));
      }
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const employeeId = currentUser?.id;
      if (!employeeId) {
        setError('Employee ID not found');
        return;
      }

      const leaveData = {
        ...formData,
        employeeId: employeeId,
        daysRequested: leaveService.calculateDaysRequested(formData.startDate, formData.endDate)
      };

      // Get current leave balance for validation
      const currentBalance = leaveBalances.find(b => b.leaveTypeId === parseInt(formData.leaveTypeId));

      // Validate the leave request
      const validation = leaveService.validateLeaveRequest(leaveData, currentBalance);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      const result = await leaveService.createLeaveRequest(leaveData);
      if (result.success) {
        setSuccess(result.message);
        setShowCreateModal(false);
        setFormData({
          startDate: '',
          endDate: '',
          reason: '',
          emergencyContact: '',
          leaveTypeId: 1
        });
        
        // Reload leave requests and balances
        await loadLeaveRequests(employeeId);
        await loadLeaveBalances(employeeId);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveReject = async (leaveRequest, action) => {
    setCurrentLeaveForApproval(leaveRequest);
    setApprovalData({ comments: '', action: action });
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = approvalData.action === 'approve'
        ? await leaveService.approveLeaveRequest(currentLeaveForApproval.id, approvalData.comments)
        : await leaveService.rejectLeaveRequest(currentLeaveForApproval.id, approvalData.comments);

      if (result.success) {
        setSuccess(result.message);
        setShowApprovalModal(false);
        
        // Reload data
        const managerId = currentUser?.id;
        if (managerId) {
          await loadPendingApprovals(managerId);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(`Failed to ${approvalData.action} leave request`);
    } finally {
      setSubmitting(false);
    }
  };

  const getLeaveStats = () => {
    const stats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter(l => l.status === 'PENDING').length,
      approved: leaveRequests.filter(l => l.status === 'APPROVED').length,
      rejected: leaveRequests.filter(l => l.status === 'REJECTED').length
    };
    return stats;
  };

  const getCurrentBalance = (leaveTypeId) => {
    return leaveBalances.find(b => b.leaveTypeId === leaveTypeId);
  };

  const getBalanceUsagePercentage = (balance) => {
    const totalDays = (balance.allocatedDays || 0);
    if (totalDays === 0) return 0;
    return (balance.usedDays / totalDays) * 100;
  };

  if (loading) {
    return <LoadingSpinner>Loading leave data...</LoadingSpinner>;
  }

  const stats = getLeaveStats();

  return (
    <div>
      <h2 style={{ 
        marginBottom: '1.5rem', 
        color: '#222e3a', 
        fontFamily: 'Outfit, Inter, sans-serif',
        fontSize: '2rem'
      }}>
        Leave Management
      </h2>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {/* Admin Employee Selection */}
      {currentUser?.role === 'ADMIN' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedEmployee?.id || ''} 
              onChange={(e) => {
                const employee = employees.find(emp => emp.id === parseInt(e.target.value));
                if (employee) handleEmployeeSelect(employee);
              }}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              <option value="">Select an employee...</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.departmentName}
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Only show leave data if user is not admin or admin has selected an employee */}
      {(currentUser?.role !== 'ADMIN' || selectedEmployee) && (
        <>
          {/* Leave Balances */}
          {leaveBalances.length > 0 && (
            <BalanceGrid>
              {leaveBalances.map(balance => (
                <BalanceCard key={balance.id}>
                  <CardContent>
                    <BalanceHeader>
                      <BalanceTitle>{balance.leaveTypeName || 'Annual Leave'}</BalanceTitle>
                      <BalanceValue>{balance.remainingDays || 0}</BalanceValue>
                    </BalanceHeader>
                    <BalanceDetails>
                      <span>Used: {balance.usedDays || 0}</span>
                      <span>Total: {(balance.allocatedDays || 0)}</span>
                    </BalanceDetails>
                    <ProgressBar>
                      <ProgressFill percentage={getBalanceUsagePercentage(balance)} />
                    </ProgressBar>
                  </CardContent>
                </BalanceCard>
              ))}
            </BalanceGrid>
          )}

          {/* Leave Statistics */}
          <StatsGrid>
            <StatCard>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total Requests</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.pending}</StatValue>
              <StatLabel>Pending</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.approved}</StatValue>
              <StatLabel>Approved</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.rejected}</StatValue>
              <StatLabel>Rejected</StatLabel>
            </StatCard>
          </StatsGrid>

          <LeaveContainer>
            {/* Apply for Leave Card - Only for employees viewing their own data */}
            {currentUser?.role !== 'ADMIN' && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ 
                    marginBottom: '1rem', 
                    color: '#4a6886', 
                    fontFamily: 'Inter, sans-serif' 
                  }}>
                    Submit a new leave request for manager approval
                  </p>
                </CardContent>
                <CardActions>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Apply for Leave
                  </Button>
                </CardActions>
              </Card>
            )}

            {/* Pending Approvals - For managers */}
            {currentUser?.role === 'MANAGER' && pendingApprovals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals ({pendingApprovals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Employee</Th>
                        <Th>Dates</Th>
                        <Th>Days</Th>
                        <Th>Reason</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.slice(0, 5).map((leave) => (
                        <tr key={leave.id}>
                          <Td>{leave.employeeName}</Td>
                          <Td>
                            {leaveService.formatDate(leave.startDate)} - {leaveService.formatDate(leave.endDate)}
                          </Td>
                          <Td>{leave.daysRequested}</Td>
                          <Td>{leave.reason?.substring(0, 50)}...</Td>
                          <Td>
                            <ActionButton
                              size="small"
                              variant="success"
                              onClick={() => handleApproveReject(leave, 'approve')}
                            >
                              Approve
                            </ActionButton>
                            <ActionButton
                              size="small"
                              variant="danger"
                              onClick={() => handleApproveReject(leave, 'reject')}
                            >
                              Reject
                            </ActionButton>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </LeaveContainer>

          {/* Leave Requests History */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests History</CardTitle>
            </CardHeader>
            <CardContent>
              {leaveRequests.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <Th>Applied Date</Th>
                      <Th>Leave Type</Th>
                      <Th>Leave Dates</Th>
                      <Th>Days</Th>
                      <Th>Status</Th>
                      <Th>Reason</Th>
                      <Th>Manager Comments</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((leave) => (
                      <tr key={leave.id}>
                        <Td>{leaveService.formatDateTime(leave.appliedDate)}</Td>
                        <Td>{leave.leaveTypeName || 'Annual Leave'}</Td>
                        <Td>
                          {leaveService.formatDate(leave.startDate)} - {leaveService.formatDate(leave.endDate)}
                        </Td>
                        <Td>{leave.daysRequested}</Td>
                        <Td>
                          <StatusBadge status={leave.status}>
                            {leave.status}
                          </StatusBadge>
                        </Td>
                        <Td>{leave.reason?.substring(0, 50)}{leave.reason?.length > 50 && '...'}</Td>
                        <Td>{leave.managerComments || '-'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p style={{ 
                  textAlign: 'center', 
                  color: '#4a6886', 
                  fontFamily: 'Inter, sans-serif',
                  padding: '2rem' 
                }}>
                  No leave requests found
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Leave Request Modal */}
      {showCreateModal && (
        <Modal onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Apply for Leave</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleCreateLeave}>
                <FormGroup>
                  <Label>Leave Type *</Label>
                  <Select
                    value={formData.leaveTypeId}
                    onChange={(e) => handleFormChange('leaveTypeId', parseInt(e.target.value))}
                    required
                  >
                    <option value={1}>Annual Leave</option>
                    <option value={2}>Sick Leave</option>
                    <option value={3}>Personal Leave</option>
                    <option value={4}>Emergency Leave</option>
                  </Select>
                  {formData.leaveTypeId && (
                    <div>
                      {(() => {
                        const balance = getCurrentBalance(parseInt(formData.leaveTypeId));
                        if (balance) {
                          return (
                            <small style={{ color: '#4a6886' }}>
                              Available: {balance.remainingDays || 0} days
                              {(balance.remainingDays || 0) < (formData.daysRequested || 0) && 
                                <WarningMessage>
                                  Insufficient leave balance!
                                </WarningMessage>
                              }
                            </small>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Days Requested</Label>
                  <Input
                    type="number"
                    value={formData.daysRequested || ''}
                    disabled
                    placeholder="Auto-calculated"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Reason *</Label>
                  <TextArea
                    value={formData.reason}
                    onChange={(e) => handleFormChange('reason', e.target.value)}
                    placeholder="Please provide a reason for your leave request..."
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Emergency Contact</Label>
                  <Input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact during leave"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLeave} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && currentLeaveForApproval && (
        <Modal onClick={() => setShowApprovalModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {approvalData.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </ModalTitle>
              <CloseButton onClick={() => setShowApprovalModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
                <strong>Employee:</strong> {currentLeaveForApproval.employeeName}<br/>
                <strong>Leave Type:</strong> {currentLeaveForApproval.leaveTypeName || 'Annual Leave'}<br/>
                <strong>Dates:</strong> {leaveService.formatDate(currentLeaveForApproval.startDate)} - {leaveService.formatDate(currentLeaveForApproval.endDate)}<br/>
                <strong>Days:</strong> {currentLeaveForApproval.daysRequested}<br/>
                <strong>Reason:</strong> {currentLeaveForApproval.reason}
              </p>

              <Form onSubmit={handleApprovalSubmit}>
                <FormGroup>
                  <Label>Comments</Label>
                  <TextArea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder={`Add comments for ${approvalData.action === 'approve' ? 'approval' : 'rejection'}...`}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={approvalData.action === 'approve' ? 'success' : 'danger'}
                onClick={handleApprovalSubmit}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : (approvalData.action === 'approve' ? 'Approve' : 'Reject')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
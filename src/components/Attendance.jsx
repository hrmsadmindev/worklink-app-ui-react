// components/Attendance.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardHeader, CardTitle, CardContent, CardActions } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalTitle, CloseButton } from './Modal';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';

// Styled Components
const AttendanceContainer = styled.div`
 display: grid;
 gap: ${({ theme }) => theme.spacing.lg};
 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const ClockCard = styled(Card)`
 text-align: center;
 background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
 color: ${({ theme }) => theme.colors.white};
 
 h3, p {
 color: ${({ theme }) => theme.colors.white};
 }
`;

const TimeDisplay = styled.div`
 font-size: ${({ theme }) => theme.fontSize.xxxl};
 font-family: ${({ theme }) => theme.typography.fonts.heading};
 font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
 margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const DateDisplay = styled.div`
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 opacity: 0.9;
`;

const StatusBadge = styled.span`
 display: inline-block;
 padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 font-size: ${({ theme }) => theme.fontSize.sm};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
 
 ${({ status, theme }) => {
   switch (status) {
     case 'PRESENT':
       return `background: ${theme.colors.success}; color: white;`;
     case 'LATE':
       return `background: ${theme.colors.warning}; color: white;`;
     case 'ABSENT':
       return `background: ${theme.colors.danger}; color: white;`;
     case 'EARLY_DEPARTURE':
       return `background: ${theme.colors.info}; color: white;`;
     default:
       return `background: ${theme.colors.secondary}; color: ${theme.colors.textPrimary};`;
   }
 }}
`;

const ClockButton = styled(Button)`
 background: ${({ theme }) => theme.colors.white};
 color: ${({ theme }) => theme.colors.primary};
 font-size: ${({ theme }) => theme.fontSize.lg};
 padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
 margin: ${({ theme }) => theme.spacing.sm};
 
 &:hover {
 background: ${({ theme }) => theme.colors.light};
 }
 
 &:disabled {
 background: ${({ theme }) => theme.colors.secondary};
 color: ${({ theme }) => theme.colors.textSecondary};
 opacity: 0.7;
 }
`;

const AttendanceTable = styled.div`
 margin-top: ${({ theme }) => theme.spacing.lg};
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

const LoadingSpinner = styled.div`
 display: flex;
 justify-content: center;
 align-items: center;
 padding: ${({ theme }) => theme.spacing.xl};
 color: ${({ theme }) => theme.colors.textSecondary};
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

const FilterContainer = styled.div`
 display: flex;
 gap: ${({ theme }) => theme.spacing.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 align-items: center;
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
`;

const SummaryGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 gap: ${({ theme }) => theme.spacing.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SummaryCard = styled(Card)`
 text-align: center;
`;

const SummaryValue = styled.div`
 font-size: ${({ theme }) => theme.fontSize.xxl};
 font-family: ${({ theme }) => theme.typography.fonts.heading};
 font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
 color: ${({ theme }) => theme.colors.primary};
 margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const SummaryLabel = styled.div`
 font-size: ${({ theme }) => theme.fontSize.sm};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 color: ${({ theme }) => theme.colors.textSecondary};
`;

export function Attendance({ currentUser }) {
 const [currentTime, setCurrentTime] = useState(new Date());
 const [todayAttendance, setTodayAttendance] = useState(null);
 const [attendanceRecords, setAttendanceRecords] = useState([]);
 const [monthlySummary, setMonthlySummary] = useState(null);
 const [loading, setLoading] = useState(true);
 const [clockLoading, setClockLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(null);
 const [employees, setEmployees] = useState([]);
 const [selectedEmployee, setSelectedEmployee] = useState(null);
 const [startDate, setStartDate] = useState('');
 const [endDate, setEndDate] = useState('');

 // Update current time every second
 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentTime(new Date());
 }, 1000);

 return () => clearInterval(timer);
 }, []);

 // Load initial data
 useEffect(() => {
 loadInitialData();
 }, [currentUser]);

 // Load employees for admin view
 useEffect(() => {
 if (currentUser?.role === 'ADMIN') {
 loadEmployees();
 }
 }, [currentUser]);

 const loadInitialData = async () => {
 setLoading(true);
 setError(null);

 try {
 // For admin, don't load specific employee data initially
 if (currentUser?.role === 'ADMIN') {
 setLoading(false);
 return;
 }

 // For employees, load their own attendance data
 const employeeId = currentUser?.employeeId;
 if (!employeeId) {
 setError('Employee ID not found');
 setLoading(false);
 return;
 }

 await Promise.all([
 loadTodayAttendance(employeeId),
 loadAttendanceRecords(employeeId),
 loadMonthlySummary(employeeId)
 ]);
 } catch (error) {
 console.error('Error loading initial data:', error);
 setError('Failed to load attendance data');
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

 const loadTodayAttendance = async (employeeId) => {
 try {
 const result = await attendanceService.getCurrentDayAttendance(employeeId);
 if (result.success) {
 setTodayAttendance(result.data);
 }
 } catch (error) {
 console.error('Error loading today attendance:', error);
 }
 };

 const loadAttendanceRecords = async (employeeId) => {
 try {
 const result = await attendanceService.getEmployeeAttendance(
 employeeId, startDate, endDate
 );
 if (result.success) {
 setAttendanceRecords(result.data?.content || []);
 }
 } catch (error) {
 console.error('Error loading attendance records:', error);
 }
 };

 const loadMonthlySummary = async (employeeId) => {
 try {
 const now = new Date();
 const result = await attendanceService.getMonthlyAttendanceSummary(
 employeeId, now.getMonth() + 1, now.getFullYear()
 );
 if (result.success) {
 setMonthlySummary(result.data);
 }
 } catch (error) {
 console.error('Error loading monthly summary:', error);
 }
 };

 const handleClockIn = async () => {
 const employeeId = currentUser?.employeeId;
 if (!employeeId) {
 setError('Employee ID not found');
 return;
 }

 setClockLoading(true);
 setError(null);
 setSuccess(null);

 try {
 const result = await attendanceService.clockIn(employeeId);
 if (result.success) {
 setSuccess(result.message);
 await loadTodayAttendance(employeeId);
 await loadAttendanceRecords(employeeId);
 } else {
 setError(result.error);
 }
 } catch (error) {
 setError('Failed to clock in');
 } finally {
 setClockLoading(false);
 }
 };

 const handleClockOut = async () => {
 const employeeId = currentUser?.employeeId;
 if (!employeeId) {
 setError('Employee ID not found');
 return;
 }

 setClockLoading(true);
 setError(null);
 setSuccess(null);

 try {
 const result = await attendanceService.clockOut(employeeId);
 if (result.success) {
 setSuccess(result.message);
 await loadTodayAttendance(employeeId);
 await loadAttendanceRecords(employeeId);
 } else {
 setError(result.error);
 }
 } catch (error) {
 setError('Failed to clock out');
 } finally {
 setClockLoading(false);
 }
 };

 const handleEmployeeSelect = async (employee) => {
 setSelectedEmployee(employee);
 setLoading(true);
 
 try {
 await Promise.all([
 loadTodayAttendance(employee.id),
 loadAttendanceRecords(employee.id),
 loadMonthlySummary(employee.id)
 ]);
 } catch (error) {
 setError('Failed to load employee attendance data');
 } finally {
 setLoading(false);
 }
 };

 const formatTime = (time) => {
 return new Date().toLocaleTimeString([], { 
 hour: '2-digit', 
 minute: '2-digit', 
 second: '2-digit' 
 });
 };

 const formatDate = (date) => {
 return new Date().toLocaleDateString([], { 
 weekday: 'long', 
 year: 'numeric', 
 month: 'long', 
 day: 'numeric' 
 });
 };

 const canClockIn = () => {
 return !todayAttendance?.clockInTime && !clockLoading;
 };

 const canClockOut = () => {
 return todayAttendance?.clockInTime && !todayAttendance?.clockOutTime && !clockLoading;
 };

 if (loading) {
 return <LoadingSpinner>Loading attendance data...</LoadingSpinner>;
 }

 return (
 <div>
 <h2 style={{ 
 marginBottom: '1.5rem', 
 color: '#222e3a', 
 fontFamily: 'Outfit, Inter, sans-serif',
 fontSize: '2rem'
 }}>
 Attendance Management
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
 <select 
 value={selectedEmployee?.id || ''} 
 onChange={(e) => {
 const employee = employees.find(emp => emp.id === parseInt(e.target.value));
 if (employee) handleEmployeeSelect(employee);
 }}
 style={{
 padding: '0.5rem 1rem',
 border: '1px solid #e8e8f1',
 borderRadius: '0.375rem',
 fontSize: '1rem',
 fontFamily: 'Inter, sans-serif',
 width: '100%',
 maxWidth: '300px'
 }}
 >
 <option value="">Select an employee...</option>
 {employees.map(employee => (
 <option key={employee.id} value={employee.id}>
 {employee.firstName} {employee.lastName} - {employee.departmentName}
 </option>
 ))}
 </select>
 </CardContent>
 </Card>
 )}

 {/* Only show attendance data if user is not admin or admin has selected an employee */}
 {(currentUser?.role !== 'ADMIN' || selectedEmployee) && (
 <>
 <AttendanceContainer>
 {/* Clock In/Out Card */}
 <ClockCard>
 <CardContent>
 <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
 <DateDisplay>{formatDate(currentTime)}</DateDisplay>
 
 {todayAttendance && (
 <div style={{ marginBottom: '1rem' }}>
 <StatusBadge status={todayAttendance.status}>
 {todayAttendance.status.replace('_', ' ')}
 </StatusBadge>
 {todayAttendance.clockInTime && (
 <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
 Clock In: {todayAttendance.clockInTime}
 </p>
 )}
 {todayAttendance.clockOutTime && (
 <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
 Clock Out: {todayAttendance.clockOutTime}
 </p>
 )}
 {todayAttendance.totalHours && (
 <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
 Total Hours: {todayAttendance.totalHours.toFixed(2)}
 </p>
 )}
 </div>
 )}

 {/* Only show clock buttons for employees viewing their own attendance */}
 {currentUser?.role !== 'ADMIN' && (
 <div>
 <ClockButton
 onClick={handleClockIn}
 disabled={!canClockIn()}
 >
 {clockLoading ? 'Processing...' : 'Clock In'}
 </ClockButton>
 <ClockButton
 onClick={handleClockOut}
 disabled={!canClockOut()}
 >
 {clockLoading ? 'Processing...' : 'Clock Out'}
 </ClockButton>
 </div>
 )}
 </CardContent>
 </ClockCard>

 {/* Monthly Summary */}
 {monthlySummary && (
 <Card>
 <CardHeader>
 <CardTitle>Monthly Summary</CardTitle>
 </CardHeader>
 <CardContent>
 <SummaryGrid>
 <SummaryCard>
 <SummaryValue>{monthlySummary.presentDays}</SummaryValue>
 <SummaryLabel>Present Days</SummaryLabel>
 </SummaryCard>
 <SummaryCard>
 <SummaryValue>{monthlySummary.absentDays}</SummaryValue>
 <SummaryLabel>Absent Days</SummaryLabel>
 </SummaryCard>
 <SummaryCard>
 <SummaryValue>{monthlySummary.totalHours}</SummaryValue>
 <SummaryLabel>Total Hours</SummaryLabel>
 </SummaryCard>
 <SummaryCard>
 <SummaryValue>{monthlySummary.attendancePercentage}%</SummaryValue>
 <SummaryLabel>Attendance %</SummaryLabel>
 </SummaryCard>
 </SummaryGrid>
 </CardContent>
 </Card>
 )}
 </AttendanceContainer>

 {/* Recent Attendance Records */}
 <Card>
 <CardHeader>
 <CardTitle>Recent Attendance Records</CardTitle>
 </CardHeader>
 <CardContent>
 <FilterContainer>
 <Input
 type="date"
 placeholder="Start Date"
 value={startDate}
 onChange={(e) => setStartDate(e.target.value)}
 />
 <Input
 type="date"
 placeholder="End Date"
 value={endDate}
 onChange={(e) => setEndDate(e.target.value)}
 />
 <Button
 onClick={() => {
 const employeeId = currentUser?.role === 'ADMIN' 
 ? selectedEmployee?.id 
 : currentUser?.id;
 if (employeeId) loadAttendanceRecords(employeeId);
 }}
 >
 Filter
 </Button>
 </FilterContainer>

 <AttendanceTable>
 {attendanceRecords.length > 0 ? (
 <Table>
 <thead>
 <tr>
 <Th>Date</Th>
 <Th>Clock In</Th>
 <Th>Clock Out</Th>
 <Th>Total Hours</Th>
 <Th>Status</Th>
 </tr>
 </thead>
 <tbody>
 {attendanceRecords.map((record) => (
 <tr key={record.id}>
 <Td>{record.date}</Td>
 <Td>{record.clockInTime || '-'}</Td>
 <Td>{record.clockOutTime || '-'}</Td>
 <Td>{record.totalHours ? record.totalHours.toFixed(2) : '-'}</Td>
 <Td>
 <StatusBadge status={record.status}>
 {record.status.replace('_', ' ')}
 </StatusBadge>
 </Td>
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
 No attendance records found
 </p>
 )}
 </AttendanceTable>
 </CardContent>
 </Card>
 </>
 )}
 </div>
 );
}
// components/Employees.jsx - With Horizontal Scrollable Table and Modal Error Handling
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody } from './Modal';
import { employeeService } from '../services/employeeService';

const EmployeesContainer = styled.div`
 max-width: 1200px;
 margin: 0 auto;
`;

const PageHeader = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: ${({ theme }) => theme.spacing.lg};

 @media (max-width: 768px) {
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.md};
   align-items: stretch;
 }
`;

const PageTitle = styled.h2`
 color: ${({ theme }) => theme.colors.textPrimary};
 margin: 0;
 font-size: ${({ theme }) => theme.fontSize.xxxl};
 font-family: ${({ theme }) => theme.typography.fonts.primary};

 @media (max-width: 768px) {
   font-size: ${({ theme }) => theme.fontSize.xxl};
   font-family: ${({ theme }) => theme.typography.fonts.primary};
   text-align: center;
 }
`;

const SearchContainer = styled.div`
 display: flex;
 gap: ${({ theme }) => theme.spacing.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 align-items: center;

 @media (max-width: 768px) {
   flex-direction: column;
   align-items: stretch;
 }
`;

const SearchInput = styled.input`
 padding: ${({ theme }) => theme.spacing.md};
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 color: ${({ theme }) => theme.colors.textPrimary};
 background: ${({ theme }) => theme.colors.white};
 min-width: 300px;
 transition: border-color 0.2s ease;

 &:focus {
   outline: none;
   border-color: ${({ theme }) => theme.colors.primary};
   box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
 }

 @media (max-width: 768px) {
   min-width: 100%;
 }
`;

const SearchButtonGroup = styled.div`
 display: flex;
 gap: ${({ theme }) => theme.spacing.sm};

 @media (max-width: 768px) {
   justify-content: center;
 }
`;

// Table container with horizontal scroll
const TableContainer = styled.div`
 width: 100%;
 overflow-x: auto;
 border-radius: ${({ theme }) => theme.borderRadius.lg};
 box-shadow: ${({ theme }) => theme.shadows.sm};
 background: ${({ theme }) => theme.colors.white};

 /* Custom scrollbar styling */
 &::-webkit-scrollbar {
   height: 8px;
 }

 &::-webkit-scrollbar-track {
   background: ${({ theme }) => theme.colors.light};
   border-radius: ${({ theme }) => theme.borderRadius.sm};
 }

 &::-webkit-scrollbar-thumb {
   background: ${({ theme }) => theme.colors.border};
   border-radius: ${({ theme }) => theme.borderRadius.sm};
 }

 &::-webkit-scrollbar-thumb:hover {
   background: ${({ theme }) => theme.colors.textSecondary};
 }

 /* For Firefox */
 scrollbar-width: thin;
 scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.light};
`;

const Table = styled.table`
 width: 100%;
 min-width: 1000px; /* Minimum width to ensure all columns are visible */
 border-collapse: collapse;
 background: ${({ theme }) => theme.colors.white};
`;

const TableHeader = styled.thead`
 background: ${({ theme }) => theme.colors.secondary};
 position: sticky;
 top: 0;
 z-index: 1;
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
 white-space: nowrap;
 min-width: ${({ minWidth }) => minWidth || 'auto'};

 /* Specific column widths */
 &:nth-child(1) { /* Employee ID */
   min-width: 120px;
 }
 &:nth-child(2) { /* Name */
   min-width: 180px;
 }
 &:nth-child(3) { /* Email */
   min-width: 200px;
 }
 &:nth-child(4) { /* Phone */
   min-width: 130px;
 }
 &:nth-child(5) { /* Department */
   min-width: 130px;
 }
 &:nth-child(6) { /* Position */
   min-width: 150px;
 }
 &:nth-child(7) { /* Status */
   min-width: 100px;
 }
 &:nth-child(8) { /* Actions */
   min-width: 140px;
 }
`;

const TableCell = styled.td`
 padding: ${({ theme }) => theme.spacing.lg};
 color: ${({ theme }) => theme.colors.textPrimary};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 max-width: 200px;

 /* Specific column styling */
 &:nth-child(3) { /* Email column */
   max-width: 250px;
 }

 &:nth-child(8) { /* Actions column */
   white-space: nowrap;
 }
`;

const StatusBadge = styled.span`
 padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
 border-radius: ${({ theme }) => theme.borderRadius.sm};
 font-size: ${({ theme }) => theme.fontSize.sm};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 font-weight: 500;
 text-transform: uppercase;
 white-space: nowrap;

 ${({ status, theme }) => {
   switch (status?.toUpperCase()) {
     case 'ACTIVE':
       return `
         background: rgba(40, 167, 69, 0.1);
         color: ${theme.colors.success};
       `;
     case 'INACTIVE':
       return `
         background: rgba(220, 53, 69, 0.1);
         color: ${theme.colors.danger};
       `;
     case 'TERMINATED':
       return `
         background: rgba(108, 117, 125, 0.1);
         color: ${theme.colors.dark};
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
 white-space: nowrap;
`;

const Form = styled.form`
 display: flex;
 flex-direction: column;
 gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: ${({ theme }) => theme.spacing.md};

 @media (max-width: 768px) {
   grid-template-columns: 1fr;
 }
`;

const FormGroup = styled.div`
 display: flex;
 flex-direction: column;
`;

const Label = styled.label`
 color: ${({ theme }) => theme.colors.textPrimary};
 font-weight: 500;
 margin-bottom: ${({ theme }) => theme.spacing.sm};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Input = styled.input`
 padding: ${({ theme }) => theme.spacing.md};
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 color: ${({ theme }) => theme.colors.textPrimary};
 background: ${({ theme }) => theme.colors.white};
 transition: border-color 0.2s ease;

 &:focus {
   outline: none;
   border-color: ${({ theme }) => theme.colors.primary};
   box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
 }

 &:disabled {
   background-color: ${({ theme }) => theme.colors.light};
   cursor: not-allowed;
 }
`;

const Select = styled.select`
 padding: ${({ theme }) => theme.spacing.md};
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 color: ${({ theme }) => theme.colors.textPrimary};
 background: ${({ theme }) => theme.colors.white};
 cursor: pointer;

 &:focus {
   outline: none;
   border-color: ${({ theme }) => theme.colors.primary};
   box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
 }

 &:disabled {
   background-color: ${({ theme }) => theme.colors.light};
   cursor: not-allowed;
 }
`;

const LoadingMessage = styled.div`
 display: flex;
 justify-content: center;
 align-items: center;
 padding: ${({ theme }) => theme.spacing.xxl};
 color: ${({ theme }) => theme.colors.textSecondary};
 font-size: ${({ theme }) => theme.fontSize.lg};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const ErrorMessage = styled.div`
 background: ${({ theme }) => theme.colors.danger};
 color: white;
 padding: ${({ theme }) => theme.spacing.md};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 text-align: center;
`;

// NEW: Form error message for inside modal
const FormErrorMessage = styled.div`
 background: ${({ theme }) => theme.colors.danger};
 color: white;
 padding: ${({ theme }) => theme.spacing.md};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 text-align: center;
 font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SuccessMessage = styled.div`
 background: ${({ theme }) => theme.colors.success};
 color: white;
 padding: ${({ theme }) => theme.spacing.md};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 text-align: center;
`;

const EmptyState = styled.div`
 text-align: center;
 padding: ${({ theme }) => theme.spacing.xxl};
 color: ${({ theme }) => theme.colors.textSecondary};
`;

// Scroll hint for mobile users
const ScrollHint = styled.div`
 text-align: center;
 color: ${({ theme }) => theme.colors.textSecondary};
 font-size: ${({ theme }) => theme.fontSize.sm};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 margin-bottom: ${({ theme }) => theme.spacing.md};

 @media (min-width: 1200px) {
   display: none;
 }
`;

export function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null); // NEW: Separate form error state
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    dateOfJoining: '',
    salary: ''
  });

  // Load employees on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Employees] Loading employees...');
      const result = await employeeService.getAllEmployees();

      if (result.success) {
        console.log('[Employees] Loaded employees:', result.data);
        setEmployees(result.data || []);
      } else {
        console.error('[Employees] Failed to load employees:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('[Employees] Error loading employees:', error);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: handleSubmit function with form error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError(null);  // Clear form error instead of general error
      setSuccess(null);

      console.log('[Employees] Submitting employee:', formData);
      const result = await employeeService.createEmployee(formData);

      if (result.success) {
        console.log('[Employees] Employee created successfully:', result.data);
        setSuccess('Employee added successfully!');

        // Reset form
        setFormData({
          employeeId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          department: '',
          position: '',
          dateOfJoining: '',
          salary: ''
        });

        setShowModal(false);

        // Reload employees list
        await loadEmployees();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        console.error('[Employees] Failed to create employee:', result.error);
        setFormError(result.error); // Set form error instead of general error
      }
    } catch (error) {
      console.error('[Employees] Error creating employee:', error);
      setFormError('Failed to create employee'); // Set form error instead of general error
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadEmployees();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await employeeService.searchEmployees(searchTerm);

      if (result.success) {
        setEmployees(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const result = await employeeService.deleteEmployee(employeeId);

      if (result.success) {
        setSuccess('Employee deleted successfully!');
        await loadEmployees();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to delete employee');
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // NEW: Clear form error after 8 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  return (
    <EmployeesContainer>
      <PageHeader>
        <PageTitle>Employee Management</PageTitle>
        <Button onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search employees by name, email, department, or employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButtonGroup>
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              setSearchTerm('');
              loadEmployees();
            }}
            disabled={loading}
          >
            Clear
          </Button>
        </SearchButtonGroup>
      </SearchContainer>

      <Card>
        {loading ? (
          <LoadingMessage>Loading employees...</LoadingMessage>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState>
            <h3>No employees found</h3>
            <p>
              {searchTerm.trim() 
                ? `No employees match your search "${searchTerm}"`
                : "No employees have been added yet. Click 'Add Employee' to get started."}
            </p>
          </EmptyState>
        ) : (
          <>
            <ScrollHint>
              💡 Scroll horizontally to view all employee details
            </ScrollHint>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Employee ID</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Phone</TableHeaderCell>
                    <TableHeaderCell>Department</TableHeaderCell>
                    <TableHeaderCell>Position</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.employeeId}</TableCell>
                      <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      <TableCell title={employee.email}>{employee.email}</TableCell>
                      <TableCell>{employee.phone || 'N/A'}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell title={employee.position}>{employee.position}</TableCell>
                      <TableCell>
                        <StatusBadge status={employee.status}>
                          {employee.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Button size="small" variant="secondary">
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="danger"
                            onClick={() => handleDeleteEmployee(employee.employeeId)}
                          >
                            Delete
                          </Button>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false);
          setFormError(null); // Clear form error when closing modal
        }}>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Add New Employee</CardTitle>
            </ModalHeader>
            <ModalBody>
              {/* NEW: Show form errors inside modal */}
              {formError && <FormErrorMessage>{formError}</FormErrorMessage>}

              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Label>First Name *</Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name *</Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 digits"
                      disabled={submitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Date of Joining</Label>
                    <Input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>Department *</Label>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Legal">Legal</option>
                      <option value="IT">IT</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Position *</Label>
                    <Input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>Salary</Label>
                  <Input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={submitting}
                  />
                </FormGroup>

                <ActionButtons>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Employee'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      setShowModal(false);
                      setFormError(null); // Clear form error when canceling
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </ActionButtons>
              </Form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </EmployeesContainer>
  );
}

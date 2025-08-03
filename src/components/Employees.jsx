import React, { useState } from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody } from './Modal';

const EmployeesContainer = styled.div`
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
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return `
          background: rgba(40, 167, 69, 0.1);
          color: ${theme.colors.success};
        `;
      case 'inactive':
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
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
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
  }
`;

export function Employees({ employees, onAddEmployee }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee(formData);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: ''
    });
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <EmployeesContainer>
      <PageHeader>
        <PageTitle>Employee Management</PageTitle>
        <Button onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </PageHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {employees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <StatusBadge status={employee.status}>
                    {employee.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button size="small" variant="outline">
                      Edit
                    </Button>
                    <Button size="small" variant="danger">
                      Delete
                    </Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Add New Employee</CardTitle>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => setShowModal(false)}
              >
                ×
              </Button>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Department</Label>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Position</Label>
                  <Input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <ActionButtons>
                  <Button type="submit" fullWidth>
                    Add Employee
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    fullWidth
                    onClick={() => setShowModal(false)}
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
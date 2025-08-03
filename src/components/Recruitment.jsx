import React, { useState } from 'react';
import styled from 'styled-components';
import Card, { CardTitle, CardContent, CardActions } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody } from './Modal';

const RecruitmentContainer = styled.div`
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

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const JobCard = styled(Card)`
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const JobHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const JobTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const JobDepartment = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const JobMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const JobDescription = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ApplicantCount = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  text-align: center;
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

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export function Recruitment({ jobs, onAddJob }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddJob(formData);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      description: ''
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
    <RecruitmentContainer>
      <PageHeader>
        <PageTitle>Recruitment</PageTitle>
        <Button onClick={() => setShowModal(true)}>
          Post New Job
        </Button>
      </PageHeader>

      <JobGrid>
        {jobs.map(job => (
          <JobCard key={job.id}>
            <JobHeader>
              <JobTitle>{job.title}</JobTitle>
              <JobDepartment>{job.department}</JobDepartment>
            </JobHeader>
            
            <JobMeta>
              <span>📍 {job.location}</span>
              <span>⏱️ {job.type}</span>
            </JobMeta>
            
            <JobDescription>{job.description}</JobDescription>
            
            <CardActions>
              <ApplicantCount>
                {job.applicants} Applicants
              </ApplicantCount>
              <ActionButtons>
                <Button size="small" variant="outline">
                  View Applications
                </Button>
                <Button size="small" variant="secondary">
                  Edit
                </Button>
              </ActionButtons>
            </CardActions>
          </JobCard>
        ))}
      </JobGrid>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Post New Job</CardTitle>
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
                  <Label>Job Title</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
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
                    <option value="Analytics">Analytics</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Job Type</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Job Description</Label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter job description..."
                    required
                  />
                </FormGroup>

                <ActionButtons>
                  <Button type="submit" fullWidth>
                    Post Job
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
    </RecruitmentContainer>
  );
}
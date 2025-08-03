import React, { useState } from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody } from './Modal';

const PerformanceContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.xxxl};
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.textSecondary)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.secondary)};
    color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.textPrimary)};
  }
`;

const TabContent = styled.div`
  display: ${({ active }) => (active ? 'block' : 'none')};
`;

const GoalItem = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GoalTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background: rgba(40, 167, 69, 0.1);
          color: ${theme.colors.success};
        `;
      case 'in-progress':
        return `
          background: rgba(24, 102, 215, 0.1);
          color: ${theme.colors.primary};
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

const GoalEmployee = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GoalDescription = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const ProgressBar = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  height: 8px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  height: 100%;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`;

const ReviewItem = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReviewEmployee = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ReviewMeta = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RatingStars = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.fontSize.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
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
`;

const Select = styled.select`
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

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(24, 102, 215, 0.2);
  }
`;

export function Performance({ goals, reviews, onAddReview }) {
  const [activeTab, setActiveTab] = useState('goals');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee: '',
    reviewer: '',
    period: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReview(formData);
    setFormData({
      employee: '',
      reviewer: '',
      period: ''
    });
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <PerformanceContainer>
      <PageTitle>Performance Management</PageTitle>

      <TabContainer>
        <TabButton 
          active={activeTab === 'goals'} 
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </TabButton>
        <TabButton 
          active={activeTab === 'reviews'} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </TabButton>
      </TabContainer>

      <TabContent active={activeTab === 'goals'}>
        <Card>
          <CardTitle>Performance Goals</CardTitle>
          {goals.map(goal => (
            <GoalItem key={goal.id}>
              <GoalHeader>
                <div>
                  <GoalTitle>{goal.title}</GoalTitle>
                  <GoalEmployee>Employee: {goal.employee}</GoalEmployee>
                </div>
                <StatusBadge status={goal.status}>{goal.status}</StatusBadge>
              </GoalHeader>
              <GoalDescription>{goal.description}</GoalDescription>
              <div>
                <strong>Deadline:</strong> {goal.deadline}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <ProgressBar>
                  <ProgressFill progress={goal.progress} />
                </ProgressBar>
                <ProgressText>{goal.progress}% Complete</ProgressText>
              </div>
            </GoalItem>
          ))}
        </Card>
      </TabContent>

      <TabContent active={activeTab === 'reviews'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <CardTitle>Performance Reviews</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            Create Review
          </Button>
        </div>
        
        <Card>
          {reviews.map(review => (
            <ReviewItem key={review.id}>
              <ReviewHeader>
                <div>
                  <ReviewEmployee>{review.employee}</ReviewEmployee>
                  <ReviewMeta>
                    Reviewer: {review.reviewer} | Period: {review.period}
                  </ReviewMeta>
                  {review.rating > 0 && (
                    <RatingStars>
                      {renderStars(review.rating)}
                    </RatingStars>
                  )}
                </div>
                <StatusBadge status={review.status}>{review.status}</StatusBadge>
              </ReviewHeader>
              {review.date && (
                <ReviewMeta>Completed: {review.date}</ReviewMeta>
              )}
            </ReviewItem>
          ))}
        </Card>
      </TabContent>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Create Performance Review</CardTitle>
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
                  <Label>Employee</Label>
                  <Select
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                    <option value="David Brown">David Brown</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Reviewer</Label>
                  <Input
                    type="text"
                    name="reviewer"
                    value={formData.reviewer}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Review Period</Label>
                  <Input
                    type="text"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    placeholder="e.g., Q1 2024"
                    required
                  />
                </FormGroup>

                <ActionButtons>
                  <Button type="submit" fullWidth>
                    Create Review
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
    </PerformanceContainer>
  );
}
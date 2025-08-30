// components/Performance.jsx - Updated to load goals by employeeId
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardTitle } from './Card';
import Button from './Button';
import { Modal, ModalContent, ModalHeader, ModalBody } from './Modal';
import { performanceService } from '../services/performanceService';
import { employeeService } from '../services/employeeService';

// ... (keep all the existing styled components - they remain the same)

const PerformanceContainer = styled.div`
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
`;

// NEW: Employee selector section
const EmployeeSelector = styled.div`
 display: flex;
 align-items: center;
 gap: ${({ theme }) => theme.spacing.md};
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 padding: ${({ theme }) => theme.spacing.lg};
 background: ${({ theme }) => theme.colors.white};
 border-radius: ${({ theme }) => theme.borderRadius.lg};
 box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SelectorLabel = styled.label`
 color: ${({ theme }) => theme.colors.textPrimary};
 font-weight: 500;
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 white-space: nowrap;
`;

const EmployeeSelect = styled.select`
 padding: ${({ theme }) => theme.spacing.md};
 border: 1px solid ${({ theme }) => theme.colors.border};
 border-radius: ${({ theme }) => theme.borderRadius.md};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
 color: ${({ theme }) => theme.colors.textPrimary};
 background: ${({ theme }) => theme.colors.white};
 min-width: 200px;

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

// ... (keep all other existing styled components)

const TabContainer = styled.div`
 display: flex;
 margin-bottom: ${({ theme }) => theme.spacing.lg};
 background: ${({ theme }) => theme.colors.white};
 border-radius: ${({ theme }) => theme.borderRadius.lg};
 padding: ${({ theme }) => theme.spacing.sm};
 box-shadow: ${({ theme }) => theme.shadows.sm};
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};
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
 font-size: ${({ theme }) => theme.fontSize.md};
 font-family: ${({ theme }) => theme.typography.fonts.primary};

 &:hover {
   background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.secondary)};
   color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.textPrimary)};
 }
`;

const TabContent = styled.div`
 display: ${({ active }) => (active ? 'block' : 'none')};
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

// ... (include all the other styled components from the previous version)

export function Performance({ currentUser }) {
  const [activeTab, setActiveTab] = useState('goals');

  // NEW: Selected employee state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // State for goals
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState(null);

  // State for reviews  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // State for employees (for dropdowns)
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  // Modal and form states
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Goal form data
  const [goalFormData, setGoalFormData] = useState({
    employeeId: '',
    goalTitle: '',
    goalDescription: '',
    priority: 'MEDIUM',
    targetDate: ''
  });

  // Review form data
  const [reviewFormData, setReviewFormData] = useState({
    employeeId: '',
    reviewerId: '',
    reviewType: 'ANNUAL',
    reviewPeriodStart: '',
    reviewPeriodEnd: '',
    overallRating: '',
    strengths: '',
    areasForImprovement: '',
    comments: ''
  });

  // Load employees on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Load goals and reviews when selected employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      loadGoals(selectedEmployeeId);
      loadReviews(selectedEmployeeId);
    } else {
      // Clear data when no employee is selected
      setGoals([]);
      setReviews([]);
    }
  }, [selectedEmployeeId]);

  // Load employees for dropdown options
  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const result = await employeeService.getAllEmployees();

      if (result.success) {
        setEmployees(result.data || []);

        // NEW: Auto-select current user if they are an employee
        if (result.data && result.data.length > 0 && currentUser) {
          // Try to find current user in employee list
          const currentEmployee = result.data.find(emp => 
            emp.email === currentUser.email
          );

          if (currentEmployee) {
            setSelectedEmployeeId(currentEmployee.employeeId.toString());
          } else if (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') {
            // For admin/manager, default to first employee
            setSelectedEmployeeId(result.data[0].employeeId.toString());
          }
        }
      } else {
        console.error('Failed to load employees:', result.error);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // NEW: Updated loadGoals function to accept employeeId parameter
  const loadGoals = async (employeeId) => {
    if (!employeeId) return;

    try {
      setGoalsLoading(true);
      setGoalsError(null);

      console.log('[Performance] Loading goals for employee:', employeeId);

      // Use the existing getGoalsByEmployeeId method
      const result = await performanceService.getGoalsByEmployeeId(employeeId);

      if (result.success) {
        console.log('[Performance] Loaded goals:', result.data);
        setGoals(result.data || []);
      } else {
        console.error('[Performance] Failed to load goals:', result.error);
        setGoalsError(result.error);
      }
    } catch (error) {
      console.error('[Performance] Error loading goals:', error);
      setGoalsError('Failed to load goals');
    } finally {
      setGoalsLoading(false);
    }
  };

  // NEW: Updated loadReviews function to accept employeeId parameter
  const loadReviews = async (employeeId) => {
    if (!employeeId) return;

    try {
      setReviewsLoading(true);
      setReviewsError(null);

      console.log('[Performance] Loading reviews for employee:', employeeId);

      // Use the existing getReviewsByEmployeeId method
      const result = await performanceService.getReviewsByEmployeeId(employeeId);

      if (result.success) {
        console.log('[Performance] Loaded reviews:', result.data);
        setReviews(result.data || []);
      } else {
        console.error('[Performance] Failed to load reviews:', result.error);
        setReviewsError(result.error);
      }
    } catch (error) {
      console.error('[Performance] Error loading reviews:', error);
      setReviewsError('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle employee selection change
  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  // Handle goal form submission
  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError(null);

      console.log('[Performance] Submitting goal:', goalFormData);
      const result = await performanceService.createGoal(goalFormData);

      if (result.success) {
        console.log('[Performance] Goal created successfully:', result.data);
        setSuccess('Goal created successfully!');

        // Reset form
        setGoalFormData({
          employeeId: '',
          goalTitle: '',
          goalDescription: '',
          priority: 'MEDIUM',
          targetDate: ''
        });

        setShowGoalModal(false);

        // Reload goals for the selected employee
        if (selectedEmployeeId) {
          await loadGoals(selectedEmployeeId);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        console.error('[Performance] Failed to create goal:', result.error);
        setFormError(result.error);
      }
    } catch (error) {
      console.error('[Performance] Error creating goal:', error);
      setFormError('Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError(null);

      // Convert rating to integer if provided
      const reviewData = {
        ...reviewFormData,
        overallRating: reviewFormData.overallRating ? parseInt(reviewFormData.overallRating) : null
      };

      console.log('[Performance] Submitting review:', reviewData);
      const result = await performanceService.createReview(reviewData);

      if (result.success) {
        console.log('[Performance] Review created successfully:', result.data);
        setSuccess('Review created successfully!');

        // Reset form
        setReviewFormData({
          employeeId: '',
          reviewerId: '',
          reviewType: 'ANNUAL',
          reviewPeriodStart: '',
          reviewPeriodEnd: '',
          overallRating: '',
          strengths: '',
          areasForImprovement: '',
          comments: ''
        });

        setShowReviewModal(false);

        // Reload reviews for the selected employee
        if (selectedEmployeeId) {
          await loadReviews(selectedEmployeeId);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        console.error('[Performance] Failed to create review:', result.error);
        setFormError(result.error);
      }
    } catch (error) {
      console.error('[Performance] Error creating review:', error);
      setFormError('Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoalChange = (e) => {
    setGoalFormData({
      ...goalFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleReviewChange = (e) => {
    setReviewFormData({
      ...reviewFormData,
      [e.target.name]: e.target.value
    });
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : `Employee #${employeeId}`;
  };

  // Get selected employee name for display
  const getSelectedEmployeeName = () => {
    if (!selectedEmployeeId) return 'No employee selected';
    return getEmployeeName(parseInt(selectedEmployeeId));
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e9ecef' }}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  // Clear form error after 8 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const handleModalClose = (type) => {
    if (type === 'goal') {
      setShowGoalModal(false);
      setGoalFormData({
        employeeId: '',
        goalTitle: '',
        goalDescription: '',
        priority: 'MEDIUM',
        targetDate: ''
      });
    } else {
      setShowReviewModal(false);
      setReviewFormData({
        employeeId: '',
        reviewerId: '',
        reviewType: 'ANNUAL',
        reviewPeriodStart: '',
        reviewPeriodEnd: '',
        overallRating: '',
        strengths: '',
        areasForImprovement: '',
        comments: ''
      });
    }
    setFormError(null);
  };

  return (
    <PerformanceContainer>
      <PageHeader>
        <PageTitle>Performance Management</PageTitle>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            onClick={() => setShowGoalModal(true)}
            disabled={!selectedEmployeeId}
          >
            Add Goal
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowReviewModal(true)}
            disabled={!selectedEmployeeId}
          >
            Add Review
          </Button>
        </div>
      </PageHeader>

      {success && <SuccessMessage>{success}</SuccessMessage>}

      {/* NEW: Employee Selector */}
      <EmployeeSelector>
        <SelectorLabel>View performance for:</SelectorLabel>
        <EmployeeSelect
          value={selectedEmployeeId}
          onChange={handleEmployeeChange}
          disabled={employeesLoading}
        >
          <option value="">Select an employee</option>
          {employees.map(employee => (
            <option key={employee.employeeId} value={employee.employeeId}>
              {employee.firstName} {employee.lastName}
              {employee.email === currentUser?.email && ' (You)'}
            </option>
          ))}
        </EmployeeSelect>
        {selectedEmployeeId && (
          <div style={{ 
            color: '#6c757d', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Showing data for: <strong>{getSelectedEmployeeName()}</strong>
          </div>
        )}
      </EmployeeSelector>

      {/* Only show tabs and content if an employee is selected */}
      {selectedEmployeeId ? (
        <>
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
              <CardTitle>Performance Goals - {getSelectedEmployeeName()}</CardTitle>

              {goalsLoading ? (
                <LoadingMessage>Loading goals...</LoadingMessage>
              ) : goalsError ? (
                <ErrorMessage>{goalsError}</ErrorMessage>
              ) : goals.length === 0 ? (
                <EmptyState>
                  <h3>No goals found</h3>
                  <p>No performance goals have been set for {getSelectedEmployeeName()}. Click 'Add Goal' to create one.</p>
                </EmptyState>
              ) : (
                goals.map(goal => (
                  <div key={goal.goalId || goal.id} style={{
                    background: 'white',
                    border: '1px solid #e8e8f1',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ margin: 0, color: '#222e3a', fontSize: '18px' }}>{goal.goalTitle}</h4>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        background: goal.goalStatus === 'COMPLETED' ? 'rgba(40, 167, 69, 0.1)' : 
                                   goal.goalStatus === 'IN_PROGRESS' ? 'rgba(24, 102, 215, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        color: goal.goalStatus === 'COMPLETED' ? '#28a745' : 
                               goal.goalStatus === 'IN_PROGRESS' ? '#1866d7' : '#ffc107'
                      }}>
                        {goal.goalStatus}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#222e3a' }}>{goal.goalDescription}</p>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Target Date:</strong> {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Not set'}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Priority:</strong> {goal.priority}
                    </div>
                    <div style={{ 
                      background: '#e3eefd', 
                      borderRadius: '4px', 
                      height: '8px', 
                      overflow: 'hidden', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{ 
                        background: '#1866d7', 
                        height: '100%', 
                        width: `${goal.progressPercentage || 0}%`, 
                        transition: 'width 0.3s ease' 
                      }} />
                    </div>
                    <div style={{ fontSize: '14px', color: '#4a6886', textAlign: 'right' }}>
                      {goal.progressPercentage || 0}% Complete
                    </div>
                  </div>
                ))
              )}
            </Card>
          </TabContent>

          <TabContent active={activeTab === 'reviews'}>
            <Card>
              <CardTitle>Performance Reviews - {getSelectedEmployeeName()}</CardTitle>

              {reviewsLoading ? (
                <LoadingMessage>Loading reviews...</LoadingMessage>
              ) : reviewsError ? (
                <ErrorMessage>{reviewsError}</ErrorMessage>
              ) : reviews.length === 0 ? (
                <EmptyState>
                  <h3>No reviews found</h3>
                  <p>No performance reviews have been conducted for {getSelectedEmployeeName()}. Click 'Add Review' to create one.</p>
                </EmptyState>
              ) : (
                reviews.map(review => (
                  <div key={review.reviewId || review.id} style={{
                    background: 'white',
                    border: '1px solid #e8e8f1',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ margin: 0, color: '#222e3a', fontSize: '18px' }}>{getSelectedEmployeeName()}</h4>
                        <div style={{ color: '#4a6886', fontSize: '14px' }}>
                          Reviewer: {getEmployeeName(review.reviewerId)} | 
                          Type: {review.reviewType} |
                          Period: {review.reviewPeriodStart && review.reviewPeriodEnd 
                            ? `${new Date(review.reviewPeriodStart).toLocaleDateString()} - ${new Date(review.reviewPeriodEnd).toLocaleDateString()}` 
                            : 'Not specified'}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        background: '#e3eefd',
                        color: '#4a6886'
                      }}>
                        {review.reviewStatus}
                      </span>
                    </div>

                    {review.overallRating && (
                      <div style={{ color: '#ffc107', fontSize: '18px', marginTop: '12px' }}>
                        {renderStars(review.overallRating)}
                      </div>
                    )}

                    {review.strengths && (
                      <div style={{ marginTop: '12px' }}>
                        <strong>Strengths:</strong> {review.strengths}
                      </div>
                    )}

                    {review.areasForImprovement && (
                      <div style={{ marginTop: '8px' }}>
                        <strong>Areas for Improvement:</strong> {review.areasForImprovement}
                      </div>
                    )}

                    {review.comments && (
                      <div style={{ marginTop: '8px' }}>
                        <strong>Comments:</strong> {review.comments}
                      </div>
                    )}

                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>
                      Created: {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                ))
              )}
            </Card>
          </TabContent>
        </>
      ) : (
        <EmptyState>
          <h3>Select an Employee</h3>
          <p>Choose an employee from the dropdown above to view their performance goals and reviews.</p>
        </EmptyState>
      )}

      {/* Goal Modal - Pre-fill with selected employee */}
      {showGoalModal && (
        <Modal onClose={() => handleModalClose('goal')}>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Create Performance Goal for {getSelectedEmployeeName()}</CardTitle>
            </ModalHeader>
            <ModalBody>
              {formError && <FormErrorMessage>{formError}</FormErrorMessage>}

              <form onSubmit={handleGoalSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Employee *</label>
                    <select
                      name="employeeId"
                      value={goalFormData.employeeId || selectedEmployeeId}
                      onChange={handleGoalChange}
                      required
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.employeeId} value={employee.employeeId}>
                          {employee.firstName} {employee.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Priority</label>
                    <select
                      name="priority"
                      value={goalFormData.priority}
                      onChange={handleGoalChange}
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Goal Title *</label>
                  <input
                    type="text"
                    name="goalTitle"
                    value={goalFormData.goalTitle}
                    onChange={handleGoalChange}
                    required
                    disabled={submitting}
                    placeholder="Enter goal title"
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Description</label>
                  <textarea
                    name="goalDescription"
                    value={goalFormData.goalDescription}
                    onChange={handleGoalChange}
                    disabled={submitting}
                    placeholder="Describe the goal..."
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white',
                      resize: 'vertical',
                      minHeight: '100px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Target Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={goalFormData.targetDate}
                    onChange={handleGoalChange}
                    disabled={submitting}
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Goal'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleModalClose('goal')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Similar updates for Review Modal - pre-fill with selected employee */}
      {showReviewModal && (
        <Modal onClose={() => handleModalClose('review')}>
          <ModalContent>
            <ModalHeader>
              <CardTitle>Create Performance Review for {getSelectedEmployeeName()}</CardTitle>
            </ModalHeader>
            <ModalBody>
              {formError && <FormErrorMessage>{formError}</FormErrorMessage>}

              <form onSubmit={handleReviewSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Employee *</label>
                    <select
                      name="employeeId"
                      value={reviewFormData.employeeId || selectedEmployeeId}
                      onChange={handleReviewChange}
                      required
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.employeeId} value={employee.employeeId}>
                          {employee.firstName} {employee.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Reviewer *</label>
                    <select
                      name="reviewerId"
                      value={reviewFormData.reviewerId}
                      onChange={handleReviewChange}
                      required
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="">Select Reviewer</option>
                      {employees.map(employee => (
                        <option key={employee.employeeId} value={employee.employeeId}>
                          {employee.firstName} {employee.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rest of review form fields... */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Review Type</label>
                    <select
                      name="reviewType"
                      value={reviewFormData.reviewType}
                      onChange={handleReviewChange}
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="ANNUAL">Annual</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="PROBATION">Probation</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Overall Rating (1-5)</label>
                    <select
                      name="overallRating"
                      value={reviewFormData.overallRating}
                      onChange={handleReviewChange}
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Review Period Start</label>
                    <input
                      type="date"
                      name="reviewPeriodStart"
                      value={reviewFormData.reviewPeriodStart}
                      onChange={handleReviewChange}
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Review Period End</label>
                    <input
                      type="date"
                      name="reviewPeriodEnd"
                      value={reviewFormData.reviewPeriodEnd}
                      onChange={handleReviewChange}
                      disabled={submitting}
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8f1',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Strengths</label>
                  <textarea
                    name="strengths"
                    value={reviewFormData.strengths}
                    onChange={handleReviewChange}
                    disabled={submitting}
                    placeholder="What are the employee's key strengths?"
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white',
                      resize: 'vertical',
                      minHeight: '100px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Areas for Improvement</label>
                  <textarea
                    name="areasForImprovement"
                    value={reviewFormData.areasForImprovement}
                    onChange={handleReviewChange}
                    disabled={submitting}
                    placeholder="What areas need improvement?"
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white',
                      resize: 'vertical',
                      minHeight: '100px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                  <label style={{ color: '#222e3a', fontWeight: '500', marginBottom: '8px' }}>Comments</label>
                  <textarea
                    name="comments"
                    value={reviewFormData.comments}
                    onChange={handleReviewChange}
                    disabled={submitting}
                    placeholder="Additional comments..."
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8f1',
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: 'white',
                      resize: 'vertical',
                      minHeight: '100px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Review'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleModalClose('review')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </PerformanceContainer>
  );
}

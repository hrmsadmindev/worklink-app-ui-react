// services/performanceService.js
import api from './api';

export const performanceService = {
  // ============ GOALS API ============

  // Get all goals for an employee
  async getGoalsByEmployeeId(employeeId) {
    try {
      const response = await api.get(`/performance/goals/employee/${employeeId}`);
      console.log('[performanceService] Get goals response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch goals'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error fetching goals:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch goals'
      };
    }
  },

  // Get all goals (for all employees - admin view)
  async getAllGoals() {
    try {
      const response = await api.get('/performance/goals');
      console.log('[performanceService] Get all goals response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch goals'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error fetching all goals:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch goals'
      };
    }
  },

  // Create new goal
  async createGoal(goalData) {
    try {
      const goalPayload = {
        employeeId: goalData.employeeId,
        goalTitle: goalData.goalTitle || goalData.title,
        goalDescription: goalData.goalDescription || goalData.description,
        priority: goalData.priority || 'MEDIUM',
        targetDate: goalData.targetDate,
        goalStatus: 'IN_PROGRESS'
      };

      console.log('[performanceService] Creating goal with payload:', goalPayload);

      const response = await api.post('/performance/goals', goalPayload);
      console.log('[performanceService] Create goal response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to create goal'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error creating goal:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create goal'
      };
    }
  },

  // Update goal progress
  async updateGoalProgress(goalId, progressPercentage) {
    try {
      const response = await api.put(`/performance/goals/${goalId}/progress`, null, {
        params: { progressPercentage }
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to update goal progress'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error updating goal progress:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update goal progress'
      };
    }
  },

  // ============ REVIEWS API ============

  // Get all reviews for an employee
  async getReviewsByEmployeeId(employeeId) {
    try {
      const response = await api.get(`/performance/reviews/employee/${employeeId}`);
      console.log('[performanceService] Get reviews response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch reviews'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error fetching reviews:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch reviews'
      };
    }
  },

  // Get all reviews (for all employees - admin view)
  async getAllReviews() {
    try {
      const response = await api.get('/performance/reviews');
      console.log('[performanceService] Get all reviews response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch reviews'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error fetching all reviews:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch reviews'
      };
    }
  },

  // Create new review
  async createReview(reviewData) {
    try {
      const reviewPayload = {
        employeeId: reviewData.employeeId,
        reviewerId: reviewData.reviewerId,
        reviewType: reviewData.reviewType || 'ANNUAL',
        reviewPeriodStart: reviewData.reviewPeriodStart,
        reviewPeriodEnd: reviewData.reviewPeriodEnd,
        overallRating: reviewData.overallRating || null,
        strengths: reviewData.strengths || '',
        areasForImprovement: reviewData.areasForImprovement || '',
        comments: reviewData.comments || '',
        reviewStatus: 'DRAFT'
      };

      console.log('[performanceService] Creating review with payload:', reviewPayload);

      const response = await api.post('/performance/reviews', reviewPayload);
      console.log('[performanceService] Create review response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to create review'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error creating review:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create review'
      };
    }
  },

  // Update review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/performance/reviews/${reviewId}`, reviewData);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to update review'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error updating review:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update review'
      };
    }
  },

  // Delete goal
  async deleteGoal(goalId) {
    try {
      const response = await api.delete(`/performance/goals/${goalId}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete goal'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error deleting goal:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete goal'
      };
    }
  },

  // Delete review
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/performance/reviews/${reviewId}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete review'
        };
      }
    } catch (error) {
      console.error('[performanceService] Error deleting review:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete review'
      };
    }
  }
};

export default performanceService;

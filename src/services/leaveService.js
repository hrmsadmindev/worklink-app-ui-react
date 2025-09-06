// Updated leaveService.js - Add Leave Balance APIs
import api from './api';

export const leaveService = {
  // =============== LEAVE REQUEST METHODS ===============
  
  // Create leave request
  async createLeaveRequest(leaveRequestData) {
    try {
      const leavePayload = {
        employeeId: leaveRequestData.employeeId,
        leaveTypeId: leaveRequestData.leaveTypeId,
        startDate: leaveRequestData.startDate,
        endDate: leaveRequestData.endDate,
        daysRequested: leaveRequestData.daysRequested,
        reason: leaveRequestData.reason,
        emergencyContact: leaveRequestData.emergencyContact || ''
      };

      console.log('[leaveService] Creating leave request:', leavePayload);

      const response = await api.post('/leave/request', leavePayload);
      console.log('[leaveService] Create leave request response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Leave request submitted successfully'
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to create leave request'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error creating leave request:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create leave request'
      };
    }
  },

  // Get employee leave requests
  async getEmployeeLeaveRequests(employeeId, page = 0, size = 20, sortBy = 'appliedDate', sortDir = 'desc') {
    try {
      const url = `/leave/employee/${employeeId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

      const response = await api.get(url);
      console.log('[leaveService] Get employee leave requests response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch leave requests'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error fetching leave requests:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch leave requests'
      };
    }
  },

  // Get pending approvals for manager
  async getPendingApprovals(managerId, page = 0, size = 20, sortBy = 'appliedDate', sortDir = 'desc') {
    try {
      const url = `/leave/pending-approvals/${managerId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

      const response = await api.get(url);
      console.log('[leaveService] Get pending approvals response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch pending approvals'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error fetching pending approvals:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch pending approvals'
      };
    }
  },

  // Approve leave request
  async approveLeaveRequest(leaveRequestId, comments = '') {
    try {
      const approvalData = {
        leaveRequestId: leaveRequestId,
        comments: comments
      };

      console.log('[leaveService] Approving leave request:', approvalData);

      const response = await api.post('/leave/approve', approvalData);
      console.log('[leaveService] Approve leave response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Leave request approved successfully'
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to approve leave request'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error approving leave request:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to approve leave request'
      };
    }
  },

  // Reject leave request
  async rejectLeaveRequest(leaveRequestId, comments = '') {
    try {
      const rejectionData = {
        leaveRequestId: leaveRequestId,
        comments: comments
      };

      console.log('[leaveService] Rejecting leave request:', rejectionData);

      const response = await api.post('/leave/reject', rejectionData);
      console.log('[leaveService] Reject leave response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Leave request rejected successfully'
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to reject leave request'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error rejecting leave request:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to reject leave request'
      };
    }
  },

  // =============== LEAVE BALANCE METHODS ===============

  // Get employee leave balances
  async getEmployeeLeaveBalances(employeeId, year = null) {
    try {
      let url = `/leave/balance/employee/${employeeId}`;
      if (year) {
        url += `?year=${year}`;
      }

      const response = await api.get(url);
      console.log('[leaveService] Get employee leave balances response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch leave balances'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error fetching leave balances:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch leave balances'
      };
    }
  },

  // Get specific leave balance for employee and leave type
  async getEmployeeLeaveBalance(employeeId, leaveTypeId, year = null) {
    try {
      let url = `/leave/balance/employee/${employeeId}/leave-type/${leaveTypeId}`;
      if (year) {
        url += `?year=${year}`;
      }

      const response = await api.get(url);
      console.log('[leaveService] Get employee leave balance response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch leave balance'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error fetching leave balance:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch leave balance'
      };
    }
  },

  // Allocate leave balance
  async allocateLeaveBalance(employeeId, leaveTypeId, allocatedDays, year = null) {
    try {
      let url = `/leave/balance/allocate?employeeId=${employeeId}&leaveTypeId=${leaveTypeId}&allocatedDays=${allocatedDays}`;
      if (year) {
        url += `&year=${year}`;
      }

      console.log('[leaveService] Allocating leave balance:', { employeeId, leaveTypeId, allocatedDays, year });

      const response = await api.post(url);
      console.log('[leaveService] Allocate leave balance response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Leave balance allocated successfully'
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to allocate leave balance'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error allocating leave balance:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to allocate leave balance'
      };
    }
  },

  // Update carryover days
  async updateCarryoverDays(employeeId, leaveTypeId, carryoverDays, year = null) {
    try {
      let url = `/leave/balance/carryover?employeeId=${employeeId}&leaveTypeId=${leaveTypeId}&carryoverDays=${carryoverDays}`;
      if (year) {
        url += `&year=${year}`;
      }

      console.log('[leaveService] Updating carryover days:', { employeeId, leaveTypeId, carryoverDays, year });

      const response = await api.put(url);
      console.log('[leaveService] Update carryover response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Carryover days updated successfully'
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to update carryover days'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error updating carryover days:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update carryover days'
      };
    }
  },

  // Get all employees leave balances (for admin/HR)
  async getAllEmployeesLeaveBalances(year = null) {
    try {
      let url = '/leave/balance/all';
      if (year) {
        url += `?year=${year}`;
      }

      const response = await api.get(url);
      console.log('[leaveService] Get all employees leave balances response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch all employees leave balances'
        };
      }
    } catch (error) {
      console.error('[leaveService] Error fetching all employees leave balances:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch leave balances'
      };
    }
  },

  // =============== UTILITY METHODS ===============

  // Calculate days between two dates (including both start and end dates)
  calculateDaysRequested(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    return daysDifference + 1; // Include both start and end dates
  },

  // Validate leave request data
  validateLeaveRequest(leaveData, leaveBalance = null) {
    const errors = [];

    if (!leaveData.startDate) {
      errors.push('Start date is required');
    }

    if (!leaveData.endDate) {
      errors.push('End date is required');
    }

    if (!leaveData.reason || leaveData.reason.trim() === '') {
      errors.push('Reason is required');
    }

    if (leaveData.startDate && leaveData.endDate) {
      const startDate = new Date(leaveData.startDate);
      const endDate = new Date(leaveData.endDate);
      const today = new Date();
      
      // Remove time component for date comparison
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (startDate > endDate) {
        errors.push('Start date cannot be after end date');
      }

      if (startDate < today) {
        errors.push('Cannot apply for leaves in the past');
      }

      // Check leave balance if provided
      if (leaveBalance && leaveData.daysRequested) {
        const remainingDays = leaveBalance.remainingDays || 0;
        if (leaveData.daysRequested > remainingDays) {
          errors.push(`Insufficient leave balance. Available: ${remainingDays} days, Requested: ${leaveData.daysRequested} days`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Get leave status color for UI
  getStatusColor(status) {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return '#28a745'; // Green
      case 'PENDING':
        return '#ffc107'; // Yellow
      case 'REJECTED':
        return '#dc3545'; // Red
      case 'CANCELLED':
        return '#6c757d'; // Gray
      case 'WITHDRAWN':
        return '#17a2b8'; // Info blue
      default:
        return '#6c757d'; // Default gray
    }
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  },

  // Format datetime for display
  formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateTimeString;
    }
  },

  // Get progress percentage for leave balance visualization
  getLeaveUsagePercentage(usedDays, totalDays) {
    if (!totalDays || totalDays === 0) return 0;
    return Math.min((usedDays / totalDays) * 100, 100);
  },

  // Get leave balance status color
  getBalanceStatusColor(remainingDays, totalDays) {
    const percentage = this.getLeaveUsagePercentage(totalDays - remainingDays, totalDays);
    
    if (percentage >= 80) return '#dc3545'; // Red - high usage
    if (percentage >= 60) return '#ffc107'; // Yellow - medium usage
    return '#28a745'; // Green - low usage
  }
};

export default leaveService;
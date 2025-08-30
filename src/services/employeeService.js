// services/employeeService.js
import api from './api';

export const employeeService = {
  // Get all employees
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      console.log('[employeeService] Get all employees response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch employees'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error fetching employees:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch employees'
      };
    }
  },

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const response = await api.get(`/employees/${id}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Employee not found'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error fetching employee by ID:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch employee'
      };
    }
  },

  // Create new employee
  async createEmployee(employeeData) {
    try {
      // Set default values
      const employeePayload = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone || '',
        address: employeeData.address || '',
        department: employeeData.department,
        position: employeeData.position,
        dateOfJoining: employeeData.dateOfJoining || new Date().toISOString().split('T')[0],
        salary: employeeData.salary || 0,
        status: 'ACTIVE'
      };

      console.log('[employeeService] Creating employee with payload:', employeePayload);

      const response = await api.post('/employees', employeePayload);
      console.log('[employeeService] Create employee response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to create employee'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error creating employee:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create employee'
      };
    }
  },

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to update employee'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error updating employee:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update employee'
      };
    }
  },

  // Delete employee
  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete employee'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error deleting employee:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete employee'
      };
    }
  },

  // Search employees
  async searchEmployees(keyword) {
    try {
      const response = await api.get(`/employees/search?keyword=${encodeURIComponent(keyword)}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Search failed'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error searching employees:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Search failed'
      };
    }
  },

  // Get employees by department
  async getEmployeesByDepartment(department) {
    try {
      const response = await api.get(`/employees/department/${encodeURIComponent(department)}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch employees by department'
        };
      }
    } catch (error) {
      console.error('[employeeService] Error fetching employees by department:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch employees by department'
      };
    }
  }
};

export default employeeService;

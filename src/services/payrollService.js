// services/payrollService.js
import api from './api';

export const payrollService = {
  // Get payroll records by employee ID
  async getPayrollByEmployeeId(employeeId) {
    try {
      const response = await api.get(`/payroll/employee/${employeeId}`);
      console.log('[payrollService] Get payroll by employee response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch payroll records'
        };
      }
    } catch (error) {
      console.error('[payrollService] Error fetching payroll records:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch payroll records'
      };
    }
  },

  // Get all payroll records (for admin/manager view)
  async getAllPayrollRecords() {
    try {
      // Since there's no direct endpoint for all payroll, we'll need to get all employees first
      // and then get their payroll records. For now, let's return a mock implementation
      // that can be enhanced later with a proper backend endpoint
      console.log('[payrollService] Getting all payroll records...');
      
      // This would require backend enhancement to add GET /api/payroll endpoint
      // For now, we'll return an error indicating this needs backend support
      return {
        success: false,
        error: 'Endpoint not yet implemented. Please use getPayrollByEmployeeId for individual records.'
      };
    } catch (error) {
      console.error('[payrollService] Error fetching all payroll records:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch payroll records'
      };
    }
  },

  // Generate payroll for an employee
  async generatePayroll(employeeId, month, year) {
    try {
      const response = await api.post(`/payroll/generate`, null, {
        params: {
          employeeId,
          month,
          year
        }
      });
      console.log('[payrollService] Generate payroll response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to generate payroll'
        };
      }
    } catch (error) {
      console.error('[payrollService] Error generating payroll:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to generate payroll'
      };
    }
  },

  // Get salary records by employee ID
  async getSalaryByEmployeeId(employeeId) {
    try {
      const response = await api.get(`/payroll/salary/employee/${employeeId}`);
      console.log('[payrollService] Get salary by employee response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch salary records'
        };
      }
    } catch (error) {
      console.error('[payrollService] Error fetching salary records:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch salary records'
      };
    }
  },

  // Create salary record
  async createSalary(salaryData) {
    try {
      const salaryPayload = {
        employeeId: salaryData.employeeId,
        basicSalary: salaryData.basicSalary,
        houseRentAllowance: salaryData.houseRentAllowance || 0,
        medicalAllowance: salaryData.medicalAllowance || 0,
        transportAllowance: salaryData.transportAllowance || 0,
        otherAllowances: salaryData.otherAllowances || 0,
        providentFund: salaryData.providentFund || 0,
        professionalTax: salaryData.professionalTax || 0,
        incomeTax: salaryData.incomeTax || 0,
        otherDeductions: salaryData.otherDeductions || 0,
        effectiveFrom: salaryData.effectiveFrom,
        effectiveTo: salaryData.effectiveTo || null,
        status: salaryData.status || 'ACTIVE'
      };

      console.log('[payrollService] Creating salary with payload:', salaryPayload);

      const response = await api.post('/payroll/salary', salaryPayload);
      console.log('[payrollService] Create salary response:', response);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to create salary record'
        };
      }
    } catch (error) {
      console.error('[payrollService] Error creating salary record:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create salary record'
      };
    }
  },

  // Utility function to get payroll summary for dashboard
  async getPayrollSummary() {
    try {
      // This would require a backend endpoint like GET /api/payroll/summary
      // For now, we'll implement this using existing endpoints
      console.log('[payrollService] Getting payroll summary...');
      
      // Since we don't have a direct summary endpoint, we'll return a placeholder
      return {
        success: false,
        error: 'Payroll summary endpoint not yet implemented in backend'
      };
    } catch (error) {
      console.error('[payrollService] Error fetching payroll summary:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch payroll summary'
      };
    }
  },

  // Batch generate payroll for multiple employees
  async batchGeneratePayroll(employeeIds, month, year) {
    try {
      const promises = employeeIds.map(employeeId => 
        this.generatePayroll(employeeId, month, year)
      );

      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      );
      
      const failed = results.filter(result => 
        result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
      );

      return {
        success: true,
        data: {
          successful: successful.length,
          failed: failed.length,
          total: employeeIds.length,
          results: successful.map(r => r.value.data)
        },
        message: `Payroll generated for ${successful.length}/${employeeIds.length} employees`
      };
    } catch (error) {
      console.error('[payrollService] Error in batch payroll generation:', error);
      return {
        success: false,
        error: error.message || 'Failed to batch generate payroll'
      };
    }
  }
};

export default payrollService;
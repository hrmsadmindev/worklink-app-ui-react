// services/departmentService.js
import api from './api';

export const departmentService = {
    // Get all departments
    async getAllDepartments() {
        try {
            const response = await api.get('/departments');
            console.log('[departmentService] Get all departments response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch departments'
                };
            }
        } catch (error) {
            console.error('[departmentService] Error fetching departments:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch departments'
            };
        }
    }
};

export default departmentService;

// services/attendanceService.js
import api from './api';

export const attendanceService = {
    // Clock in
    async clockIn(employeeId) {
        try {
            const biometricData = {
                employeeId: employeeId,
                timestamp: new Date().toISOString()
            };

            console.log('[attendanceService] Clock in request:', biometricData);

            const response = await api.post('/attendance/clock-in', biometricData);
            console.log('[attendanceService] Clock in response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Clocked in successfully'
                };
            } else {
                return {
                    success: false,
                    error: response.data?.error || 'Failed to clock in'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error during clock in:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to clock in'
            };
        }
    },

    // Clock out
    async clockOut(employeeId) {
        try {
            const biometricData = {
                employeeId: employeeId,
                timestamp: new Date().toISOString()
            };

            console.log('[attendanceService] Clock out request:', biometricData);

            const response = await api.post('/attendance/clock-out', biometricData);
            console.log('[attendanceService] Clock out response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Clocked out successfully'
                };
            } else {
                return {
                    success: false,
                    error: response.data?.error || 'Failed to clock out'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error during clock out:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to clock out'
            };
        }
    },

    // Get employee attendance records
    async getEmployeeAttendance(employeeId, page = 0, size = 20, sortBy = 'date', sortDir = 'desc', startDate = null, endDate = null) {
        try {
            let url = `/attendance/employee/${employeeId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

            if (startDate) {
                url += `&startDate=${startDate}`;
            }
            if (endDate) {
                url += `&endDate=${endDate}`;
            }

            const response = await api.get(url);
            console.log('[attendanceService] Get attendance response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch attendance records'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error fetching attendance:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch attendance records'
            };
        }
    },

    // Get daily report
    async getDailyReport(date, departmentId = null) {
        try {
            let url = `/attendance/daily-report?date=${date}`;

            if (departmentId) {
                url += `&departmentId=${departmentId}`;
            }

            const response = await api.get(url);
            console.log('[attendanceService] Get daily report response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch daily report'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error fetching daily report:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch daily report'
            };
        }
    },

    // Get monthly attendance summary
    async getMonthlyAttendanceSummary(employeeId, month, year) {
        try {
            const response = await api.get(`/attendance/monthly-summary/${employeeId}?month=${month}&year=${year}`);
            console.log('[attendanceService] Get monthly summary response:', response);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch monthly summary'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error fetching monthly summary:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch monthly summary'
            };
        }
    },

    // Get current day attendance status
    async getCurrentDayAttendance(employeeId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await this.getEmployeeAttendance(employeeId, 0, 1, 'date', 'desc', today, today);

            if (response.success && response.data && response.data.content && response.data.content.length > 0) {
                return {
                    success: true,
                    data: response.data.content[0],
                    message: 'Current day attendance found'
                };
            } else {
                return {
                    success: true,
                    data: null,
                    message: 'No attendance record for today'
                };
            }
        } catch (error) {
            console.error('[attendanceService] Error fetching current day attendance:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch current day attendance'
            };
        }
    }
};

export default attendanceService;
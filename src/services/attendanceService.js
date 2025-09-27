// services/attendanceService.js
import api from './api';

export const attendanceService = {
    // Clock in
    async clockIn(employeeId, notes = null) {
        try {
            // Use AttendanceDTO structure (date will be auto-set by backend)
            const attendanceData = {
                employeeId: employeeId,
                date: new Date().toISOString().split('T')[0],
                notes: notes
            };

            console.log('[attendanceService] Clock in request:', attendanceData);

            const response = await api.post('/attendance/clock-in', attendanceData);
            console.log('[attendanceService] Clock in response:', response);

            // Backend returns AttendanceDTO directly, not wrapped in success/data
            return {
                success: true,
                data: response.data,
                message: 'Clocked in successfully'
            };
        } catch (error) {
            console.error('[attendanceService] Error during clock in:', error);
            
            // Extract error message from backend (AttendanceController error handler)
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to clock in';
            
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    // Clock out
    async clockOut(employeeId, notes = null) {
        try {
            // Use AttendanceDTO structure (date will be auto-set by backend)
            const attendanceData = {
                employeeId: employeeId,
                notes: notes
            };

            console.log('[attendanceService] Clock out request:', attendanceData);

            const response = await api.post('/attendance/clock-out', attendanceData);
            console.log('[attendanceService] Clock out response:', response);

            // Backend returns AttendanceDTO directly, not wrapped in success/data
            return {
                success: true,
                data: response.data,
                message: 'Clocked out successfully'
            };
        } catch (error) {
            console.error('[attendanceService] Error during clock out:', error);
            
            // Extract error message from backend (AttendanceController error handler)
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to clock out';
            
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    // Get employee attendance records (NO PAGINATION)
    async getEmployeeAttendance(employeeId, startDate = null, endDate = null) {
        try {
            let url = `/attendance/employee/${employeeId}`;
            const params = new URLSearchParams();

            if (startDate) {
                params.append('startDate', startDate);
            }
            if (endDate) {
                params.append('endDate', endDate);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log('[attendanceService] Get attendance URL:', url);

            const response = await api.get(url);
            console.log('[attendanceService] Get attendance response:', response);

            // Backend returns List<AttendanceDTO> directly
            return {
                success: true,
                data: response.data,
                message: 'Attendance records fetched successfully'
            };
        } catch (error) {
            console.error('[attendanceService] Error fetching attendance:', error);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch attendance records';
            
            return {
                success: false,
                error: errorMessage
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

            console.log('[attendanceService] Get daily report URL:', url);

            const response = await api.get(url);
            console.log('[attendanceService] Get daily report response:', response);

            // Backend returns List<AttendanceDTO> directly
            return {
                success: true,
                data: response.data,
                message: 'Daily report fetched successfully'
            };
        } catch (error) {
            console.error('[attendanceService] Error fetching daily report:', error);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch daily report';
            
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    // Get monthly attendance summary
    async getMonthlyAttendanceSummary(employeeId, month, year) {
        try {
            const response = await api.get(`/attendance/monthly-summary/${employeeId}?month=${month}&year=${year}`);
            console.log('[attendanceService] Get monthly summary response:', response);

            // Backend returns Map<String, Object> directly
            return {
                success: true,
                data: response.data,
                message: 'Monthly summary fetched successfully'
            };
        } catch (error) {
            console.error('[attendanceService] Error fetching monthly summary:', error);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to fetch monthly summary';
            
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    // Get current day attendance status (UPDATED - no pagination)
    async getCurrentDayAttendance(employeeId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await this.getEmployeeAttendance(employeeId, today, today);

            if (response.success && response.data && response.data.length > 0) {
                return {
                    success: true,
                    data: response.data[0], // First record (most recent)
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
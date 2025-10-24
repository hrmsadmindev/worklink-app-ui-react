import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { isModuleEnabled } from '../config/clientConfig';

const RolesContext = createContext();

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};

export const RolesProvider = ({ children }) => {
  const { user, hasRole, hasAnyRole } = useAuth();

  // Define role-based permissions
  const permissions = {
    // Employee Management
    'employee.view': ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    'employee.create': ['ADMIN', 'MANAGER'],
    'employee.edit': ['ADMIN', 'MANAGER'],
    'employee.delete': ['ADMIN'],
    'employee.viewAll': ['ADMIN', 'MANAGER'],
    'employee.viewOwn': ['EMPLOYEE'],

    // Recruitment
    'recruitment.view': ['ADMIN', 'MANAGER'],
    'recruitment.create': ['ADMIN', 'MANAGER'],
    'recruitment.edit': ['ADMIN', 'MANAGER'],
    'recruitment.delete': ['ADMIN'],

    // Performance
    'performance.view': ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    'performance.create': ['ADMIN', 'MANAGER'],
    'performance.edit': ['ADMIN', 'MANAGER'],
    'performance.delete': ['ADMIN'],
    'performance.viewOwn': ['EMPLOYEE'],

    // Payroll
    'payroll.view': ['ADMIN', 'MANAGER'],
    'payroll.create': ['ADMIN', 'MANAGER'],
    'payroll.edit': ['ADMIN', 'MANAGER'],
    'payroll.delete': ['ADMIN'],

    // Admin
    'admin.users': ['ADMIN'],
    'admin.settings': ['ADMIN'],
    'admin.reports': ['ADMIN'],

    // Dashboard
    'dashboard.admin': ['ADMIN'],
    'dashboard.manager': ['MANAGER'],
    'dashboard.employee': ['EMPLOYEE']
  };

  const hasPermission = (permission) => {
    const allowedRoles = permissions[permission];
    if (!allowedRoles) return false;
    return hasAnyRole(allowedRoles);
  };

  const getNavigationItems = () => {
    const allItems = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        path: '/dashboard',
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
      },
      {
        key: 'employees',
        label: 'Employees',
        icon: 'fas fa-users',
        path: '/employees',
        roles: ['ADMIN', 'MANAGER']
      },
      {
        key: 'attendance',
        label: 'Attendance',
        icon: 'fas fa-calendar-check',
        path: '/attendance',
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
      },
      {
        key: 'leave',
        label: 'Leave Management',
        icon: 'fas fa-calendar-times',
        path: '/leave',
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
      },
      {
        key: 'recruitment',
        label: 'Recruitment',
        icon: 'fas fa-briefcase',
        path: '/recruitment',
        roles: ['ADMIN', 'MANAGER']
      },
      {
        key: 'performance',
        label: 'Performance',
        icon: 'fas fa-chart-line',
        path: '/performance',
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
      },
      {
        key: 'payroll',
        label: 'Payroll',
        icon: 'fas fa-money-check-alt',
        path: '/payroll',
        roles: ['ADMIN', 'MANAGER']
      },
      {
        key: 'admin',
        label: 'Administration',
        icon: 'fas fa-cog',
        path: '/admin',
        roles: ['ADMIN']
      }
    ];

    // Filter items based on both role permissions AND client configuration
    return allItems.filter(item => {
      // Check if user has required roles
      const hasRequiredRole = hasAnyRole(item.roles);
      // Check if module is enabled for current client
      const isEnabledForClient = isModuleEnabled(item.key);

      return hasRequiredRole && isEnabledForClient;
    });
  };

  const canAccessRoute = (route) => {
    const routePermissions = {
      '/dashboard': ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      '/employees': ['ADMIN', 'MANAGER'],
      '/recruitment': ['ADMIN', 'MANAGER'],
      '/performance': ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      '/payroll': ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      '/admin': ['ADMIN']
    };

    const allowedRoles = routePermissions[route];
    if (!allowedRoles) return true; // Allow access to routes not explicitly restricted

    // Check both role access and client module availability
    const hasRoleAccess = hasAnyRole(allowedRoles);
    const moduleName = route.replace('/', ''); // Convert '/employees' to 'employees'
    const isModuleEnabledForClient = isModuleEnabled(moduleName);

    return hasRoleAccess && isModuleEnabledForClient;
  };

  const value = {
    permissions,
    hasPermission,
    getNavigationItems,
    canAccessRoute,
    currentRole: user?.role || user?.roles?.[0],
    allRoles: user?.roles || [user?.role].filter(Boolean)
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
};

export default RolesContext;

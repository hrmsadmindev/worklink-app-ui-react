import { useContext } from 'react';
import RolesContext from './context/RolesContext';

export const useRole = () => {
  const context = useContext(RolesContext);

  if (!context) {
    throw new Error('useRole must be used within a RolesProvider');
  }

  return context;
};

export default useRole;
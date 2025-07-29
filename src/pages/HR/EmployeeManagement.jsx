import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const EmployeeManagement = () => {
  return (
    <UpdateSoon 
      title="Employee Management"
      description="Comprehensive employee database and management system. Handle employee records, onboarding, offboarding, and maintain detailed personnel information."
      icon={FaUserTie}
      expectedDate="Update Soon"
      userType="HR"
    />
  );
};

export default EmployeeManagement; 
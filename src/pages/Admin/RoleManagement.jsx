import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const RoleManagement = () => {
  return (
    <UpdateSoon 
      title="Role Management"
      description="Advanced user role and permission management system. Configure user access levels, manage role assignments, and control system permissions with granular control."
      icon={FaUserShield}
      expectedDate="Update Soon"
      userType="Admin"
    />
  );
};

export default RoleManagement; 
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const HR = () => {
  return (
    <UpdateSoon 
      title="HR Dashboard"
      description="Human resources management and employee oversight. Monitor team performance, manage employee records, and coordinate HR activities across departments."
      icon={FaUsers}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default HR; 
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Overview = () => {
  return (
    <UpdateSoon 
      title="HR Overview"
      description="Human Resources dashboard with comprehensive employee management, performance tracking, and organizational insights. Monitor workforce metrics and streamline HR operations."
      icon={FaUsers}
      expectedDate="Update Soon"
      userType="HR"
    />
  );
};

export default Overview; 
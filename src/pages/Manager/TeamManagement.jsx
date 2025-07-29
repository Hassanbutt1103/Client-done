import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const TeamManagement = () => {
  return (
    <UpdateSoon 
      title="Team Management"
      description="Comprehensive team leadership and management tools. Coordinate team activities, track performance, manage assignments, and foster team collaboration."
      icon={FaUserTie}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default TeamManagement; 
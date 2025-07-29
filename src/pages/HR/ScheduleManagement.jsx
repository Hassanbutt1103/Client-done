import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const ScheduleManagement = () => {
  return (
    <UpdateSoon 
      title="Schedule Management"
      description="Employee scheduling and time management system. Manage work schedules, track attendance, handle time-off requests, and optimize workforce allocation."
      icon={FaCalendarAlt}
      expectedDate="Update Soon"
      userType="HR"
    />
  );
};

export default ScheduleManagement; 
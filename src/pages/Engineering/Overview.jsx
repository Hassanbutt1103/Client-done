import React from 'react';
import { FaCogs } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Overview = () => {
  return (
    <UpdateSoon 
      title="Engineering Overview"
      description="Engineering operations dashboard with project insights, technical metrics, and development analytics. Monitor project progress and engineering performance."
      icon={FaCogs}
      expectedDate="Update Soon"
      userType="Engineering"
    />
  );
};

export default Overview; 
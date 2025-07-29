import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const PerformanceMetrics = () => {
  return (
    <UpdateSoon 
      title="Performance Metrics"
      description="Employee performance tracking and analytics. Monitor KPIs, conduct performance reviews, and generate insights to improve workforce productivity."
      icon={FaChartBar}
      expectedDate="Update Soon"
      userType="HR"
    />
  );
};

export default PerformanceMetrics; 
import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const PerformanceMetrics = () => {
  return (
    <UpdateSoon 
      title="Performance Metrics"
      description="Engineering performance analytics and quality metrics. Track development velocity, monitor code quality, and analyze team productivity."
      icon={FaChartLine}
      expectedDate="Update Soon"
      userType="Engineering"
    />
  );
};

export default PerformanceMetrics; 
import React from 'react';
import { FaCalculator } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const Accounting = () => {
  return (
    <UpdateSoon 
      title="Accounting Dashboard"
      description="Managerial accounting tools and departmental financial tracking. Access accounting reports, manage departmental budgets, and monitor financial performance."
      icon={FaCalculator}
      expectedDate="Update Soon"
      userType="Manager"
    />
  );
};

export default Accounting; 
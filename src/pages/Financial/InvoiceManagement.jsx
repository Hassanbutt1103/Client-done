import React from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import UpdateSoon from '../../components/UpdateSoon';

const InvoiceManagement = () => {
  return (
    <UpdateSoon 
      title="Invoice Management"
      description="Comprehensive invoice management and billing system. Create invoices, track payments, manage receivables, and streamline financial operations."
      icon={FaFileInvoiceDollar}
      expectedDate="Update Soon"
      userType="Financial"
    />
  );
};

export default InvoiceManagement; 
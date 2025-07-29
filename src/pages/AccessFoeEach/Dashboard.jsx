import React, { useState } from 'react';

const Dashboard = () => {
  const [uploadMethod, setUploadMethod] = useState('csv');

  const [formData, setFormData] = useState({
    users: '',
    month: '',
    expense: '',
    revenue: '',
    profit: '',
    assets: '',
    liabilities: '',
    cashflow: '',
    issues: '',
    tasks: '',
    issueBy: '',
    week: '',
    progress: '',
    productName: '',
    productSales: '',
    monthlySales: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle =
    'w-60 p-2 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none';

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: '#1a2a33' }}>
      <h1 className="text-3xl font-bold text-[#f59e42] mb-6">Business Dashboard</h1>

      {/* Upload Method */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-white">Choose Upload Method:</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-xl border ${
              uploadMethod === 'csv'
                ? 'bg-[#f59e42] text-white'
                : 'bg-transparent border-white text-white'
            }`}
            onClick={() => setUploadMethod('csv')}
          >
            Upload CSV
          </button>
          <button
            className={`px-4 py-2 rounded-xl border ${
              uploadMethod === 'manual'
                ? 'bg-[#f59e42] text-white'
                : 'bg-transparent border-white text-white'
            }`}
            onClick={() => setUploadMethod('manual')}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {/* Manual Input Fields */}
      {uploadMethod === 'manual' && (
        <div className="grid md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Total Users"
            className={inputStyle}
            value={formData.users}
            onChange={e => handleChange('users', e.target.value)}
          />
          <input
            type="text"
            placeholder="Month"
            className={inputStyle}
            value={formData.month}
            onChange={e => handleChange('month', e.target.value)}
          />
          <input
            type="text"
            placeholder="Expense"
            className={inputStyle}
            value={formData.expense}
            onChange={e => handleChange('expense', e.target.value)}
          />
          <input
            type="text"
            placeholder="Revenue"
            className={inputStyle}
            value={formData.revenue}
            onChange={e => handleChange('revenue', e.target.value)}
          />
          <input
            type="text"
            placeholder="Profit"
            className={inputStyle}
            value={formData.profit}
            onChange={e => handleChange('profit', e.target.value)}
          />
          <input
            type="text"
            placeholder="Assets"
            className={inputStyle}
            value={formData.assets}
            onChange={e => handleChange('assets', e.target.value)}
          />
          <input
            type="text"
            placeholder="Liabilities"
            className={inputStyle}
            value={formData.liabilities}
            onChange={e => handleChange('liabilities', e.target.value)}
          />
          <input
            type="text"
            placeholder="Cashflow"
            className={inputStyle}
            value={formData.cashflow}
            onChange={e => handleChange('cashflow', e.target.value)}
          />
          <input
            type="text"
            placeholder="Issues"
            className={inputStyle}
            value={formData.issues}
            onChange={e => handleChange('issues', e.target.value)}
          />
          <input
            type="text"
            placeholder="Tasks"
            className={inputStyle}
            value={formData.tasks}
            onChange={e => handleChange('tasks', e.target.value)}
          />
          <input
            type="text"
            placeholder="Issue By"
            className={inputStyle}
            value={formData.issueBy}
            onChange={e => handleChange('issueBy', e.target.value)}
          />
          <input
            type="text"
            placeholder="Week"
            className={inputStyle}
            value={formData.week}
            onChange={e => handleChange('week', e.target.value)}
          />
          <input
            type="text"
            placeholder="Progress (%)"
            className={inputStyle}
            value={formData.progress}
            onChange={e => handleChange('progress', e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Name"
            className={inputStyle}
            value={formData.productName}
            onChange={e => handleChange('productName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Sales"
            className={inputStyle}
            value={formData.productSales}
            onChange={e => handleChange('productSales', e.target.value)}
          />
          <input
            type="text"
            placeholder="Monthly Sales"
            className={inputStyle}
            value={formData.monthlySales}
            onChange={e => handleChange('monthlySales', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

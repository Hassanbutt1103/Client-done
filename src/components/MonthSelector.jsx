import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MonthSelector = ({ 
  onMonthChange, 
  selectedMonth = null, 
  showCustomRange = true,
  className = "",
  label = "Filter by Month"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('current');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Generate month options (current month + 12 previous months)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Current month
    options.push({
      value: 'current',
      label: 'Current Month',
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    });

    // Previous months (1-12 months ago)
    for (let i = 1; i <= 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      options.push({
        value: `${i}month`,
        label: `${monthName} (${i} month${i > 1 ? 's' : ''} ago)`,
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
      });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    // Set initial selection based on selectedMonth prop
    if (selectedMonth) {
      const option = monthOptions.find(opt => 
        opt.startDate.getTime() === selectedMonth.startDate.getTime() &&
        opt.endDate.getTime() === selectedMonth.endDate.getTime()
      );
      if (option) {
        setSelectedOption(option.value);
      }
    }
  }, [selectedMonth]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    
    if (onMonthChange) {
      onMonthChange({
        value: option.value,
        label: option.label,
        startDate: option.startDate,
        endDate: option.endDate
      });
    }
  };

  const handleCustomRangeSubmit = () => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      
      if (onMonthChange) {
        onMonthChange({
          value: 'custom',
          label: `Custom Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          startDate: startDate,
          endDate: endDate
        });
      }
      setIsOpen(false);
    }
  };

  const getCurrentSelection = () => {
    if (selectedOption === 'custom' && customStartDate && customEndDate) {
      return `Custom: ${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`;
    }
    
    const option = monthOptions.find(opt => opt.value === selectedOption);
    return option ? option.label : 'Select Month';
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#1e293b] border border-gray-600 rounded-lg text-white hover:bg-[#334155] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-400" />
            <span className="text-sm">{getCurrentSelection()}</span>
          </div>
          {isOpen ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[#1e293b] border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {/* Quick Options */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-400 mb-2 px-2">Quick Select</div>
              {monthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                    selectedOption === option.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-[#334155]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            {showCustomRange && (
              <div className="border-t border-gray-600 p-3">
                <div className="text-xs font-medium text-gray-400 mb-3">Custom Range</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#334155] border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#334155] border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCustomRangeSubmit}
                    disabled={!customStartDate || !customEndDate}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-150"
                  >
                    Apply Custom Range
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Month Display */}
      {selectedOption && (
        <div className="mt-2 text-xs text-gray-400">
          {selectedOption === 'custom' && customStartDate && customEndDate ? (
            <span>
              Showing data from {new Date(customStartDate).toLocaleDateString()} to {new Date(customEndDate).toLocaleDateString()}
            </span>
          ) : (
            <span>
              {monthOptions.find(opt => opt.value === selectedOption)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthSelector; 
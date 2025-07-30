import React, { useState, useEffect } from 'react'

const Transection = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const transactionData = Array.isArray(data) && data.length > 0 ? data : [];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="w-full h-full">
      {transactionData.length > 0 ? (
        <>
                     {isMobile && (
             <div className="mb-2 text-center">
               <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                 <span>←</span> Scroll horizontally to see all columns <span>→</span>
               </p>
               <div className="w-full bg-gray-700 h-1 rounded-full mt-2">
                 <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
               </div>
             </div>
           )}
                     <div className={`overflow-x-auto ${isMobile ? 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : ''}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
             <div className="bg-[#1e293b] rounded-lg border border-gray-600 overflow-hidden" style={{ minWidth: isMobile ? '800px' : 'auto' }}>
             <table className={`${isMobile ? 'min-w-[800px]' : 'w-full'} text-sm`}>
              <thead className="bg-[#334155]">
                <tr>
                  <th className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-left text-gray-200 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>ID</th>
                  <th className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-left text-gray-200 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>Date</th>
                  <th className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-left text-gray-200 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>Description</th>
                  <th className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-right text-gray-200 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>Amount</th>
                  <th className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-center text-gray-200 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {transactionData.map((transaction, index) => (
                  <tr 
                    key={transaction.id || index} 
                    className="hover:bg-[#334155]/50 transition-colors duration-200 text-white"
                  >
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} font-mono ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      #{transaction.id || index + 1}
                    </td>
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
                      <span className="text-gray-300">
                        {isMobile ? transaction.date?.split('/').slice(0, 2).join('/') : transaction.date}
                      </span>
                    </td>
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'}`}>
                      <span className={`text-gray-200 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {isMobile ? transaction.description?.substring(0, 20) + '...' : transaction.description}
                      </span>
                    </td>
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-right`}>
                      <span className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'} ${
                        transaction.type === 'Credit' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        R$ {Number(transaction.amount).toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className={`${isMobile ? 'px-3 py-2' : 'px-6 py-4'} text-center`}>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        transaction.type === 'Credit' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                     </div>
           
           {/* Summary Footer */}
           <div className={`mt-4 flex ${isMobile ? 'flex-col gap-2' : 'justify-between'} items-center ${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>
             <span>Total Transactions: {transactionData.length}</span>
             <span>
               Last Updated: {new Date().toLocaleDateString()}
             </span>
           </div>
         </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No transaction data available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transection

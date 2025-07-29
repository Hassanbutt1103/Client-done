import React from 'react'

const Transection = ({ data }) => {
  const transactionData = Array.isArray(data) && data.length > 0 ? data : [];

  return (
    <div className="w-full h-full">
      {transactionData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="bg-[#1e293b] rounded-lg border border-gray-600 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#334155]">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Description</th>
                  <th className="px-6 py-4 text-right text-gray-200 font-semibold">Amount</th>
                  <th className="px-6 py-4 text-center text-gray-200 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {transactionData.map((transaction, index) => (
                  <tr 
                    key={transaction.id || index} 
                    className="hover:bg-[#334155]/50 transition-colors duration-200 text-white"
                  >
                    <td className="px-6 py-4 font-mono text-sm">
                      #{transaction.id || index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {transaction.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-200 font-medium">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg ${
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
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border ${
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
          <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Total Transactions: {transactionData.length}</span>
            <span>
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
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

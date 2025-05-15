import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const CreditHistoryPage = () => {
  const { t } = useTranslation('dashboard'); // Assuming you have a 'dashboard' namespace
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15; // Number of items per page

  const fetchHistory = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/credits/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: page,
          limit: limit
        }
      });
      setHistory(response.data.history || []);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(response.data.current_page || 1);
    } catch (err) {
      console.error("Error fetching credit history:", err);
      setError(err.response?.data?.error || t('creditHistory.errors.loadFailed', 'Failed to load credit history.'));
      setHistory([]); // Clear history on error
    } finally {
      setIsLoading(false);
    }
  }, [token, t, limit]);

  useEffect(() => {
    if (token) {
      fetchHistory(currentPage);
    }
  }, [fetchHistory, currentPage, token]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!token) {
    // Or a redirect to login, or a more user-friendly message
    return <p>{t('creditHistory.authRequired', 'Please log in to view your credit history.')}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{t('creditHistory.title', 'Credit History')}</h1>

      {isLoading && <p>{t('creditHistory.loading', 'Loading credit history...')}</p>}
      {error && <p className="text-red-500">{t('creditHistory.errorLabel', 'Error:')} {error}</p>}

      {!isLoading && !error && history.length === 0 && (
        <p>{t('creditHistory.noHistory', 'No credit transactions found.')}</p>
      )}

      {!isLoading && !error && history.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('creditHistory.table.date', 'Date')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('creditHistory.table.description', 'Description')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('creditHistory.table.change', 'Change')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('creditHistory.table.balance', 'Balance')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.change_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change_amount > 0 ? '+' : ''}{item.change_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.balance_after_change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                {t('pagination.previous', 'Previous')}
              </button>
              <span className="text-sm text-gray-700">
                {t('pagination.page', 'Page')} {currentPage} {t('pagination.of', 'of')} {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                {t('pagination.next', 'Next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreditHistoryPage; 
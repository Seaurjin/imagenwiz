import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, isAuthenticated, forceRefreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const fetchPaymentHistory = async () => {
    if (!showHistory) {
      setShowHistory(true);
      try {
        setLoadingHistory(true);
        const response = await axios.get('/payment/history');
        setPaymentHistory(response.data.history || []);
        setHistoryError('');
      } catch (err) {
        setHistoryError('Failed to load payment history. Please try again later.');
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    } else {
      setShowHistory(false);
    }
  };

  // Format date in a readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Please Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You need to be signed in to view your profile.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and view your purchase history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Created</p>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Credit Balance</p>
                <p className="mt-1 text-lg font-bold text-teal-600">{user?.credits || 0}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.is_admin ? (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Admin</span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Standard User</span>
                  )}
                </p>
              </div>
              
              {user?.is_admin && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Admin Tools</p>
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/admin/settings"
                      className="inline-flex items-center px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Site Settings
                    </Link>
                    <Link
                      to="/cms"
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      CMS Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={async () => {
                  setRefreshing(true);
                  await forceRefreshUserData();
                  setRefreshing(false);
                }}
                disabled={refreshing}
                className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded flex items-center justify-center"
              >
                {refreshing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>Refresh Account Status</>
                )}
              </button>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Go to Dashboard →
              </Link>
              
              {user?.is_admin && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Admin Tools</h3>
                  <div className="flex space-x-2">
                    <Link
                      to="/admin/settings"
                      className="text-sm px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded"
                    >
                      Site Settings
                    </Link>
                    <Link
                      to="/cms"
                      className="text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      CMS Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Credits</h2>
              <Link
                to="/pricing"
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              >
                View Pricing Plans
              </Link>
            </div>
            <p className="text-gray-600 mb-4">
              Your current credit balance: <span className="font-bold">{user?.credits || 0}</span> credits
            </p>
            <div className="text-sm text-gray-500">
              <p>Need more credits? Visit our pricing page to purchase additional credit packages.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <button
                onClick={fetchPaymentHistory}
                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                {showHistory ? 'Hide History' : 'View History'}
              </button>
            </div>

            {showHistory && (
              <>
                {historyError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{historyError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {loadingHistory ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="rounded-full bg-teal-200 h-10 w-10 flex items-center justify-center mb-3">
                        <svg className="h-5 w-5 text-teal-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Loading history...</p>
                    </div>
                  </div>
                ) : paymentHistory.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't made any purchases yet.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/pricing"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-600 bg-teal-100 hover:bg-teal-200"
                      >
                        View pricing plans
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credits
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(payment.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.credit_gained}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.payment_status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : payment.payment_status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
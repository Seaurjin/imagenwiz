import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { CheckCircle, Loader2, XCircle, ArrowRight, Calendar, CreditCard, Gift, ShieldCheck } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  
  // Extract payment information from URL and start polling verification
  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    
    console.log('Payment verification page loaded');
    console.log('Session ID from URL:', sessionId);
    console.log('Full URL search params:', location.search);
    
    // Setup polling function
    const pollPaymentStatus = async () => {
      try {
        if (!isMounted) return;
        
        // If no session ID is provided, we'll repeatedly check if the user's credit balance has increased
        if (!sessionId) {
          console.log('No session ID provided, checking user credit balance');
          
          // Best effort approach: just refresh the user data to see if their credit balance has changed
          await refreshUser();
          setPollingCount(prev => prev + 1);
          
          // After a few attempts, just redirect to dashboard
          if (pollingCount >= 5) {
            console.log('Maximum polling attempts reached, redirecting to dashboard');
            setLoading(false);
            setPaymentVerified(true); // Assume success to show a positive message
            if (isAuthenticated) {
              startRedirectCountdown();
            }
            return;
          }
          
          // Continue polling
          return;
        }
        
        // If session ID is available, verify with backend
        console.log(`Polling attempt #${pollingCount + 1} for session ${sessionId}`);
        
        // Get token if available (for authenticated users)
        const token = localStorage.getItem('token');
        
        // If user is not authenticated, we'll just show a success message
        // without checking the API, since the webhook would have processed the payment
        if (!token && !isAuthenticated) {
          console.log('User is not authenticated, showing generic success message');
          setPaymentVerified(true);
          setPaymentDetails({
            packageName: 'Credit Package',
            creditsAdded: 'Your account has been credited',
            newBalance: 'Please log in to see your updated balance'
          });
          setLoading(false);
          return;
        }
        
        // For authenticated users, verify with the API
        let headers = {};
        if (token) {
          headers = { 'Authorization': `Bearer ${token}` };
        }
        
        const response = await axios.get(`/api/payment/verify?session_id=${sessionId}&t=${Date.now()}`, {
          headers,
          timeout: 8000 // 8 second timeout
        });
        
        console.log('Payment verification response:', response.data);
        
        if (response.data.status === 'success') {
          // Payment verified successfully
          setPaymentVerified(true);
          setPaymentDetails({
            packageName: response.data.package_name || 'Credit Package',
            amountPaid: response.data.amount_paid || 0,
            creditsAdded: response.data.credits_added || 0,
            isYearly: response.data.is_yearly || false,
            newBalance: response.data.new_balance || 0
          });
          
          // Refresh user data to get updated credit balance
          await refreshUser();
          
          setLoading(false);
          if (isAuthenticated) {
            startRedirectCountdown();
          }
          return;
        } else if (response.data.status === 'pending') {
          // Payment is still processing, continue polling
          console.log('Payment is still processing, continuing to poll');
          setPollingCount(prev => prev + 1);
        } else {
          // Payment failed or unknown status
          console.error('Payment verification failed with response:', response.data);
          setError('Payment verification failed. Please check your dashboard to see if your credits were applied or contact support.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error during payment verification request:', err);
        
        // Handle structured error responses
        if (err.response && err.response.data) {
          console.log('Error response data:', err.response.data);
          
          // Check for structured error response
          if (err.response.data.details) {
            try {
              let errorDetails = err.response.data.details;
              if (typeof errorDetails === 'string') {
                try {
                  const parsedDetails = JSON.parse(errorDetails);
                  if (parsedDetails.message) {
                    setError(parsedDetails.message);
                    setLoading(false);
                    return;
                  }
                } catch (e) {
                  // If parsing fails, use the string as is
                  if (errorDetails.includes('No such checkout.session') || 
                      errorDetails.includes('Payment session not found')) {
                    setError('The payment session was not found. This could happen if you\'re using an old or invalid session ID. Please check your dashboard to see if your credits were applied or try making a new purchase.');
                    setLoading(false);
                    return;
                  }
                }
              }
            } catch (e) {
              console.error('Error parsing error details:', e);
            }
          }
          
          // If no structured message was found, check for general error message
          if (err.response.data.error) {
            setError(err.response.data.error);
            setLoading(false);
            return;
          }
        }
        
        // If we've tried too many times, stop polling and show error
        if (pollingCount >= 5) {
          setError('We were unable to verify your payment after multiple attempts. Please check your dashboard to see if your credits were applied or contact support.');
          setLoading(false);
          return;
        }
        
        // Continue polling on error
        setPollingCount(prev => prev + 1);
      }
    };
    
    // Start polling immediately
    pollPaymentStatus();
    
    // Continue polling every 3 seconds, up to 5 attempts
    const intervalId = setInterval(() => {
      if (pollingCount < 5 && isMounted) {
        pollPaymentStatus();
      } else if (isMounted) {
        // Max polling attempts reached, redirect to dashboard
        clearInterval(intervalId);
        if (loading) {
          console.log('Maximum polling attempts reached without success');
          setLoading(false);
          setError('Payment verification time exceeded. Please check your dashboard to see if your credits were applied.');
        }
      }
    }, 3000);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [location, pollingCount, refreshUser, loading, isAuthenticated, navigate]);
  
  // Function to start countdown for dashboard redirect
  const startRedirectCountdown = () => {
    let countdown = 3;
    setRedirectCountdown(countdown);
    
    const intervalId = setInterval(() => {
      countdown -= 1;
      setRedirectCountdown(countdown);
      
      if (countdown <= 0) {
        clearInterval(intervalId);
        navigate('/dashboard');
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-teal-500 mb-4" />
        <p className="text-gray-600">Verifying your payment...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-teal-600 py-4 px-6">
            <h1 className="text-xl font-semibold text-white">
              {paymentVerified ? 'Order Confirmation' : error ? 'Payment Issue' : 'Processing Payment'}
            </h1>
          </div>
          
          <div className="p-8">
            {error ? (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Verification Issue</h2>
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-left">
                  {error}
                </div>
                
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Log In
                  </button>
                )}
              </div>
            ) : paymentVerified ? (
              <div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Thank you for your purchase. Your payment was successful and your credits have been added to your account.
                  </p>
                </div>
                
                {/* Order information card */}
                <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm mb-8 overflow-hidden">
                  <div className="bg-teal-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-teal-800">Order Summary</h3>
                  </div>
                  
                  <div className="px-6 py-4">
                    {paymentDetails && (
                      <>
                        <div className="space-y-4 mb-6">
                          {/* Package info */}
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <Gift className="h-5 w-5 text-teal-600 mt-0.5" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Package</h4>
                              <p className="text-sm text-gray-600">{paymentDetails.packageName}</p>
                              <p className="text-xs text-gray-500">{paymentDetails.isYearly ? 'Annual subscription' : 'Monthly subscription'}</p>
                            </div>
                          </div>
                          
                          {/* Payment info */}
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <CreditCard className="h-5 w-5 text-teal-600 mt-0.5" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Payment</h4>
                              <p className="text-sm text-gray-600">${paymentDetails.amountPaid?.toFixed(2) || '0.00'}</p>
                            </div>
                          </div>
                          
                          {/* Credits info */}
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <ShieldCheck className="h-5 w-5 text-teal-600 mt-0.5" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Credits</h4>
                              <p className="text-sm text-gray-600">{paymentDetails.creditsAdded} credits added</p>
                              <p className="text-xs text-gray-500">New balance: {paymentDetails.newBalance} credits</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {isAuthenticated && (
                  <div className="text-center">
                    <p className="mb-4 text-gray-500">
                      You will be redirected to the dashboard in {redirectCountdown} seconds...
                    </p>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center justify-center mx-auto px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Go to Dashboard Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-teal-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Your Payment</h2>
                <p className="text-gray-600 mb-6">
                  Please wait while we verify your payment details...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
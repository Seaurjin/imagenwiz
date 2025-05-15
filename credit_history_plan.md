## Plan for User Credit History Page

**1. Backend Enhancements:**

*   **Database Model (`CreditLog`):**
    *   Create a new SQLAlchemy model named `CreditLog`.
    *   Fields:
        *   `id` (Primary Key, Integer)
        *   `user_id` (Foreign Key to `User` model, Integer, Indexed)
        *   `timestamp` (DateTime, default to current time)
        *   `change_amount` (Integer, positive for credits added, negative for credits consumed)
        *   `balance_after_change` (Integer, the user's credit balance after this transaction)
        *   `source_type` (String, e.g., "plan_purchase", "image_processing", "manual_adjustment", "referral_bonus", "initial_credits")
        *   `source_details` (String or JSON, optional, to store relevant IDs like `plan_id`, `image_id`, or a description for manual adjustments)
        *   `description` (String, human-readable summary of the transaction, e.g., "Purchased Pro Plan", "Processed image 'sunset.jpg'", "Admin credit adjustment")
*   **API Endpoint (`/api/credits/history`):**
    *   Create a new GET endpoint in a relevant Flask blueprint (e.g., a new `credits_bp` or within the existing `auth_bp` or a user-specific blueprint).
    *   Requires JWT authentication (`@jwt_required()`).
    *   Fetches `CreditLog` entries for the currently authenticated user (`get_jwt_identity()`).
    *   Supports pagination (e.g., `?page=1&limit=20`).
    *   Orders results by `timestamp` (descending).
    *   Returns a JSON array of credit log entries.
*   **Logic for Logging Credit Changes:**
    *   Identify all existing backend functions where user credits are modified:
        *   User registration (initial credits, if any).
        *   Plan purchases / Stripe webhook for successful payments.
        *   Image processing functions that deduct credits.
        *   Any admin tools for manually adjusting credits.
    *   In each of these functions, after successfully modifying a user's credit balance, create and save a new `CreditLog` entry.
    *   Ensure these operations are atomic (e.g., within a database transaction) to maintain consistency between the user's credit balance and the log.

**2. Frontend Enhancements:**

*   **New React Component (`CreditHistoryPage.jsx`):**
    *   Create a new page component located at `frontend/src/pages/CreditHistoryPage.jsx`.
    *   Fetch credit history from the `/api/credits/history` endpoint using `axios`.
    *   Display the credit history in a clear, tabular format.
        *   Columns: Date & Time, Description/Source, Amount Changed (+/-), Balance After.
    *   Implement pagination controls if the API supports it (e.g., "Previous", "Next" buttons).
    *   Show a loading state while data is being fetched.
    *   Handle potential errors during data fetching and display an appropriate message.
*   **Routing:**
    *   Add a new route in `frontend/src/App.jsx` for `/dashboard/credit-history` that renders the `CreditHistoryPage` component.
    *   Ensure this route is protected and only accessible to authenticated users.
*   **Dashboard Navigation:**
    *   Add a new link/tab in the user dashboard's navigation (e.g., in `DashboardLayout.jsx` or a similar navigation component) pointing to "/dashboard/credit-history". The link text could be "Credit History" or "Transaction History".
*   **Styling:**
    *   Style the page and table using Tailwind CSS to match the existing dashboard's look and feel.
    *   Use distinct visual cues for credit additions (e.g., green text or + sign) and deductions (e.g., red text or - sign).

**3. Data Migration/Backfilling (Consideration):**

*   If there's existing credit data or transaction history that isn't currently logged in this new `CreditLog` format, a one-time data migration script might be needed. This is outside the scope of the immediate feature implementation but should be noted if historical accuracy is critical from day one. For now, the log will start recording from the moment this feature is deployed.

**4. Testing:**

*   **Backend:**
    *   Unit tests for the `CreditLog` model creation.
    *   Integration tests for the `/api/credits/history` endpoint (authentication, data retrieval, pagination).
    *   Tests to ensure `CreditLog` entries are correctly created whenever credits are modified.
*   **Frontend:**
    *   Component tests for `CreditHistoryPage.jsx` (rendering, data display, loading/error states, pagination).
    *   End-to-end tests to verify the user flow: navigating to the page, viewing credit history. 
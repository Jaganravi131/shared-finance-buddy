
# ExpenseEase: Shared Expense Management Solution

ExpenseEase is a comprehensive web application designed to simplify shared expense tracking, automate cost-splitting, and reduce financial conflicts for roommates, travel groups, and collaborative teams.

## Project Overview

ExpenseEase provides an intuitive platform for managing shared expenses with features like real-time balance tracking, payment integration, and receipt scanning.

### Target Audience

- Students and roommates sharing rent/utilities
- Travel groups splitting trip costs
- Colleagues managing team expenses

### Key Features

- **Expense Logging**: Log expenses with detailed information such as amount, date, category, payer, and participants.
- **Split Methods**: Split expenses equally, by percentage, or with custom amounts.
- **Real-Time Balance Tracking**: Dashboard showing "You Owe" and "You Are Owed" balances.
- **Multi-Group Support**: Create separate groups (e.g., "Apartment 2024," "Summer Trip") with role-based access.
- **Payment Integration**: Settle debts directly via PayPal with transaction tracking.
- **Receipt Scanning**: OCR technology to extract expense details from receipts automatically.
- **Payment Reminders**: Automated notifications for pending payments.
- **Currency Conversion**: Support for multiple currencies including USD, INR, EUR, JPY, and GBP.

## Usage Instructions

### Adding an Expense

1. Navigate to the "Add Expense" tab.
2. Enter the expense details (title, amount, date, category).
3. Select who paid for the expense.
4. Choose a split method (equal, custom, etc.).
5. Submit the expense.

### Scanning a Receipt

1. Click on "Scan Receipt" in the header.
2. Use your device's camera to take a picture of the receipt.
3. The app will extract expense details using OCR technology.
4. Review and adjust the extracted information if needed.
5. Submit the expense.

### Settling Up

1. Navigate to the "Balances" tab.
2. Review your current balances with group members.
3. Click "Settle Up" to pay what you owe.
4. Choose a payment method (Cash, PayPal, Venmo, etc.).
5. Complete the payment.

### Managing Groups

1. Navigate to the "Group" tab.
2. View existing group members.
3. Add new members with the "Add Member" button.
4. Each group has an Admin who can manage group settings.

## API Integration

### PayPal Integration

ExpenseEase uses the PayPal SDK for payment processing. To configure:

1. The app uses a client ID for authentication.
2. Payments are processed through PayPal's checkout system.
3. Transaction records sync back to ExpenseEase to update balances.

```javascript
// PayPal Configuration Example
const PAYPAL_CLIENT_ID = "YOUR_CLIENT_ID";

// Initialize PayPal SDK
const script = document.createElement("script");
script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
script.async = true;
document.body.appendChild(script);
```

Replace `YOUR_CLIENT_ID` with your actual PayPal Client ID.

### OCR Receipt Scanning

The receipt scanning feature uses OCR technology to extract expense details:

1. The app captures an image of the receipt.
2. The image is processed to extract text and data.
3. Extracted information is used to pre-fill expense details.

## Technical Information

ExpenseEase is built with:

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI components
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Data Persistence**: Local Storage (in demo version)
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

### Local Development

To run the project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. The app will be available at `http://localhost:5173`

## Customization Options

Users can customize their experience through profile settings:

1. **Preferred Currency**: Choose between USD, INR, EUR, JPY, and GBP.
2. **Notifications**: Enable/disable app notifications.
3. **Payment Reminders**: Set reminders for pending payments.
4. **Personal Information**: Update name, email, and avatar.

## License

ExpenseEase is available under the MIT License.

---

© 2025 ExpenseEase. All rights reserved.

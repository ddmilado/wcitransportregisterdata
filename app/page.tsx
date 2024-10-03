"use client"; // Mark this component as a Client Component
import { useState } from "react";
import { Client, Account } from 'appwrite';


const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66c8fb260036e14ffbf2');
  const account = new Account(client);
export default function Home() {
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const [isSubmitting, setIsSubmitting] = useState(false); // State for button active/inactive

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    // Get userId and secret from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId'); // Extract userId from query parameters
    const secret = urlParams.get('secret'); // Extract secret from query parameters

    if (!userId || !secret) {
      alert('UserID and Secret must be provided in the URL.'); // Alert if userId or secret is missing
      setIsSubmitting(false); // Re-enable the button
      return; // Exit the function if values are missing
    }

    try {
      const result = await account.updateRecovery(
        userId, // userId
        secret, // secret
        newPassword // password
      );
      console.log(result); // Log the result or handle it as needed
      alert(`Password successfully updated! UserID: ${userId}, Secret: ${secret}`); // Alert with userId and secret
    } catch (error) {
      // Handle error (e.g., show an error message)
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
        <h2>Enter New Password</h2> {/* Header for the form */}
        {/* Form for entering new password */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${newPassword ? 'text-black' : ''}`} // Change text color to black if newPassword is not empty
            disabled={isSubmitting} // Disable input while submitting
          />
          <button
            type="submit"
            className={`bg-red-700 text-white rounded-full h-10 w-40 hover:bg-red-500 transition duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
        {/* End of Form */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* You can add footer elements here */}
      </footer>
    </div>
  );
}

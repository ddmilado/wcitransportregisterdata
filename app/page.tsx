"use client"; // Mark this component as a Client Component

import Image from "next/image";
import { useState } from "react"; // Import useState for managing input state
// Import useState for managing input state
import { Client, Account, Databases } from 'appwrite';
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66e8e38f00086688d657');

const DATABASE_ID = '66e8e3f4002bf9158a49'; // Store your database ID here
const COLLECTION_ID = '66e8e4060021b62520d3'; // Store your collection ID here

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(""); // State for wallet address
  const [isSubmitting, setIsSubmitting] = useState(false); // State for button active/inactive
  const [documentId, setDocumentId] = useState("66e8e9fe0014da157afd"); // State for document ID

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Specify the type for 'e'
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Set button to inactive

    console.log("Submitting wallet address:", walletAddress); // Debugging statement

    try {
      const database = new Databases(client); // Create a Databases instance
      // Validate documentId before using it
      if (documentId.length > 36 || !/^[a-zA-Z0-9_]+$/.test(documentId) || documentId.startsWith('_')) {
        throw new Error("Invalid documentId format.");
      }

      const response = await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, 'walletAddress', { walletAddress }); // Pass walletAddress as an object
      console.log("Document updated:", response); // Log the response
      alert("Wallet Address updated"); // Show success alert
      setWalletAddress(""); // Clear the input field
    } catch (error) {
      console.error("Error updating wallet address:", error); // Log the error object
      alert(`Failed to update wallet address: ${(error as Error).message || error}`); // Cast error to Error type
    } finally {
      setIsSubmitting(false); // Set button back to active
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* New Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter a wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)} // Update state on input change
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting} // Disable input while submitting
          />
          <button
            type="submit"
            className={`bg-red-700 text-white rounded-full h-10 w-40 hover:bg-red-500 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
        {/* End of New Form Section */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">    
      </footer>
    </div>
  );
}

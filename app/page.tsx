"use client"; // Mark this component as a Client Component
import { useState } from "react";
import { Client, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66e8e38f00086688d657');

const DATABASE_ID = '66e8e3f4002bf9158a49'; // Your database ID
const COLLECTION_ID = '66e8e4060021b62520d3'; // Your collection ID

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(""); // State for wallet address input
  const [isSubmitting, setIsSubmitting] = useState(false); // State for button active/inactive
  // const [documentId, setDocumentId] = useState("66e8e9fe0014da157afd"); // State for document ID

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Disable the button during submission

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      alert("Invalid wallet address format. Please enter a valid address.");
      setIsSubmitting(false);
      return; // Exit early if the format is invalid
    }

    console.log("Submitting wallet address:", walletAddress); // Debugging statement

    try {
      const database = new Databases(client); // Create a Databases instance

      // Create a new document in the collection with the wallet address
      const response = await database.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
        walletAddress: walletAddress, // Pass walletAddress as part of an object
      });

      console.log("Document created:", response); // Log the response on success
      alert("Wallet Address added successfully!"); // Show success alert
      setWalletAddress(""); // Clear the input field

      // Schedule deletion of the document after 3 minutes (180000 milliseconds)
      setTimeout(async () => {
        try {
          await database.deleteDocument(DATABASE_ID, COLLECTION_ID, response.$id); // Delete the document
          console.log("Document deleted after 3 minutes:", response.$id); // Log deletion
        } catch (error) {
          console.error("Error deleting document:", error); // Log any errors during deletion
        }
      }, 180000); // 3 minutes in milliseconds

    } catch (error) {
      console.error("Error adding wallet address:", error); // Log the error object
      alert(`Failed to add wallet address: ${(error as Error).message || error}`); // Show error message
    } finally {
      setIsSubmitting(false); // Enable the button again
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Form for entering wallet address */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter a wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)} 
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${walletAddress ? 'text-black' : ''}`} // Change text color to black if walletAddress is not empty
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

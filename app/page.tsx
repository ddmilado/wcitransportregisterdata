"use client";
import { useState, useEffect } from "react";
import { Client, Databases, Models } from "appwrite";

// Extend the Appwrite Document interface
interface Register extends Models.Document {
  fullName: string;
  location: string;
  phoneNumber: string;
  worshippersToChurch: number;
  worshippersFromChurch: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67581f8c003e096231c3");

const databases = new Databases(client);

export default function Home() {
  const [registrations, setRegistrations] = useState<Register[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await databases.listDocuments<Register>(
        "675821f00019a9ddd1c0", // Database ID
        "678bea500016265fa4f9", // Collection ID
      );
      
      // Filter registrations to only show entries less than 24 hours old
      const twentyFourHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000);
      const recentRegistrations = response.documents.filter((registration: Register) => {
        const registrationDate = new Date(registration.$createdAt);
        return registrationDate > twentyFourHoursAgo;
      });
      
      setRegistrations(recentRegistrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Options for displaying time without seconds
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          WCI DUBAI TRANSPORTATION UNIT REGISTER
        </h1>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
            {registrations.length === 0 ? (
              <p className="text-center text-gray-500">No registrations found</p>
            ) : (
              registrations.map((registration) => (
                <div
                  key={registration.$id}
                  className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  {/* Header with avatar and full name */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-700 text-lg font-semibold">
                        {registration.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {registration.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Signed In at{" "}
                        {new Date(registration.$createdAt).toLocaleTimeString([], timeOptions)}
                      </p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Location */}
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11c-4 0-7 3-7 7h14c0-4-3-7-7-7z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {registration.location}
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {registration.phoneNumber}
                      </span>
                    </div>

                    {/* Worshippers to Church */}
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 01-8 0M12 3v4m0 0a4 4 0 00-4 4v2a4 4 0 004 4 4 4 0 004-4v-2a4 4 0 00-4-4z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        Worshippers to Church: {registration.worshippersToChurch}
                      </span>
                    </div>

                    {/* Worshippers from Church */}
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 01-8 0M12 3v4m0 0a4 4 0 00-4 4v2a4 4 0 004 4 4 4 0 004-4v-2a4 4 0 00-4-4z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        Worshippers from Church: {registration.worshippersFromChurch}
                      </span>
                    </div>
                  </div>

                  {/* Signed Out Time */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Signed Out at{" "}
                      {new Date(registration.$updatedAt).toLocaleTimeString([], timeOptions)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

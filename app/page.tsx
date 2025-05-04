"use client";
import { useState, useEffect } from "react";
import { Client, Databases, Models } from "appwrite";

// Define the Register interface
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

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67581f8c003e096231c3");

const databases = new Databases(client);

export default function Home() {
  const [registrations, setRegistrations] = useState<Register[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 5;

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await databases.listDocuments<Register>(
        "675821f00019a9ddd1c0", // Database ID
        "678bea500016265fa4f9"  // Collection ID
      );

      const sorted = response.documents.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
      setRegistrations(sorted);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = registrations.slice(indexOfFirstRegistration, indexOfLastRegistration);
  const totalPages = Math.ceil(registrations.length / registrationsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-800 tracking-tight drop-shadow-sm">
            WCI Dubai Transportation Register
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Most recent entries listed first
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur shadow-2xl rounded-2xl p-6 space-y-6">
          {currentRegistrations.length === 0 ? (
            <p className="text-center text-gray-500">No registrations found</p>
          ) : (
            currentRegistrations.map((registration) => {
              const createdAt = new Date(registration.$createdAt);
              const updatedAt = new Date(registration.$updatedAt);
              return (
                <div
                  key={registration.$id}
                  className="rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition duration-300 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xl font-bold">
                      {registration.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{registration.fullName}</h3>
                      <p className="text-sm text-gray-500">
                        {createdAt.toLocaleDateString(undefined, dateOptions)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Signed In: {createdAt.toLocaleTimeString([], timeOptions)}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                    <p>📍 Location: {registration.location}</p>
                    <p>📞 Phone: {registration.phoneNumber}</p>
                    <p>🧍‍♂️ To Church: {registration.worshippersToChurch}</p>
                    <p>🚶‍♀️ From Church: {registration.worshippersFromChurch}</p>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Signed Out: {updatedAt.toLocaleTimeString([], timeOptions)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {registrations.length > registrationsPerPage && (
          <div className="flex justify-between items-center mt-8 px-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              ⬅ Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Client, Databases, Models, Query } from "appwrite";

// Appwrite document type
interface Register extends Models.Document {
  fullName: string;
  location: string;
  phoneNumber: string;
  worshippersToChurch: number;
  worshippersFromChurch: number;
  $createdAt: string;
  $updatedAt: string;
  $id: string;
}

// Appwrite client setup
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

  // Fetch all documents with cursor-based pagination
  const fetchRegistrations = async () => {
    const allDocs: Register[] = [];
    let lastId: string | null = null;
    let hasMore = true;
    const pageLimit = 100;

    try {
      while (hasMore) {
        const queries = [Query.limit(pageLimit)];
        if (lastId) {
          queries.push(Query.cursorAfter(lastId));
        }

        const response = await databases.listDocuments<Register>(
          "675821f00019a9ddd1c0",
          "678bea500016265fa4f9",
          queries
        );

        allDocs.push(...response.documents);

        if (response.documents.length < pageLimit) {
          hasMore = false;
        } else {
          lastId = response.documents[response.documents.length - 1].$id;
        }
      }

      const sorted = allDocs.sort(
        (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );

      setRegistrations(sorted);
    } catch (err) {
      console.error("Error fetching all registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Date and Time Formatters
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

  // Pagination Logic
  const indexOfLast = currentPage * registrationsPerPage;
  const indexOfFirst = indexOfLast - registrationsPerPage;
  const currentRegs = registrations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(registrations.length / registrationsPerPage);

  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-400">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-purple-400 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
            WCI Dubai Transportation Register
          </h1>
          <p className="text-gray-200 mt-2 text-lg">Latest entries appear first</p>
        </div>

        {/* Content Cards */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 space-y-6">
          {currentRegs.length === 0 ? (
            <p className="text-center text-gray-500">No registrations found.</p>
          ) : (
            currentRegs.map((reg) => {
              const createdAt = new Date(reg.$createdAt);
              const updatedAt = new Date(reg.$updatedAt);
              return (
                <div
                  key={reg.$id}
                  className="rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                      {reg.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{reg.fullName}</h3>
                      <p className="text-sm text-gray-500">{createdAt.toLocaleDateString(undefined, dateOptions)}</p>
                      <p className="text-sm text-gray-500">
                        Signed In: {createdAt.toLocaleTimeString([], timeOptions)}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                    <p>📍 Location: {reg.location}</p>
                    <p>📞 Phone: {reg.phoneNumber}</p>
                    <p>🧍‍♂️ To Church: {reg.worshippersToChurch}</p>
                    <p>🚶‍♀️ From Church: {reg.worshippersFromChurch}</p>
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
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

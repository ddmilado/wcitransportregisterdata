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
  const registrationsPerPage = 6;

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
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  // Helper function to check if document was actually updated
  const isUpdated = (reg: Register) => {
    const created = new Date(reg.$createdAt).getTime();
    const updated = new Date(reg.$updatedAt).getTime();
    return updated > created + 1000; // 1 second tolerance
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Transportation Register
            </h1>
            <p className="text-gray-600">WCI Dubai Church Services</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-medium">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
              {registrations.length} Total Registrations
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Registration Cards */}
        {currentRegs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No registrations found</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentRegs.map((reg) => {
              const createdAt = new Date(reg.$createdAt);
              const updatedAt = new Date(reg.$updatedAt);
              const wasUpdated = isUpdated(reg);
              const hasToChurch = reg.worshippersToChurch && reg.worshippersToChurch > 0;
              const hasFromChurch = reg.worshippersFromChurch && reg.worshippersFromChurch > 0;
              
              return (
                <div
                  key={reg.$id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(reg.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {reg.fullName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{createdAt.toLocaleDateString(undefined, dateOptions)}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span>{createdAt.toLocaleTimeString([], timeOptions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Location */}
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-gray-400 mt-0.5">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{reg.location}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm font-mono">{reg.phoneNumber}</span>
                    </div>

                    {/* Worshippers Counts - Only render if values exist and are > 0 */}
                    {(hasToChurch || hasFromChurch) && (
                      <div className="pt-2 space-y-3">
                        {hasToChurch && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">To Church</span>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-medium">
                              {reg.worshippersToChurch}
                            </span>
                          </div>
                        )}
                        {hasFromChurch && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">From Church</span>
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-sm font-medium">
                              {reg.worshippersFromChurch}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Only show if updated */}
                  {wasUpdated && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                        Updated: {updatedAt.toLocaleTimeString([], timeOptions)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {registrations.length > registrationsPerPage && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-2">
              <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 text-sm font-medium rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

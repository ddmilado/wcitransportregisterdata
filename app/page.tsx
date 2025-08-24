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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Transportation Register
            </h1>
            <p className="text-slate-600">WCI Dubai Church Services</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {registrations.length} Total Registrations
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Registration Cards */}
        {currentRegs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 text-6xl mb-4">📋</div>
            <p className="text-slate-500 text-lg">No registrations found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentRegs.map((reg) => {
              const createdAt = new Date(reg.$createdAt);
              const updatedAt = new Date(reg.$updatedAt);
              const wasUpdated = isUpdated(reg);
              
              return (
                <div
                  key={reg.$id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {getInitials(reg.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg truncate">
                          {reg.fullName}
                        </h3>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <span>{createdAt.toLocaleDateString(undefined, dateOptions)}</span>
                          <span className="mx-2">•</span>
                          <span>{createdAt.toLocaleTimeString([], timeOptions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 pb-4 space-y-3">
                    {/* Location */}
                    <div className="flex items-center text-slate-700">
                      <span className="text-slate-400 mr-3">📍</span>
                      <span className="text-sm">{reg.location}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center text-slate-700">
                      <span className="text-slate-400 mr-3">📞</span>
                      <span className="text-sm font-mono">{reg.phoneNumber}</span>
                    </div>

                    {/* Worshippers Counts */}
                    <div className="space-y-2">
                      {reg.worshippersToChurch > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">To Church</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {reg.worshippersToChurch}
                          </span>
                        </div>
                      )}
                      {reg.worshippersFromChurch > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">From Church</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {reg.worshippersFromChurch}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer - Only show if updated */}
                  {wasUpdated && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
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
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
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
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

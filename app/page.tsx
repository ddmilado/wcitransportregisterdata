"use client";
import { useState, useEffect } from "react";
import { Client, Databases, Query } from 'appwrite';

// Define the interface for registration data
interface Registration {
  $id: string;
  $createdAt: string;
  $collectionId: string;
  $databaseId: string;
  $updatedAt: string;
  $permissions: string[];
  fullName: string;
  pickupPoint: string;
  phoneNumber: string;
}

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67581f8c003e096231c3');
const databases = new Databases(client);

export default function Home() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await databases.listDocuments<Registration>(
        '675821f00019a9ddd1c0',
        '67582af800226be0de89',
        [
          Query.orderDesc('$createdAt'),
        ]
      );
      setRegistrations(response.documents);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
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
          SHILOH 2024 DAY ONE REGISTRATIONS
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
                  <div className="flex flex-col space-y-3">
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
                          Registered on {new Date(registration.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-13 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">{registration.pickupPoint}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-600">{registration.phoneNumber}</span>
                      </div>
                    </div>
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CallbackData } from '@/lib/vapi';

export default function SecurePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [callbackData, setCallbackData] = useState<CallbackData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      try {
        // Fetch callback data from Firestore
        const docRef = doc(db, 'callbackRequests', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCallbackData(docSnap.data() as CallbackData);
        }
      } catch (error) {
        console.error('Error fetching callback data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Callback Information
          </h1>
          
          {callbackData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Consultation Type</h3>
                  <p className="mt-1 text-lg text-gray-900">{callbackData.consultationType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-lg text-gray-900">{callbackData.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Country</h3>
                  <p className="mt-1 text-lg text-gray-900">{callbackData.country}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Language</h3>
                  <p className="mt-1 text-lg text-gray-900">{callbackData.language}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Urgency Level</h3>
                  <p className="mt-1 text-lg text-gray-900">{callbackData.urgencyLevel}</p>
                </div>
                {callbackData.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-lg text-gray-900">{callbackData.address}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Request Summary</h3>
                <p className="mt-1 text-lg text-gray-900">{callbackData.requestSummary}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No callback information available.</p>
          )}
        </div>
      </div>
    </main>
  );
} 
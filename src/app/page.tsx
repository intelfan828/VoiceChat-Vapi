'use client';

import { useState } from 'react';
import CallbackForm from '@/components/CallbackForm';
import WebCall from '@/components/WebCall';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [callUrl, setCallUrl] = useState<string | null>(null);

  const handleCallInitiated = (url: string) => {
    setCallUrl(url);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Voice AI Callback Service
          </h1>
          {!submitted ? (
            <CallbackForm onSubmit={() => setSubmitted(true)} onCallInitiated={handleCallInitiated} />
          ) : callUrl ? (
            <div className="space-y-6">
              <WebCall callUrl={callUrl} />
              <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Call in Progress
                </h2>
                <p className="text-gray-600">
                  You are now connected to the AI assistant. The call will be recorded for quality purposes.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Thank You for Your Request!
              </h2>
              <p className="text-gray-600">
                Our AI assistant will call you shortly. Please keep your phone nearby.
                You will receive an email with a secure link after the call.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

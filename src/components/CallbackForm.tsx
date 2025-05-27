import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { initiateCallback } from '@/lib/vapi';

interface CallbackFormProps {
  onSubmit: () => void;
  onCallInitiated: (url: string) => void;
}

export default function CallbackForm({ onSubmit, onCallInitiated }: CallbackFormProps) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Save callback request to Firestore
      await addDoc(collection(db, 'callbackRequests'), {
        phone,
        email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Trigger Vapi call
      const call = await initiateCallback(phone, email);
      
      if (call?.transport?.callUrl) {
        onCallInitiated(call.transport.callUrl);
      } else {
        onSubmit();
      }
    } catch (err) {
      setError('Failed to submit callback request. Please try again.');
      console.error('Error submitting callback request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Request a Callback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            placeholder="+1234567890"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            placeholder="you@example.com"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Request Callback'}
        </button>
      </form>
    </div>
  );
} 
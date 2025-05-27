import Vapi from '@vapi-ai/web';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || '');

export interface CallbackData {
  consultationType: string;
  category: string;
  country: string;
  language: string;
  urgencyLevel: string;
  address?: string;
  requestSummary: string;
}

export interface CallResponse {
  id: string;
  status?: string;
  transport?: {
    callUrl: string;
  };
}

export async function initiateCallback(phoneNumber: string, email: string): Promise<CallResponse> {
  try {
    const call = await vapi.start({
      model: {
        provider: 'openai',
        model: 'gpt-4-turbo-preview'
      },
      voice: {
        provider: '11labs',
        voiceId: 'alloy'
      },
      metadata: {
        email,
        phoneNumber
      }
    });

    if (!call) {
      throw new Error('Failed to initiate call');
    }

    // Handle call events
    vapi.on('call-end', async () => {
      console.log('Call ended successfully');
    });

    vapi.on('error', (error: Error) => {
      console.error('Call error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    });

    return call as CallResponse;
  } catch (error) {
    console.error('Error initiating callback:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export { vapi }; 
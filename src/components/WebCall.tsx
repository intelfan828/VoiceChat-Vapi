import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

interface WebCallProps {
  callUrl: string;
}

// Singleton class to manage Daily.co frame
class DailyFrameManager {
  private static instance: DailyFrameManager;
  private frame: any = null;
  private isInitializing: boolean = false;

  private constructor() {}

  static getInstance(): DailyFrameManager {
    if (!DailyFrameManager.instance) {
      DailyFrameManager.instance = new DailyFrameManager();
    }
    return DailyFrameManager.instance;
  }

  async destroyFrame() {
    if (this.frame) {
      try {
        await this.frame.destroy();
        this.frame = null;
      } catch (err) {
        console.error('Error destroying frame:', err);
      }
    }
  }

  async createFrame(container: HTMLElement, callUrl: string) {
    if (this.isInitializing) {
      throw new Error('Frame initialization already in progress');
    }

    try {
      this.isInitializing = true;
      
      // Clean up existing frame
      await this.destroyFrame();

      // Request camera permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
      } catch (err) {
        throw new Error('Camera access denied. Please allow camera access to join the call.');
      }

      // Create new frame
      this.frame = DailyIframe.createFrame(container, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '12px',
        },
        showLeaveButton: true,
        showLocalVideo: true,
      });

      // Join the call
      await this.frame.join({ url: callUrl });
      
      return this.frame;
    } finally {
      this.isInitializing = false;
    }
  }

  getFrame() {
    return this.frame;
  }
}

export default function WebCall({ callUrl }: WebCallProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const frameManager = useRef(DailyFrameManager.getInstance());

  useEffect(() => {
    if (!videoRef.current) return;

    const setupFrame = async () => {
      try {
        const frame = await frameManager.current.createFrame(videoRef.current!, callUrl);

        // Add event listeners
        frame.on('error', (error: any) => {
          console.error('Daily.co frame error:', error);
          if (error?.errorMsg?.includes('camera')) {
            setError('Camera access error. Please check your camera permissions and try again.');
          } else {
            setError('Error in video call. Please try again.');
          }
        });

        frame.on('joining-meeting', () => {
          console.log('Joining meeting...');
        });

        frame.on('joined-meeting', () => {
          console.log('Successfully joined meeting');
        });

        frame.on('camera-error', (error: any) => {
          console.error('Camera error:', error);
          setError('Camera error. Please check your camera connection and permissions.');
        });
      } catch (err: any) {
        console.error('Error setting up call:', err);
        setError(err.message || 'Error setting up the call. Please try again.');
      }
    };

    setupFrame();

    return () => {
      frameManager.current.destroyFrame();
    };
  }, [callUrl]);

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => setError(null)} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        ref={videoRef} 
        className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden"
      />
    </div>
  );
} 
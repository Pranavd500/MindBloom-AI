'use client';

import { AlertTriangle, X } from 'lucide-react';

interface EmergencyModalProps {
  message: string;
  onClose: () => void;
}

export default function EmergencyModal({ message, onClose }: EmergencyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-red-200 bg-white dark:bg-gray-900 dark:border-red-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-red-100 dark:bg-red-950/20 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            We&apos;re Here for You
          </h2>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>

          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Emergency Resources
            </p>
            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
              <li>
                <strong>National Crisis Helpline:</strong> 988 or 1-800-273-8255
              </li>
              <li>
                <strong>Crisis Text Line:</strong> Text &quot;HELLO&quot; to 741741
              </li>
              <li>
                <strong>International:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline">findahelpline.com</a>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please consider reaching out to a trusted friend, family member, counselor, or mental health professional. You don&apos;t have to go through this alone.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gray-900 dark:bg-white px-4 py-3 font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

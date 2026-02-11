
import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, targetName }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason) {
      setSubmitted(true);
      setTimeout(() => {
        onSubmit(reason);
        setSubmitted(false);
        setReason('');
        onClose();
      }, 1500);
    }
  };

  const reasons = [
    "Suspicious or Spam",
    "Inappropriate Content",
    "Scam or Fraud",
    "Harassment",
    "Other"
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151b] border border-red-500/30 rounded-2xl shadow-2xl p-6 animate-scale-up overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none"></div>

        {!submitted ? (
          <>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center space-x-3 text-red-400">
                <ShieldAlert className="w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Report Content</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-6 relative z-10">
              Why are you reporting <span className="text-white font-bold">"{targetName}"</span>?
              This will help us keep the community safe.
            </p>

            <div className="space-y-3 mb-6 relative z-10">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    reason === r
                      ? 'bg-red-500/20 border-red-500 text-white'
                      : 'bg-[#0f1117] border-[#2a2e37] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!reason}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all relative z-10 ${
                reason
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'
                  : 'bg-[#2a2e37] text-gray-500 cursor-not-allowed'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Submit Report</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4 border border-green-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Thank You</h3>
            <p className="text-gray-400 text-center text-sm">
              We have received your report and will review it shortly. The content has been hidden for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

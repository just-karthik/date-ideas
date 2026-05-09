'use client';

import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationPermissionModalProps {
  show: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  show,
  onAllow,
  onDeny
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onDeny}
          />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative bg-white w-full max-w-sm rounded-[24px] p-7 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="w-16 h-16 bg-[#4A1D96]/10 rounded-2xl flex items-center justify-center">
                <MapPin size={32} className="text-[#4A1D96]" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-gray-900">Enable Location</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  See date ideas near you in Chennai.
                </p>
              </div>

              <div className="w-full space-y-2.5 pt-1">
                <button
                  onClick={onAllow}
                  className="w-full py-3.5 bg-[#4A1D96] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Allow Access
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={onDeny}
                  className="w-full py-3 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

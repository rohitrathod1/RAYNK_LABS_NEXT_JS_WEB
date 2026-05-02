'use client';

import { LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <LogOut className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Logout Confirmation</h3>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to logout?
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You will need to login again to access admin dashboard.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

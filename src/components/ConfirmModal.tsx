import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  const { t, isRTL } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-brown/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className={cn("flex items-center gap-4 mb-6", isRTL && "flex-row-reverse")}>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className={cn("text-start", isRTL && "text-end")}>
                  <h3 className="text-xl font-serif text-brand-brown">{title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className={cn("absolute top-4 hover:text-brand-burgundy transition-colors", isRTL ? "left-4" : "right-4")}
                >
                  <X size={20} />
                </button>
              </div>

              <p className={cn("text-gray-600 mb-8", isRTL && "text-end")}>
                {message}
              </p>

              <div className={cn("flex gap-3", isRTL ? "flex-row-reverse" : "justify-end")}>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-none border-gray-200 text-gray-600 hover:bg-gray-50 uppercase tracking-widest text-xs px-6"
                >
                  {t.admin.cancel}
                </Button>
                <Button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="rounded-none bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest text-xs px-6"
                >
                  {t.admin.delete}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

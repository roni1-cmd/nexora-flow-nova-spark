
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-[90vh] mx-4">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute -top-12 right-0 text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

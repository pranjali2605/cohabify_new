import React from 'react';
import { X } from 'lucide-react';

const Modal = ({
  title,
  description,
  trigger,
  children,
  open,
  onOpenChange,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  return (
    <>
      {trigger && (
        <div onClick={() => setModalOpen(true)}>
          {trigger}
        </div>
      )}
      
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setModalOpen(false)}
          />
          <div className={`relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 ${className}`}>
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

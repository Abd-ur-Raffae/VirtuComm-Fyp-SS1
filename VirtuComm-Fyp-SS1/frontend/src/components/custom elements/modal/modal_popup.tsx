import React, { useRef, useEffect } from "react";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, hasCloseBtn = true, children }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    // Restore focus to the last focused element before opening modal
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === modalRef.current) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      modalElement.showModal();
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      modalElement.close();
      document.body.style.overflow = ""; // Restore scrolling
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      {hasCloseBtn && (
        <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
          &times;
        </button>
      )}
      {children}
    </dialog>
  );
};

export default Modal;

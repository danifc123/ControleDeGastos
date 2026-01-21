import { useEffect } from "react";
import "./AlertModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success" | "warning" | "info";
};

function AlertModal({ isOpen, onClose, title, message, type = "error" }: Props) {
  useEffect(() => {
    if (isOpen) {
      // Fecha o modal ao pressionar ESC
      function handleEscape(e: KeyboardEvent) {
        if (e.key === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", handleEscape);
      // Previne scroll do body quando o modal está aberto
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="alertModalOverlay" onClick={onClose}>
      <div className={`alertModal alertModal-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alertModalHeader">
          <div className="alertModalIcon">
            {type === "error" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {type === "success" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {type === "warning" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {type === "info" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <h3 className="alertModalTitle">{title}</h3>
          <button className="alertModalClose" onClick={onClose} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="alertModalBody">
          <p className="alertModalMessage">{message}</p>
        </div>
        <div className="alertModalFooter">
          <button className="alertModalButton" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;


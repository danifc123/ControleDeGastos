import { useEffect } from "react";
import "./ConfirmModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
};

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}: Props) {
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

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <div className="confirmModalOverlay" onClick={onClose}>
      <div className={`confirmModal confirmModal-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="confirmModalHeader">
          <div className="confirmModalIcon">
            {type === "danger" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="currentColor"
                />
              </svg>
            )}
            {type === "warning" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                  fill="currentColor"
                />
              </svg>
            )}
            {type === "info" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <h3 className="confirmModalTitle">{title}</h3>
          <button className="confirmModalClose" onClick={onClose} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="confirmModalBody">
          <p className="confirmModalMessage">{message}</p>
        </div>
        <div className="confirmModalFooter">
          <button className="confirmModalButton cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`confirmModalButton confirm confirm-${type}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;


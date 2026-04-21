import * as React from "react";
import { X } from "lucide-react";

const useDialogControl = (dialogRef, open, onClose) => {
  React.useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const handleClose = () => {
      if (typeof onClose === "function") onClose();
    };

    dialogElement.addEventListener("close", handleClose);

    if (open) {
      if (!dialogElement.open) dialogElement.showModal();
    } else {
      if (dialogElement.open) dialogElement.close();
    }

    return () => {
      dialogElement.removeEventListener("close", handleClose);
    };
  }, [dialogRef, open, onClose]);
};

const Dialog = ({ open, onClose, className = "", children, ...props }) => {
  const dialogRef = React.useRef(null);

  useDialogControl(dialogRef, open, onClose);

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      onClose={onClose}
      {...props}
    >
      {children}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} aria-label="Fechar Diálogo">
          close
        </button>
      </form>
    </dialog>
  );
};
Dialog.displayName = "Dialog";

const DialogPortal = ({ children }) => children;
DialogPortal.displayName = "DialogPortal";

const DialogOverlay = ({ className = "", ...props }) => (
  <div className={`fixed inset-0 z-50 bg-black/80 ${className}`} {...props} />
);
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = ({ className = "", children, ...props }) => (
  <div
    className={`modal-box bg-base-100 relative p-6 shadow-2xl ${className}`}
    {...props}
  >
    {children}
    <DialogClose onClick={props.onClose} />
  </div>
);
DialogContent.displayName = "DialogContent";

const DialogClose = ({ onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${className}`}
    aria-label="Fechar"
    {...props}
  >
    <X className="h-5 w-5" />
    <span className="sr-only">Fechar</span>
  </button>
);
DialogClose.displayName = "DialogClose";

const DialogTrigger = ({ className = "", children, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
);
DialogTrigger.displayName = "DialogTrigger";

const DialogHeader = ({ className = "", children, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 mb-4 text-center sm:text-left ${className}`}
    {...props}
  >
    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = ({ className = "", children, ...props }) => (
  <h3
    className={`text-xl font-bold text-base-content leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-base-content/70 mt-1 ${className}`} {...props}>
    {children}
  </p>
);
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className = "", children, ...props }) => (
  <div
    className={`modal-action flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    {...props}
  >
    {children}
  </div>
);
DialogFooter.displayName = "DialogFooter";

Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

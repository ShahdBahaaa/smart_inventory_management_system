import React from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ id, title, children, footer, size }) => {
  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`}>
        <div className="modal-content glass-card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-bottom border-light-subtle px-4 py-3 bg-light-subtle">
            <h5 className="modal-title fw-black fst-italic text-inherit" id={`${id}Label`}>{title}</h5>
            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-4 text-inherit">
            {children}
          </div>
          {footer && (
            <div className="modal-footer border-top border-light-subtle px-4 py-3 bg-light-subtle">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

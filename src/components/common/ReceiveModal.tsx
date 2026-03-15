import React from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { X, Check } from 'lucide-react';
import { POItem } from '@/types/index';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: POItem[];
}

export default function ReceiveModal({ isOpen, onClose, items }: ReceiveModalProps) {
  return (
    <Modal 
      show={isOpen} 
      onHide={onClose} 
      size="lg" 
      centered 
      contentClassName="bg-white border-secondary border-opacity-25"
    >
      <Modal.Header className="border-secondary border-opacity-25 bg-white">
        <Modal.Title className="text-dark fw-bold">Receive Goods</Modal.Title>
        <Button variant="link" onClick={onClose} className="text-secondary p-0">
          <X size={24} />
        </Button>
      </Modal.Header>
      <Modal.Body className="bg-white p-4">
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr className="text-secondary small fw-bold text-uppercase border-bottom border-secondary border-opacity-25">
              <th className="pb-3">Item Name</th>
              <th className="pb-3 text-center">Ordered</th>
              <th className="pb-3 text-center">Receive Qty</th>
              <th className="pb-3">Batch/Lot #</th>
              <th className="pb-3">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-bottom border-secondary border-opacity-10">
                <td className="py-3 text-dark fw-bold">{item.name}</td>
                <td className="py-3 text-center text-secondary">{item.orderedQty}</td>
                <td className="py-3 px-2">
                  <Form.Control 
                    type="number" 
                    defaultValue={item.orderedQty}
                    size="sm"
                    className="text-center mx-auto"
                    style={{ width: '80px' }}
                  />
                </td>
                <td className="py-3 px-2">
                  <Form.Control 
                    type="text" 
                    placeholder="LOT-123"
                    size="sm"
                  />
                </td>
                <td className="py-3 px-2">
                  <Form.Control 
                    type="date" 
                    size="sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="border-secondary border-opacity-25 bg-white">
        <Button variant="link" onClick={onClose} className="text-secondary text-decoration-none fw-bold">
          Cancel
        </Button>
        <Button variant="success" onClick={onClose} className="px-4 fw-bold shadow-sm">
          <Check size={20} className="me-2" /> Confirm Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import React from 'react';
import { POStatus } from '@/types/index';
import { Badge } from 'react-bootstrap';

interface StatusBadgeProps {
  status: POStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass = {
    DRAFT: "badge-draft",
    SENT: "badge-sent",
    RECEIVED: "badge-received",
    CLOSED: "badge-closed",
  };

  return (
    <Badge className={`${badgeClass[status]} rounded-pill px-3 py-2 fw-semibold`}>
      {status}
    </Badge>
  );
}

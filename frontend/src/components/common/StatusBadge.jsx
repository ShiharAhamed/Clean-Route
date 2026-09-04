import React from 'react';

const StatusBadge = ({ type = 'status', value }) => {
  if (!value) return null;

  let badgeClass = 'badge ';

  const normalized = value.toLowerCase().replace(/\s+/g, '-');

  if (type === 'priority') {
    if (normalized === 'low') badgeClass += 'badge-low';
    else if (normalized === 'medium') badgeClass += 'badge-medium';
    else if (normalized === 'high') badgeClass += 'badge-high';
  } else {
    if (normalized === 'pending') badgeClass += 'badge-pending';
    else if (normalized === 'in-progress') badgeClass += 'badge-in-progress';
    else if (normalized === 'resolved') badgeClass += 'badge-resolved';
    else if (normalized === 'active') badgeClass += 'badge-active';
  }

  return <span className={badgeClass}>{value}</span>;
};

export default StatusBadge;

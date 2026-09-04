import React from 'react';

<<<<<<< HEAD
export const StatusBadge = ({ type = 'status', value }) => {
  if (!value) return null;

  if (type === 'priority') {
    const priorityClass = `badge-priority-${value.toLowerCase()}`;
    return <span className={`badge ${priorityClass}`}>{value} Priority</span>;
  }

  const normalized = value.toLowerCase().replace(/\s+/g, '-');
  const badgeClass = `badge-${normalized}`;

  return <span className={`badge ${badgeClass}`}>{value}</span>;
};
=======
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
>>>>>>> bac31862511e68fec5e9d8bd36b4c3be444d186c

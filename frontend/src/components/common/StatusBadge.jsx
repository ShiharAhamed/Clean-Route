import React from 'react';

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

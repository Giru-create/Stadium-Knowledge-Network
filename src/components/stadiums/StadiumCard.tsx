import React from 'react';
import { Stadium } from '../../types';

/**
 * Accessible, memoized card to display stadium information.
 * Uses role="region" and aria-labelledby for screen readers.
 */
export const StadiumCard = React.memo(({ stadium }: { stadium: Stadium }) => {
  const {
    name,
    city,
    country,
    capacity,
    climate,
    latitude,
    longitude,
    status,
  } = stadium;

  return (
    <article
      role="region"
      aria-label={`Stadium ${name}`}
      className="glass-panel glass-panel-emerald rounded-2xl p-6 mb-4"
    >
      <h3 className="text-xl font-semibold text-slate-100 mb-2" id={`stadium-${stadium.id}-title`}>{name}</h3>
      <p className="text-sm text-slate-300 mb-1"><strong>Location:</strong> {city}, {country}</p>
      <p className="text-sm text-slate-300 mb-1"><strong>Capacity:</strong> {capacity?.toLocaleString() ?? 'N/A'}</p>
      <p className="text-sm text-slate-300 mb-1"><strong>Climate:</strong> {climate}</p>
      <p className="text-sm text-slate-300 mb-1"><strong>Coordinates:</strong> {latitude?.toFixed(4)}, {longitude?.toFixed(4)}</p>
      <p className="text-sm text-slate-300"><strong>Status:</strong> {status}</p>
    </article>
  );
});

StadiumCard.displayName = 'StadiumCard';

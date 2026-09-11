import React from 'react';
import GISRealMap from './GISRealMap';

/**
 * Enhanced GISMap Component
 * Bridges existing page references to the real interactive Google Maps component.
 */
export default function GISMapMock(props) {
  return <GISRealMap {...props} />;
}

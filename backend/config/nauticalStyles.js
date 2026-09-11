/**
 * Custom Nautical Dark Google Maps Styling
 * Tailored for deep maritime operations, contrasting coastlines, and clear bathymetry.
 */
export const NAUTICAL_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#071927" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#071927" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#748896" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a5b9c7" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#547185" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0d263b" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#16344d" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#091f33" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#627f94" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e4566" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#132d42" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#799bb3" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#05131f" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#36688d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#05131f" }]
  }
];


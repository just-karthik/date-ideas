'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DateIdea } from '@/types';

// Replace with your actual Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface MapProps {
  ideas: DateIdea[];
  onPinClick: (idea: DateIdea) => void;
  userLocation: [number, number] | null;
}

export const Map: React.FC<MapProps> = ({ ideas, onPinClick, userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation || [80.2707, 13.0827],
      zoom: 12,
      pitch: 45,
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsStyleLoaded(true);
      // Add data source for clustering
      map.addSource('ideas', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circles
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'ideas',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#4A1D96',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Cluster count
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'ideas',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Inspect cluster on click
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties?.cluster_id;
        (map.getSource('ideas') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom || 14
            });
          }
        );
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

      // Initial user location dot
      if (userLocation) {
        new mapboxgl.Marker({
          element: createUserLocationDot(),
        })
          .setLngLat(userLocation)
          .addTo(map);
      }
    });

    return () => map.remove();
  }, []);

  // Update center when user location is found
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: userLocation,
        zoom: 14,
        essential: true,
      });
      
      new mapboxgl.Marker({
        element: createUserLocationDot(),
      })
        .setLngLat(userLocation)
        .addTo(mapRef.current);
    }
  }, [userLocation]);

  // Update markers and GeoJSON source when ideas change or style loads
  useEffect(() => {
    if (!mapRef.current || !isStyleLoaded) return;

    const source = mapRef.current.getSource('ideas') as mapboxgl.GeoJSONSource;
    if (!source) return;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: 'FeatureCollection',
      features: ideas.map(idea => ({
        type: 'Feature',
        properties: { ...idea },
        geometry: {
          type: 'Point',
          coordinates: [idea.longitude, idea.latitude]
        }
      }))
    };

    source.setData(geojson);

    // Update unclustered markers
    // We use markers for unclustered points to allow custom HTML/Emoji
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // We only show markers when zoomed in enough or if they aren't clustered
    // Actually, simple approach: always show markers but Mapbox will handle clustering for circles
    // Wait, if I want emoji pins, I should check zoom level or use a custom layer.
    // For simplicity and premium feel, I'll use markers for unclustered points.
    
    ideas.forEach((idea) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = 'display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#fff;border-radius:50%;border:2px solid #4A1D96;box-shadow:0 2px 8px rgba(74,29,150,0.2);font-size:18px;';
      el.innerHTML = `<span>${idea.emoji}</span>`;
      el.onclick = (e) => {
        e.stopPropagation();
        onPinClick(idea);
      };

      const marker = new mapboxgl.Marker(el)
        .setLngLat([idea.longitude, idea.latitude])
        .addTo(mapRef.current!);

      markersRef.current[idea.id] = marker;
    });

  }, [ideas, onPinClick, isStyleLoaded]);

  function createUserLocationDot() {
    const el = document.createElement('div');
    el.className = 'relative flex h-4 w-4';
    el.innerHTML = `
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background:#4A1D96"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white" style="background:#4A1D96"></span>
    `;
    return el;
  }

  return (
    <div ref={mapContainerRef} className="w-full h-full" />
  );
};

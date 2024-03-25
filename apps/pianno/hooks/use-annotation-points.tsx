import type { Annotation } from '@/lib/types';

import { rgbToHex } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

import { useStoreColors, useStoreImg, useStoreLabel } from './use-store';

type PartialAnnotation = Partial<Pick<Annotation, 'distance' | 'type'>> &
  Pick<Annotation, 'color' | 'x' | 'y'>;
type PreffiledAnnotation = Map<string, PartialAnnotation[]>;

export const useAnnotationPoints = () => {
  const [annotation, setAnnotation] = useState<PreffiledAnnotation>(new Map());
  const label = useStoreLabel();
  const colors = useStoreColors();
  const { height, width } = useStoreImg();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, [height, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!width || !height || !ctx) return;
    const typeFromColor = (color: string) => {
      if (colors.vertical.includes(color)) return 'vertical';
      if (colors.horizontal.includes(color)) return 'horizontal';
      if (colors.euclidean.includes(color)) return 'euclidean';
      return undefined;
    };

    const distanceFromType = (type: string) => {
      if (type === 'vertical') return -1;
      if (type === 'horizontal') return -1;
      if (type === 'euclidean') return undefined;
      return undefined;
    };

    const img = new Image();
    img.src = label;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);

      const annot: PreffiledAnnotation = new Map();
      const data = ctx?.getImageData(0, 0, width, height).data;
      if (!data) return;
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a === 0) continue;
        const color = rgbToHex(r, g, b);
        const type = typeFromColor(color);
        if (!type) continue;
        const distance = distanceFromType(type);
        if (!annot.has(color)) {
          annot.set(color, []);
        }
        annot.get(color)?.push({
          color,
          distance,
          type,
          x,
          y,
        });
      }
      setAnnotation(annot);
    };
  }, [
    colors.euclidean,
    colors.horizontal,
    colors.vertical,
    height,
    label,
    width,
  ]);

  return { points: annotation, setPoints: setAnnotation };
};

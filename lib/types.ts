import dayjs from 'dayjs';
import { z } from 'zod';

import { ANNOTATION_DISTANCE_TYPES } from './constants';

export type BrushMode = 'eraser' | 'pen';

export type Brush = {
  eraserSize: number;
  maxSize: number;
  mode: 'eraser' | 'pen';
  penSize: number;
};

export const openImageSchema = z.object({
  checked: z.nullable(z.string()),
  dtype: z.nullable(z.enum(['float32', 'float64', 'int32'])),
  height: z.nullable(z.coerce.number()),
  width: z.nullable(z.coerce.number()),
});

export const annotationSchema = z.object({
  date: z.string().refine((s) => dayjs(s, 'YYYY-MM-DD HH:mm:ss').isValid()),
  device_id: z.string(),
  device_name: z.string().refine((s) => s.startsWith('pi')),
  distance: z.coerce.number(),
  geometry: z.string(),
  pair_distance: z.array(z.coerce.number()),
  pair_distance_type: z.array(z.string()),
});

export type DistanceTypes = (typeof ANNOTATION_DISTANCE_TYPES)[number];

export type Annotation = {
  color: string;
  distance: number;
  type: DistanceTypes;
  x: number;
  y: number;
};

export type AnnotationObject = {
  [key: string]: Annotation;
};

export type AnnotationGroup = {
  [key: string]: Annotation[];
};

export type Metadata = {
  annotations: {
    distance: number;
    points: {
      x: number;
      y: number;
    }[];
    type: string;
  }[];
  date: string;
  device: {
    distance: number;
    geometry: string;
    id: string;
    name: string;
  };
};

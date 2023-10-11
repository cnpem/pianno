import dayjs from 'dayjs';
import { z } from 'zod';

export type BrushMode = 'pen' | 'eraser' | 'lens';

export const openImageSchema = z.object({
  checked: z.nullable(z.string()),
  width: z.nullable(z.coerce.number()),
  height: z.nullable(z.coerce.number()),
});

export const annotationSchema = z.object({
  date: z.string().refine((s) => dayjs(s, 'YYYY-MM-DD HH:mm:ss').isValid()),
  pimega_name: z.string().refine((s) => s.startsWith('pi')),
  geometry: z.string(),
  distance: z.coerce.number(),
  image: z.string(),
});

export type Annotation = {
  id: string;
  x: number;
  y: number;
  distance: number;
  type: 'horizontal' | 'vertical' | 'euclidean';
};

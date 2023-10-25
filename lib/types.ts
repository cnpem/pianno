import dayjs from 'dayjs';
import { z } from 'zod';

export type BrushMode = 'eraser' | 'lens' | 'pen';

export const openImageSchema = z.object({
  checked: z.nullable(z.string()),
  height: z.nullable(z.coerce.number()),
  width: z.nullable(z.coerce.number()),
});

export const annotationSchema = z.object({
  date: z.string().refine((s) => dayjs(s, 'YYYY-MM-DD HH:mm:ss').isValid()),
  distance: z.coerce.number(),
  geometry: z.string(),
  image: z.string(),
  pimega_name: z.string().refine((s) => s.startsWith('pi')),
});

export type Annotation = {
  distance: number;
  id: string;
  type: 'euclidean' | 'horizontal' | 'vertical';
  x: number;
  y: number;
};

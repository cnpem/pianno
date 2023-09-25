import { z } from 'zod';

export type BrushMode = 'pen' | 'eraser' | 'grab';

export const openImageSchema = z.object({
  checked: z.nullable(z.string()),
  width: z.nullable(z.coerce.number()),
  height: z.nullable(z.coerce.number()),
});

'use server';

import { openImageSchema } from '@/lib/types';

export async function openImage(data: FormData) {
  const parsed = openImageSchema.safeParse({
    checked: data.get('checked'),
    width: data.get('width'),
    height: data.get('height'),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}

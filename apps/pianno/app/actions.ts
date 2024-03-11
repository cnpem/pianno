'use server';

import { openImageSchema } from '@/lib/types';

export async function openImage(data: FormData) {
  const parsed = openImageSchema.safeParse({
    checked: data.get('checked'),
    dtype: data.get('dtype'),
    height: data.get('height'),
    width: data.get('width'),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}

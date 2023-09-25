'use server';

import { annotationSchema, openImageSchema } from '@/lib/types';
import dayjs from 'dayjs';

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

export async function exportAnnotation(data: FormData, dataurl: string) {
  const device = data.get('device');
  const hash = data.get('device-hash');

  const pimega_name = `${device}#${hash}`;

  const parsed = annotationSchema.safeParse({
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    pimega_name,
    geometry: data.get('geometry'),
    distance: data.get('distance'),
    image: dataurl,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

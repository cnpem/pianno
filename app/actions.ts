'use server';

import {
  AnnotationGroup,
  AnnotationObject,
  Metadata,
  annotationSchema,
  openImageSchema,
} from '@/lib/types';
import { rgbToHex } from '@/lib/utils';
import { createCanvas, loadImage } from 'canvas';
import dayjs from 'dayjs';

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

export async function exportAnnotation(
  data: FormData,
  dataurl: string,
): Promise<Metadata> {
  const device = data.get('device');
  const id = data.get('device-id');

  const parsed = annotationSchema.safeParse({
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    device_id: id,
    device_name: device,
    distance: data.get('distance'),
    geometry: data.get('geometry'),
    pair_distance: data.getAll('pair-distance'),
    pair_distance_type: data.getAll('pair-distance-type'),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // get annotation from label dataurl
  const annotation: AnnotationObject = {};
  const annotationGroup: AnnotationGroup = {};
  const canvas = createCanvas(1, 1); // Create a canvas (size doesn't matter at this point)
  const ctx = canvas.getContext('2d');

  if (dataurl === 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=') {
    return {} as Metadata;
  }

  return new Promise((resolve, reject) => {
    loadImage(dataurl)
      .then((img) => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Now, you can manipulate the image using the Canvas API.
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        if (!data) throw new Error('No data');
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % img.width;
          const y = Math.floor(i / 4 / img.width);
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) continue;
          const color = rgbToHex(r, g, b);
          const key = `${x}-${y}`;
          annotation[key] = {
            color,
            distance: -1,
            type: 'horizontal',
            x,
            y,
          };
        }
        // group annotation by color
        Object.keys(annotation).forEach((key) => {
          const { color, distance, type, x, y } = annotation[key];
          if (!annotationGroup[color]) {
            annotationGroup[color] = [];
          }
          annotationGroup[color].push({ color, distance, type, x, y });
        });

        // correct distance and types in annotationGroup
        const pair_distance = parsed.data.pair_distance;
        const pair_distance_type = parsed.data.pair_distance_type;

        Object.keys(annotationGroup).forEach((color, index) => {
          const annotations = annotationGroup[color];
          annotations.forEach((annotation) => {
            const distance = pair_distance[index];
            const type = pair_distance_type[index];
            annotation.distance = distance;
            annotation.type = type;
          });
        }, 0);

        const metadata: Metadata = {
          annotations: [],
          date: parsed.data.date,
          device: {
            distance: parsed.data.distance,
            geometry: parsed.data.geometry,
            id: parsed.data.device_id,
            name: parsed.data.device_name,
          },
        };

        Object.keys(annotationGroup).forEach((color) => {
          const annotations = annotationGroup[color];
          const points = annotations.map((annotation) => ({
            x: annotation.x,
            y: annotation.y,
          }));
          const distance = annotations[0].distance;
          const type = annotations[0].type;
          metadata.annotations.push({
            distance,
            points,
            type,
          });
        });

        resolve(metadata);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getAnnotationGroup(
  dataurl: string,
): Promise<AnnotationGroup> {
  const annotationGroup: AnnotationGroup = {};
  const canvas = createCanvas(1, 1); // Create a canvas (size doesn't matter at this point)
  const ctx = canvas.getContext('2d');

  if (dataurl === 'data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=') {
    return annotationGroup;
  }

  return new Promise((resolve, reject) => {
    loadImage(dataurl)
      .then((img) => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Now, you can manipulate the image using the Canvas API.
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        if (!data) throw new Error('No data');
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % img.width;
          const y = Math.floor(i / 4 / img.width);
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) continue;
          const color = rgbToHex(r, g, b);
          const key = `${x}-${y}`;
          if (!annotationGroup[color]) {
            annotationGroup[color] = [];
          }
          annotationGroup[color].push({
            color,
            distance: -1,
            type: 'horizontal',
            x,
            y,
          });
        }
        resolve(annotationGroup);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

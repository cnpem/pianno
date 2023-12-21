import { getAnnotationGroup } from '@/app/actions';
import { useStoreColors, useStoreImg, useStoreLabel } from '@/hooks/use-store';
import { AnnotationGroup } from '@/lib/types';
import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { FC, useCallback, useEffect, useState } from 'react';

interface PairsProps {}

type annotationMarkerProps = {
  color: string;
  graphics: PIXI.Graphics;
  radius: number;
  shape:
    | 'alert'
    | 'circle'
    | 'pointing-down'
    | 'pointing-left'
    | 'pointing-right'
    | 'pointing-up'
    | 'ring';
  x: number;
  y: number;
};
const annotationMarker = (props: annotationMarkerProps) => {
  const { color, graphics, radius, shape, x, y } = props;
  switch (shape) {
    case 'pointing-right':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.beginFill(color);
      graphics.drawPolygon([
        x + radius,
        y,
        x - radius / 2,
        y - (radius * 1.73) / 2,
        x - radius / 2,
        y + (radius * 1.73) / 2,
      ]);
      graphics.endFill();
      break;
    case 'pointing-left':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.beginFill(color);
      graphics.drawPolygon([
        x - radius,
        y,
        x + radius / 2,
        y - (radius * 1.73) / 2,
        x + radius / 2,
        y + (radius * 1.73) / 2,
      ]);
      graphics.endFill();
      break;
    case 'pointing-down':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.beginFill(color);
      graphics.drawPolygon([
        x,
        y + radius,
        x - (radius * 1.73) / 2,
        y - radius / 2,
        x + (radius * 1.73) / 2,
        y - radius / 2,
      ]);
      graphics.endFill();
      break;
    case 'pointing-up':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.beginFill(color);
      graphics.drawPolygon([
        x,
        y - radius,
        x - (radius * 1.73) / 2,
        y + radius / 2,
        x + (radius * 1.73) / 2,
        y + radius / 2,
      ]);
      graphics.endFill();
      break;
    case 'circle':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.beginFill(color);
      graphics.drawCircle(x, y, radius);
      graphics.endFill();
      break;
    case 'ring':
      graphics.lineStyle(radius / 4, color, 1);
      graphics.drawCircle(x, y, radius);
      break;
    case 'alert':
      // draw an x marker over the point
      graphics.lineStyle(radius / 1.44, color, 1);
      graphics.moveTo(x - radius, y - radius);
      graphics.lineTo(x + radius, y + radius);
      graphics.moveTo(x - radius, y + radius);
      graphics.lineTo(x + radius, y - radius);
      break;
  }
  return graphics;
};

const Pairs: FC<PairsProps> = ({}) => {
  const label = useStoreLabel();
  const [annotationPoints, setAnnotationPoints] =
    useState<AnnotationGroup | null>(null);
  const img = useStoreImg();
  const colors = useStoreColors();
  const { height, width } = img;
  const markerRadius =
    Math.floor(Math.max(height, width) * 0.01) < 5
      ? 5
      : Math.floor(Math.max(height, width) * 0.01);

  useEffect(() => {
    getAnnotationGroup(label).then((data) => {
      if (!data) return;
      setAnnotationPoints(data);
    });
  }, [label]);

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      if (annotationPoints) {
        Object.values(annotationPoints).forEach((labelPoints, _) => {
          if (!labelPoints) return;
          const [a, b, ...outliers] = labelPoints;
          const color = a.color;
          if (!b) {
            // marking single point
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'ring',
              x: a.x,
              y: a.y,
            });
            return;
          }
          if (!!outliers.length) {
            // marking outliers
            outliers.forEach((outlier) => {
              annotationMarker({
                color,
                graphics: g,
                radius: markerRadius,
                shape: 'alert',
                x: outlier.x,
                y: outlier.y,
              });
            });
          }
          if (colors.vertical.includes(color)) {
            // red means vertical annotation => sort pairs by y and makers are vertical aligned triangles
            // the top one is pointing down and the bottom one is pointing up
            const [top, bottom] = [a, b].sort((a, b) => a.y - b.y);
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'pointing-down',
              x: top.x,
              y: top.y,
            });
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'pointing-up',
              x: bottom.x,
              y: bottom.y,
            });
          }
          if (colors.horizontal.includes(color)) {
            // green means horizontal annotation => sort pairs by x and makers are horizontal aligned triangles
            // the left one is pointing right and the right one is pointing left
            const [left, right] = [a, b].sort((a, b) => a.x - b.x);
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'pointing-left',
              x: right.x,
              y: right.y,
            });
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'pointing-right',
              x: left.x,
              y: left.y,
            });
          }
          if (colors.euclidean.includes(color)) {
            // blue means point annotation => no need to sort and markers are circles
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'circle',
              x: a.x,
              y: a.y,
            });
            annotationMarker({
              color,
              graphics: g,
              radius: markerRadius,
              shape: 'circle',
              x: b.x,
              y: b.y,
            });
          }
          // drawing a line between a and b
          g.lineStyle(markerRadius / 4, color, 1);
          g.moveTo(a.x, a.y);
          g.lineTo(b.x, b.y);
        });
      }
    },
    [colors, annotationPoints, img],
  );

  return <Graphics blendMode={PIXI.BLEND_MODES.OVERLAY} draw={draw} />;
};

export default Pairs;

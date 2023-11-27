import { getAnnotationGroup } from '@/app/actions';
import { useStoreColors, useStoreImg, useStoreLabel } from '@/hooks/use-store';
import { AnnotationGroup } from '@/lib/types';
import { hexToRgb } from '@/lib/utils';
import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { FC, useCallback, useEffect, useState } from 'react';

interface PairsProps {}

type annotationMarkerProps = {
  color: string;
  direction: 'circle' | 'pointing-down' | 'pointing-left' | 'pointing-right' | 'pointing-up';
  graphics: PIXI.Graphics;
  radius: number;
  x: number;
  y: number;
};
const annotationMarker = (props: annotationMarkerProps) => {
  const { color, direction, graphics, radius, x, y } = props;
  console.log('color', color, hexToRgb(color));
  graphics.beginFill(color);
  switch (direction) {
    case 'pointing-right':
      graphics.drawPolygon([x, y, x - radius/2 - radius, y - radius*1.73/2, x - radius/2 - radius, y + radius*1.73/2]);
      break;
    case 'pointing-left':
      graphics.drawPolygon([x, y, x + radius/2 + radius, y - radius*1.73/2, x + radius/2 + radius, y + radius*1.73/2]);
      break;
    case 'pointing-up':
      graphics.drawPolygon([x, y, x - radius*1.73/2, y - radius/2 - radius, x + radius*1.73/2, y - radius/2 - radius]);
      break;
    case 'pointing-down':
      graphics.drawPolygon([x, y, x - radius*1.73/2, y + radius/2 + radius, x + radius*1.73/2, y + radius/2 + radius]);
      break;
    case 'circle':
      graphics.drawCircle(x, y, radius);
      break;
  }
  graphics.endFill();
  return graphics;
};

const Pairs: FC<PairsProps> = ({}) => {
  const label = useStoreLabel();
  const [pairs, setPairs] = useState<AnnotationGroup | null>(null);
  const img = useStoreImg(); 
  const colors = useStoreColors();

  useEffect(() => {
      getAnnotationGroup(label).then((data) => {
        if (!data) return;
        setPairs(data);
      });
  }, [label]);

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      if (pairs) {
        const { height, width } = img; 
        Object.values(pairs).forEach((pair, index) => {
          if (pair.length < 2) return;
          const pairColor = pair[0].color;
          // line style for the pair
          g.lineStyle(Math.max(height, width) * 0.002, pairColor, 1);
          const markerRadius = Math.max(height, width) * 0.01;
          if (colors.verticalColors.includes(pairColor)) {
            // red means vertical annotation => sort pairs by y and makers are vertical aligned triangles
            const [a, b] = pair.sort((a, b) => a.y - b.y);
            annotationMarker({ color: pairColor, direction: 'pointing-up', graphics: g, radius: markerRadius, x: a.x, y: a.y });
            annotationMarker({ color: pairColor, direction: 'pointing-down', graphics: g, radius: markerRadius, x: b.x, y: b.y });
          };
          if (colors.horizontalColors.includes(pairColor)) {
            // green means horizontal annotation => sort pairs by x and makers are horizontal aligned triangles
            const [a, b] = pair.sort((a, b) => a.x - b.x);
            annotationMarker({ color: pairColor, direction: 'pointing-left', graphics: g, radius: markerRadius, x: b.x, y: b.y });
            annotationMarker({ color: pairColor, direction: 'pointing-right', graphics: g, radius: markerRadius, x: a.x, y: a.y });
          };
          if (colors.euclideanColors.includes(pairColor)) {
            // blue means point annotation => no need to sort and markers are circles
            const [a, b] = pair;
            annotationMarker({ color: pairColor, direction: 'circle', graphics: g, radius: markerRadius, x: a.x, y: a.y });
            annotationMarker({ color: pairColor, direction: 'circle', graphics: g, radius: markerRadius, x: b.x, y: b.y });
          };
          const [a, b] = pair;
          g.moveTo(a.x, a.y);
          g.lineTo(b.x, b.y);
        });
      }
    },
    [colors, pairs, img],
  );

  return <Graphics blendMode={PIXI.BLEND_MODES.OVERLAY} draw={draw} />;
};

export default Pairs;

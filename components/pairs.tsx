import { getAnnotationGroup } from '@/app/actions';
import { useStoreLabel } from '@/hooks/use-store';
import { AnnotationGroup } from '@/lib/types';
import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { FC, useCallback, useEffect, useState } from 'react';

interface PairsProps {}

const Pairs: FC<PairsProps> = ({}) => {
  const label = useStoreLabel();
  const [pairs, setPairs] = useState<AnnotationGroup | null>(null);

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
        Object.values(pairs).forEach((pair, index) => {
          if (pair.length < 2) return;
          const [a, b] = pair.slice(-2);
          g.lineStyle(1, a.color, 1);
          g.beginFill(a.color);
          g.drawCircle(a.x, a.y, 7);
          g.drawCircle(b.x, b.y, 7);
          g.endFill();
          const textStyle = new PIXI.TextStyle({
            align: 'center',
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 4,
            dropShadowColor: '#ccced2',
            dropShadowDistance: 6,
            fill: ['#ffffff', '#a39ea3'], // gradient
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: '400',
            letterSpacing: 10,
            stroke: '#000000',
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 440,
          });
          const textA = new PIXI.Text(index.toString(), textStyle);
          const textB = new PIXI.Text(index.toString(), textStyle);
          textA.x = a.x;
          textA.y = a.y;
          textA.anchor.set(0.5);
          textA.scale.set(0.15);
          textB.x = b.x;
          textB.y = b.y;
          textB.anchor.set(0.5);
          textB.scale.set(0.15);
          g.addChild(textA);
          g.addChild(textB);
          g.moveTo(a.x, a.y);
          g.lineTo(b.x, b.y);
        });
      }
    },
    [pairs],
  );

  return <Graphics blendMode={PIXI.BLEND_MODES.OVERLAY} draw={draw} />;
};

export default Pairs;

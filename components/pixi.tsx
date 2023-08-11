"use client";

import { BlurFilter } from "pixi.js";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import { useMemo, useState } from "react";

const Bunny = () => {
  const [theta, setTheta] = useState(0);
  useTick((delta) => setTheta((theta) => theta - delta * 0.1));
  const bunny = useMemo(() => PIXI.Sprite.from("https://pixijs.io/pixi-react/img/bunny.png"), []);
  return (
    <Sprite
      // image="https://pixijs.io/pixi-react/img/bunny.png"
      texture={bunny.texture}
      x={400}
      y={270}
      scale={4}
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={theta}
    />
  );
};

export const Canvas = () => {
  const blurFilter = useMemo(() => new BlurFilter(4), []);

  return (
    <Stage
      width={800}
      height={600}
      options={{
        backgroundAlpha: 1,
        antialias: true,
        backgroundColor: "#50C878",
      }}
    >
      <Bunny />
      <Container x={400} y={400}>
        <Text
          text="Hello World"
          style={new PIXI.TextStyle({ fontSize: 36 })}
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
        />
      </Container>
    </Stage>
  );
};

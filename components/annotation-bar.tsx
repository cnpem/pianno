'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ChevronDown, ChevronUp, Dog, Zap } from 'lucide-react';
import { FC, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface AnnotationBarProps {}

const AnnotationBar: FC<AnnotationBarProps> = ({}) => {
  //list of 10 animals
  const example = [
    'cat',
    'dog',
    'bird',
    'fish',
    'snake',
    'turtle',
    'rabbit',
    'hamster',
    'lizard',
    'frog',
  ];

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const [animals, setAnimals] = useState(example);

  const moveUp = (id: number) => {
    //swap animal at id with previous
    const newAnimals = [...animals];
    const temp = newAnimals[id - 1];
    newAnimals[id - 1] = newAnimals[id];
    newAnimals[id] = temp;
    setAnimals(newAnimals);
  };

  const moveDown = (id: number) => {
    //swap animal at id with next
    const newAnimals = [...animals];
    const temp = newAnimals[id + 1];
    newAnimals[id + 1] = newAnimals[id];
    newAnimals[id] = temp;
    setAnimals(newAnimals);
  };

  const moveToLast = (id: number) => {
    //move animal at id to end of list
    const newAnimals = [...animals];
    const temp = newAnimals[id];
    newAnimals.splice(id, 1);
    newAnimals.push(temp);
    setAnimals(newAnimals);
  };

  const remove = (id: number) => {
    //remove animal at id
    const newAnimals = [...animals];
    newAnimals.splice(id, 1);
    setAnimals(newAnimals);
  };

  return (
    <Accordion
      className="fixed right-4 top-4 opacity-90"
      type="single"
      collapsible
    >
      <AccordionItem value="animalz">
        <AccordionTrigger
          title="toggle annotation list"
          className="flex items-center justify-center rounded-md bg-white p-2 shadow-lg"
        >
          <Dog className="mr-2 h-4 w-4" />
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-screen">
            <div ref={parent} className="flex flex-col gap-2 p-4">
              {animals.map((animal, id) => (
                <Card
                  key={animal}
                  className="flex flex-row items-center gap-2 p-2"
                >
                  <input id={animal} type="checkbox" />
                  <label htmlFor={animal}>{animal}</label>
                  <Button
                    onClick={() => moveUp(id)}
                    size="icon"
                    className="h-5 w-5"
                    variant="ghost"
                    disabled={id === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => moveDown(id)}
                    size="icon"
                    className="h-5 w-5"
                    variant="ghost"
                    disabled={id === animals.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => moveToLast(id)}
                    size="icon"
                    className="h-5 w-5"
                    variant="ghost"
                    disabled={id === animals.length - 1}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AnnotationBar;

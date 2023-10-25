'use client';

import { useStoreActions, useStoreAnnotation } from '@/hooks/use-store';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Braces, ChevronDown, ChevronUp } from 'lucide-react';
import { FC } from 'react';

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
  const annotations = useStoreAnnotation();
  const { setAnnotation } = useStoreActions();

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const moveUp = (id: number) => {
    //swap annotation at id with previous
    const newAnnotations = [...annotations];
    const temp = newAnnotations[id - 1];
    newAnnotations[id - 1] = newAnnotations[id];
    newAnnotations[id] = temp;
    setAnnotation(newAnnotations);
  };

  const moveDown = (id: number) => {
    //swap annotation at id with next
    const newAnnotations = [...annotations];
    const temp = newAnnotations[id + 1];
    newAnnotations[id + 1] = newAnnotations[id];
    newAnnotations[id] = temp;
    setAnnotation(newAnnotations);
  };

  return (
    <Accordion
      className="fixed right-4 top-4 opacity-90"
      collapsible
      type="single"
    >
      <AccordionItem value="animalz">
        <AccordionTrigger
          className="flex items-center justify-center rounded-md bg-white p-2 shadow-lg"
          title="toggle annotation list"
        >
          <Braces className="mr-1 h-4 w-4" />
          <p className="text-xs font-semibold text-purple-700">Annotations</p>
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="flex flex-col gap-2 p-4" ref={parent}>
              {annotations.map((annotation, id) => (
                <Card
                  className="flex flex-row items-center gap-2 p-2"
                  key={annotation?.id}
                >
                  <input id={annotation?.id} type="checkbox" />
                  <label
                    htmlFor={annotation?.id}
                  >{`${annotation?.x} ${annotation?.y}`}</label>
                  <Button
                    className="h-5 w-5"
                    disabled={id === 0}
                    onClick={() => moveUp(id)}
                    size="icon"
                    variant="ghost"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    className="h-5 w-5"
                    disabled={id === annotations.length - 1}
                    onClick={() => moveDown(id)}
                    size="icon"
                    variant="ghost"
                  >
                    <ChevronDown className="h-4 w-4" />
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

"use client";

import { Button } from "./ui/button";
import { SaveIcon, BracesIcon, CheckIcon, CopyIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useReducer, useRef } from "react";

const SaveTool = () => {
  return (
    <div className="border rounded-sm flex flex-col items-center justify-center h-40">
      <div className="flex p-1 gap-1 flex-row h-fit opacity-90 items-center border shadow-lg rounded-md">
        {Array.from({ length: 2 }).map((_, i) => (
          <Button
            className="animate-pulse bg-muted"
            key={i}
            variant="outline"
            size="icon"
          />
        ))}
        <span className="text-input">|</span>
        <Button
          className="animate-pulse bg-muted"
          variant="outline"
          size="icon"
        />
        <Button variant="outline" size="icon">
          <SaveIcon className="h-4 w-4" />
        </Button>
        {Array.from({ length: 2 }).map((_, i) => (
          <Button
            className="animate-pulse bg-muted"
            key={i}
            variant="outline"
            size="icon"
          />
        ))}
      </div>
    </div>
  );
};

const PIMEGA_DEVICES = ["pi135D", "pi450D", "pi540D"];
const PIMEGA_GEOMETRIES = ["planar", "nonplanar", "arc", "tower"];

const SaveForm = () => {
  const [isCopied, toggleCopied] = useReducer((state) => !state, false);
  const handleCopy = () => {
    if (ref.current && ref.current.reportValidity()) {
      toggleCopied();
      setTimeout(() => toggleCopied(), 2000);
    }
  };
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-col items-center border rounded-sm p-12">
      <form
        ref={ref}
        className="shadow-lg p-4 border rounded-md space-y-4 max-w-[425px]"
      >
        <header>
          <p className="font-semibold text-lg">Save your Annotations</p>
          <p className="text-muted-foreground text-sm">
            Fill in the following fields with the annotation metadata. Click
            save or copy to clipboard when you are done.
          </p>
        </header>
        <hr />
        <div className="flex flex-col gap-1">
          <Label className="font-semibold" htmlFor="device">
            Device
          </Label>
          <Select name="device" required>
            <SelectTrigger id="device">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PIMEGA_DEVICES.map((device) => (
                <SelectItem
                  className="cursor-pointer"
                  key={device}
                  value={device}
                >
                  {device}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm">
            Choose the pimega device used for the annotations.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-semibold" htmlFor="device-id">
            Device ID
          </Label>
          <Input
            className="peer"
            id="device-id"
            max={5}
            min={1}
            name="device-id"
            required
            type="number"
          />
          <p className="text-muted-foreground text-sm">
            Enter the pimega device identifier from 1 to 5 referring to the
            beamline.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label className=" font-semibold" htmlFor="geometry">
            Geometry
          </Label>
          <Select name="geometry" required>
            <SelectTrigger id="geometry">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PIMEGA_GEOMETRIES.map((geometry) => (
                <SelectItem
                  className="cursor-pointer"
                  key={geometry}
                  value={geometry}
                >
                  {geometry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm">
            Choose the device geometry.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-semibold" htmlFor="distance">
            Distance <span className="font-light">(mm)</span>
          </Label>
          <Input
            className="peer"
            id="distance"
            min={0}
            name="distance"
            required
            type="number"
          />
          <p className="text-muted-foreground text-sm">
            Choose the distance for the measured image (in mm), can be 0 for
            planar devices.
          </p>
        </div>
        <div className="animate-pulse bg-muted h-20 rounded-md" />
        <div className="flex items-center gap-2">
          <Button type="submit" variant="default">
            <BracesIcon className="mr-2 h-4 w-4" />
            Save JSON
          </Button>
          <Button onClick={handleCopy} size="icon" variant="outline">
            <CopyButtonIcon isCopied={isCopied} />
          </Button>
        </div>
      </form>
    </div>
  );
};

const CopyButtonIcon = ({ isCopied }: { isCopied: boolean }) => {
  if (isCopied) {
    return <CheckIcon className="h-4 w-4" />;
  }
  return <CopyIcon className="h-4 w-4" />;
};

export { SaveTool, SaveForm };

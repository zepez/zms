import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { useVideoContext } from "~/components/video/context";

const LevelDropdownItem = (props: { title: string; index: number }) => {
  const { streamLevel, setStreamLevel } = useVideoContext();

  const checked = streamLevel === props.index;

  return (
    <DropdownMenu.CheckboxItem
      title={props.title}
      checked={checked}
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={() =>
        setStreamLevel(props.index, { immediate: true, preferred: true })
      }
      className="flex items-center gap-2 py-1 pl-2 pr-8 cursor-pointer"
    >
      {!checked && <div className="w-6" />}
      <DropdownMenu.ItemIndicator className="w-6">
        <Check className="opacity-50" />
      </DropdownMenu.ItemIndicator>
      {props.title}
    </DropdownMenu.CheckboxItem>
  );
};

export const Level = () => {
  const { streamLevel, streamLevels, setPlayerForcedActive } =
    useVideoContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const height = streamLevels[streamLevel]?.height;
  const resolution = height ? `${height}p` : "Auto";

  const toggleDropdown = (isOpen: boolean) => {
    if (isOpen) {
      setPlayerForcedActive(true);
      setIsDropdownOpen(true);
    } else {
      setPlayerForcedActive(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenu.Trigger className="bg-zinc-100 text-zinc-900 border-zinc-100 border-2 py-1 px-2 rounded-md text-sm">
        {resolution}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="z-30 bg-zinc-100 text-zinc-900 py-2 px-4 rounded-md"
        >
          <LevelDropdownItem title="Auto" index={-1} />
          {streamLevels.map((l, lIndex) => (
            <LevelDropdownItem
              key={l.height}
              title={`${l.height}p`}
              index={lIndex}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

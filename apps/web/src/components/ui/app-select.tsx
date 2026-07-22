"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type AppSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AppSelectProps = {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

function getSelectedLabel(value: string, options: AppSelectOption[]) {
  return options.find((option) => option.value === value)?.label ?? null;
}

export function AppSelect({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled,
  required,
  className,
}: AppSelectProps) {
  const selectableOptions = options.filter((option) => !option.disabled);
  const selectedLabel = getSelectedLabel(value, options);
  const hasSelection = Boolean(selectedLabel);

  return (
    <Select.Root
      name={name}
      items={options}
      value={hasSelection ? value : null}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue);
        }
      }}
      disabled={disabled || selectableOptions.length === 0}
      required={required}
      modal={false}
    >
      <Select.Trigger
        id={id}
        className={cn(
          "surface-select-trigger group flex w-full items-center justify-between gap-3 text-left",
          className,
        )}
      >
        <Select.Value
          className={cn(
            "truncate",
            !hasSelection && "text-muted-foreground",
          )}
          placeholder={placeholder}
        >
          {selectedLabel}
        </Select.Value>
        <Select.Icon className="text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180">
          <ChevronDown className="size-4 shrink-0" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          className="z-[200] outline-none"
          side="bottom"
          align="start"
          sideOffset={6}
          alignItemWithTrigger={false}
          collisionPadding={12}
        >
          <Select.Popup className="app-select-popup app-scrollbar">
            <Select.List className="p-1.5">
              {options.map((option) => (
                <Select.Item
                  key={`${option.value}-${option.label}`}
                  value={option.value}
                  disabled={option.disabled}
                  label={option.label}
                  className="app-select-item"
                >
                  <Select.ItemText className="flex-1 truncate">
                    {option.label}
                  </Select.ItemText>
                  <Select.ItemIndicator className="text-primary">
                    <Check className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

"use client";

import { useRef, type ComponentProps } from "react";
import { Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

interface SearchInputProps extends Omit<ComponentProps<typeof InputGroupInput>, "value" | "onChange" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

/** Controlled search box with a leading icon and a clear button that appears once there is text. */
export function SearchInput({ value, onValueChange, className, "aria-label": ariaLabel = "Ara", ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    onValueChange("");
    inputRef.current?.focus();
  };

  return (
    <InputGroup className={className}>
      <InputGroupAddon align="inline-start">
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        {...props}
        ref={inputRef}
        type="search"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {value !== "" && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Aramayı temizle" onClick={clear}>
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

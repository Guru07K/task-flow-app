import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface PermissionOption {
  label: string;
  value: string;
}

interface PermissionSelectorProps {
  options: readonly PermissionOption[];
  value: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

const PermissionSelector = ({ options, value, onChange, disabled = false }: PermissionSelectorProps) => {
  const togglePermission = (permission: string) => {
    const updatedPermissions = value.includes(permission) ? value.filter((item) => item !== permission) : [...value, permission];

    onChange(updatedPermissions);
  };

  return (
    <Popover>
      <PopoverTrigger disabled={disabled} className="w-full">
        <Button type="button" variant="outline" disabled={disabled} className="w-full justify-between font-normal">
          {value.length > 0 ? `${value.length} permission(s) selected` : "Select permissions"}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search permissions..." />

          <CommandEmpty>No permissions found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const checked = value.includes(option.value);

              return (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  onSelect={() => togglePermission(option.value)}
                  className="flex items-center gap-2"
                >
                  <Checkbox checked={checked} />

                  <span className="flex-1">{option.label}</span>

                  {checked && <Check className="h-4 w-4 text-primary" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PermissionSelector;

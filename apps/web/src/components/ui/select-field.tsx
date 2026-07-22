import { AppSelect, type AppSelectOption } from "@/components/ui/app-select";

export type { AppSelectOption };

type SelectFieldProps = {
  id?: string;
  name?: string;
  value: string;
  onChange?: (event: { target: { value: string } }) => void;
  onValueChange?: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function SelectField({
  id,
  name,
  value,
  onChange,
  onValueChange,
  options,
  placeholder,
  disabled,
  required,
  className,
}: SelectFieldProps) {
  const handleChange = (nextValue: string) => {
    onValueChange?.(nextValue);
    onChange?.({ target: { value: nextValue } });
  };

  return (
    <AppSelect
      id={id}
      name={name}
      value={value}
      onValueChange={handleChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={className}
    />
  );
}

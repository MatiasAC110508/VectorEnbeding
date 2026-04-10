interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

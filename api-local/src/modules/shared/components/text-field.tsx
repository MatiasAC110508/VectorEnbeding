interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function TextField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

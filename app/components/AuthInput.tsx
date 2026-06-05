type Props = {
  label: string;
  type?: string;
  placeholder: string;
};

export default function AuthInput({
  label,
  type = "text",
  placeholder,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white/10
        "
      />
    </div>
  );
}

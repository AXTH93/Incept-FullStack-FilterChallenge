"use client";

import Select, { MultiValue, StylesConfig } from "react-select";

interface Option {
  value: number;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  value: MultiValue<Option>;
  onChange: (selected: MultiValue<Option>) => void;
  isDisabled?: boolean;
}

// Custom styles for react-select
const customStyles: StylesConfig<Option, true> = {
  control: (base) => ({
    ...base,
    borderColor: "gray",
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "black",
    },
  }),
  option: (base, state) => ({
    ...base,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected ? "#2563eb" : "white",
    "&:hover": {
      backgroundColor: "#dbeafe",
      color: "black",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#dbeafe",
    color: "black",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "black",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#2563eb",
    "&:hover": {
      backgroundColor: "#2563eb",
      color: "white",
    },
  }),
};

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  isDisabled = false,
}: FilterDropdownProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-black">{label}</label>
      <Select
        instanceId={label.toLowerCase()}
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        placeholder={`Select ${label}`}
        styles={customStyles} // Apply custom styles
      />
    </div>
  );
}

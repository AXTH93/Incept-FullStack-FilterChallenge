interface MultiSelectProps {
    options: { label: string; value: number }[];
    selected: number[];
    onChange: (selected: number[]) => void;
    disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    disabled = false 
}) => {
    const handleSelect = (value: number) => {
        if (disabled) return; 

        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className={disabled ? 'opacity-50' : ''}>
            {options.map((option) => (
                <label
                    key={option.value}
                    style={{ display: "block", margin: "5px 0" }}
                    className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                        disabled={disabled} 
                    />
                    <span className="ml-2">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default MultiSelect;

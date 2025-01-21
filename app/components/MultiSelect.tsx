// MultiSelect 组件
interface MultiSelectProps {
    options: { label: string; value: number }[]; // value remains number
    selected: number[]; // value type matches the selected array
    onChange: (selected: number[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange }) => {
    const handleSelect = (value: number) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div>
            {options.map((option) => (
                <label key={option.value} style={{ display: "block", margin: "5px 0" }}>
                    <input
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default MultiSelect;

// 更新 MultiSelect 接口
interface MultiSelectProps {
    options: { label: string; value: number }[];
    selected: number[];
    onChange: (selected: number[]) => void;
    disabled?: boolean; // 添加可选的 disabled 属性
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    disabled = false // 设置默认值为 false
}) => {
    const handleSelect = (value: number) => {
        if (disabled) return; // 如果禁用，直接返回

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
                        disabled={disabled} // 添加 disabled 属性
                    />
                    <span className="ml-2">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default MultiSelect;

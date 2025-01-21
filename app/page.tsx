"use client";

import { useState, useEffect } from "react";
import MultiSelect from "./components/MultiSelect";
import { fetchModules, fetchUnits, fetchLocations, validateFilters } from "./api/filters";

interface Module {
    id: number;
    title: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

const AnalyticsFilterPage = () => {
    // 筛选器选项
    const [modules, setModules] = useState<Module[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    // 已选值
    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

    // 加载状态
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<string | null>(null); // 验证结果

    // 加载数据的通用函数
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [modulesData, unitsData, locationsData] = await Promise.all([
                fetchModules(selectedUnits, selectedLocations),
                fetchUnits(selectedModules, selectedLocations),
                fetchLocations(selectedModules, selectedUnits),
            ]);

            setModules(modulesData);
            setUnits(unitsData);
            setLocations(locationsData);
        } catch (err) {
            setError("数据加载失败，请稍后重试。");
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 初始加载所有筛选项
    useEffect(() => {
        fetchData();
    }, []);

    // 每当筛选条件变化时重新加载数据
    useEffect(() => {
        fetchData();
    }, [selectedModules, selectedUnits, selectedLocations]);

    // Apply Filter 按钮的事件处理函数
    const handleApplyFilters = async () => {
        setValidationResult(null);
        setError(null);

        try {
            const result = await validateFilters(selectedModules, selectedUnits, selectedLocations);

            if (result.valid) {
                setValidationResult("Filters applied successfully!");
            } else {
                setValidationResult(
                    `Validation failed: ${result.errors?.join(", ") || "Unknown errors"}`
                );
            }
        } catch (error) {
            setError("Failed to validate filters. Please try again.");
            console.error("Error applying filters:", error);
        }
    };

    // 重置筛选
    const handleResetFilters = () => {
        setSelectedModules([]);
        setSelectedUnits([]);
        setSelectedLocations([]);
        fetchData();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Analytics Filter System</h1>
            {isLoading && <p>加载中...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {validationResult && <p style={{ color: validationResult.startsWith("Filters applied") ? "green" : "red" }}>{validationResult}</p>}
            <div>
                <h3>Modules</h3>
                <MultiSelect
                    options={modules.map((module) => ({
                        label: module.title,
                        value: module.id,
                    }))}
                    selected={selectedModules}
                    onChange={setSelectedModules}
                />
            </div>
            <div>
                <h3>Units</h3>
                <MultiSelect
                    options={units.map((unit) => ({
                        label: unit.name,
                        value: unit.id,
                    }))}
                    selected={selectedUnits}
                    onChange={setSelectedUnits}
                />
            </div>
            <div>
                <h3>Locations</h3>
                <MultiSelect
                    options={locations.map((location) => ({
                        label: location.name,
                        value: location.id,
                    }))}
                    selected={selectedLocations}
                    onChange={setSelectedLocations}
                />
            </div>
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleApplyFilters}
                    style={{ marginLeft: "10px" }}
                    disabled={isLoading || (!selectedModules.length && !selectedUnits.length && !selectedLocations.length)}
                >
                    Apply
                </button>
                <button onClick={handleResetFilters} disabled={isLoading}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AnalyticsFilterPage;






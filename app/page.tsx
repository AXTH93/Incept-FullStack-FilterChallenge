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
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">Analytics Filter System</h1>
            {isLoading && <p className="text-blue-500">加载中...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {validationResult && (
                <p
                    className={`${validationResult.startsWith("Filters applied") ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {validationResult}
                </p>
            )}
            <div>
                <h3 className="text-lg font-semibold mb-2">Modules</h3>
                <MultiSelect
                    options={modules.map((module) => ({
                        label: module.title,
                        value: module.id,
                    }))}
                    selected={selectedModules}
                    onChange={setSelectedModules}
                />
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Units</h3>
                <MultiSelect
                    options={units.map((unit) => ({
                        label: unit.name,
                        value: unit.id,
                    }))}
                    selected={selectedUnits}
                    onChange={setSelectedUnits}
                />
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Locations</h3>
                <MultiSelect
                    options={locations.map((location) => ({
                        label: location.name,
                        value: location.id,
                    }))}
                    selected={selectedLocations}
                    onChange={setSelectedLocations}
                />
            </div>
            <div className="mt-6">
                <button
                    onClick={handleApplyFilters}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading || (!selectedModules.length && !selectedUnits.length && !selectedLocations.length)}
                >
                    Apply
                </button>
                <button
                    onClick={handleResetFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2 disabled:opacity-50"
                    disabled={isLoading}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}


export default AnalyticsFilterPage;






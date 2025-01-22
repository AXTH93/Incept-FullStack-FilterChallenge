"use client";

import { useState, useEffect, useRef } from "react";
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
    const [modules, setModules] = useState<Module[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<string | null>(null);

    const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load initial data
    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [modulesData, unitsData, locationsData] = await Promise.all([
                fetchModules([], []),
                fetchUnits([], []),
                fetchLocations([], [])
            ]);
            setModules(modulesData);
            setUnits(unitsData);
            setLocations(locationsData);
        } catch (err) {
            setError("Failed to load initial data. Please try again.");
            console.error("Error fetching initial data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Clean invalid selections
    const cleanInvalidSelections = (newUnits: Unit[], newLocations: Location[]) => {
        setSelectedUnits((prevSelectedUnits) =>
            prevSelectedUnits.filter((unit) => newUnits.some((u) => u.id === unit))
        );
        setSelectedLocations((prevSelectedLocations) =>
            prevSelectedLocations.filter((location) => newLocations.some((l) => l.id === location))
        );
    };

    // Handle changes in module selection
    const handleModuleChange = async (moduleIds: number[]) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        setSelectedModules(moduleIds);
        setError(null);

        try {
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(true);
            }, 500);

            const [unitsData, locationsData] = await Promise.all([
                fetchUnits(moduleIds, selectedLocations),
                fetchLocations(moduleIds, selectedUnits)
            ]);

            setUnits(unitsData);
            setLocations(locationsData);

            // Clean invalid selections
            cleanInvalidSelections(unitsData, locationsData);
        } catch (err) {
            setError("Failed to update filters. Please try again.");
            console.error("Error updating filters:", err);
        } finally {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            setIsLoading(false);
        }
    };

    // Handle changes in unit selection
    const handleUnitChange = async (unitIds: number[]) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        setSelectedUnits(unitIds);
        setError(null);

        try {
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(true);
            }, 500);

            const [locationsData, modulesData] = await Promise.all([
                fetchLocations(selectedModules, unitIds),
                fetchModules(unitIds, selectedLocations)
            ]);

            setLocations(locationsData);
            setModules(modulesData);

            // Clean invalid selections
            cleanInvalidSelections(units, locationsData);
        } catch (err) {
            setError("Failed to update filters. Please try again.");
            console.error("Error updating filters:", err);
        } finally {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            setIsLoading(false);
        }
    };

    // Handle changes in location selection
    const handleLocationChange = async (locationIds: number[]) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        setSelectedLocations(locationIds);
        setError(null);

        try {
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(true);
            }, 500);

            const [unitsData, modulesData] = await Promise.all([
                fetchUnits(selectedModules, locationIds),
                fetchModules(selectedUnits, locationIds)
            ]);

            setUnits(unitsData);
            setModules(modulesData);

            // Clean invalid selections
            cleanInvalidSelections(unitsData, locations);
        } catch (err) {
            setError("Failed to update filters. Please try again.");
            console.error("Error updating filters:", err);
        } finally {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            setIsLoading(false);
        }
    };

    // Handle applying filters
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

    // Handle resetting filters
    const handleResetFilters = async () => {
        setSelectedModules([]);
        setSelectedUnits([]);
        setSelectedLocations([]);
        setValidationResult(null); // Clear validation result on reset
        await fetchInitialData();
    };

    // Initial data loading
    useEffect(() => {
        fetchInitialData();
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">Analytics Filter System</h1>
            {isLoading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {validationResult && (
                <p className={`${validationResult.startsWith("Filters applied") ? "text-green-500" : "text-red-500"}`}>
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
                    onChange={handleModuleChange}
                    disabled={isLoading}
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
                    onChange={handleUnitChange}
                    disabled={isLoading}
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
                    onChange={handleLocationChange}
                    disabled={isLoading}
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
};

export default AnalyticsFilterPage;

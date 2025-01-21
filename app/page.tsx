"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import MultiSelect from "./components/MultiSelect";
import { fetchModules, fetchUnits, fetchLocations, validateFilters } from "./api/filters";
import debounce from "lodash/debounce";

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
    // State for filter options
    const [modules, setModules] = useState<Module[]>([]); // List of available modules
    const [units, setUnits] = useState<Unit[]>([]); // List of available units
    const [locations, setLocations] = useState<Location[]>([]); // List of available locations

    const [selectedModules, setSelectedModules] = useState<number[]>([]); // Selected module IDs
    const [selectedUnits, setSelectedUnits] = useState<number[]>([]); // Selected unit IDs
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]); // Selected location IDs

    const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching
    const [error, setError] = useState<string | null>(null); // Error message for data fetching
    const [validationResult, setValidationResult] = useState<string | null>(null); // Result of filter validation

    // Ref to manage loading timeout
    const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Generic fetchData function with a loading delay
    const fetchData = async (modules: number[], units: number[], locations: number[]) => {
        // Clear any previous loading timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        // Set a loading delay: Only show loading state if the request takes longer than 500ms
        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(true);
        }, 500);

        setError(null); // Reset any previous errors

        try {
            // Fetch data concurrently for modules, units, and locations
            const [modulesData, unitsData, locationsData] = await Promise.all([
                fetchModules(units, locations),
                fetchUnits(modules, locations),
                fetchLocations(modules, units),
            ]);

            // Update state with the fetched data
            setModules(modulesData);
            setUnits(unitsData);
            setLocations(locationsData);
        } catch (err) {
            // Handle fetch errors
            setError("Failed to load data. Please try again.");
            console.error("Error fetching data:", err);
        } finally {
            // Clear the loading timeout when the request finishes
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            setIsLoading(false); // Reset loading state
        }
    };

    // UseMemo to optimize debounce with a delay of 800ms
    const fetchDataWithDebounce = useMemo(
        () =>
            debounce((modules: number[], units: number[], locations: number[]) => {
                fetchData(modules, units, locations);
            }, 800),
        [] // Dependencies are empty to ensure the debounce function is only created once
    );

    // Effect to trigger data fetching when filters change
    useEffect(() => {
        fetchDataWithDebounce(selectedModules, selectedUnits, selectedLocations);

        return () => {
            // Cleanup
            fetchDataWithDebounce.cancel();
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [selectedModules, selectedUnits, selectedLocations]);

    // Handle Apply Filters
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

    // Handle Reset Filters
    const handleResetFilters = () => {
        setSelectedModules([]);
        setSelectedUnits([]);
        setSelectedLocations([]);
        fetchData([], [], []);
    };


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
};

export default AnalyticsFilterPage;

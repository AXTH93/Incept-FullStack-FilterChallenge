"use client";

import { useState, useEffect } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import ButtonGroup from "@/components/ButtonGroup";
import { MultiValue } from "react-select";

interface Option {
  value: number;
  label: string;
}

export default function FiltersPage() {
  const [isMounted, setIsMounted] = useState(false);

  const [modules, setModules] = useState<Option[]>([]);
  const [units, setUnits] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);

  const [selectedModules, setSelectedModules] = useState<MultiValue<Option>>([]);
  const [selectedUnits, setSelectedUnits] = useState<MultiValue<Option>>([]);
  const [selectedLocations, setSelectedLocations] = useState<MultiValue<Option>>([]);

  // Ensure the component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch modules once the component mounts
  useEffect(() => {
    async function fetchModules() {
      const response = await fetch("http://localhost:3001/api/filters/modules");
      const data = await response.json();
      setModules(data.modules.map((mod: any) => ({ value: mod.id, label: mod.title })));
    }

    fetchModules();
  }, []);

  // Prevent rendering until the component is mounted
  if (!isMounted) {
    return null; // Use a loading spinner or placeholder here if needed
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Filters</h1>

        {/* Filter Dropdowns */}
        <FilterDropdown
          label="Modules"
          options={modules}
          value={selectedModules}
          onChange={setSelectedModules}
        />
        <FilterDropdown
          label="Units"
          options={units}
          value={selectedUnits}
          onChange={setSelectedUnits}
          isDisabled={!selectedModules.length}
        />
        <FilterDropdown
          label="Locations"
          options={locations}
          value={selectedLocations}
          onChange={setSelectedLocations}
          isDisabled={!selectedUnits.length}
        />

        {/* Button Group */}
        <ButtonGroup
          onApply={() => console.log("Apply Filters", { selectedModules, selectedUnits, selectedLocations })}
          onReset={() => {
            setSelectedModules([]);
            setSelectedUnits([]);
            setSelectedLocations([]);
          }}
        />
      </div>
    </div>
  );
}

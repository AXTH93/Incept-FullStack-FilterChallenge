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
  const [modules, setModules] = useState<Option[]>([]);
  const [units, setUnits] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);

  const [selectedModules, setSelectedModules] = useState<MultiValue<Option>>([]);
  const [selectedUnits, setSelectedUnits] = useState<MultiValue<Option>>([]);
  const [selectedLocations, setSelectedLocations] = useState<MultiValue<Option>>([]);

  useEffect(() => {
    async function fetchModules() {
      const response = await fetch("http://localhost:3001/api/filters/modules");
      const data = await response.json();
      setModules(data.modules.map((mod: any) => ({ value: mod.id, label: mod.title })));
    }

    fetchModules();
  }, []);

  useEffect(() => {
    async function fetchUnits() {
      if (selectedModules.length === 0) {
        setUnits([]);
        return;
      }

      const moduleIds = selectedModules.map((mod) => mod.value);
      const response = await fetch(
        `http://localhost:3001/api/filters/units?moduleIds=${JSON.stringify(moduleIds)}`
      );
      const data = await response.json();
      setUnits(data.units.map((unit: any) => ({ value: unit.id, label: unit.name })));
    }

    fetchUnits();
  }, [selectedModules]);

  useEffect(() => {
    async function fetchLocations() {
      if (selectedUnits.length === 0) {
        setLocations([]);
        return;
      }

      const unitIds = selectedUnits.map((unit) => unit.value);
      const response = await fetch(
        `http://localhost:3001/api/filters/locations?unitIds=${JSON.stringify(unitIds)}`
      );
      const data = await response.json();
      setLocations(data.locations.map((loc: any) => ({ value: loc.id, label: loc.name })));
    }

    fetchLocations();
  }, [selectedUnits]);

  function handleApply() {
    const moduleIds = selectedModules.map((mod) => mod.value);
    const unitIds = selectedUnits.map((unit) => unit.value);
    const locationIds = selectedLocations.map((loc) => loc.value);

    fetch("http://localhost:3001/api/filters/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleIds, unitIds, locationIds }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          alert("Filters applied successfully!");
          // You can display the filtered results here
        } else {
          alert(`Validation Errors: ${data.errors.join(", ")}`);
        }
      })
      .catch((error) => console.error("Error validating filters:", error));
  }

  function handleReset() {
    setSelectedModules([]);
    setSelectedUnits([]);
    setSelectedLocations([]);
    setUnits([]);
    setLocations([]);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Filters</h1>
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
        <ButtonGroup onApply={handleApply} onReset={handleReset} />
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-black">Selected Filters:</h2>
          <p className="text-black">
            <strong>Modules:</strong> {selectedModules.map((mod) => mod.label).join(", ") || "None"}
          </p>
          <p className="text-black">
            <strong>Units:</strong> {selectedUnits.map((unit) => unit.label).join(", ") || "None"}
          </p>
          <p className="text-black">
            <strong>Locations:</strong> {selectedLocations.map((loc) => loc.label).join(", ") || "None"}
          </p>
        </div>

      </div>
    </div>
  );
}

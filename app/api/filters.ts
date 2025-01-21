import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/filters';

// Fetch all modules
export const fetchModules = async (
    unitIds?: number[],
    locationIds?: number[]
): Promise<{ id: number; title: string }[]> => {
    try {
        // Build query parameters based on selected unit and location IDs
        const queryParams = {
            ...(unitIds?.length ? { unitIds: unitIds.join(",") } : {}),
            ...(locationIds?.length ? { locationIds: locationIds.join(",") } : {}),
        };

        // Make a GET request to retrieve modules
        const response = await axios.get(`${API_BASE_URL}/modules`, {
            params: queryParams,
        });

        // Return the modules array
        return response.data.modules;
    } catch (error) {
        console.error("Error fetching modules:", error);
        throw new Error("Failed to fetch modules");
    }
};

// Fetch available units based on selected module and location IDs
export const fetchUnits = async (
    moduleIds?: number[],
    locationIds?: number[]
): Promise<{ id: number; name: string }[]> => {
    try {
        // Build query parameters based on selected module and location IDs
        const queryParams = {
            ...(moduleIds?.length ? { moduleIds: moduleIds.join(",") } : {}),
            ...(locationIds?.length ? { locationIds: locationIds.join(",") } : {}),
        };

        // Make a GET request to retrieve units
        const response = await axios.get(`${API_BASE_URL}/units`, {
            params: queryParams,
        });

        // Return the units array
        return response.data.units;
    } catch (error) {
        console.error("Error fetching units:", error);
        throw new Error("Failed to fetch units");
    }
};

// Fetch available locations based on selected module and unit IDs
export const fetchLocations = async (
    moduleIds?: number[],
    unitIds?: number[]
): Promise<{ id: number; name: string }[]> => {
    try {
        // Build query parameters based on selected module and unit IDs
        const queryParams = {
            ...(moduleIds?.length ? { moduleIds: moduleIds.join(",") } : {}),
            ...(unitIds?.length ? { unitIds: unitIds.join(",") } : {}),
        };

        // Make a GET request to retrieve locations
        const response = await axios.get(`${API_BASE_URL}/locations`, {
            params: queryParams,
        });

        // Return the locations array
        return response.data.locations;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to fetch locations");
    }
};

// Validate the selected filters
export const validateFilters = async (
    moduleIds: number[],
    unitIds: number[],
    locationIds: number[]
) => {
    try {
        // Make a POST request to validate the selected filters
        const response = await axios.post(`${API_BASE_URL}/validate`, {
            moduleIds,
            unitIds,
            locationIds,
        });

        // Return the validation result: { valid: boolean, errors?: string[] }
        return response.data;
    } catch (error) {
        console.error('Error validating filters:', error);
        throw new Error('Failed to validate filters');
    }
};


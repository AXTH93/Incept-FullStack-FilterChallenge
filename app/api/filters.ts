import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/filters';

// Fetch all modules
export const fetchModules = async (
    unitIds?: number[],
    locationIds?: number[]
): Promise<{ id: number; title: string }[]> => {
    try {
        // 构建查询参数
        const queryParams = {
            ...(unitIds?.length ? { unitIds: unitIds.join(",") } : {}),
            ...(locationIds?.length ? { locationIds: locationIds.join(",") } : {}),
        };

        // 发起请求并返回模块数据
        const response = await axios.get(`${API_BASE_URL}/modules`, {
            params: queryParams,
        });

        return response.data.modules; // 确保返回的是模块数组
    } catch (error) {
        console.error("Error fetching modules:", error);
        throw new Error("Failed to fetch modules");
    }
};

// Fetch available units based on selected module IDs and location IDs
export const fetchUnits = async (
    moduleIds?: number[],
    locationIds?: number[]
): Promise<{ id: number; name: string }[]> => {
    try {
        // 构建查询参数
        const queryParams = {
            ...(moduleIds?.length ? { moduleIds: moduleIds.join(",") } : {}),
            ...(locationIds?.length ? { locationIds: locationIds.join(",") } : {}),
        };

        // 发起请求并返回单元数据
        const response = await axios.get(`${API_BASE_URL}/units`, {
            params: queryParams,
        });

        return response.data.units; // 确保返回的是单元数组
    } catch (error) {
        console.error("Error fetching units:", error);
        throw new Error("Failed to fetch units");
    }
};

// Fetch available locations based on selected module IDs and unit IDs
export const fetchLocations = async (
    moduleIds?: number[],
    unitIds?: number[]
): Promise<{ id: number; name: string }[]> => {
    try {
        // 构建查询参数
        const queryParams = {
            ...(moduleIds?.length ? { moduleIds: moduleIds.join(",") } : {}),
            ...(unitIds?.length ? { unitIds: unitIds.join(",") } : {}),
        };

        // 发起请求并返回位置数据
        const response = await axios.get(`${API_BASE_URL}/locations`, {
            params: queryParams,
        });

        return response.data.locations; // 确保返回的是位置数组
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Failed to fetch locations");
    }
};



// Validate selected filters
export const validateFilters = async (
    moduleIds: number[],
    unitIds: number[],
    locationIds: number[]
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/validate`, {
            moduleIds,
            unitIds,
            locationIds,
        });
        return response.data; // Returns validation result: { valid: boolean, errors?: string[] }
    } catch (error) {
        console.error('Error validating filters:', error);
        throw new Error('Failed to validate filters');
    }
};

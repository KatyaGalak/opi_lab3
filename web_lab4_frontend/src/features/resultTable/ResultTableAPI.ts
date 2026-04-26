export interface PointRow {
  x: number;
  y: number;
  r: number;
  hit: boolean;
  execTime: number;
  dateFormatted: string;
}

export interface PointsResponse {
  points: PointRow[];
  error?: string;
}

export const fetchPoints = async (token: string): Promise<PointsResponse> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("api/points", {
      method: "GET",
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { points: [], error: errorData.error || `HTTP ошибка: ${response.status}` };
    }

    const data = await response.json();
    return { points: data };
  } catch (error) {
    console.error("Ошибка загрузки точек: ", error);
    return {
      points: [],
      error: error instanceof Error ? error.message : "Ошибка сети",
    };
  }
};

export const clearPointsApi = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("api/points", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Ошибка при удалении" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Ошибка сети" };
  }
};
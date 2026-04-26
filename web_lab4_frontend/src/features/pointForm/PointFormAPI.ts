import { PointRow } from "../resultTable/ResultTableAPI";

export interface PointSubmitData {
  x: number;
  y: number;
  r: number;
  fromGraph?: boolean;
}

export interface PointSubmitResponse {
  newPoint?: PointRow;
  error?: string;
}

export const submitPoint = async (data: PointSubmitData, token: string): Promise<PointSubmitResponse> => {
  try {
    const response = await fetch("api/points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || `HTTP ошибка: ${response.status}` };
    }

    const result = await response.json();
    return { newPoint: result as PointRow };
  } catch (error) {
    console.error("Ошибка при отправке точки:", error);
    return {
      error: error instanceof Error ? error.message : "Неизвестная ошибка сети",
    };
  }
};
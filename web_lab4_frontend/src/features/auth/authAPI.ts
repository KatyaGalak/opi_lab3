export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export const login = async (
  credential: AuthCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "[Error] HTTP. Status: ${response.status}",
        token: "",
      };
    }

    return {
      message: data.message || "Success",
      token: data.token || "",
    };
  } catch (error) {
    console.error("[Error] Login error. ", error);
    return {
      message: error instanceof Error ? error.message : "Unknown error",
      token: "",
    };
  }
};

export const logout = async (
  token: string
): Promise<{ success: boolean; result?: string }> => {
  try {
    const response = await fetch("api/auth/logout", {
      method: "GET",
      headers: {
        Authorization: 'Bearer ${token}',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        result: data.message || "[Error] HTTP. Status: ${response.status}",
        success: false,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Error] Logout error. ", error);
    return {
      result: error instanceof Error ? error.message : "Unknown error",
      success: false,
    };
  }
};

export const register = async (
  credential: AuthCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch("api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Ошибка регистрации: " + response.status,
        token: "",
      };
    }

    return {
      message: data.message || "Success",
      token: data.token || "",
    };
  } catch (error) {
    console.error("[Error] Register error. ", error);
    return {
      message: error instanceof Error ? error.message : "Unknown error",
      token: "",
    };
  }
};
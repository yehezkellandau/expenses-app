const API_URL = import.meta.env.VITE_API_URL; // from your .env

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json(); // token + user
}

export function saveAuth(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

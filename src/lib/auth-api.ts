// Mock API functions with random responses
// These can be easily replaced with actual API calls by changing the route names

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

// Random delay helper
const randomDelay = () => Math.random() * 1000 + 500;

// Random success helper (80% success rate)
const randomSuccess = () => Math.random() > 0.2;

// Mock login API
export async function loginAPI(email: string, password: string): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  if (!randomSuccess()) {
    return {
      success: false,
      error: "Invalid credentials. Please try again.",
    };
  }

  const names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"];
  const randomName = names[Math.floor(Math.random() * names.length)];

  return {
    success: true,
    token: "mock_token_" + Date.now() + "_" + Math.random().toString(36).substring(7),
    user: {
      id: Math.random().toString(36).substring(7),
      name: randomName,
      email: email,
    },
  };
}

// Mock register API
export async function registerAPI(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  if (!randomSuccess()) {
    return {
      success: false,
      error: "Registration failed. Email may already be in use.",
    };
  }

  return {
    success: true,
    token: "mock_token_" + Date.now() + "_" + Math.random().toString(36).substring(7),
    user: {
      id: Math.random().toString(36).substring(7),
      name: name,
      email: email,
    },
  };
}

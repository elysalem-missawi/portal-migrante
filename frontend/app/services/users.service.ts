import { AUTH_TOKEN_KEY, http } from "./api";

export type PlatformRole = "user" | "moderator" | "admin";
export type UserStatus = "active" | "inactive" | "pending" | "blocked";
export type PreferredLanguage = "es" | "eu" | "ar" | "en";

export type MunicipalityRef = {
  _id: string;
  name: string;
  slug?: string;
  territory?: string;
};

export type User = {
  _id: string;
  displayName: string;
  fullName?: string;
  email: string;
  phone?: string;
  preferredLanguage: PreferredLanguage;
  originCountry?: string;
  municipalityId?: string | MunicipalityRef | null;
  profileImage?: string;
  platformRole: PlatformRole;
  status: UserStatus;
  legalConsentAccepted: boolean;
  legalConsentAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterUserInput = {
  displayName: string;
  fullName?: string;
  email: string;
  password: string;
  phone?: string;
  preferredLanguage?: PreferredLanguage;
  originCountry?: string;
  municipalityId?: string | null;
  profileImage?: string;
  legalConsentAccepted: true;
};

export type UpdateUserInput = {
  displayName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  preferredLanguage?: PreferredLanguage;
  originCountry?: string;
  municipalityId?: string | null;
  profileImage?: string;
  platformRole?: PlatformRole;
  status?: UserStatus;
};

export type RegisterUserResult = {
  message: string;
  user: User;
};

export type UpdateUserResult = {
  message: string;
  user: User;
};

export type LoginResult = {
  message: string;
  user: User;
  token: string;
  expiresAt: string;
  sessionId: string;
};

const CURRENT_USER_KEY = "portal.currentUser";
const CURRENT_USER_EVENT = "portal.currentUserChanged";

function notifyCurrentUserChanged() {
  window.dispatchEvent(new Event(CURRENT_USER_EVENT));
}

export const usersService = {
  async list(q?: string) {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    return http<User[]>(`/users${query}`);
  },

  async register(data: RegisterUserInput) {
    return http<RegisterUserResult>("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }) {
    const result = await http<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    this.setCurrentUser(result.user);
    return result.user;
  },

  async refreshCurrentUser() {
    const result = await http<{ user: User }>("/auth/me");
    this.setCurrentUser(result.user);
    return result.user;
  },

  hasAuthToken() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    notifyCurrentUserChanged();
  },

  clearLocalSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyCurrentUserChanged();
  },

  async logout() {
    try {
      await http<{ message: string }>("/auth/logout", { method: "POST" });
    } finally {
      this.clearLocalSession();
    }
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const result = await http<{ message: string }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    this.clearLocalSession();
    return result;
  },

  onCurrentUserChange(listener: () => void) {
    window.addEventListener(CURRENT_USER_EVENT, listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener(CURRENT_USER_EVENT, listener);
      window.removeEventListener("storage", listener);
    };
  },

  async getById(id: string) {
    return http<User>(`/users/${id}`);
  },

  async update(id: string, data: UpdateUserInput) {
    const result = await http<UpdateUserResult>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result.user;
  },

  async remove(id: string) {
    return http<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

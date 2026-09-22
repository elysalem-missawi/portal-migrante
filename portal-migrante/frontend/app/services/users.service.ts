import { AUTH_TOKEN_KEY, http } from "./api";

export type UserRole =
  | "community_user"
  | "organization_manager"
  | "admin"
  | "super_admin";

export type PlatformRole = "user" | "moderator" | "admin" | "super_admin";
export type AccountType = "individual" | "organization_account";
export type UserStatus = "active" | "inactive" | "pending" | "blocked";

export type OrganizationRef = {
  _id: string;
  name: string;
  type: string;
  slug: string;
  status: string;
  verified: boolean;
};

export type IdentityDocumentInput = {
  fileName: string;
  mimeType: string;
  size: number;
  dataUrl: string;
};

export type User = {
  _id: string;
  accountType: AccountType;
  platformRole?: PlatformRole;
  role: UserRole;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  preferredLanguage?: string;
  originCountry?: string;
  nativeLanguage?: string;
  municipalityId?: string | null;
  municipality?: string;
  profileImage?: string;
  identityDocument?: Partial<IdentityDocumentInput> & { uploadedAt?: string };
  legalConsentAccepted?: boolean;
  legalConsentAt?: string;
  organizationId?: string | OrganizationRef | null;
  status: UserStatus;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;

  // ───── Extended fields ─────
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  cif?: string;
  contactPersonName?: string;
  address?: string;
  postalCode?: string;
};

export type CreateUserInput = {
  accountType?: AccountType;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  password?: string;
  preferredLanguage?: string;
  originCountry?: string;
  nativeLanguage?: string;
  municipalityId?: string | null;
  municipality?: string;
  profileImage?: string;
  identityDocument?: IdentityDocumentInput;
  legalConsentAccepted?: boolean;

  // ───── Extended fields ─────
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  cif?: string;
  contactPersonName?: string;
  address?: string;
  postalCode?: string;
};

export type RegisterUserResult = {
  user: User;
  phoneVerification?: {
    sent: boolean;
    skipped?: boolean;
    reason?: string;
  };
};

export type LoginResult = {
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

  async create(data: CreateUserInput) {
    return http<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async register(data: CreateUserInput) {
    return http<RegisterUserResult>("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
    async googleRegister(credential: string) {
    return http<RegisterUserResult>("/users/register/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
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
    const user = await http<User>("/auth/me");
    this.setCurrentUser(user);
    return user;
  },

  async sendPhoneCode(userId: string) {
    return http<{
      message: string;
      phoneVerification?: RegisterUserResult["phoneVerification"];
    }>(`/users/${userId}/send-phone-code`, { method: "POST" });
  },

  async verifyPhone(userId: string, code: string) {
    const user = await http<User>(`/users/${userId}/verify-phone`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (this.hasAuthToken()) {
      this.setCurrentUser(user);
    }
    return user;
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

  async update(id: string, data: Partial<CreateUserInput>) {
    return http<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async remove(id: string) {
    return http<{ message: string }>(`/users/${id}`, { method: "DELETE" });
  },
};
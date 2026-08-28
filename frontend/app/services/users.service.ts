// frontend/app/services/users.service.ts
import { http } from "./api";

export type UserRole =
  | "community_user"
  | "organization_manager"
  | "admin"
  | "super_admin";

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
  role: UserRole;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  preferredLanguage?: string;
  originCountry?: string;
  nativeLanguage?: string;
  municipality?: string;
  profileImage?: string;
  identityDocument?: Partial<IdentityDocumentInput> & {
    uploadedAt?: string;
  };
  legalConsentAccepted?: boolean;
  legalConsentAt?: string;
  organizationId?: string | OrganizationRef | null;
  status: UserStatus;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserInput = {
  accountType?: AccountType;
  role?: UserRole;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  password?: string;
  preferredLanguage?: string;
  originCountry?: string;
  nativeLanguage?: string;
  municipality?: string;
  profileImage?: string;
  identityDocument?: IdentityDocumentInput;
  legalConsentAccepted?: boolean;
  organizationId?: string | null;
  status?: UserStatus;
  isVerified?: boolean;
};

export type RegisterUserResult = {
  user: User;
  phoneVerification?: {
    sent: boolean;
    skipped?: boolean;
    reason?: string;
  };
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
    const result = await http<RegisterUserResult>("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setCurrentUser(result.user);
    return result;
  },

  async login(data: { email: string; password: string }) {
    const user = await http<User>("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setCurrentUser(user);
    return user;
  },

  async sendPhoneCode(userId: string) {
    return http<{ message: string; phoneVerification?: RegisterUserResult["phoneVerification"] }>(
      `/users/${userId}/send-phone-code`,
      {
        method: "POST",
      }
    );
  },

  async verifyPhone(userId: string, code: string) {
    const user = await http<User>(`/users/${userId}/verify-phone`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    this.setCurrentUser(user);
    return user;
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

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyCurrentUserChanged();
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
    return http<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

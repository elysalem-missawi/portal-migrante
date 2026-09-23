import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const values = new Map();
globalThis.localStorage = {
  getItem(key) {
    return values.has(key) ? values.get(key) : null;
  },
  setItem(key, value) {
    values.set(key, String(value));
  },
  removeItem(key) {
    values.delete(key);
  },
  clear() {
    values.clear();
  },
};
globalThis.window = {
  dispatchEvent() {},
  addEventListener() {},
  removeEventListener() {},
};
globalThis.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};

const apiModule =
  'export const AUTH_TOKEN_KEY = "portal.authToken";\n' +
  'export const http = (...args) => globalThis.__portalTestHttp(...args);\n';
const apiUrl =
  "data:text/javascript;base64," +
  Buffer.from(apiModule).toString("base64");

const source = await readFile("app/services/users.service.ts", "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const serviceCode = transpiled.outputText.replace(
  /from ["']\.\/api["']/,
  'from "' + apiUrl + '"'
);
const serviceUrl =
  "data:text/javascript;base64," +
  Buffer.from(serviceCode).toString("base64");
const { usersService } = await import(serviceUrl);

const user = {
  _id: "user-1",
  accountType: "individual",
  role: "community_user",
  fullName: "Test user",
  email: "test@example.test",
  status: "pending",
  isVerified: false,
};

globalThis.__portalTestHttp = async (path) => {
  if (path === "/users/register") {
    return { user, phoneVerification: { sent: true } };
  }
  if (path === "/users/" + user._id + "/verify-phone") {
    return { ...user, phoneVerified: true };
  }
  if (path === "/auth/login") {
    return {
      user: { ...user, phoneVerified: true },
      token: "valid-session-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      sessionId: "session-1",
    };
  }
  if (path === "/auth/logout") return { message: "Session closed" };
  throw new Error("Unexpected API path: " + path);
};

await usersService.register({
  fullName: user.fullName,
  email: user.email,
  phone: "+34000000000",
  password: "password-123",
});
assert.equal(
  localStorage.getItem("portal.currentUser"),
  null,
  "Registration must not create a local authenticated user"
);

await usersService.verifyPhone(user._id, "123456");
assert.equal(
  localStorage.getItem("portal.currentUser"),
  null,
  "Public phone verification must not create a session"
);

const loggedIn = await usersService.login({
  email: user.email,
  password: "password-123",
});
assert.equal(loggedIn._id, user._id);
assert.equal(
  localStorage.getItem("portal.authToken"),
  "valid-session-token"
);
assert.equal(
  JSON.parse(localStorage.getItem("portal.currentUser"))._id,
  user._id
);

await usersService.verifyPhone(user._id, "123456");
assert.equal(
  JSON.parse(localStorage.getItem("portal.currentUser")).phoneVerified,
  true,
  "Authenticated phone verification must refresh the cached user"
);

await usersService.logout();
assert.equal(localStorage.getItem("portal.authToken"), null);
assert.equal(localStorage.getItem("portal.currentUser"), null);

console.log("User session tests passed: registration, verification, login and logout verified.");

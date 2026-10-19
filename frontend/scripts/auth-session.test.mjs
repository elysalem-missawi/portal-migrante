import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile("app/auth-session.ts", "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});

const moduleUrl =
  "data:text/javascript;base64," +
  Buffer.from(transpiled.outputText).toString("base64");
const { inspectStoredSession } = await import(moduleUrl);

let calls = 0;
const noToken = await inspectStoredSession(false, async () => {
  calls += 1;
  throw new Error("must not run");
});
assert.equal(calls, 0, "No-token sessions must not call /auth/me");
assert.deepEqual(
  {
    status: noToken.status,
    user: noToken.currentUser,
    clear: noToken.clearLocalSession,
  },
  { status: "anonymous", user: null, clear: true }
);

const verifiedUser = {
  _id: "user-1",
  accountType: "individual",
  role: "community_user",
  fullName: "Verified user",
  email: "verified@example.test",
  status: "active",
  isVerified: true,
};
const validToken = await inspectStoredSession(
  true,
  async () => verifiedUser
);
assert.equal(validToken.status, "authenticated");
assert.equal(validToken.currentUser?._id, verifiedUser._id);
assert.equal(validToken.clearLocalSession, false);

for (const status of [401, 403, 404]) {
  const rejected = await inspectStoredSession(true, async () => {
    throw Object.assign(new Error("Rejected"), { status });
  });
  assert.equal(rejected.status, "anonymous");
  assert.equal(rejected.currentUser, null);
  assert.equal(rejected.clearLocalSession, true);
}

const unavailable = await inspectStoredSession(true, async () => {
  throw new TypeError("Network unavailable");
});
assert.equal(unavailable.status, "unavailable");
assert.equal(unavailable.currentUser, null);
assert.equal(unavailable.clearLocalSession, false);
assert.equal(unavailable.error, "Network unavailable");

console.log("Auth session tests passed: 6 session states verified.");

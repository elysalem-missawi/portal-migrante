import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { createApp } from "../app";

async function withServer(
  run: (baseUrl: string) => Promise<void>
): Promise<void> {
  const server = createApp({ requestLogging: false }).listen(
    0,
    "127.0.0.1"
  );
  await once(server, "listening");

  const address = server.address() as AddressInfo | null;
  assert.ok(address, "The test server must have an address");

  try {
    await run("http://127.0.0.1:" + address.port);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

test("root and health endpoints respond without a database", async () => {
  await withServer(async (baseUrl) => {
    const rootResponse = await fetch(baseUrl + "/");
    assert.equal(rootResponse.status, 200);
    assert.deepEqual(await rootResponse.json(), {
      message: "Portal Migrante API is running",
      status: "ok",
    });

    const healthResponse = await fetch(baseUrl + "/api/health");
    assert.equal(healthResponse.status, 200);
    const health = (await healthResponse.json()) as {
      ok: boolean;
      status: string;
      time: string;
    };
    assert.equal(health.ok, true);
    assert.equal(health.status, "healthy");
    assert.equal(Number.isNaN(Date.parse(health.time)), false);
  });
});

test("unknown API routes return the JSON 404 contract", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(baseUrl + "/api/does-not-exist");
    assert.equal(response.status, 404);
    const body = (await response.json()) as { message: string };
    assert.equal(body.message, "Not Found - /api/does-not-exist");
  });
});

test("CORS allows the configured frontend and rejects unknown origins", async () => {
  await withServer(async (baseUrl) => {
    const allowed = await fetch(baseUrl + "/api/health", {
      headers: { Origin: "http://localhost:5173" },
    });
    assert.equal(allowed.status, 200);
    assert.equal(
      allowed.headers.get("access-control-allow-origin"),
      "http://localhost:5173"
    );
    assert.equal(
      allowed.headers.get("access-control-allow-credentials"),
      "true"
    );

    const blocked = await fetch(baseUrl + "/api/health", {
      headers: { Origin: "https://untrusted.example" },
    });
    assert.equal(blocked.status, 500);
    assert.equal(
      blocked.headers.get("access-control-allow-origin"),
      null
    );
  });
});

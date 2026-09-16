import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";

import { createApp } from "./app.js";
import { secretFrom } from "./auth/token.js";
import { loadSchemaSql } from "./db/migrate.js";
import { LedgerStore } from "./store/ledger-store.js";

const jwtSecret = secretFrom("test-secret");

function app(store = new LedgerStore()) {
  return createApp({ store, jwtSecret });
}

describe("health", () => {
  it("returns ok", async () => {
    const response = await request(app()).get("/health");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
  });
});

describe("schema", () => {
  it("defines users, items, and upload_jobs", async () => {
    const sql = await loadSchemaSql();
    assert.match(sql, /CREATE TABLE IF NOT EXISTS users/);
    assert.match(sql, /password_hash/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS items/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS upload_jobs/);
  });
});

describe("auth and items", () => {
  it("registers and creates an item", async () => {
    const api = app();
    const registered = await request(api).post("/auth/register").send({
      email: "maya@example.com",
      password: "password12",
    });
    assert.equal(registered.status, 201);
    assert.equal(registered.body.user.passwordHash, undefined);

    const created = await request(api)
      .post("/items")
      .set("Authorization", `Bearer ${registered.body.token}`)
      .send({ title: "Cafe receipt", notes: "Tuesday lunch" });
    assert.equal(created.status, 201);
    assert.equal(created.body.title, "Cafe receipt");
    assert.equal(created.body.status, "pending");

    const listed = await request(api)
      .get("/items")
      .set("Authorization", `Bearer ${registered.body.token}`);
    assert.equal(listed.status, 200);
    assert.equal(listed.body.length, 1);
  });

  it("rejects item create without a token", async () => {
    const response = await request(app()).post("/items").send({
      title: "Cafe receipt",
    });
    assert.equal(response.status, 401);
  });
});

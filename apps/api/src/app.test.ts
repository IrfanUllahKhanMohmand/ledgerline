import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";

import { createApp } from "./app.js";
import { loadSchemaSql } from "./db/migrate.js";

describe("health", () => {
  it("returns ok", async () => {
    const response = await request(createApp()).get("/health");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
  });
});

describe("schema", () => {
  it("defines users, items, and upload_jobs", async () => {
    const sql = await loadSchemaSql();
    assert.match(sql, /CREATE TABLE IF NOT EXISTS users/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS items/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS upload_jobs/);
    assert.match(sql, /REFERENCES users/);
    assert.match(sql, /REFERENCES items/);
  });
});

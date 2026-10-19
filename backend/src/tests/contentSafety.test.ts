import assert from "node:assert/strict";
import test from "node:test";
import type { Request, Response } from "express";
import {
  getPublicationById,
} from "../controllers/publication.controller";
import {
  createReport,
  updateReport,
} from "../controllers/report.controller";
import Publication from "../models/publication.model";
import Report from "../models/report.model";

const objectId = "507f1f77bcf86cd799439011";

function responseStub() {
  const state: {
    statusCode: number;
    payload?: unknown;
  } = { statusCode: 200 };
  const response = {
    status(statusCode: number) {
      state.statusCode = statusCode;
      return response;
    },
    json(payload: unknown) {
      state.payload = payload;
      return response;
    },
  };

  return {
    response: response as unknown as Response,
    state,
  };
}

function populatedQuery(value: unknown) {
  const query: any = {
    populate() {
      return query;
    },
    then(resolve: (result: unknown) => unknown, reject: (error: unknown) => unknown) {
      return Promise.resolve(value).then(resolve, reject);
    },
  };
  return query;
}

test("public publication details query only published, unexpired records", async () => {
  const originalUpdateOne = Publication.updateOne;
  const originalFindOne = Publication.findOne;
  let detailFilter: any;
  let expiryFilter: any;

  (Publication as any).updateOne = async (filter: unknown) => {
    expiryFilter = filter;
    return {};
  };
  (Publication as any).findOne = (filter: unknown) => {
    detailFilter = filter;
    return populatedQuery(null);
  };

  try {
    const { response, state } = responseStub();
    await getPublicationById(
      {
        params: { id: objectId },
      } as unknown as Request,
      response
    );

    assert.equal(state.statusCode, 404);
    assert.equal(expiryFilter.status, "published");
    assert.equal(detailFilter.status, "published");
    assert.equal(detailFilter._id, objectId);
    assert.equal(detailFilter.$or[0].expiresAt, null);
    assert.ok(detailFilter.$or[1].expiresAt.$gt instanceof Date);
  } finally {
    (Publication as any).updateOne = originalUpdateOne;
    (Publication as any).findOne = originalFindOne;
  }
});

test("reports cannot be created for private or expired publications", async () => {
  const originalExists = Publication.exists;
  const originalCreate = Report.create;
  let publicationFilter: any;
  let createCalled = false;

  (Publication as any).exists = async (filter: unknown) => {
    publicationFilter = filter;
    return null;
  };
  (Report as any).create = async () => {
    createCalled = true;
    return {};
  };

  try {
    const { response, state } = responseStub();
    await createReport(
      {
        auth: {
          userId: objectId,
          platformRole: "user",
        },
        body: {
          publicationId: objectId,
          reason: "spam",
        },
      } as unknown as Request,
      response
    );

    assert.equal(state.statusCode, 404);
    assert.equal(createCalled, false);
    assert.equal(publicationFilter.status, "published");
    assert.ok(
      publicationFilter.$or[1].expiresAt.$gt instanceof Date
    );
  } finally {
    (Publication as any).exists = originalExists;
    (Report as any).create = originalCreate;
  }
});

test("report moderation ignores immutable attacker-controlled fields", async () => {
  const originalUpdate = Report.findByIdAndUpdate;
  let capturedUpdate: any;

  (Report as any).findByIdAndUpdate = async (
    _id: string,
    update: unknown
  ) => {
    capturedUpdate = update;
    return { _id, status: "resolved" };
  };

  try {
    const { response, state } = responseStub();
    await updateReport(
      {
        params: { id: objectId },
        body: {
          status: "resolved",
          publicationId: "aaaaaaaaaaaaaaaaaaaaaaaa",
          reporterUserId: "bbbbbbbbbbbbbbbbbbbbbbbb",
          reason: "other",
          details: "must stay immutable",
        },
      } as unknown as Request,
      response
    );

    assert.equal(state.statusCode, 200);
    assert.equal(capturedUpdate.$set.status, "resolved");
    assert.ok(capturedUpdate.$set.resolvedAt instanceof Date);
    for (const protectedField of [
      "publicationId",
      "reporterUserId",
      "reason",
      "details",
    ]) {
      assert.equal(
        protectedField in capturedUpdate.$set,
        false,
        protectedField + " must not be mutable"
      );
    }
  } finally {
    (Report as any).findByIdAndUpdate = originalUpdate;
  }
});

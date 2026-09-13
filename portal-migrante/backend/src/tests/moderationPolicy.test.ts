import assert from "node:assert/strict";
import test from "node:test";
import {
  canReviewTarget,
  reviewStateFor,
  serviceRequiresLocation,
} from "../services/moderationPolicy.service";

test("only administrators can review organizations", () => {
  assert.equal(canReviewTarget("user", "organization"), false);
  assert.equal(canReviewTarget("moderator", "organization"), false);
  assert.equal(canReviewTarget("admin", "organization"), true);
  assert.equal(canReviewTarget("super_admin", "organization"), true);
});

test("platform staff can review services", () => {
  assert.equal(canReviewTarget("user", "service"), false);
  assert.equal(canReviewTarget("moderator", "service"), true);
  assert.equal(canReviewTarget("admin", "service"), true);
  assert.equal(canReviewTarget("super_admin", "service"), true);
});

test("physical and hybrid services require a location", () => {
  assert.equal(serviceRequiresLocation(["in_person"]), true);
  assert.equal(serviceRequiresLocation(["hybrid"]), true);
  assert.equal(
    serviceRequiresLocation(["online", "phone", "mobile"]),
    false
  );
  assert.equal(
    serviceRequiresLocation(["online", "in_person"]),
    true
  );
  assert.equal(serviceRequiresLocation([]), false);
});

test("moderation decisions map to canonical database states", () => {
  assert.deepEqual(reviewStateFor("approve"), {
    status: "active",
    verificationStatus: "verified",
    verified: true,
  });
  assert.deepEqual(reviewStateFor("reject"), {
    status: "inactive",
    verificationStatus: "rejected",
    verified: false,
  });
});

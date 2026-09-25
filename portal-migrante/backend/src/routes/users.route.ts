import { Router } from "express";

import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

import { requireSelfOrPlatformRoles } from "../middlewares/userAuthorization";

const router = Router();

/* =========================================================
   PUBLIC ROUTES
   ========================================================= */

/**
 * Register a new user.
 *
 * POST /api/users/register
 *
 * Public endpoint.
 * The backend must always assign:
 *   platformRole = "user"
 *   status = "active"
 *
 * The client must NOT be allowed to assign roles.
 */
router.post("/register", registerUser);

/* =========================================================
   USER COLLECTION
   ========================================================= */

/**
 * List users.
 *
 * GET /api/users
 *
 * Only moderators and administrators can list users.
 */
router.get(
  "/",
  requireAuth,
  requirePlatformRoles("moderator", "admin"),
  getUsers
);

/* =========================================================
   SINGLE USER
   ========================================================= */

/**
 * Get one user.
 *
 * GET /api/users/:id
 *
 * Allowed:
 * - the user himself/herself
 * - moderator
 * - admin
 */
router.get(
  "/:id",
  requireAuth,
  requireSelfOrPlatformRoles("moderator", "admin"),
  getUserById
);

/**
 * Update one user.
 *
 * PUT /api/users/:id
 *
 * Allowed:
 * - the user himself/herself
 * - admin
 *
 * Normal users must NOT be able to modify:
 * - platformRole
 * - status
 */
router.put(
  "/:id",
  requireAuth,
  requireSelfOrPlatformRoles("admin"),
  updateUser
);

/**
 * Delete / deactivate one user.
 *
 * DELETE /api/users/:id
 *
 * Allowed:
 * - the user himself/herself
 * - admin
 *
 * V1 should use soft delete:
 * status = "inactive"
 */
router.delete(
  "/:id",
  requireAuth,
  requireSelfOrPlatformRoles("admin"),
  deleteUser
);

export default router;
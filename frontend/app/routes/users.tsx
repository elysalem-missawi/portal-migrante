import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../auth";

import {
  useI18n,
} from "../i18n";

import {
  usersService,
  type PlatformRole,
  type User,
  type UserStatus,
} from "../services/users.service";

type PendingChange = {
  platformRole: PlatformRole;
  status: UserStatus;
};

function municipalityName(
  user: User
): string {
  if (
    !user.municipalityId
  ) {
    return "—";
  }

  if (
    typeof user
      .municipalityId ===
    "string"
  ) {
    return user
      .municipalityId;
  }

  return (
    user
      .municipalityId
      .name ||
    "—"
  );
}

export default function UsersPage() {
  const [
    users,
    setUsers,
  ] = useState<User[]>(
    []
  );

  const [
    pending,
    setPending,
  ] = useState<
    Record<
      string,
      PendingChange
    >
  >({});

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    busyId,
    setBusyId,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    params,
  ] =
    useSearchParams();

  const q =
    params.get(
      "q"
    ) || "";

  const {
    currentUser,
  } = useAuth();

  const {
    t,
  } = useI18n();

  const isAdmin =
    currentUser
      ?.platformRole ===
    "admin";

  const roleOptions =
    useMemo<
      PlatformRole[]
    >(
      () => [
        "user",
        "moderator",
        "admin",
      ],
      []
    );

  const statusOptions =
    useMemo<
      UserStatus[]
    >(
      () => [
        "active",
        "inactive",
        "pending",
        "blocked",
      ],
      []
    );

  const roleLabel = (
    role: PlatformRole
  ) => {
    if (
      role === "admin"
    ) {
      return t(
        "users_role_admin"
      );
    }

    if (
      role ===
      "moderator"
    ) {
      return t(
        "users_role_moderator"
      );
    }

    return t(
      "users_role_user"
    );
  };

  const statusLabel = (
    status: UserStatus
  ) => {
    if (
      status === "active"
    ) {
      return t(
        "status_active"
      );
    }

    if (
      status === "inactive"
    ) {
      return t(
        "status_inactive"
      );
    }

    if (
      status === "pending"
    ) {
      return t(
        "status_pending"
      );
    }

    return t(
      "status_blocked"
    );
  };

  const load =
    async () => {
      setLoading(
        true
      );

      setError("");
      setSuccess("");

      try {
        const result =
          await usersService.list(
            q
          );

        setUsers(
          result
        );

        setPending(
          Object.fromEntries(
            result.map(
              (
                user
              ) => [
                user._id,
                {
                  platformRole:
                    user
                      .platformRole,

                  status:
                    user
                      .status,
                },
              ]
            )
          )
        );
      } catch (
        caught
      ) {
        setError(
          caught instanceof
            Error
            ? caught.message
            : "Failed to load users"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void load();
  }, [q]);

  const hasChanges = (
    user: User
  ) => {
    const draft =
      pending[
        user._id
      ];

    if (!draft) {
      return false;
    }

    return (
      draft
        .platformRole !==
        user
          .platformRole ||
      draft.status !==
        user.status
    );
  };

  const changeDraft = (
    userId: string,
    patch: Partial<PendingChange>
  ) => {
    setPending(
      (
        current
      ) => ({
        ...current,

        [userId]: {
          ...current[
            userId
          ],

          ...patch,
        },
      })
    );

    setSuccess("");
    setError("");
  };

  const resetChanges = (
    user: User
  ) => {
    setPending(
      (
        current
      ) => ({
        ...current,

        [user._id]: {
          platformRole:
            user
              .platformRole,

          status:
            user.status,
        },
      })
    );

    setSuccess("");
    setError("");
  };

  const saveChanges =
    async (
      user: User
    ) => {
      if (!isAdmin) {
        return;
      }

      const draft =
        pending[
          user._id
        ];

      if (
        !draft ||
        !hasChanges(
          user
        )
      ) {
        return;
      }

      const patch: Partial<
        Pick<
          User,
          | "platformRole"
          | "status"
        >
      > = {};

      const changes:
        string[] = [];

      if (
        draft
          .platformRole !==
        user.platformRole
      ) {
        patch.platformRole =
          draft
            .platformRole;

        changes.push(
          t(
            "users_role_change",
            {
              old:
                roleLabel(
                  user
                    .platformRole
                ),

              new:
                roleLabel(
                  draft
                    .platformRole
                ),
            }
          )
        );
      }

      if (
        draft.status !==
        user.status
      ) {
        patch.status =
          draft.status;

        changes.push(
          t(
            "users_status_change",
            {
              old:
                statusLabel(
                  user.status
                ),

              new:
                statusLabel(
                  draft.status
                ),
            }
          )
        );
      }

      setBusyId(
        user._id
      );

      setError("");
      setSuccess("");

      try {
        const updated =
          await usersService.update(
            user._id,
            patch
          );

        setUsers(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item._id ===
                updated._id
                  ? updated
                  : item
            )
        );

        setPending(
          (
            current
          ) => ({
            ...current,

            [updated._id]: {
              platformRole:
                updated
                  .platformRole,

              status:
                updated
                  .status,
            },
          })
        );

        setSuccess(
          t(
            "users_changes_saved",
            {
              name:
                updated
                  .displayName,

              changes:
                changes.join(
                  " · "
                ),
            }
          )
        );
      } catch (
        caught
      ) {
        setError(
          caught instanceof
            Error
            ? caught.message
            : "Failed to update user"
        );
      } finally {
        setBusyId("");
      }
    };

  const deactivate =
    async (
      user: User
    ) => {
      if (!isAdmin) {
        return;
      }

      const name =
        user.displayName ||
        user.email;

      const confirmed =
        window.confirm(
          t(
            "users_deactivate_confirm",
            {
              name,
            }
          )
        );

      if (!confirmed) {
        return;
      }

      setBusyId(
        user._id
      );

      setError("");
      setSuccess("");

      try {
        await usersService.remove(
          user._id
        );

        setUsers(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item._id ===
                user._id
                  ? {
                      ...item,
                      status:
                        "inactive",
                    }
                  : item
            )
        );

        setPending(
          (
            current
          ) => ({
            ...current,

            [user._id]: {
              platformRole:
                user
                  .platformRole,

              status:
                "inactive",
            },
          })
        );

        setSuccess(
          t(
            "users_deactivated",
            {
              name,
            }
          )
        );
      } catch (
        caught
      ) {
        setError(
          caught instanceof
            Error
            ? caught.message
            : "Failed to deactivate user"
        );
      } finally {
        setBusyId("");
      }
    };

  const stats = [
    {
      label: t(
        "users_total"
      ),

      value:
        users.length,

      className:
        "border-emerald-100 bg-emerald-50 text-emerald-800",
    },

    {
      label: t(
        "users_active"
      ),

      value:
        users.filter(
          (
            user
          ) =>
            user.status ===
            "active"
        ).length,

      className:
        "border-sky-100 bg-sky-50 text-sky-800",
    },

    {
      label: t(
        "users_blocked"
      ),

      value:
        users.filter(
          (
            user
          ) =>
            user.status ===
            "blocked"
        ).length,

      className:
        "border-rose-100 bg-rose-50 text-rose-800",
    },

    {
      label: t(
        "users_admins"
      ),

      value:
        users.filter(
          (
            user
          ) =>
            user
              .platformRole ===
            "admin"
        ).length,

      className:
        "border-amber-100 bg-amber-50 text-amber-800",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
              PORTAL MIGRANTE
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {t(
                "users_title"
              )}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {t(
                "users_admin_intro"
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <form
              method="get"
              role="search"
              className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <input
                name="q"
                defaultValue={
                  q
                }
                placeholder={t(
                  "search"
                )}
                className="w-full min-w-0 bg-transparent px-4 py-2.5 text-sm outline-none sm:w-60"
              />

              <button
                type="submit"
                className="border-s border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                {t(
                  "search"
                )}
              </button>
            </form>

            <Link
              to="/users/new"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition hover:bg-emerald-700"
            >
              +{" "}
              {t(
                "users_new"
              )}
            </Link>
          </div>
        </header>

        {/* STATS */}

        <section className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {stats.map(
            (
              item
            ) => (
              <div
                key={
                  item.label
                }
                className={`rounded-xl border px-4 py-2.5 ${item.className}`}
              >
                <p className="text-xs font-bold opacity-70">
                  {
                    item.label
                  }
                </p>

                <p className="mt-0.5 text-lg font-black">
                  {
                    item.value
                  }
                </p>
              </div>
            )
          )}
        </section>

        {/* MESSAGES */}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* USERS LIST */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-black text-slate-900">
              {t(
                "users_list_title"
              )}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {t(
                "users_list_hint"
              )}
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-sm text-slate-500">
              {t(
                "loading"
              )}
            </div>
          ) : users.length ===
            0 ? (
            <div className="py-8 text-sm text-slate-500">
              {t(
                "no_data"
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(
                (
                  user
                ) => {
                  const draft =
                    pending[
                      user._id
                    ] ?? {
                      platformRole:
                        user
                          .platformRole,

                      status:
                        user
                          .status,
                    };

                  const changed =
                    hasChanges(
                      user
                    );

                  const busy =
                    busyId ===
                    user._id;

                  const initial =
                    (
                      user.displayName ||
                      user.email
                    )
                      .charAt(
                        0
                      )
                      .toUpperCase();

                  return (
                    <article
                      key={
                        user._id
                      }
                      className={`rounded-xl border px-4 py-3.5 transition ${
                        changed
                          ? "border-amber-200 bg-amber-50/40"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1.1fr)_160px_170px] lg:items-center">
                        {/* USER */}

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                            {
                              initial
                            }
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-black text-slate-900">
                                {
                                  user
                                    .displayName
                                }
                              </h3>

                              {changed && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                                  {t(
                                    "users_unsaved"
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {
                                user.email
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {municipalityName(
                                user
                              )}{" "}
                              ·{" "}
                              {user
                                .preferredLanguage
                                ?.toUpperCase() ||
                                "ES"}
                            </p>
                          </div>
                        </div>

                        {/* ROLE */}

                        <label>
                          <span className="mb-1.5 block text-xs font-bold text-slate-400">
                            {t(
                              "role"
                            )}
                          </span>

                          <select
                            value={
                              draft
                                .platformRole
                            }
                            disabled={
                              !isAdmin ||
                              busy
                            }
                            onChange={(
                              event
                            ) =>
                              changeDraft(
                                user._id,
                                {
                                  platformRole:
                                    event
                                      .target
                                      .value as PlatformRole,
                                }
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400"
                          >
                            {roleOptions.map(
                              (
                                role
                              ) => (
                                <option
                                  key={
                                    role
                                  }
                                  value={
                                    role
                                  }
                                >
                                  {roleLabel(
                                    role
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </label>

                        {/* STATUS */}

                        <label>
                          <span className="mb-1.5 block text-xs font-bold text-slate-400">
                            {t(
                              "status"
                            )}
                          </span>

                          <select
                            value={
                              draft
                                .status
                            }
                            disabled={
                              !isAdmin ||
                              busy
                            }
                            onChange={(
                              event
                            ) =>
                              changeDraft(
                                user._id,
                                {
                                  status:
                                    event
                                      .target
                                      .value as UserStatus,
                                }
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400"
                          >
                            {statusOptions.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {statusLabel(
                                    status
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </label>

                        {/* ACTIONS */}

                        {isAdmin && (
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              disabled={
                                busy ||
                                !changed
                              }
                              onClick={() =>
                                void saveChanges(
                                  user
                                )
                              }
                              className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                changed
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "border border-slate-200 bg-slate-50 text-slate-400"
                              } disabled:cursor-not-allowed`}
                            >
                              {busy
                                ? t(
                                    "users_saving_changes"
                                  )
                                : t(
                                    "users_save_changes"
                                  )}
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                disabled={
                                  busy ||
                                  !changed
                                }
                                onClick={() =>
                                  resetChanges(
                                    user
                                  )
                                }
                                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                              >
                                {t(
                                  "users_cancel_changes"
                                )}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  busy ||
                                  user.status ===
                                    "inactive"
                                }
                                onClick={() =>
                                  void deactivate(
                                    user
                                  )
                                }
                                className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-40"
                              >
                                {t(
                                  "users_deactivate"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
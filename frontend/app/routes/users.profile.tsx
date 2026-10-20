import {
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth";

import {
  useI18n,
} from "../i18n";

import {
  usersService,
  type PreferredLanguage,
} from "../services/users.service";

import CommunityAccountNav from "../components/CommunityAccountNav";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Belgium",
  "Brazil",
  "Cameroon",
  "Canada",
  "Chile",
  "Colombia",
  "Cote d'Ivoire",
  "Egypt",
  "France",
  "Germany",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Italy",
  "Mali",
  "Mauritania",
  "Morocco",
  "Netherlands",
  "Nigeria",
  "Pakistan",
  "Palestine",
  "Portugal",
  "Senegal",
  "Spain",
  "Sudan",
  "Syria",
  "Tunisia",
  "Turkey",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Venezuela",
] as const;

async function optimizeAvatar(
  file: File
): Promise<string> {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "unsupported"
    );
  }

  const dataUrl =
    await new Promise<string>(
      (
        resolve,
        reject
      ) => {
        const reader =
          new FileReader();

        reader.onload =
          () => {
            resolve(
              String(
                reader.result
              )
            );
          };

        reader.onerror =
          () => {
            reject(
              reader.error
            );
          };

        reader.readAsDataURL(
          file
        );
      }
    );

  const image =
    await new Promise<HTMLImageElement>(
      (
        resolve,
        reject
      ) => {
        const img =
          new Image();

        img.onload =
          () => {
            resolve(
              img
            );
          };

        img.onerror =
          reject;

        img.src =
          dataUrl;
      }
    );

  const maxSize = 400;

  const scale =
    Math.min(
      1,
      maxSize /
        Math.max(
          image.width,
          image.height
        )
    );

  const width =
    Math.max(
      1,
      Math.round(
        image.width *
          scale
      )
    );

  const height =
    Math.max(
      1,
      Math.round(
        image.height *
          scale
      )
    );

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    width;

  canvas.height =
    height;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    throw new Error(
      "canvas"
    );
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  return canvas.toDataURL(
    "image/jpeg",
    0.82
  );
}

export default function UserProfilePage() {
  const {
    currentUser,
    refreshSession,
  } = useAuth();

  const {
    locale,
    t,
  } = useI18n();

  const navigate =
    useNavigate();

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    editing,
    setEditing,
  ] = useState(
    false
  );

  const [
    showPasswordForm,
    setShowPasswordForm,
  ] = useState(
    false
  );

  const [
    savingProfile,
    setSavingProfile,
  ] = useState(
    false
  );

  const [
    savingPhoto,
    setSavingPhoto,
  ] = useState(
    false
  );

  const [
    savingPassword,
    setSavingPassword,
  ] = useState(
    false
  );

  const [
    notice,
    setNotice,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState<{
    displayName: string;
    fullName: string;
    originCountry: string;
    preferredLanguage: PreferredLanguage;
  }>({
    displayName:
      currentUser
        ?.displayName ||
      "",

    fullName:
      currentUser
        ?.fullName ||
      "",

    originCountry:
      currentUser
        ?.originCountry ||
      "",

    preferredLanguage:
      currentUser
        ?.preferredLanguage ||
      locale ||
      "es",
  });

  const [
    passwordForm,
    setPasswordForm,
  ] = useState({
    currentPassword:
      "",

    newPassword:
      "",

    confirmNewPassword:
      "",
  });

  if (!currentUser) {
    return null;
  }

  const displayName =
    currentUser.displayName ||
    currentUser.fullName ||
    currentUser.email;

  const initial =
    displayName
      .charAt(0)
      .toUpperCase();

  const roleLabel =
    currentUser.platformRole ===
    "admin"
      ? t(
          "users_role_admin"
        )
      : currentUser.platformRole ===
          "moderator"
        ? t(
            "users_role_moderator"
          )
        : t(
            "users_role_user"
          );

  const municipality =
    !currentUser.municipalityId
      ? "—"
      : typeof currentUser
            .municipalityId ===
          "string"
        ? currentUser
            .municipalityId
        : currentUser
            .municipalityId
            .name;

  const language =
    currentUser.preferredLanguage ===
    "ar"
      ? "العربية"
      : currentUser.preferredLanguage ===
          "eu"
        ? "Euskara"
        : currentUser.preferredLanguage ===
            "en"
          ? "English"
          : "Español";

  const savePhoto =
    async (
      profileImage: string
    ) => {
      setSavingPhoto(
        true
      );

      setNotice("");
      setError("");

      try {
        await usersService.update(
          currentUser._id,
          {
            profileImage,
          }
        );

        await refreshSession();

        setNotice(
          t(
            "profile_photo_updated"
          )
        );
      } catch {
        setError(
          t(
            "profile_photo_error"
          )
        );
      } finally {
        setSavingPhoto(
          false
        );
      }
    };

  const onPhotoChange =
    async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target
          .files?.[0];

      event.target.value =
        "";

      if (!file) {
        return;
      }

      try {
        const optimized =
          await optimizeAvatar(
            file
          );

        await savePhoto(
          optimized
        );
      } catch {
        setError(
          t(
            "profile_photo_error"
          )
        );
      }
    };

  const saveProfile =
    async () => {
      setSavingProfile(
        true
      );

      setNotice("");
      setError("");

      try {
        await usersService.update(
          currentUser._id,
          {
            displayName:
              form.displayName.trim(),

            fullName:
              form.fullName.trim(),

            originCountry:
              form.originCountry.trim(),

            preferredLanguage:
              form.preferredLanguage,
          }
        );

        await refreshSession();

        setEditing(
          false
        );

        setNotice(
          t(
            "profile_updated"
          )
        );
      } catch {
        setError(
          t(
            "profile_update_error"
          )
        );
      } finally {
        setSavingProfile(
          false
        );
      }
    };

  const cancelEdit =
    () => {
      setEditing(
        false
      );

      setForm({
        displayName:
          currentUser.displayName ||
          "",

        fullName:
          currentUser.fullName ||
          "",

        originCountry:
          currentUser.originCountry ||
          "",

        preferredLanguage:
          currentUser.preferredLanguage ||
          locale ||
          "es",
      });
    };

  const changePassword =
    async () => {
      setNotice("");
      setError("");

      if (
        !passwordForm
          .currentPassword ||
        passwordForm
          .newPassword
          .length <
          8
      ) {
        setError(
          t(
            "profile_password_error"
          )
        );

        return;
      }

      if (
        passwordForm
          .newPassword !==
        passwordForm
          .confirmNewPassword
      ) {
        setError(
          t(
            "profile_password_mismatch"
          )
        );

        return;
      }

      setSavingPassword(
        true
      );

      try {
        await usersService.changePassword(
          {
            currentPassword:
              passwordForm
                .currentPassword,

            newPassword:
              passwordForm
                .newPassword,
          }
        );

        setNotice(
          t(
            "profile_password_changed"
          )
        );

        window.setTimeout(
          () => {
            navigate(
              "/login",
              {
                replace:
                  true,
              }
            );
          },
          700
        );
      } catch {
        setError(
          t(
            "profile_password_error"
          )
        );
      } finally {
        setSavingPassword(
          false
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#f0f2f5] py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CommunityAccountNav />

        {/* PROFILE HEADER */}

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {currentUser.profileImage ? (
                <img
                  src={
                    currentUser.profileImage
                  }
                  alt=""
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-50"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white ring-4 ring-emerald-50">
                  {
                    initial
                  }
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  inputRef
                    .current
                    ?.click()
                }
                title={t(
                  "profile_change_photo"
                )}
                className="absolute bottom-0 end-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-xs font-black text-white shadow"
              >
                +
              </button>

              <input
                ref={
                  inputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  onPhotoChange
                }
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-black text-slate-950 sm:text-2xl">
                  {
                    displayName
                  }
                </h1>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">
                  {
                    roleLabel
                  }
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-slate-500">
                {
                  currentUser.email
                }
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  {
                    language
                  }
                </span>

                {currentUser.originCountry && (
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                    {
                      currentUser.originCountry
                    }
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setEditing(
                  true
                )
              }
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              {t(
                "profile_edit"
              )}
            </button>
          </div>
        </section>

        {/* FEEDBACK */}

        {notice && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {
              notice
            }
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {
              error
            }
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* LEFT COLUMN */}

          <aside className="space-y-4">
            {/* ABOUT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">
                {t(
                  "profile_about"
                )}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    {t(
                      "profile_municipality"
                    )}
                  </p>

                  <p className="mt-0.5 font-bold text-slate-700">
                    {
                      municipality
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t(
                      "profile_origin_country"
                    )}
                  </p>

                  <p className="mt-0.5 font-bold text-slate-700">
                    {currentUser.originCountry ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t(
                      "profile_language"
                    )}
                  </p>

                  <p className="mt-0.5 font-bold text-slate-700">
                    {
                      language
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* PHOTO */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">
                {t(
                  "profile_photo"
                )}
              </h2>

              <button
                type="button"
                disabled={
                  savingPhoto
                }
                onClick={() =>
                  inputRef
                    .current
                    ?.click()
                }
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {savingPhoto
                  ? t(
                      "profile_saving"
                    )
                  : t(
                      "profile_change_photo"
                    )}
              </button>

              {currentUser.profileImage && (
                <button
                  type="button"
                  disabled={
                    savingPhoto
                  }
                  onClick={() =>
                    void savePhoto(
                      ""
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {t(
                    "profile_remove_photo"
                  )}
                </button>
              )}
            </section>
          </aside>

          {/* RIGHT COLUMN */}

          <section className="space-y-4">
            {/* ACCOUNT INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-black text-slate-900">
                  {t(
                    "profile_account_info"
                  )}
                </h2>
              </div>

              <div className="p-4">
                {editing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* DISPLAY NAME */}

                    <label>
                      <span className="mb-1.5 block text-xs font-bold text-slate-500">
                        {t(
                          "profile_display_name"
                        )}
                      </span>

                      <input
                        value={
                          form.displayName
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,

                              displayName:
                                event.target.value,
                            })
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    {/* FULL NAME */}

                    <label>
                      <span className="mb-1.5 block text-xs font-bold text-slate-500">
                        {t(
                          "profile_full_name"
                        )}
                      </span>

                      <input
                        value={
                          form.fullName
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,

                              fullName:
                                event.target.value,
                            })
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    {/* COUNTRY */}

                    <label>
                      <span className="mb-1.5 block text-xs font-bold text-slate-500">
                        {t(
                          "profile_origin_country"
                        )}
                      </span>

                      <select
                        value={
                          form.originCountry
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,

                              originCountry:
                                event.target.value,
                            })
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="">
                          —
                        </option>

                        {countries.map(
                          (
                            country
                          ) => (
                            <option
                              key={
                                country
                              }
                              value={
                                country
                              }
                            >
                              {
                                country
                              }
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    {/* LANGUAGE */}

                    <label>
                      <span className="mb-1.5 block text-xs font-bold text-slate-500">
                        {t(
                          "profile_language"
                        )}
                      </span>

                      <select
                        value={
                          form.preferredLanguage
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,

                              preferredLanguage:
                                event.target
                                  .value as PreferredLanguage,
                            })
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="es">
                          Español
                        </option>

                        <option value="eu">
                          Euskara
                        </option>

                        <option value="ar">
                          العربية
                        </option>

                        <option value="en">
                          English
                        </option>
                      </select>
                    </label>

                    {/* ACTIONS */}

                    <div className="flex gap-2 sm:col-span-2">
                      <button
                        type="button"
                        disabled={
                          savingProfile
                        }
                        onClick={() =>
                          void saveProfile()
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingProfile
                          ? t(
                              "profile_saving"
                            )
                          : t(
                              "profile_save"
                            )}
                      </button>

                      <button
                        type="button"
                        disabled={
                          savingProfile
                        }
                        onClick={
                          cancelEdit
                        }
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        {t(
                          "profile_cancel"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[
                      [
                        t(
                          "profile_display_name"
                        ),
                        displayName,
                      ],

                      [
                        t(
                          "profile_email"
                        ),
                        currentUser.email,
                      ],

                      [
                        t(
                          "profile_municipality"
                        ),
                        municipality,
                      ],

                      [
                        t(
                          "profile_origin_country"
                        ),
                        currentUser.originCountry ||
                          "—",
                      ],

                      [
                        t(
                          "profile_language"
                        ),
                        language,
                      ],

                      [
                        t(
                          "profile_role"
                        ),
                        roleLabel,
                      ],
                    ].map(
                      ([
                        label,
                        value,
                      ]) => (
                        <div
                          key={
                            label
                          }
                          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="text-xs text-slate-400">
                            {
                              label
                            }
                          </span>

                          <span className="text-sm font-bold text-slate-700">
                            {
                              value
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* SECURITY */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    {t(
                      "profile_security"
                    )}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {t(
                      "profile_security_desc"
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordForm(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {showPasswordForm
                    ? t(
                        "profile_close_password"
                      )
                    : t(
                        "profile_change_password"
                      )}
                </button>
              </div>

              {showPasswordForm && (
                <div className="border-t border-slate-100 p-4">
                  <div className="grid gap-3 lg:grid-cols-3">
                    <input
                      type="password"
                      value={
                        passwordForm.currentPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setPasswordForm(
                          (
                            current
                          ) => ({
                            ...current,

                            currentPassword:
                              event.target.value,
                          })
                        )
                      }
                      placeholder={t(
                        "profile_current_password"
                      )}
                      autoComplete="current-password"
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />

                    <input
                      type="password"
                      value={
                        passwordForm.newPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setPasswordForm(
                          (
                            current
                          ) => ({
                            ...current,

                            newPassword:
                              event.target.value,
                          })
                        )
                      }
                      placeholder={t(
                        "profile_new_password"
                      )}
                      autoComplete="new-password"
                      minLength={8}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />

                    <input
                      type="password"
                      value={
                        passwordForm.confirmNewPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setPasswordForm(
                          (
                            current
                          ) => ({
                            ...current,

                            confirmNewPassword:
                              event.target.value,
                          })
                        )
                      }
                      placeholder={t(
                        "profile_confirm_password"
                      )}
                      autoComplete="new-password"
                      minLength={8}
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={
                      savingPassword
                    }
                    onClick={() =>
                      void changePassword()
                    }
                    className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingPassword
                      ? t(
                          "profile_saving"
                        )
                      : t(
                          "profile_change_password"
                        )}
                  </button>
                </div>
              )}
            </section>

            {/* QUICK ACCESS */}

            <section>
              <h2 className="mb-3 text-sm font-black text-slate-900">
                {t(
                  "profile_shortcuts"
                )}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {currentUser.platformRole ===
                  "admin" && (
                  <Link
                    to="/users"
                    className="rounded-2xl border border-amber-100 bg-white p-3.5 no-underline shadow-sm transition hover:border-amber-200 hover:bg-amber-50/40"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                      ⚙
                    </div>

                    <h3 className="mt-3 text-sm font-black text-slate-900">
                      {t(
                        "profile_admin_users"
                      )}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {t(
                        "profile_admin_users_desc"
                      )}
                    </p>

                    <span className="mt-2 inline-flex text-xs font-bold text-amber-700">
                      {t(
                        "profile_open"
                      )}{" "}
                      →
                    </span>
                  </Link>
                )}

                <Link
                  to="/foro"
                  className="rounded-2xl border border-emerald-100 bg-white p-3.5 no-underline shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    ◌
                  </div>

                  <h3 className="mt-3 text-sm font-black text-slate-900">
                    {t(
                      "profile_community"
                    )}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {t(
                      "profile_community_desc"
                    )}
                  </p>

                  <span className="mt-2 inline-flex text-xs font-bold text-emerald-700">
                    {t(
                      "profile_open"
                    )}{" "}
                    →
                  </span>
                </Link>

                <Link
                  to="/servicios"
                  className="rounded-2xl border border-sky-100 bg-white p-3.5 no-underline shadow-sm transition hover:border-sky-200 hover:bg-sky-50/40"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                    +
                  </div>

                  <h3 className="mt-3 text-sm font-black text-slate-900">
                    {t(
                      "profile_services"
                    )}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {t(
                      "profile_services_desc"
                    )}
                  </p>

                  <span className="mt-2 inline-flex text-xs font-bold text-sky-700">
                    {t(
                      "profile_open"
                    )}{" "}
                    →
                  </span>
                </Link>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
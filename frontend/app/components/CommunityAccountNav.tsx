import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../auth";

import {
  useI18n,
} from "../i18n";

export default function CommunityAccountNav() {
  const {
    currentUser,
  } = useAuth();

  const {
    t,
  } = useI18n();

  const name =
    currentUser?.displayName ||
    currentUser?.fullName ||
    currentUser?.email ||
    "";

  const initial =
    (
      name ||
      "U"
    )
      .charAt(0)
      .toUpperCase();

  const navItems = [
    {
      to: "/profile",
      label: t(
        "profile_title"
      ),
    },
    {
      to: "/support/my",
      label: t(
        "support_my_title"
      ),
    },
    {
      to: "/foro",
      label: t(
        "nav_forum"
      ),
    },
  ];

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3 px-2 py-1">
        {currentUser?.profileImage ? (
          <img
            src={
              currentUser.profileImage
            }
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-emerald-50"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
            {
              initial
            }
          </div>
        )}

        <div className="min-w-0">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            {t(
              "profile_eyebrow"
            )}
          </p>

          <p className="m-0 mt-0.5 truncate text-sm font-bold text-slate-800">
            {
              name
            }
          </p>
        </div>
      </div>

      <nav className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto">
        {navItems.map(
          (
            item
          ) => (
            <NavLink
              key={
                item.to
              }
              to={
                item.to
              }
              className={({
                isActive,
              }) =>
                `rounded-lg px-3 py-2.5 text-center text-sm font-bold no-underline transition sm:px-4 ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                }`
              }
            >
              {
                item.label
              }
            </NavLink>
          )
        )}
      </nav>
    </div>
  );
}

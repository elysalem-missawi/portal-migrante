import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import { usersService } from "../services/users.service";
import CommunityAccountNav from "../components/CommunityAccountNav";

type Locale = "es" | "ar" | "eu" | "en";

const copy = {
  es: {
    eyebrow: "Mi cuenta",
    title: "Perfil y cuenta",
    intro: "Gestiona tu identidad en Portal Migrante y accede rápidamente a tus espacios.",
    photo: "Foto de perfil",
    changePhoto: "Cambiar foto",
    removePhoto: "Quitar",
    photoHelp: "JPG, PNG o WebP. La imagen se optimiza antes de guardarse.",
    saving: "Guardando...",
    saved: "Foto actualizada.",
    photoError: "No se pudo guardar la imagen.",
    account: "Datos de la cuenta",
    dashboard: "Panel de cuenta",
    community: "Mi comunidad",
    communityDesc: "Consulta tus publicaciones y participa en el foro.",
    services: "Servicios",
    servicesDesc: "Encuentra recursos y orientación según tus necesidades.",
    name: "Nombre",
    email: "Correo electrónico",
    municipality: "Municipio",
    origin: "País de origen",
    language: "Idioma",
    role: "Cuenta",
    goForum: "Abrir comunidad",
    goServices: "Explorar servicios",
    security: "Seguridad y privacidad",
    securityDesc: "Tu correo identifica tu cuenta. No compartas tu contraseña.",
    edit: "Editar perfil",
    save: "Guardar cambios",
    cancel: "Cancelar",
    editIntro: "Actualiza los datos básicos que se muestran en tu perfil.",
    displayName: "Nombre visible",
    fullName: "Nombre completo",
    preferredLanguage: "Idioma preferido",
    originCountry: "País de origen",
    updated: "Perfil actualizado.",
    updateError: "No se pudo actualizar el perfil.",
  },
  ar: {
    eyebrow: "حسابي",
    title: "الملف الشخصي والحساب",
    intro: "تحكم في هويتك داخل Portal Migrante وانتقل بسرعة إلى مساحاتك.",
    photo: "الصورة الشخصية",
    changePhoto: "تغيير الصورة",
    removePhoto: "حذف",
    photoHelp: "JPG أو PNG أو WebP. يتم تحسين الصورة قبل حفظها.",
    saving: "جارٍ الحفظ...",
    saved: "تم تحديث الصورة.",
    photoError: "تعذر حفظ الصورة.",
    account: "بيانات الحساب",
    dashboard: "لوحة الحساب",
    community: "مجتمعي",
    communityDesc: "راجع منشوراتك وشارك في المنتدى.",
    services: "الخدمات",
    servicesDesc: "ابحث عن الموارد والتوجيهات حسب احتياجاتك.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    municipality: "البلدية",
    origin: "بلد الأصل",
    language: "اللغة",
    role: "الحساب",
    goForum: "فتح المجتمع",
    goServices: "استكشاف الخدمات",
    security: "الأمان والخصوصية",
    securityDesc: "بريدك الإلكتروني يعرّف حسابك. لا تشارك كلمة المرور.",
    edit: "تعديل الملف",
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    editIntro: "حدّث المعلومات الأساسية التي تظهر في ملفك.",
    displayName: "الاسم الظاهر",
    fullName: "الاسم الكامل",
    preferredLanguage: "اللغة المفضلة",
    originCountry: "بلد الأصل",
    updated: "تم تحديث الملف.",
    updateError: "تعذر تحديث الملف.",
  },
  eu: {
    eyebrow: "Nire kontua",
    title: "Profila eta kontua",
    intro: "Kudeatu zure identitatea Portal Migranten eta sartu azkar zure espazioetara.",
    photo: "Profileko argazkia",
    changePhoto: "Aldatu argazkia",
    removePhoto: "Kendu",
    photoHelp: "JPG, PNG edo WebP. Irudia gorde aurretik optimizatzen da.",
    saving: "Gordetzen...",
    saved: "Argazkia eguneratu da.",
    photoError: "Ezin izan da irudia gorde.",
    account: "Kontuaren datuak",
    dashboard: "Kontu-panela",
    community: "Nire komunitatea",
    communityDesc: "Ikusi zure argitalpenak eta parte hartu foroan.",
    services: "Zerbitzuak",
    servicesDesc: "Bilatu baliabideak eta orientazioa zure beharren arabera.",
    name: "Izena",
    email: "Posta elektronikoa",
    municipality: "Udalerria",
    origin: "Jatorrizko herrialdea",
    language: "Hizkuntza",
    role: "Kontua",
    goForum: "Ireki komunitatea",
    goServices: "Arakatu zerbitzuak",
    security: "Segurtasuna eta pribatutasuna",
    securityDesc: "Zure posta elektronikoak kontua identifikatzen du. Ez partekatu pasahitza.",
    edit: "Editatu profila",
    save: "Gorde aldaketak",
    cancel: "Utzi",
    editIntro: "Eguneratu zure profilean agertzen diren oinarrizko datuak.",
    displayName: "Bistaratzeko izena",
    fullName: "Izen-abizenak",
    preferredLanguage: "Hobetsitako hizkuntza",
    originCountry: "Jatorrizko herrialdea",
    updated: "Profila eguneratu da.",
    updateError: "Ezin izan da profila eguneratu.",
  },
  en: {
    eyebrow: "My account",
    title: "Profile and account",
    intro: "Manage your identity on Portal Migrante and quickly access your spaces.",
    photo: "Profile photo",
    changePhoto: "Change photo",
    removePhoto: "Remove",
    photoHelp: "JPG, PNG or WebP. The image is optimized before saving.",
    saving: "Saving...",
    saved: "Photo updated.",
    photoError: "The image could not be saved.",
    account: "Account details",
    dashboard: "Account dashboard",
    community: "My community",
    communityDesc: "Review your posts and take part in the forum.",
    services: "Services",
    servicesDesc: "Find resources and guidance around your needs.",
    name: "Name",
    email: "Email",
    municipality: "Municipality",
    origin: "Country of origin",
    language: "Language",
    role: "Account",
    goForum: "Open community",
    goServices: "Explore services",
    security: "Security and privacy",
    securityDesc: "Your email identifies your account. Never share your password.",
    edit: "Edit profile",
    save: "Save changes",
    cancel: "Cancel",
    editIntro: "Update the basic information shown on your profile.",
    displayName: "Display name",
    fullName: "Full name",
    preferredLanguage: "Preferred language",
    originCountry: "Country of origin",
    updated: "Profile updated.",
    updateError: "The profile could not be updated.",
  },
} satisfies Record<Locale, Record<string, string>>;

async function optimizeAvatar(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("unsupported");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const max = 512;
  const scale = Math.min(1, max / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function UserProfilePage() {
  const { currentUser, refreshSession } = useAuth();
  const { locale } = useI18n();
  const c = copy[(locale as Locale) in copy ? (locale as Locale) : "es"];
  const inputRef = useRef<HTMLInputElement>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [form, setForm] = useState({
    displayName: currentUser?.displayName || "",
    fullName: currentUser?.fullName || "",
    originCountry: currentUser?.originCountry || "",
    preferredLanguage: currentUser?.preferredLanguage || locale || "es",
  });

  if (!currentUser) return null;

  const displayName =
    currentUser.displayName || currentUser.fullName || currentUser.email;
  const initial = displayName.charAt(0).toUpperCase();

  const savePhoto = async (profileImage: string) => {
    setSavingPhoto(true);
    setNotice("");
    setError("");
    try {
      await usersService.update(currentUser._id, { profileImage });
      await refreshSession();
      setNotice(c.saved);
    } catch {
      setError(c.photoError);
    } finally {
      setSavingPhoto(false);
    }
  };

  const onPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const optimized = await optimizeAvatar(file);
      await savePhoto(optimized);
    } catch {
      setError(c.photoError);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setNotice("");
    setError("");
    try {
      await usersService.update(currentUser._id, {
        displayName: form.displayName.trim(),
        fullName: form.fullName.trim(),
        originCountry: form.originCountry.trim(),
        preferredLanguage: form.preferredLanguage,
      });
      await refreshSession();
      setEditing(false);
      setNotice(c.updated);
    } catch {
      setError(c.updateError);
    } finally {
      setSavingProfile(false);
    }
  };

  const languageLabel =
    currentUser.preferredLanguage === "ar"
      ? "العربية"
      : currentUser.preferredLanguage === "eu"
        ? "Euskara"
        : currentUser.preferredLanguage === "en"
          ? "English"
          : "Español";

  const accountLabel =
    currentUser.accountType === "organization_account"
      ? locale === "ar"
        ? "حساب مؤسسة"
        : locale === "eu"
          ? "Erakunde-kontua"
          : locale === "en"
            ? "Organization account"
            : "Cuenta de organización"
      : locale === "ar"
        ? "حساب فردي"
        : locale === "eu"
          ? "Banakako kontua"
          : locale === "en"
            ? "Individual account"
            : "Cuenta individual";

  const details = [
    [c.name, displayName],
    [c.email, currentUser.email],
    [c.municipality, currentUser.municipality || "—"],
    [c.origin, currentUser.originCountry || "—"],
    [c.language, languageLabel],
    [c.role, accountLabel],
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CommunityAccountNav />
        <header className="mb-6">
          <p className="m-0 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
            {c.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {c.intro}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt=""
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-emerald-50"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-950 text-4xl font-black text-white ring-4 ring-emerald-50">
                    {initial}
                  </div>
                )}

                <h2 className="mt-4 text-xl font-black text-slate-950">
                  {displayName}
                </h2>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {currentUser.email}
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onPhotoChange}
                />

                <div className="mt-5 grid w-full gap-2">
                  <button
                    type="button"
                    disabled={savingPhoto}
                    onClick={() => inputRef.current?.click()}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {savingPhoto ? c.saving : c.changePhoto}
                  </button>
                  {currentUser.profileImage && (
                    <button
                      type="button"
                      disabled={savingPhoto}
                      onClick={() => void savePhoto("")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {c.removePhoto}
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {c.photoHelp}
                </p>
                {notice && <p className="mt-2 text-sm font-bold text-emerald-700">{notice}</p>}
                {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">{c.security}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">{c.securityDesc}</p>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">{c.account}</h2>
                  {editing && (
                    <p className="mt-1 text-sm text-slate-500">{c.editIntro}</p>
                  )}
                </div>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {c.edit}
                  </button>
                )}
              </div>

              {editing ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">{c.displayName}</span>
                    <input
                      value={form.displayName}
                      onChange={(e) => setForm((v) => ({ ...v, displayName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">{c.fullName}</span>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm((v) => ({ ...v, fullName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">{c.originCountry}</span>
                    <input
                      value={form.originCountry}
                      onChange={(e) => setForm((v) => ({ ...v, originCountry: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">{c.preferredLanguage}</span>
                    <select
                      value={form.preferredLanguage}
                      onChange={(e) => setForm((v) => ({ ...v, preferredLanguage: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    >
                      <option value="es">Español</option>
                      <option value="eu">Euskara</option>
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="button"
                      disabled={savingProfile}
                      onClick={() => void saveProfile()}
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {savingProfile ? c.saving : c.save}
                    </button>
                    <button
                      type="button"
                      disabled={savingProfile}
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          displayName: currentUser.displayName || "",
                          fullName: currentUser.fullName || "",
                          originCountry: currentUser.originCountry || "",
                          preferredLanguage: currentUser.preferredLanguage || locale || "es",
                        });
                      }}
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      {c.cancel}
                    </button>
                  </div>
                </div>
              ) : (
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-bold text-slate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-xl font-black text-slate-950">{c.dashboard}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  to="/foro"
                  className="group rounded-3xl border border-slate-200 bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-700">◌</div>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{c.community}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{c.communityDesc}</p>
                  <span className="mt-4 inline-flex text-sm font-bold text-emerald-700">{c.goForum} →</span>
                </Link>

                <Link
                  to="/servicios"
                  className="group rounded-3xl border border-slate-200 bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-xl text-sky-700">+</div>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{c.services}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{c.servicesDesc}</p>
                  <span className="mt-4 inline-flex text-sm font-bold text-sky-700">{c.goServices} →</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

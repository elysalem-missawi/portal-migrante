import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { officeText } from "../../components/office/OfficeUi";

export default function UnauthorizedPage() {
  const { locale } = useI18n();

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-3xl">!</div>
        <h1 className="text-4xl font-black text-slate-950">
          {officeText(locale, "Acceso no autorizado", "ليست لديك صلاحية الدخول")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {officeText(
            locale,
            "Esta zona pertenece al espacio interno de la asociación. Pide acceso a la persona administradora.",
            "هذه المنطقة خاصة بالفضاء الداخلي للجمعية. اطلب الصلاحية من المسؤول."
          )}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="rounded-xl bg-emerald-700 px-5 py-3 font-black text-white no-underline">
            {officeText(locale, "Volver al portal", "العودة للبوابة")}
          </Link>
          <Link to="/login" className="rounded-xl border border-slate-200 px-5 py-3 font-black text-slate-700 no-underline">
            {officeText(locale, "Iniciar sesión", "تسجيل الدخول")}
          </Link>
        </div>
      </div>
    </main>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useState } from "react";

export default function Home() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const categories = [
    { key: "salud", title: t("cat_health") || "Salud", icon: "", to: "/servicios?c=salud" },
    { key: "vivienda", title: t("cat_housing") || "Vivienda", icon: "", to: "/servicios?c=vivienda" },
    { key: "empleo", title: t("cat_jobs") || "Empleo", icon: "", to: "/servicios?c=empleo" },
    { key: "educacion", title: t("cat_education") || "Educación", icon: "", to: "/servicios?c=educacion" },
    { key: "legal", title: t("cat_legal") || "Legal", icon: "", to: "/servicios?c=legal" },
    { key: "idioma", title: t("cat_language") || "Idioma", icon: "", to: "/servicios?c=idioma" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/servicios?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <main>
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 min-h-screen flex items-center">
          <div className="w-full">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="block">Tu nuevo hogar en</span>
                <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
                  Euskadi te espera
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                Más que información, somos el puente hacia tu nueva vida. 
                <span className="block mt-2 text-green-200">
                  Cada paso importa, cada historia importa, tú importas.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/servicios"
                  className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Comenzar ahora
                </Link>
                
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-3 border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                >
                  Conoce más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              <span className="block">En qué podemos</span>
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ayudarte hoy?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sabemos que cada persona tiene necesidades únicas. Por eso hemos organizado nuestros servicios pensando en lo que realmente importa en tu día a día.
            </p>
          </div>

          <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.key}
                to={c.to}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100 group-hover:border-blue-200/50">
                  
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl text-white" aria-hidden>{c.icon}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Te acompañamos paso a paso con información clara, contactos directos y recursos verificados.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:text-blue-700">
                      Explorar servicios
                    </span>
                    <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      Disponible
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            <span className="block">Listo para dar</span>
            <span className="block text-green-300">el siguiente paso?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            No tienes que hacer este camino solo. Estamos aquí para acompañarte, 
            paso a paso, con toda la información y apoyo que necesitas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Explorar servicios
            </Link>
            
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all"
            >
              Hablar con nosotros
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <span> Gratuito</span>
            </div>
            <div className="flex items-center gap-2">  
              <span> Confidencial</span>
            </div>
            <div className="flex items-center gap-2">
              <span> En tu idioma</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

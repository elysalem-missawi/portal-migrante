import { useState } from "react";
import { useI18n } from "../i18n";
import { Link } from "react-router-dom";

interface Anuncio {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  price?: string;
  contact: string;
  date: string;
  urgent: boolean;
  verified: boolean;
}

export default function Anuncios() {
  const { t } = useI18n();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);

  // Sample announcements data
  const anuncios: Anuncio[] = [
    {
      id: 1,
      title: t("ad_housing_vitoria"),
      description: t("ad_housing_vitoria_desc"),
      category: "housing",
      location: "Vitoria-Gasteiz",
      price: "850€/mes",
      contact: "ana.garcia@email.com",
      date: "2025-09-25",
      urgent: true,
      verified: true
    },
    {
      id: 2,
      title: t("ad_job_bilbao"),
      description: t("ad_job_bilbao_desc"),
      category: "work",
      location: "Bilbao",
      price: t("negotiable"),
      contact: "+34 944 123 456",
      date: "2025-09-24",
      urgent: false,
      verified: true
    },
    {
      id: 3,
      title: t("ad_spanish_classes"),
      description: t("ad_spanish_classes_desc"),
      category: "education",
      location: "San Sebastián",
      price: "20€/hora",
      contact: "profesor.jose@email.com",
      date: "2025-09-23",
      urgent: false,
      verified: false
    },
    {
      id: 4,
      title: t("ad_legal_services"),
      description: t("ad_legal_services_desc"),
      category: "legal",
      location: "Vitoria-Gasteiz",
      price: t("free_consultation"),
      contact: "abogado.martinez@legal.es",
      date: "2025-09-22",
      urgent: true,
      verified: true
    },
    {
      id: 5,
      title: t("ad_medical_interpreter"),
      description: t("ad_medical_interpreter_desc"),
      category: "health",
      location: "Bilbao",
      price: "25€/hora",
      contact: "interprete.sara@health.es",
      date: "2025-09-21",
      urgent: false,
      verified: true
    },
    {
      id: 6,
      title: t("ad_community_event"),
      description: t("ad_community_event_desc"),
      category: "community",
      location: "Donostia",
      price: t("free"),
      contact: "eventos@comunidad.org",
      date: "2025-09-20",
      urgent: false,
      verified: true
    }
  ];

  const categories = [
    { value: "all", label: t("all_categories") },
    { value: "housing", label: t("f_housing") },
    { value: "work", label: t("f_work") },
    { value: "education", label: t("f_education") },
    { value: "health", label: t("f_health") },
    { value: "legal", label: t("f_legal") },
    { value: "community", label: t("community") }
  ];

  const locations = [
    { value: "all", label: t("all_locations") },
    { value: "Vitoria-Gasteiz", label: "Vitoria-Gasteiz" },
    { value: "Bilbao", label: "Bilbao" },
    { value: "San Sebastián", label: "San Sebastián" },
    { value: "Donostia", label: "Donostia" }
  ];

  // Filter announcements
  const filteredAnuncios = anuncios.filter(anuncio => {
    const matchesSearch = anuncio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || anuncio.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || anuncio.location === selectedLocation;
    const matchesUrgent = !showOnlyUrgent || anuncio.urgent;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesUrgent;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "housing":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "work":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z" />
          </svg>
        );
      case "education":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "health":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case "legal":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-background">
      {/* Header */}
      <div className="bg-vitoria-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t("ads_title")}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {t("ads_subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-neutral-surface rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-vitoria-black mb-4">
            {t("filter_ads")}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("search")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("category")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("location")}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              >
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgent filter */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyUrgent}
                  onChange={(e) => setShowOnlyUrgent(e.target.checked)}
                  className="mr-2 h-4 w-4 text-vitoria-green focus:ring-vitoria-green border-gray-300 rounded"
                />
                <span className="text-sm text-vitoria-black">
                  {t("urgent_only")}
                </span>
              </label>
            </div>
          </div>

          {/* Add Ad Button */}
          <div className="flex justify-end">
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("add_ad")}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-vitoria-gray">
            {t("showing_results")} {filteredAnuncios.length} {t("of")} {anuncios.length} {t("ads")}
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredAnuncios.map(anuncio => (
            <div key={anuncio.id} className="bg-neutral-surface rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-vitoria-green">
                    {getCategoryIcon(anuncio.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-vitoria-black">
                      {anuncio.title}
                    </h3>
                    <p className="text-sm text-vitoria-gray">
                      {t(anuncio.category as any)} • {anuncio.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {anuncio.urgent && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t("urgent")}
                    </span>
                  )}
                  {anuncio.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t("verified")}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-vitoria-gray mb-4">
                {anuncio.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-vitoria-gray">{t("price")}:</span>
                  <span className="font-medium text-vitoria-black ml-2">
                    {anuncio.price}
                  </span>
                </div>
                <div>
                  <span className="text-vitoria-gray">{t("date")}:</span>
                  <span className="font-medium text-vitoria-black ml-2">
                    {new Date(anuncio.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-vitoria-gray">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{anuncio.contact}</span>
                </div>
                
                <button className="btn bg-vitoria-green/10 text-vitoria-green hover:bg-vitoria-green hover:text-white transition-colors">
                  {t("contact")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredAnuncios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-vitoria-gray mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-vitoria-black mb-2">
              {t("no_ads_found")}
            </h3>
            <p className="text-vitoria-gray mb-6">
              {t("try_different_filters")}
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setShowOnlyUrgent(false);
              }}
              className="btn-primary"
            >
              {t("clear_filters")}
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-vitoria-gradient text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("share_your_ad")}
            </h2>
            <p className="text-lg mb-6">
              {t("help_community_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-white text-vitoria-green hover:bg-gray-100">
                {t("publish_ad")}
              </button>
              <Link
                to="/contacto"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-vitoria-green transition-colors"
              >
                {t("need_help")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
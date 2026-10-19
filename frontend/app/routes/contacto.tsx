import { useState } from "react";
import { useI18n } from "../i18n";

export default function Contacto() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكن إضافة منطق إرسال البيانات
    console.log("Contact form data:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-neutral-surface rounded-lg shadow-lg p-8 text-center">
            <div className="text-vitoria-green text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-vitoria-black mb-4">
              {t("contact_success_title")}
            </h2>
            <p className="text-vitoria-gray mb-6">
              {t("contact_success_message")}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary"
            >
              {t("send_another_message")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vitoria-black mb-4">
            {t("contact_title")}
          </h1>
          <p className="text-lg text-vitoria-gray max-w-2xl mx-auto">
            {t("contact_subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* معلومات الاتصال */}
          <div className="space-y-8">
            <div className="bg-neutral-surface rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-vitoria-black mb-6">
                {t("contact_info")}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-vitoria-green text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitoria-black">{t("address")}</h3>
                    <p className="text-vitoria-gray">
                      Portal Migrante Euskadi<br />
                      C/ Mayor, 1<br />
                      01001 Vitoria-Gasteiz, Álava<br />
                      País Vasco, España
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vitoria-green text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitoria-black">{t("phone")}</h3>
                    <p className="text-vitoria-gray">+34 945 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vitoria-green text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitoria-black">{t("email")}</h3>
                    <p className="text-vitoria-gray">info@portalmigrante.eus</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vitoria-green text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vitoria-black">{t("office_hours")}</h3>
                    <p className="text-vitoria-gray">
                      {t("monday_friday")}: 09:00 - 17:00<br />
                      {t("weekend")}: {t("closed")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* خريطة */}
            <div className="bg-neutral-surface rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-vitoria-black mb-4">
                {t("find_us")}
              </h3>
              <div className="bg-vitoria-gray/10 rounded-lg h-64 flex items-center justify-center">
                <p className="text-vitoria-gray">{t("map_placeholder")}</p>
              </div>
            </div>
          </div>

          {/* نموذج الاتصال */}
          <div className="bg-neutral-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-vitoria-black mb-6">
              {t("send_message")}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-vitoria-black mb-2">
                    {t("full_name")} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
                    placeholder={t("enter_name")}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-vitoria-black mb-2">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
                    placeholder={t("enter_email")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-vitoria-black mb-2">
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
                  placeholder={t("enter_phone")}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-vitoria-black mb-2">
                  {t("subject")} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
                >
                  <option value="">{t("select_subject")}</option>
                  <option value="services">{t("services_inquiry")}</option>
                  <option value="support">{t("technical_support")}</option>
                  <option value="general">{t("general_inquiry")}</option>
                  <option value="feedback">{t("feedback")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-vitoria-black mb-2">
                  {t("message")} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent resize-none"
                  placeholder={t("enter_message")}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4"
              >
                {t("send_message_btn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
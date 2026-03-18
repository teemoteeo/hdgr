/* lang.js — Language switcher EN/ES/PL/ZH
 * - Legge lingua da localStorage('hdgr-lang'), default 'en'
 * - Applica traduzione a tutti gli elementi [data-i18n="key"]
 * - Salva al click
 */
const TRANSLATIONS = {
  en: {
    'nav.about': 'About Us',
    'nav.investment': 'Investment Opportunities',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'hero.subtitle': 'Design & Development',
    'section.projects': 'Award-Winning Projects',
    'section.about': 'About Us',
    'section.visualizations': 'Visualizations',
    'section.interior': 'Interior Design',
    'section.portfolio': 'Property Portfolio',
    'section.investment': 'Investment Opportunities',
    'footer.touch': 'Get in touch',
    'footer.follow': 'Follow us',
    'footer.contact-btn': 'Contact Our Team',
    'statement.main': 'Design That Lasts, Development That Matters',
    'btn.all-projects': 'All projects →',
    'btn.go-back': '← Go back',
    'btn.explore': 'Explore',
    'btn.buyer-journey': 'Check Buyer Journey',
    'form.firstname': 'First name',
    'form.lastname': 'Last name',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.send': 'Send Inquiry',
    'role.designer': 'Designer',
    'role.business': 'Business Development',
    'role.finance': 'Finance',
  },
  es: {
    'nav.about': 'Sobre Nosotros',
    'nav.investment': 'Oportunidades de Inversión',
    'nav.news': 'Noticias',
    'nav.contact': 'Contacto',
    'hero.subtitle': 'Diseño y Desarrollo',
    'section.projects': 'Proyectos Premiados',
    'section.about': 'Sobre Nosotros',
    'section.visualizations': 'Visualizaciones',
    'section.interior': 'Diseño de Interiores',
    'section.portfolio': 'Cartera de Propiedades',
    'section.investment': 'Oportunidades de Inversión',
    'footer.touch': 'Contacto',
    'footer.follow': 'Síguenos',
    'footer.contact-btn': 'Contactar al Equipo',
    'statement.main': 'Diseño que perdura, desarrollo que importa',
    'btn.all-projects': 'Todos los proyectos →',
    'btn.go-back': '← Volver',
    'btn.explore': 'Explorar',
    'btn.buyer-journey': 'Ver Guía del Comprador',
    'form.firstname': 'Nombre',
    'form.lastname': 'Apellido',
    'form.email': 'Correo electrónico',
    'form.message': 'Mensaje',
    'form.send': 'Enviar Consulta',
    'role.designer': 'Diseñador/a',
    'role.business': 'Desarrollo de Negocio',
    'role.finance': 'Finanzas',
  },
  pl: {
    'nav.about': 'O Nas',
    'nav.investment': 'Możliwości Inwestycyjne',
    'nav.news': 'Aktualności',
    'nav.contact': 'Kontakt',
    'hero.subtitle': 'Projekt i Rozwój',
    'section.projects': 'Nagradzane Projekty',
    'section.about': 'O Nas',
    'section.visualizations': 'Wizualizacje',
    'section.interior': 'Projektowanie Wnętrz',
    'section.portfolio': 'Portfolio Nieruchomości',
    'section.investment': 'Możliwości Inwestycyjne',
    'footer.touch': 'Skontaktuj się',
    'footer.follow': 'Obserwuj nas',
    'footer.contact-btn': 'Skontaktuj się z Zespołem',
    'statement.main': 'Projekt na lata, rozwój który ma znaczenie',
    'btn.all-projects': 'Wszystkie projekty →',
    'btn.go-back': '← Wróć',
    'btn.explore': 'Odkryj',
    'btn.buyer-journey': 'Przewodnik Kupującego',
    'form.firstname': 'Imię',
    'form.lastname': 'Nazwisko',
    'form.email': 'E-mail',
    'form.message': 'Wiadomość',
    'form.send': 'Wyślij Zapytanie',
    'role.designer': 'Projektant/ka',
    'role.business': 'Rozwój Biznesu',
    'role.finance': 'Finanse',
  },
  zh: {
    'nav.about': '关于我们',
    'nav.investment': '投资机会',
    'nav.news': '新闻',
    'nav.contact': '联系',
    'hero.subtitle': '设计与开发',
    'section.projects': '获奖项目',
    'section.about': '关于我们',
    'section.visualizations': '可视化',
    'section.interior': '室内设计',
    'section.portfolio': '房产组合',
    'section.investment': '投资机会',
    'footer.touch': '联系我们',
    'footer.follow': '关注我们',
    'footer.contact-btn': '联系团队',
    'statement.main': '经久设计，有意开发',
    'btn.all-projects': '所有项目 →',
    'btn.go-back': '← 返回',
    'btn.explore': '探索',
    'btn.buyer-journey': '买家指南',
    'form.firstname': '名字',
    'form.lastname': '姓氏',
    'form.email': '电子邮件',
    'form.message': '留言',
    'form.send': '发送咨询',
    'role.designer': '设计师',
    'role.business': '业务发展',
    'role.finance': '财务',
  }
};

(function() {
  function getLang() {
    return localStorage.getItem('hdgr-lang') || 'en';
  }

  function applyLang(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
    const btn = document.querySelector('.lang-current');
    if (btn) btn.textContent = lang.toUpperCase();
  }

  function init() {
    const lang = getLang();
    applyLang(lang);

    const switcher = document.querySelector('.lang-switcher');
    if (!switcher) return;

    const current = switcher.querySelector('.lang-current');
    const dropdown = switcher.querySelector('.lang-dropdown');

    current.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('is-open');
    });

    switcher.querySelectorAll('[data-lang-option]').forEach(item => {
      item.addEventListener('click', () => {
        const selected = item.getAttribute('data-lang-option');
        localStorage.setItem('hdgr-lang', selected);
        applyLang(selected);
        dropdown.classList.remove('is-open');
      });
    });

    document.addEventListener('click', () => dropdown.classList.remove('is-open'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();

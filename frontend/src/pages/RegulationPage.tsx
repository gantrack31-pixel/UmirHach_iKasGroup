import { useEffect } from "react";
import { Icon } from "../shared/components/Icon";
import { regulationAnchor, regulationNotice, regulationSections, regulationTitle } from "../features/regulation/data/regulation";

export function RegulationPage() {
  useEffect(() => {
    const anchor = decodeURIComponent(window.location.hash.slice(1));
    if (!anchor) return;

    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <main className="regulation-page">
      <a className="regulation-back" href="/" aria-label="Вернуться к проверке">
        <Icon name="arrow-left" size={22} />
        К проверке
      </a>
      <header className="regulation-header">
        <span className="help-eyebrow">Учебный документ</span>
        <h1>{regulationTitle}</h1>
        <p className="regulation-notice">{regulationNotice}</p>
      </header>
      <nav className="regulation-index" aria-label="Разделы Положения">
        {regulationSections.map((section) => (
          <a key={section.number} href={`#section-${section.number}`}>{section.number}. {section.title}</a>
        ))}
      </nav>
      {regulationSections.map((section) => (
        <section className="regulation-section" id={`section-${section.number}`} key={section.number}>
          <h2>{section.number}. {section.title}</h2>
          {section.rules.map((rule) => (
            <p className="regulation-rule" id={regulationAnchor(rule.number)} key={rule.number}>
              <strong>{rule.number}.</strong> {rule.text}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}

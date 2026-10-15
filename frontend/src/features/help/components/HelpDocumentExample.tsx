export function HelpDocumentExample() {
  return (
    <section className="help-document" aria-labelledby="help-document-title">
      <div>
        <span className="help-section-number">Тестовый пример</span>
        <h2 id="help-document-title">Справка об обучении</h2>
        <p>Для теста используйте приложенный синтетический документ. В нём есть ФИО, вуз, период обучения, номер справки, дата выдачи, подпись и печать.</p>
      </div>
      <div className="help-document-preview" aria-label="Краткое содержание тестовой справки">
        <strong>СПРАВКА ОБ ОБУЧЕНИИ</strong>
        <span>Александров Артём Игоревич</span>
        <span>Учебный университет «Меридиан»</span>
        <span>01.09.2023 — 31.08.2026</span>
        <span>ОБ-1001 · 01.09.2026</span>
      </div>
    </section>
  );
}

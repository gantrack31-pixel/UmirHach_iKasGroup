import { tips } from "../data/helpContent";

export function HelpTips() {
  return (
    <section className="help-tips" aria-labelledby="help-tips-title">
      <div>
        <span className="help-section-number">Перед загрузкой</span>
        <h2 id="help-tips-title">Что улучшает OCR</h2>
      </div>
      <ul>
        {tips.map((tip) => <li key={tip}>{tip}</li>)}
      </ul>
    </section>
  );
}

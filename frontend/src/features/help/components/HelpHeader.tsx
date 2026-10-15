import { Icon } from "../../../shared/components/Icon";
import { steps } from "../data/helpContent";

export function HelpHeader() {
  return (
    <header className="help-hero">
      <a className="help-back-button" href="/" aria-label="Вернуться к проверке">
        <Icon name="arrow-left" size={26} />
      </a>
      <div className="help-hero-copy">
        <span className="help-eyebrow">Справочник StudDoc</span>
        <h1>Как проверить справку об обучении</h1>
        <p>Короткая последовательность действий с примерами экранов, чтобы пройти проверку от загрузки файла до результата.</p>
      </div>
      <ol className="help-hero-steps" aria-label="Краткие шаги проверки">
        {steps.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            {step.title}
          </li>
        ))}
      </ol>
    </header>
  );
}

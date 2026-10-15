import { steps } from "../data/helpContent";

export function HelpSteps() {
  return (
    <section className="help-steps" aria-label="Последовательность проверки">
      {steps.map((step) => (
        <article className="help-step" key={step.number}>
          <div className="help-step-copy">
            <span>{step.number}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </div>
          <figure className="help-step-shot">
            <img src={step.image} alt={step.alt} width={step.width} height={step.height} loading="lazy" />
          </figure>
        </article>
      ))}
    </section>
  );
}

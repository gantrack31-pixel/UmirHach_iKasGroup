import { Icon } from "./Icon";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="page-title">
      <img className="hero-art" src="/assets/pictures/image%201.png" alt="" />
      <div className="hero-help">
        <a
          className="hero-help-button"
          href="/help"
          aria-label="Открыть справочник"
        >
          <Icon name="help" size={32} />
        </a>
      </div>
      <a className="hero-brand" href="#top" aria-label="Онлайн-деканат — на главную">
        <img src="/assets/pictures/logo.svg" alt="" />
        <span>StudDoc</span>
      </a>
      <div className="hero-copy">
        <h1 id="page-title">Проверка <span>документов</span> <br className="desktop-break" /> и ответы на вопросы</h1>
        <p>Загрузите документ, задайте вопрос и получите ответ<br className="desktop-break" /> с опорой на правила университета</p>
      </div>
    </section>
  );
}

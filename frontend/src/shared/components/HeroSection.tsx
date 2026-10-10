export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="page-title">
      <img className="hero-art" src="/assets/pictures/image.png" alt="" />
      <a className="hero-brand" href="#top" aria-label="Онлайн-деканат — на главную">
        <img src="/assets/pictures/Знак%20%E2%80%94%20шапочка,%20диплом%20и%20печать.svg" alt="" />
        <span>Онлайн Деканат</span>
      </a>
      <div className="hero-copy">
        <h1 id="page-title">Проверка <span>документов</span><br className="desktop-break" /> и ответы на вопросы</h1>
        <p>Загрузите документ, задайте вопрос и получите ответ<br className="desktop-break" /> с опорой на правила университета</p>
      </div>
    </section>
  );
}
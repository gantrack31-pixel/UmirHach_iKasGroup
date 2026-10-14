import { Icon } from "../shared/components/Icon";

const steps = [
  {
    number: "01",
    title: "Выберите тип документа",
    text: "Для приложенной справки выберите тип «Справка об обучении». От этого зависит, какие поля backend будет искать в OCR-тексте.",
    image: "/assets/help/help-step-upload-empty.png",
    alt: "Скриншот выбранного типа документа и пустой зоны загрузки",
  },
  {
    number: "02",
    title: "Загрузите файл",
    text: "Подойдут JPG, PNG или одностраничный PDF до 10 МБ. Чем ровнее и чётче документ, тем стабильнее OCR читает даты и номера.",
    image: "/assets/help/help-step-upload-selected.png",
    alt: "Скриншот загруженной справки об обучении",
  },
  {
    number: "03",
    title: "Задайте вопрос",
    text: "Вопрос помогает сохранить смысл проверки для пользователя. OCR всё равно распознаёт документ локально и возвращает найденные поля.",
    image: "/assets/help/help-step-question.png",
    alt: "Скриншот поля вопроса студента",
  },
  {
    number: "04",
    title: "Проверьте результат",
    text: "После обработки появятся найденные сведения, общий статус и исходный OCR-текст. Поля «не найдено» стоит перепроверить по оригиналу.",
    image: "/assets/help/help-step-result.png",
    alt: "Скриншот результата проверки документа",
  },
];

const tips = [
  "Держите документ ровно, без сильной перспективы и бликов.",
  "Не обрезайте строки с датами, подписью и печатью.",
  "Если дата не распозналась, попробуйте изображение крупнее или PDF.",
];

export function HelpPage() {
  return (
    <main className="help-page">
      <header className="help-hero">
        <a className="help-back-button" href="/" aria-label="Вернуться к проверке">
          <Icon name="arrow-left" size={26} />
        </a>
        <div className="help-hero-copy">
          <span className="help-eyebrow">Справочник StudDoc</span>
          <h1>Как проверить справку об обучении</h1>
          <p>Короткая последовательность действий с примерами экранов, чтобы пройти проверку от загрузки файла до результата.</p>
        </div>
      </header>

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

      <section className="help-steps" aria-label="Последовательность проверки">
        {steps.map((step) => (
          <article className="help-step" key={step.number}>
            <div className="help-step-copy">
              <span>{step.number}</span>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
            <figure className="help-step-shot">
              <img src={step.image} alt={step.alt} />
            </figure>
          </article>
        ))}
      </section>

      <section className="help-tips" aria-labelledby="help-tips-title">
        <div>
          <span className="help-section-number">Перед загрузкой</span>
          <h2 id="help-tips-title">Что улучшает OCR</h2>
        </div>
        <ul>
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

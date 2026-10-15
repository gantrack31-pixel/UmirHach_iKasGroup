# Проверка документов

Фича объединяет загрузку файла, вопрос студента, карточку полей,
предварительную проверку комплектности и блок источников. Страница
`pages/DocumentCheckerPage.tsx` размещает её рядом с hero и footer;
внутренний сценарий собирает `components/DocumentCheckWorkflow.tsx`.

## Поток данных

1. `DocumentUploadPanel` и `QuestionForm` передают действия в `useDocumentCheck`.
2. `model/validateDocument.ts` проверяет файл, тип документа и вопрос.
3. `DocumentCheckService.analyze` получает оригинальный браузерный `File`,
   выбранный тип, вопрос и callback прогресса.
4. `ApiDocumentCheckService` вызывает HTTP-клиент, проверяет JSON и получает
   готовый `DocumentCheckResult` из mapper.
5. Reducer сохраняет результат; панели отображают его без обращения к API.

## Ответственность модулей

| Модуль | Ответственность |
| --- | --- |
| `components/DocumentCheckWorkflow.tsx` | Связь состояния, каталога и всех панелей |
| `components/upload/` | Выбор типа, drag-and-drop, file input и карточка файла |
| `components/fields/` | Строка извлечённого поля и её отметка |
| `components/result/` | Статусы комплектности, ответ и раскрываемые источники |
| `hooks/useDocumentCheck.ts` | Выполнение проверки и отправка действий reducer |
| `hooks/useDocumentTypes.ts` | Загрузка каталога типов |
| `model/documentCheckReducer.ts` | Переходы состояния формы и запроса |
| `model/validateDocument.ts` | Локальные лимиты и проверки формы |
| `model/documentPresentation.ts` | Подписи полей, значения, источники и сводка комплектности |
| `model/buildDocumentAnswer.ts` | Шаблонный ответ по классификации backend |
| `services/ApiDocumentCheckService.ts` | Последовательность HTTP, parse и mapping |
| `services/api/analyzeDocument.ts` | Multipart-запрос и проверка HTTP-статуса |
| `services/api/readApiError.ts` | Сообщения FastAPI и fallback для ошибок прокси |
| `services/api/parseAnalyzeResponse.ts` | Runtime-проверка неизвестного JSON |
| `services/api/mapAnalyzeResponse.ts` | Преобразование DTO в модель UI |
| `services/documentCheckService.ts` | Выбор реального или демо-сервиса |
| `types/api.ts` | Контракт ответа backend |
| `types/documentCheck.ts` | Поля, результат, вход и состояние интерфейса |
| `types/service.ts` | Интерфейсы сервиса проверки и каталога |
| `data/` | Статические подписи, типы, статусы и демо-сценарии |

Модули `shared/` не зависят от этой фичи. Страница использует публичный
`index.ts`; внутренние компоненты импортируют конкретные модули.
Новые компоненты сохраняют существующие CSS-классы и не добавляют обёртки
в DOM ради декомпозиции.

## API и представление

Запрос: `POST /analyze`, поля multipart `photos`, `prompt`, `document_type`.
Ограничения: один JPEG/PNG/одностраничный PDF до 10 МиБ, непустой вопрос
до 2000 символов. Структура ответа:

```ts
type OcrAnalyzeResponse = {
  document_type: DocumentType;
  ocr_text?: string;
  fields: Record<string, string | boolean>;
  validation: {
    status: "document_ok" | "missing_fields";
    missing_fields: string[];
    sources: string[];
  };
  classification:
    | { intent: "field"; field: string }
    | { intent: "validation" | "decision" | "unsupported"; field: null };
};
```

Комплектность и возможность ответить на вопрос независимы:

- Статус панели определяется `validation.status` от backend.
- Намерение `field` показывает значение одного поля или сообщает, что его нет.
- Boolean `false` означает известное отсутствие подписи/печати. Это ответ
  на вопрос о наличии, хотя комплектность документа может быть неполной.
- `validation` перечисляет пропуски и использует источники из backend.
- `decision` показывает шаблонный ответ о сотруднике деканата с `rule:1.3`.
- `unsupported` показывает отсутствие ответа без вымышленных источников.

`answerSources` сохраняет машинные ссылки `field:<key>` и `rule:<number>`.
Mapper формирует читаемые подписи для блока источников; OCR-текст остаётся
отдельным `sourceExcerpt`. Отсутствие `ocr_text` не приводит к падению.

Это форматирование результата, а не генерация ответа нейросетью.
Backend пока не возвращает готовые `answer`/`answerable`/`value`;
фронт не перечитывает и не интерпретирует произвольный текст Положения.

## Тестирование

Из папки `frontend`:

```bash
npm test
npm run build
```

`tests/api-document-check.test.mjs` проверяет публичный API-адаптер:
все четыре намерения, пропущенные значения, boolean-флаги, источники,
некорректный JSON, ошибки API и состав multipart-запроса.
`tests/document-check-state.test.mjs` фиксирует лимиты формы и переходы
состояния при выборе файла, изменении вопроса, успехе и ошибке запроса.

Тесты выполняются встроенным раннером Node. Импорты исполняемых TypeScript-модулей
в тестируемом графе имеют расширение `.ts`, чтобы Node мог разрешить их без
Vite; это разрешено текущим `tsconfig.json`. Дополнительный тестовый framework
или сборка тестов не нужны. Настоящие OCR и веса модели здесь не используются.

## Дальнейшее развитие

Когда backend начнёт возвращать готовый ответ, точками изменения будут
`types/api.ts`, проверка контракта и mapper. JSX-компоненты должны продолжать
получать `DocumentCheckResult`. Добавление новых полей затрагивает их подписи
в `data/fieldLabels.ts`, а не HTTP-клиент или компоненты.

Настройки окружения и запуск описаны в [README фронтенда](../../../README.md).

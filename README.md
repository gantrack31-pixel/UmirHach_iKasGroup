# StudDoc: онлайн-деканат

Студент загружает JPEG, PNG или одностраничный PDF, выбирает один из трёх типов
документов и получает распознанные поля, предварительную комплектность и список
действий по замечаниям. Вопрос можно оставить пустым: frontend отправит
«Содержит ли документ все обязательные сведения?». Окончательное решение
о принятии документа остаётся за сотрудником деканата.

Все документы и правила в `data/` вымышлены. OCR и классификация выполняются
локально; внешние OCR/LLM API не используются.

## Первый запуск: Docker

Установите Git и Docker Desktop либо Docker Engine с Compose. Запустите Docker
и убедитесь, что команда `docker info` выполняется без ошибки. Для первой
сборки нужен интернет и несколько гигабайт свободного места.

Если репозиторий ещё не скачан:

```bash
git clone https://github.com/gantrack31-pixel/UmirHach_iKasGroup.git
cd UmirHach_iKasGroup
```

Если он уже скачан, откройте терминал в **корне проекта — папке с
`docker-compose.yml`**. В рабочем пространстве команды эта папка называется
`Code`; при клонировании её имя может быть другим. Backend уже входит в
репозиторий: отдельный clone или `git submodule update` не нужен.

```bash
docker compose up -d --build --wait
```

Откройте [сайт](http://localhost:5173). Backend доступен на
[порту 8000](http://localhost:8000/docs). Проверка готовности:

```bash
docker compose ps
curl http://localhost:5173/ocr-api/health
```

Оба контейнера должны иметь статус `healthy`, ответ API — `{"status":"ok"}`.
В Windows PowerShell используйте `curl.exe` вместо `curl`.

Если порты заняты, создайте в корне файл `.env` с таким содержимым и повторите
команду запуска. Существующий `.env` отредактируйте, не перезаписывая другие
настройки:

```dotenv
FRONTEND_PORT=5176
BACKEND_PORT=8001
QUESTION_MODEL_THREADS=4
```

Тогда сайт будет на http://localhost:5176, Swagger — http://localhost:8001/docs.
Проверку health тоже выполняйте через выбранный порт сайта. Для Docker не
требуются Node.js, Python и Tesseract на хосте.

### Что проверить после запуска

1. Выберите «Справка об обучении» и загрузите `data/documents/open-002.pdf`.
2. Оставьте вопрос пустым и нажмите «Проверить комплектность».
3. Должны появиться распознанные поля, пропуск даты выдачи и рекомендация
   со ссылкой на пункт 3.1. Начало обучения в этом примере — `2022-09-01`.
4. Раскройте рекомендацию. Для просмотра OCR откройте блок источников.

Главная страница — `/`, справка — `/help`, учебное Положение — `/rules`.
Сам запуск контейнера не проверяет качество OCR: для этого нужен документ.

### Вопросы, для которых нужна Qwen

OCR, комплектность и вопросы, которые распознаются правилами, работают сразу.
Для нейросетевого маршрута один раз подготовьте веса:

```bash
docker compose run --rm model-setup
```

Команда скачивает Qwen3-1.7B и проверяет её запуск. Весам в FP32 нужно около
7 ГБ RAM, приложению и вычислениям — дополнительная память. В Docker Desktop
память должна быть выделена виртуальной машине, а не только доступна на хосте.
Без весов такой вопрос вернёт `503`; во время HTTP-запроса модели не скачиваются.
Прогрев отдельного контейнера не прогревает процесс API.

Остановка: `docker compose down`. Повторный запуск после изменения кода:
`docker compose up -d --build --wait`. Именованный volume с Qwen сохраняется
при обычной остановке. Полные инструкции: [DOCKER.md](DOCKER.md).

## Локальная разработка без Docker

Для frontend нужен Node.js 24 с npm. Backend требует Python 3.12 или новее,
нативную библиотеку Tesseract и русскую OCR-модель. Рабочие конфигурации:
macOS с Python 3.14 и Docker Linux ARM64 с Python 3.13. CI backend проверяет
Python 3.12 и 3.13. Чистая нативная установка на всех ОС не проверена.

1. В первом терминале выполните установку и запуск из
   [README backend](backend/online-dekanat-backend/README.md).
   Запускайте Uvicorn **из `backend/online-dekanat-backend`**, где лежит `main.py`.
2. Во втором терминале, из корня проекта:

```bash
cd frontend
npm ci
npm run dev
```

Откройте адрес из вывода Vite. По умолчанию это http://localhost:5173;
при занятом порте Vite может выбрать другой. Локальный dev-прокси ожидает
backend на `127.0.0.1:8000`. Перед запуском на тех же портах остановите Docker
командой `docker compose down` либо выберите разные порты.

`frontend/.env.local` нужен только при изменении настроек Vite. По умолчанию
работает реальный API через `/ocr-api`. Только `VITE_USE_DEMO_SERVICE=true`
включает статические примеры: загруженный файл в этом режиме не распознаётся.
Корневой `.env` настраивает Compose и не управляет локальным Vite.

## Проверки и экспорт

Frontend, команды из `frontend/`:

```bash
npm test
npm run build
```

Backend, из `backend/online-dekanat-backend/` с активным `.venv`:

```bash
python -m pip install -r requirements-test.txt
python -m pytest
python -m ruff check .
python -m ruff format --check .
```

В проекте 31 тест frontend и 82 теста backend. Unit-тесты подставляют ответы API
или OCR и не измеряют качество распознавания реальных документов. Полный экспорт
`results.json` выполняется через CLI, а не кнопкой сайта:
[в Docker](DOCKER.md#экспорт-и-оценка-resultsjson),
[локально](backend/online-dekanat-backend/README.md#экспорт-для-проверки-кейса).
Эталон `reference_results.json` используется для оценки, не вместо OCR.

## Где искать инструкции и код

| Путь | Назначение |
| --- | --- |
| [DOCKER.md](DOCKER.md) | Docker, модели, порты, диагностика и экспорт |
| [frontend/README.md](frontend/README.md) | Запуск frontend, настройки и устройство интерфейса |
| [README фичи](frontend/src/features/document-check/README.md) | API-поток, ручные правки и список действий |
| [README backend](backend/online-dekanat-backend/README.md) | Нативная установка, API и локальные модели |
| [Поток backend](backend/online-dekanat-backend/docs/pipeline.md) | OCR, поля, валидация и ответы |
| [data/README.md](data/README.md) | Учебное задание и формат автопроверки |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Ветки, тесты и совместная работа |

Общая документация команды лежит в `docs/obsidian-vault/`; эту папку можно
открыть как Obsidian vault. Изменения передаются через Git. Модели, окружения,
пользовательские документы и секреты в коммиты не включаются.

## Частые проблемы

| Симптом | Что проверить |
| --- | --- |
| `Cannot connect to the Docker daemon` | Запущен ли Docker Desktop; выполните `docker info` |
| `port is already allocated` | Поменяйте порты в корневом `.env` или остановите прежний сервер |
| Сайт открывается, API не отвечает | `docker compose ps`, затем `docker compose logs --tail=100 backend frontend` |
| API возвращает `503` | Посмотрите текст ошибки: это может быть OCR или отсутствие весов Qwen; проверьте `model-setup` и логи |
| `prompt: Field required` | Обновите frontend: он должен всегда передавать вопрос, включая стандартный при пустом вводе |
| Правки не видны в Docker | Пересоберите: `docker compose up -d --build --wait`, затем обновите страницу |

Подробная диагностика — в [DOCKER.md](DOCKER.md#если-запуск-не-удался).

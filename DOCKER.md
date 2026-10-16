# StudDoc в Docker

Команды выполняются из корня проекта — папки с `docker-compose.yml` (в рабочем
пространстве она называется `Code`). В Windows Docker Desktop должен работать
в режиме Linux containers; используйте `curl.exe` вместо `curl`. Нужен запущенный Docker Desktop либо
Docker Engine с Docker Compose. Node.js, Python и Tesseract на хосте для этого
способа запуска не требуются. Первая сборка скачивает образы и зависимости,
поэтому требует интернета и нескольких гигабайт свободного места.

## Сборка и запуск

```bash
docker compose up -d --build --wait
```

- Сайт: http://localhost:5173.
- Backend API: http://localhost:8000, Swagger: http://localhost:8000/docs.
- Состояние: `docker compose ps`.
- Логи: `docker compose logs -f backend frontend`.
- Остановка: `docker compose down`.

Если порты заняты локальными Vite или Uvicorn, используйте другие:

```bash
FRONTEND_PORT=5176 BACKEND_PORT=8001 docker compose up -d --build --wait
```

Тогда сайт доступен на http://localhost:5176, а API — на http://localhost:8001.
Порты открываются только на локальном интерфейсе компьютера.
Пример с `FRONTEND_PORT=...` перед командой предназначен для Bash/Zsh.
В PowerShell и для постоянной настройки создайте корневой `.env` с нужными
портами и затем выполните обычный `docker compose up -d --build --wait`.
Не перезаписывайте существующий `.env` целиком. Пример настроек:

```dotenv
FRONTEND_PORT=5173
BACKEND_PORT=8000
QUESTION_MODEL_THREADS=4
```

Для команд сборки, остановки и чтения логов менять порты повторно не требуется.
Для следующего `up` или пересоздания контейнеров используйте те же значения.

## Что входит в образы

| Сервис | Содержимое |
| --- | --- |
| `frontend` | Сборка React через Node.js 24, затем статические файлы и изображения в Nginx |
| `backend` | Python 3.13, CPU PyTorch, зависимости, Tesseract и русская OCR-модель |
| `model-setup` | Одноразовая подготовка Qwen в общем volume; автоматически не запускается |

Frontend обращается к `/ocr-api/analyze`. Nginx передаёт запрос в
`http://backend:8000/analyze` внутри Docker-сети. Маршруты `/help` и `/rules`
поддерживают прямое открытие и обновление страницы. Размер multipart-запроса
на Nginx ограничен 12 МиБ; лимит backend на сам файл остаётся 10 МиБ.
Ожидание ответа прокси — 180 секунд.

Backend запускается от пользователя без root-прав. Исходные загрузки не
сохраняются постоянно. `.venv`, локальные модели, `.git`, конфигурация `.env`
и кеши исключены из контекста сборки. Русская OCR-модель скачивается из
`tessdata_fast` версии 4.1.0 при сборке и проверяется по SHA-256.

## Подготовка Qwen

OCR и вопросы, распознаваемые правилами, работают сразу после сборки. Для
вопросов, которым нужен нейросетевой классификатор, один раз выполните:

```bash
docker compose run --rm model-setup
```

Команда скачивает Qwen3-1.7B и проверяет её запуск. Модель хранится в именованном
volume `question-model-cache`, общем для backend и подготовки. Обычная команда
`docker compose down` сохраняет этот volume. При удалении volume модель придётся
скачивать заново. Локальная папка `backend/.../models/llm` сюда не копируется.

Загрузчик использует CPU и FP32: только веса требуют около 7 ГБ RAM, дополнительно
нужна память для вычислений. Выделите Docker Desktop достаточно оперативной
памяти. Прогрев в одноразовом контейнере не прогревает процесс API: первый
нейросетевой вопрос на сервере может обрабатываться дольше.

Без подготовленных весов вопрос, требующий Qwen, вернёт `503`. В HTTP-запросах
модели не скачиваются. Внешние OCR/LLM API не используются.

## Проверка

```bash
docker compose ps
curl http://localhost:5173/ocr-api/health
```

Ожидаемый ответ — `{"status":"ok"}`. Healthcheck проверяет доступность процесса,
а не готовность Qwen. Frontend стартует после успешного healthcheck backend.

Для проверки OCR выберите справку об обучении, загрузите
`data/documents/open-002.pdf` и нажмите «Проверить комплектность» без вопроса.
Должны появиться поля, пропуск даты выдачи и действие по нему.

При изменении кода выполните `docker compose up -d --build`: контейнеры используют
собранные образы, автоматической подстановки файлов с хоста нет. Vite-переменные
для Docker фиксируются при сборке frontend: реальный API и адрес `/ocr-api`.
Корневой `.env` управляет Compose; `frontend/.env.local` в образ не попадает.

Проверено на Docker Desktop с `linux/arm64`: сборка обоих образов, 31 тест
frontend внутри сборки, healthcheck контейнеров, страницы и изображения,
OCR по одному PDF каждого типа с совпадением полей и комплектности с эталоном,
отсутствующий ответ и ручные исправления через Nginx. Импорт CPU PyTorch и
Transformers, а также запись в volume модели проверены отдельно. Загрузка
весов и нейросетевой вывод Qwen в эту проверку не входили.

## Экспорт и оценка results.json

Команды из корня проекта, при работающем Docker backend. Python на хосте
не требуется. Все файлы манифеста должны присутствовать хотя бы в одном
представлении: PNG либо PDF. Эталон используется только оценщиком.

```bash
docker compose cp data backend:/tmp/studdoc-data
docker compose exec -T backend python -m services.answer_service --documents /tmp/studdoc-data/documents.json --questions /tmp/studdoc-data/questions.json --output /tmp/studdoc-results.json
docker compose exec -T backend python /tmp/studdoc-data/evaluate.py --reference /tmp/studdoc-data/reference_results.json --predictions /tmp/studdoc-results.json
docker compose cp backend:/tmp/studdoc-results.json ./results.json
```

При повторном экспорте после изменения набора сначала удалите только его
временную копию внутри контейнера, затем повторите команды:
`docker compose exec -T backend python -c "import shutil; shutil.rmtree('/tmp/studdoc-data', ignore_errors=True)"`.
Файлы на хосте эта команда не удаляет. При другом имени Compose-проекта
используйте одинаковый `-p` во всех командах, иначе будет выбран другой volume.

## Если запуск не удался

| Ошибка или симптом | Действие |
| --- | --- |
| `docker: command not found` | Установите Docker Desktop или Docker Engine и Compose |
| `Cannot connect to the Docker daemon` | Запустите Docker и дождитесь успешного `docker info` |
| `no configuration file provided` | Перейдите в папку с `docker-compose.yml` |
| `port is already allocated` | Задайте свободные порты в корневом `.env` и повторите `up` |
| Образ не скачивается, таймаут или ошибка сертификата | Проверьте доступ Docker к Docker Hub, PyPI, PyTorch и GitHub; затем повторите сборку |
| Контейнер `unhealthy` или перезапускается | Выполните `docker compose logs --tail=100 backend frontend` |
| Сайт отвечает `502` | Проверьте backend и его healthcheck; после исправления выполните `docker compose restart frontend` |
| Вопрос возвращает `503` с ошибкой модели | Выполните `docker compose run --rm model-setup`, проверьте свободную память и логи |
| `model-setup` завершился с кодом `137` | Процесс мог быть остановлен из-за нехватки памяти; проверьте ресурсы Docker Desktop |
| `Missing input file` при экспорте | Сверьте `data/documents.json` и наличие PNG/PDF; дополнительные файлы с другим именем манифест не заменяют |
| После смены порта открывается старый сайт | Откройте адрес с `FRONTEND_PORT` из `.env`; у локального Vite может быть другой порт |

Сначала проверяйте логи, затем повторяйте запуск. Команда `docker compose down`
не удаляет volume с Qwen. `down -v` удаляет его и требует повторной загрузки весов.

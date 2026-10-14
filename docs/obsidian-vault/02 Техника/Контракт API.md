---
title: "Контракт API"
tags: [online-dekanat, api, tech]
status: "актуально"
created: 2026-10-10
updated: 2026-10-14
version: "2.0"
project: "Онлайн-деканат"
owner: "Команда"
---

# Контракт API

Backend: `backend/online-dekanat-backend`.

Интерактивная документация FastAPI после запуска: `http://127.0.0.1:8000/docs`.

## `GET /health`

Проверяет, что процесс backend жив.

Ответ:

```json
{
  "status": "ok"
}
```

## `POST /analyze`

Формат: `multipart/form-data`.

Поля:

| Поле | Тип | Ограничения |
|---|---|---|
| `prompt` | string | непустой вопрос, максимум 2000 символов |
| `document_type` | enum | `study_certificate`, `academic_leave_application`, `internship_certificate` |
| `photos` | file[] | ровно один файл |

Файл:

- JPEG, PNG или PDF;
- максимум 10 МиБ;
- PDF должен быть одностраничным и без пароля;
- изображение/страница не больше 20 мегапикселей;
- всё тело запроса максимум 42 МиБ.

Пример:

```bash
curl http://127.0.0.1:8000/analyze \
  -F 'prompt=Какая дата выдачи?' \
  -F 'document_type=study_certificate' \
  -F 'photos=@document.pdf;type=application/pdf'
```

Ответ:

```json
{
  "status": "received",
  "ocr_text": "распознанный текст",
  "document_type": "study_certificate",
  "fields": {
    "student_name": "Александров Артём Игоревич",
    "university": "Учебный университет кМеридианх",
    "program": "38.03.01 Экономика",
    "study_form": "очная",
    "study_start": "2023-09-01",
    "study_end": "2026-08-31",
    "document_number": "ОБ-1001",
    "issue_date": "2026-09-01",
    "signature_present": true,
    "seal_present": true
  }
}
```

Важно: `status: "received"` означает, что backend обработал запрос. Это не означает, что документ нормативно подходит.

## Ошибки

| Код | Когда |
|---|---|
| `400` | некорректный запрос до обработки FastAPI |
| `413` | файл или тело запроса слишком большие |
| `422` | нет вопроса, неправильный тип, пустой файл, битый PDF/изображение |
| `503` | OCR не смог выполниться |

Ответ ошибки содержит `detail`.

## Как frontend мапит ответ

`ApiDocumentCheckService`:

1. отправляет `photos`, `prompt`, `document_type`;
2. читает JSON;
3. преобразует `fields` в UI-массив `{ label, value, status }`;
4. считает общий статус:
   - `success`, если все поля найдены;
   - `warning`, если часть полей не найдена;
   - `unknown`, если OCR-текст пустой или полей нет;
5. кладёт `ocr_text` в `sourceExcerpt`.

## Что ещё нужно добавить в контракт

- `blocks` с OCR-координатами пока описаны в backend README, но frontend их не использует.
- Нужен будущий блок нормативной проверки: `answer`, `rule_id`, `evidence`, `requires_manual_review`.
- Нужен официальный формат `results.json`.

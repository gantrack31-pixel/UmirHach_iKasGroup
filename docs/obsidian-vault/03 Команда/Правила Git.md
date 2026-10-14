---
title: "Правила Git и GitHub"
tags: [online-dekanat, git, team]
status: "актуально"
created: 2026-10-10
updated: 2026-10-14
version: "2.0"
project: "Онлайн-деканат"
owner: "Команда"
---

# Правила Git и GitHub

## Текущий репозиторий

Remote:

```text
https://github.com/gantrack31-pixel/UmirHach_iKasGroup.git
```

Активная ветка с help-страницей:

```text
feature/help-card
```

PR:

```text
https://github.com/gantrack31-pixel/UmirHach_iKasGroup/pull/6
```

## Рабочий цикл

```bash
git status --short --branch
git checkout main
git pull --ff-only
git checkout -b feature/name
```

Перед коммитом:

```bash
git diff --name-only
git diff --cached --name-only
```

Проверки:

```bash
cd frontend
npm run build
```

```bash
cd backend/online-dekanat-backend
python -m pytest
```

## Важная осторожность

В рабочем дереве есть незакоммиченные изменения, которые могут относиться к backend/OCR и не должны случайно попадать в frontend PR. Перед `git add .` всегда подумать дважды. Лучше добавлять файлы явно.

## Что не коммитить

- `.venv`, `node_modules`, `.env`;
- реальные документы студентов;
- модели EasyOCR и датасеты;
- временные OCR-выходы;
- приватные ключи и токены.

## Шаблон PR

```md
## Что сделано
- ...

## Проверка
- npm run build
- python -m pytest

## Риски
- ...
```

## Связанные заметки

- [[06 Качество/План тестирования]]
- [[06 Качество/Риски и запасные решения]]

# Технический блог на Jekyll

Минималистичный личный блог без готовой темы. Исходники сайта находятся в каталоге `site/`.

## Локальный запуск

Через Docker (рекомендуется в этом репозитории):

```bash
make up
```

Сайт будет доступен на [http://localhost:4000](http://localhost:4000).

Или напрямую:

```bash
cd site
bundle install
bundle exec jekyll serve
```

## Создание публикации

Имя файла:

```text
site/_posts/2026-08-16-example-post.md
```

Пример front matter:

```yaml
---
layout: post
title: "Название статьи"
description: "Краткое описание статьи"
date: 2026-08-16 18:00:00 +0400
category: programming
tags:
  - go
  - architecture
lang: ru
image:
  path: /assets/images/posts/example-post/cover.jpg
  alt: "Описание изображения"
toc: true
---
```

Обязательные поля: `layout`, `title`, `date`.

Permalink: `/:year/:month/:day/:title/`.

## Изображения

Рекомендуемая структура:

```text
site/assets/images/posts/<post-slug>/
```

Cover задаётся через `image.path` и `image.alt`.

## UI-строки и язык

Пользовательские строки интерфейса хранятся в `site/_data/ui.yml`.
Текущий язык сайта задаётся через `lang` в `_config.yml` (сейчас `ru`).

## Build

```bash
cd site
bundle exec jekyll build
```

## Deployment

Публикация выполняется GitHub Actions (`.github/workflows/pages.yml`):

1. установка Ruby и зависимостей;
2. `jekyll build`;
3. деплой артефакта в GitHub Pages.

Ожидаемый адрес: `https://arzamaskov.github.io`.

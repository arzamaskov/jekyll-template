---
layout: post
title: "Индексы PostgreSQL: когда они помогают"
description: "Коротко о B-tree, покрывающих индексах и цене записи."
date: 2026-08-08 10:30:00 +0400
category: databases
tags:
  - postgresql
  - performance
lang: ru
image:
  path: /assets/images/posts/postgres-indexes/cover.svg
  alt: "Обложка про индексы PostgreSQL"
---

Индекс ускоряет чтение и замедляет запись. Это не лозунг, а рабочая модель принятия решений.

| Ситуация | Обычно помогает |
| --- | --- |
| Частый фильтр по равенству | B-tree |
| Поиск по префиксу текста | B-tree / trigram |
| Много обновлений одной строки | Иногда вредит |

Перед добавлением индекса смотрите `EXPLAIN (ANALYZE, BUFFERS)`.

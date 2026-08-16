---
layout: post
title: "Интерфейсы в Go: меньше магии, больше ясности"
description: "Как проектировать маленькие интерфейсы и не раздувать абстракции."
date: 2026-08-16 18:00:00 +0400
category: programming
tags:
  - go
  - architecture
lang: ru
image:
  path: /assets/images/posts/go-interfaces/cover.svg
  alt: "Схематичная обложка про интерфейсы Go"
toc: false
---

Интерфейсы в Go лучше держать узкими. Чем меньше методов, тем проще подменять зависимости в тестах и тем понятнее контракт.

```go
type Hasher interface {
    Hash(data []byte) ([]byte, error)
}
```

Не начинайте с большого `Service`. Начните с действия, которое действительно нужно вызывающему коду.

---
layout: post
title: "git rebase: когда стоит, а когда нет"
description: "Линейная история полезна, но не любой ценой."
date: 2026-07-22 16:20:00 +0400
category: programming
tags:
  - git
  - workflow
lang: ru
image:
  path: /assets/images/posts/git-rebase/cover.svg
  alt: "Обложка про git rebase"
---

`rebase` удобен для локальной уборки истории. Публичные ветки лучше трогать осторожно.

```bash
git fetch origin
git rebase origin/main
```

Если ветка уже в общем ревью — предпочитайте merge или согласованный update.

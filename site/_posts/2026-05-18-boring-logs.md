---
layout: post
title: "Логи лучше делать скучными"
description: "Структурированные логи и зачем избегать шума в проде."
date: 2026-05-18 13:00:00 +0400
category: programming
tags:
  - observability
  - craft
lang: ru
---

Лог должен отвечать на вопрос «что произошло», а не создавать отдельную загадку.

Полезный минимум полей: `time`, `level`, `event`, `request_id`.

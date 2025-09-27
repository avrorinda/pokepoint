# Шпаргалка по проекту (Pokemon / Pokepoint)

Короткие напоминания, чтобы «помнить как всё устроено».

## Деплой на GitHub Pages
- CI: файл воркфлоу — `.github/workflows/gh-pages.yml`.
- Источник Pages: GitHub Actions (официальный пайплайн `actions/deploy-pages`).
- Требования:
  - В репозитории присутствуют `go.mod`, `go.sum` и каталог `_vendor/` (вендорим Hugo-модули).
  - В Settings → Pages: Source = GitHub Actions. Custom domain = `pokepoint.ru`. Enforce HTTPS включён.
- Что делает пайплайн:
  1) Checkout кода (история нужна для генерации sitemap/lastmod).
  2) Устанавливает Go и Hugo (extended).
  3) `hugo mod tidy` и сборка `hugo --minify` в `public/`.
  4) Создаёт `public/CNAME` со значением `pokepoint.ru`.
  5) Загружает артефакт и деплоит на Pages через `actions/deploy-pages`.

## Обновление темы и модулей (vendor)
- Тема подключена как Hugo Module: `github.com/nicokaiser/hugo-theme-gallery/v4`.
- Используем vendor-режим, чтобы сборка в CI не зависела от сети.
- Процедура обновления локально:
  1) Обновить версию в `go.mod` (или выполнить `hugo mod get -u` для обновлений).
  2) Выполнить:
     - `hugo mod tidy`
     - `hugo mod vendor`
  3) Закоммитить изменения: `go.mod`, `go.sum`, каталог `_vendor/`.
  4) Запустить Actions — убедиться, что сборка зелёная.

## Конфигурация Hugo
- Основной конфиг: `config/_default/hugo.toml`.
- Важные параметры:
  - `baseURL = "https://pokepoint.ru/"` (обновить при смене домена/окружения).
  - `[module] vendorDir = "_vendor"` — хранит модули в репозитории.

## Цены при клике на изображение
- Публичный JSON для фронтенда: `static/data/prices.json` (доступен по `/data/prices.json`).
- Структура: массив объектов `{ "filename": "имя-файла.jpg", "price": 1000 }`.
- Сопоставление происходит по имени файла без хешей Hugo и без учёта регистра:
  - Hugo добавляет к обработанным изображениям суффикс `_hu_...`. Скрипт отрезает его.
  - Ленивая загрузка: если у картинки есть `data-src`, скрипт берёт именно его, иначе `src`.
  - Все ключи и искомые имена приводятся к нижнему регистру.
- Скрипт: `static/js/show-price.js` подключён в переопределённом `layouts/partials/footer.html`.
- Как обновить цены:
  - Редактировать `static/data/prices.json` (и при желании дубликат в `data/prices.json`).
  - Рекомендуется хранить имена файлов в нижнем регистре.

## Локальная проверка
- Запуск локального сервера:
  - `hugo server -D`
- Сборка (перед коммитом/релизом):
  - `hugo --minify`
- Быстрый чек фронтенда:
  - Открыть галерею, кликнуть на изображение — должно показаться alert с ценой.

## Частые проблемы и решения
- 404 для `/data/prices.json`:
  - Убедиться, что файл лежит в `static/data/prices.json` (а не только в `data/`).
- Цена «не найдена» при клике:
  - Проверьте фактическое `src`/`data-src` изображения в DevTools, сравните имя с ключом в JSON.
  - Убедитесь, что в JSON имя в нижнем регистре и без суффикса `_hu_...`.
- CI падает из-за модулей:
  - Проверьте, что закоммичен `_vendor/`, и не игнорируются `go.mod`, `go.sum`.
  - Локально выполните `hugo mod tidy && hugo mod vendor`, затем закоммитьте изменения.

- 404 на кастомном домене после смены процесса деплоя:
  - Убедитесь, что Pages использует Source = GitHub Actions, а не ветку `gh-pages`.
  - Проверьте наличие `public/CNAME` в артефакте (значение `pokepoint.ru`).
  - Запустите повторный деплой (пустой коммит), дождитесь статуса Deployed.

## Cloudflare (Proxy и DNS)
- Рекомендации:
  - Включайте Proxy (оранжевая тучка) для `pokepoint.ru` и `www`.
  - SSL/TLS Mode: Full (strict).
  - DNS:
    - `www` → CNAME на `pokepoint.ru`.
    - `pokepoint.ru` → A-записи GitHub Pages (185.199.108.153/109.153/110.153/111.153) или CNAME flattening на `avrorinda.github.io`.
  - Редирект `www` → apex: Cloudflare Redirect Rule (301) при необходимости.
  - При проблемах с сертификатами временно отключите Proxy (серые тучки), дождитесь выпуска сертификата Pages, затем включите обратно и верните Full (strict).

## Где что лежит
- Цены: `static/data/prices.json`
- Скрипт цен: `static/js/show-price.js`
- Подключение скрипта: `layouts/partials/footer.html`
- Конфиг Hugo: `config/_default/hugo.toml`
- CI workflow: `.github/workflows/gh-pages.yml`
- Вендорные модули: `_vendor/`

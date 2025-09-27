# Pokepoint (Hugo)

Сайт на Hugo с темой hugo-theme-gallery. Для оперативных напоминаний см. файл: `MAINTENANCE.md`.

- Продакшн URL: задаётся в `config/_default/hugo.toml` → `baseURL`.
- Деплой: GitHub Actions — `.github/workflows/gh-pages.yml` (официальный GitHub Pages workflow: `actions/deploy-pages`).
- Цены при клике: `static/js/show-price.js` + `static/data/prices.json`.

Локально:
- dev-сервер: `hugo server -D`
- сборка: `hugo --minify`

Cloudflare:
- см. раздел "Cloudflare (Proxy и DNS)" в `MAINTENANCE.md` для рекомендуемой настройки Proxy (оранжевая тучка), SSL Full (strict) и редиректов.

Справка:
- Сравнение деплоя GitHub Pages vs GitLab Pages (Hugo): `docs/deploy-pages-comparison.md`


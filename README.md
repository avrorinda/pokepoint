# Pokepoint (Hugo)

Сайт на Hugo с темой hugo-theme-gallery. Для оперативных напоминаний см. файл: `MAINTENANCE.md`.

- Продакшн URL: задаётся в `config/_default/hugo.toml` → `baseURL`.
- Деплой: GitHub Actions — `.github/workflows/gh-pages.yml` (публикация в `gh-pages`).
- Цены при клике: `static/js/show-price.js` + `static/data/prices.json`.

Локально:
- dev-сервер: `hugo server -D`
- сборка: `hugo --minify`

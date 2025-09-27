# Сравнение деплоя: GitHub Pages vs GitLab Pages (Hugo)

Кратко — оба варианта подходят для Hugo. Ниже ключевые отличия и рекомендации с учётом Cloudflare и кастомных доменов.

## Куда публикуется сайт
- GitHub Pages: официальный путь — GitHub Actions → actions/deploy-pages. Сайт упаковывается в артефакт и разворачивается в среде Pages (без обязательной ветки `gh-pages`).
- GitLab Pages: GitLab CI job `pages` публикует содержимое каталога `public/` как артефакт Pages.

## Конфигурация CI
- GitHub:
  - Workflow (`.github/workflows/gh-pages.yml`): build → `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`.
  - Права: `permissions: pages: write, id-token: write`.
  - Полезные экшены: `peaceiris/actions-hugo@v3` для установки Hugo.
- GitLab:
  - `.gitlab-ci.yml`: job `pages`, образ с Hugo, команды `hugo --minify`, артефакты `public/`.
  - Пример:
    ```yaml
    image: klakegg/hugo:0.125.7-ext-alpine
    pages:
      stage: deploy
      script:
        - hugo --minify
      artifacts:
        paths:
          - public
      only:
        - main
    ```

## URL по умолчанию (без кастомного домена)
- GitHub: `https://<user>.github.io/<repo>/` (project pages) или `https://<user>.github.io/` (user/organization pages).
- GitLab: `https://<namespace>.gitlab.io/<project>/`.
- Важно: `baseURL` в `config/_default/hugo.toml` должен совпадать с конечным URL (или кастомным доменом).

## Кастомный домен и сертификаты
- GitHub:
  - Требуется `CNAME` в корне публикуемого сайта (мы генерируем `public/CNAME` в workflow).
  - Settings → Pages: указать `Custom domain`, включить `Enforce HTTPS`.
- GitLab:
  - Settings → Pages → Domains: добавить домен, подтвердить DNS, можно выпустить Let’s Encrypt.
  - `CNAME`-файл не обязателен, но не мешает.

## Cloudflare (Proxy и DNS)
- Подходит и для GitHub, и для GitLab:
  - Proxy: ON (оранжевая тучка), SSL/TLS Mode: Full (strict).
  - DNS:
    - `www` → CNAME на apex (`example.com`).
    - apex → A-записи GitHub/GitLab Pages или CNAME flattening на соответствующий хост (`<user>.github.io` / `<namespace>.gitlab.io`).
  - Редиректы (www → apex): Cloudflare Redirect Rule (301).
  - Если задержки с сертификатами: временно выключите Proxy (серые тучки), дождитесь выдачи сертификата на бэкенде, затем включите обратно.

## Ограничения и видимость
- GitHub Pages:
  - Для публичных репозиториев обычно хватает лимитов Actions.
  - Репозиторий может быть приватным, сайт — публичным.
- GitLab Pages:
  - Лимиты/квоты зависят от тарифа (CI минуты, размер артефактов).
  - Можно ограничивать доступ (Members only, Private).

## Практические рекомендации
- Если код уже на GitHub — используйте официальный `actions/deploy-pages` (как у вас сейчас).
- При миграции на GitLab:
  - Настройте `.gitlab-ci.yml` с образами Hugo и job `pages`.
  - В Pages → Domains добавьте домен и сертификат.
  - Сохраняйте те же правила Cloudflare: Proxy ON + Full (strict), CNAME www → apex, flattening/CNAME/A для apex.

## Чек-лист для Hugo
- `baseURL` = конечный домен (с http(s) и слешем на конце).
- Публичный `CNAME` для GitHub (или настроенный домен в GitLab Pages).
- Вендорные модули Hugo в репозитории (`_vendor/`, `go.mod`, `go.sum`).
- В CI: `hugo mod tidy` + `hugo --minify`.
- После смены домена: запустите новый деплой (пустой коммит), дождитесь статуса Deployed.

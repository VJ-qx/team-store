# Landing page: responsive styles

Responsive styles for the landing page (`Landing Page.dc.html`, and `landing.html` in Vue). There are none yet, so this folder only holds this README.

- **Same type folders as the workspace** (`../workspace/`): `components/`, `layouts/` and `pages/`.
- **First line of every partial:** `@use "../../../variables" as *;`
- **Import them from the landing page's entry,** named from `styles/`: `@use "responsive/landing/<type>/<name>";`. A name that clashes with another partial's (for example `pages/landing/_landing.scss`) needs an alias: `@use "responsive/landing/pages/landing" as responsive-landing;`.

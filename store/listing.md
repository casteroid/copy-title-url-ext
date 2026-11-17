# Store listings

The Chrome Web Store and Firefox Add-ons listings already exist. Keep the copy here in sync with the dashboards when the extension changes.

# Chrome Web Store listing

## Store listing tab

**Name** (from the manifest, `appName` in `app/_locales/en/messages.json`): Copy Title and URL

**Summary** (from the manifest `description`, `appDescription`, max 132 characters): Copy the title or selection and the URL of the current page from the right-click menu, the toolbar button or Alt+Shift+C.

**Category:** Productivity → Tools

**Language:** English

**Store icon:** `promo/Chrome-Webstore-Icon_128x128.png`

**Screenshots:** `promo/Screenshot_1280x800.png`, `promo/Screenshot_640x400.png`

**Promo tiles:** `promo/Promo-Image-Small_440x280.png`, `promo/Promo-Image-Large_920x680.png`, `promo/Promo-Image-Marquee_1400x560.png`

**Detailed description:**

```
Copy Title and URL lets you copy a page's title or selected text together with its URL, so you can share or note a page in one click.

What it does
• "Copy Title and URL" (right-click anywhere on a page) copies the page title and its address.
• "Copy Selection and URL" (right-click on selected text) copies the selected text and the page address.
• "Copy as Markdown" copies a Markdown link, [title](address), using the selected text instead of the title when there is a selection.
• The toolbar button, or Alt+Shift+C (Option+Shift+C on macOS), copies the selected text and the address, or the title and the address when nothing is selected. You can change the shortcut in your browser's extension shortcut settings.

The clipboard gets two lines: the title or selection first, then the URL. Apps that accept formatted text, such as Slack, Google Docs, Notion or Gmail, paste a linked title instead. When the toolbar icon is pinned, it briefly shows ✓ after a copy, or ! when the page could not be copied.

Works in Chrome and Firefox. Copied addresses lose their tracking parameters (utm_*, fbclid, gclid, mc_eid). There are no settings besides the shortcut.

Privacy
The title, URL and selection go to your clipboard and nowhere else. No accounts, no analytics, no network requests.
```

**Homepage URL:** https://github.com/casteroid/copy-title-url-ext

**Support URL:** https://github.com/casteroid/copy-title-url-ext/issues

## Privacy practices tab

**Single purpose:**

```
Copies the current page's title (or the selected text) together with its URL to the clipboard from a right-click context menu, the toolbar button or a keyboard shortcut.
```

**Permission justifications:**

| Permission | Justification |
|---|---|
| `activeTab` | Lets the extension run its copy function in the current tab after the user clicks one of its menu items or its toolbar button, or presses its keyboard shortcut. Access lasts only for that tab and that action; the extension has no host permissions and no content script. |
| `contextMenus` | Adds the three right-click menu items, "Copy Title and URL", "Copy Selection and URL" and "Copy as Markdown". |
| `clipboardWrite` | Writes the title or selection and the URL to the clipboard. |
| `scripting` | Runs the copy function in the current tab (`scripting.executeScript`). The background service worker cannot read the page title or selection or write to the clipboard itself, so the function runs in the page: it reads `document.title` or the selection and writes the clipboard with `navigator.clipboard`. Nothing is injected before the user acts and nothing is sent anywhere. |

**Remote code:** No, I am not using remote code. (All code ships in the package; there is no `eval` and no remotely hosted script.)

**Data usage:** Tick **Website content** and **Web history**. The store requires disclosing data an extension handles even when it never leaves the device ([User Data FAQ, question 3](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)). The extension reads the page title and the selected text (website content) and the page URL, which the FAQ counts as web browsing activity (question 4). Each is read only when the user clicks a menu item or the toolbar button, or presses the shortcut, and only goes to the clipboard. Nothing else applies: no personal, health, financial, authentication, location or communication data, and no user activity tracking. Tick all three certifications (no selling or transferring of user data, no use unrelated to the single purpose, no use for creditworthiness or lending).

**Privacy policy URL:** https://github.com/casteroid/copy-title-url-ext/blob/main/PRIVACY.md

## Distribution tab

**Visibility:** Public. If you change visibility in the dashboard later, publish once by hand before the API can publish again.

**Regions:** All regions.

# Firefox Add-ons listing

**Slug:** `copy-title-and-url-ext` (<https://addons.mozilla.org/en-US/firefox/addon/copy-title-and-url-ext/>)

**Name, summary and description:** the same as the Chrome listing above.

**Category:** Tabs

**License:** MIT

**Privacy policy URL:** https://github.com/casteroid/copy-title-url-ext/blob/main/PRIVACY.md

**Support URL:** https://github.com/casteroid/copy-title-url-ext/issues

# Translations

Both stores take the name and summary from `app/_locales/<locale>/messages.json`. Paste the detailed description below into each store's listing for that language. Keep these in sync with the English description above.

## Português (Portugal), `pt_PT`

```
O Copiar título e URL copia o título ou o texto selecionado de uma página juntamente com o URL, para partilhar ou guardar uma página com um clique.

O que faz
• "Copiar título e URL" (clique com o botão direito em qualquer parte da página) copia o título da página e o endereço.
• "Copiar seleção e URL" (clique com o botão direito no texto selecionado) copia o texto selecionado e o endereço da página.
• "Copiar como Markdown" copia uma ligação Markdown, [título](endereço), usando o texto selecionado em vez do título quando existe uma seleção.
• O botão da barra de ferramentas, ou Alt+Shift+C (Option+Shift+C no macOS), copia o texto selecionado e o endereço, ou o título e o endereço quando não há nada selecionado. Pode alterar o atalho nas definições de atalhos de extensões do navegador.

A área de transferência recebe duas linhas: primeiro o título ou a seleção, depois o URL. As aplicações que aceitam texto formatado, como o Slack, o Google Docs, o Notion ou o Gmail, colam antes um título com ligação. Quando o ícone está afixado na barra de ferramentas, mostra brevemente ✓ depois de copiar, ou ! quando não foi possível copiar a página.

Funciona no Chrome e no Firefox. Não há definições além do atalho.

Privacidade
O título, o URL e a seleção vão para a área de transferência e para mais lado nenhum. Sem contas, sem estatísticas, sem pedidos de rede.
```

## Português (Brasil), `pt_BR`

```
O Copiar título e URL copia o título ou o texto selecionado de uma página junto com a URL, para você compartilhar ou anotar uma página com um clique.

O que ele faz
• "Copiar título e URL" (clique com o botão direito em qualquer lugar da página) copia o título da página e o endereço.
• "Copiar seleção e URL" (clique com o botão direito no texto selecionado) copia o texto selecionado e o endereço da página.
• "Copiar como Markdown" copia um link Markdown, [título](endereço), usando o texto selecionado no lugar do título quando há uma seleção.
• O botão da barra de ferramentas, ou Alt+Shift+C (Option+Shift+C no macOS), copia o texto selecionado e o endereço, ou o título e o endereço quando nada está selecionado. Você pode mudar o atalho nas configurações de atalhos de extensões do navegador.

A área de transferência recebe duas linhas: primeiro o título ou a seleção, depois a URL. Apps que aceitam texto formatado, como Slack, Google Docs, Notion ou Gmail, colam um título com link. Quando o ícone está fixado na barra de ferramentas, ele mostra rapidamente ✓ depois de copiar, ou ! quando não foi possível copiar a página.

Funciona no Chrome e no Firefox. Não há configurações além do atalho.

Privacidade
O título, a URL e a seleção vão para a área de transferência e para nenhum outro lugar. Sem contas, sem análises, sem requisições de rede.
```

## Español, `es`

```
Copiar título y URL copia el título o el texto seleccionado de una página junto con su URL, para compartir o guardar una página con un clic.

Qué hace
• «Copiar título y URL» (clic derecho en cualquier parte de la página) copia el título de la página y su dirección.
• «Copiar selección y URL» (clic derecho sobre el texto seleccionado) copia el texto seleccionado y la dirección de la página.
• «Copiar como Markdown» copia un enlace Markdown, [título](dirección), con el texto seleccionado en lugar del título cuando hay una selección.
• El botón de la barra de herramientas, o Alt+Mayús+C (Opción+Mayús+C en macOS), copia el texto seleccionado y la dirección, o el título y la dirección cuando no hay nada seleccionado. Puedes cambiar el atajo en la configuración de atajos de extensiones del navegador.

El portapapeles recibe dos líneas: primero el título o la selección y después la URL. Las aplicaciones que aceptan texto con formato, como Slack, Google Docs, Notion o Gmail, pegan en su lugar un título enlazado. Cuando el icono está fijado en la barra de herramientas, muestra brevemente ✓ tras copiar, o ! si no se pudo copiar la página.

Funciona en Chrome y Firefox. No hay más ajustes que el atajo.

Privacidad
El título, la URL y la selección van a tu portapapeles y a ningún otro sitio. Sin cuentas, sin analíticas, sin peticiones de red.
```

## Français, `fr`

```
Copier le titre et l'URL copie le titre ou le texte sélectionné d'une page avec son URL, pour partager ou noter une page en un clic.

Ce que fait l'extension
• « Copier le titre et l'URL » (clic droit n'importe où sur la page) copie le titre de la page et son adresse.
• « Copier la sélection et l'URL » (clic droit sur le texte sélectionné) copie le texte sélectionné et l'adresse de la page.
• « Copier en Markdown » copie un lien Markdown, [titre](adresse), avec le texte sélectionné à la place du titre s'il y a une sélection.
• Le bouton de la barre d'outils, ou Alt+Maj+C (Option+Maj+C sur macOS), copie le texte sélectionné et l'adresse, ou le titre et l'adresse si rien n'est sélectionné. Vous pouvez changer le raccourci dans les paramètres des raccourcis d'extensions de votre navigateur.

Le presse-papiers reçoit deux lignes : d'abord le titre ou la sélection, puis l'URL. Les applications qui acceptent le texte mis en forme, comme Slack, Google Docs, Notion ou Gmail, collent plutôt un titre avec lien. Quand l'icône est épinglée dans la barre d'outils, elle affiche brièvement ✓ après une copie, ou ! si la page n'a pas pu être copiée.

Fonctionne dans Chrome et Firefox. Aucun réglage à part le raccourci.

Confidentialité
Le titre, l'URL et la sélection vont dans votre presse-papiers et nulle part ailleurs. Pas de compte, pas de statistiques, pas de requêtes réseau.
```

## Deutsch, `de`

```
Titel und URL kopieren kopiert den Titel oder den markierten Text einer Seite zusammen mit ihrer URL, damit Sie eine Seite mit einem Klick teilen oder notieren können.

Funktionen
• „Titel und URL kopieren“ (Rechtsklick irgendwo auf der Seite) kopiert den Seitentitel und die Adresse.
• „Auswahl und URL kopieren“ (Rechtsklick auf markierten Text) kopiert den markierten Text und die Adresse der Seite.
• „Als Markdown kopieren“ kopiert einen Markdown-Link, [Titel](Adresse), mit dem markierten Text statt des Titels, wenn etwas markiert ist.
• Die Schaltfläche in der Symbolleiste oder Alt+Umschalt+C (Wahl+Umschalt+C unter macOS) kopiert den markierten Text und die Adresse oder, wenn nichts markiert ist, den Titel und die Adresse. Das Tastenkürzel können Sie in den Erweiterungs-Tastenkürzeln Ihres Browsers ändern.

In die Zwischenablage kommen zwei Zeilen: zuerst der Titel oder die Auswahl, dann die URL. Apps, die formatierten Text annehmen, etwa Slack, Google Docs, Notion oder Gmail, fügen stattdessen einen verlinkten Titel ein. Wenn das Symbol an die Symbolleiste angeheftet ist, zeigt es nach dem Kopieren kurz ✓ an, oder !, wenn die Seite nicht kopiert werden konnte.

Funktioniert in Chrome und Firefox. Außer dem Tastenkürzel gibt es keine Einstellungen.

Datenschutz
Titel, URL und Auswahl landen in Ihrer Zwischenablage und nirgendwo sonst. Keine Konten, keine Analyse, keine Netzwerkanfragen.
```

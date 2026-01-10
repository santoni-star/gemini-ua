# Видалення Gemini CLI

Спосіб видалення залежить від того, як ви встановлювали або запускали CLI.
Дотримуйтесь інструкцій для npx або глобального встановлення npm.

## Спосіб 1: При використанні npx

npx запускає пакунки з тимчасового кешу без постійного встановлення. Щоб
"видалити" CLI, ви повинні очистити цей кеш, що видалить gemini-cli та будь-які
інші пакунки, раніше запущені через npx.

Кеш npx — це каталог з назвою `_npx` всередині вашої основної папки кешу npm. Ви
можете знайти шлях до кешу npm, виконавши `npm config get cache`.

**Для macOS / Linux**

```bash
# Шлях зазвичай ~/.npm/_npx
rm -rf "$(npm config get cache)/_npx"
```

**Для Windows**

_Командний рядок (CMD)_

```cmd
:: Шлях зазвичай %LocalAppData%\npm-cache\_npx
rmdir /s /q "%LocalAppData%\npm-cache\_npx"
```

_PowerShell_

```powershell
# Шлях зазвичай $env:LocalAppData\npm-cache\_npx
Remove-Item -Path (Join-Path $env:LocalAppData "npm-cache\_npx") -Recurse -Force
```

## Спосіб 2: При використанні npm (глобальне встановлення)

Якщо ви встановили CLI глобально (наприклад,
`npm install -g santoni-star/gemini-ua`), скористайтеся командою `npm uninstall`
з прапорцем `-g`.

```bash
# Для української версії (якщо встановлювали через GitHub)
npm uninstall -g @google/gemini-cli
# Або якщо ви встановлювали конкретно за посиланням:
npm uninstall -g santoni-star/gemini-ua
```

Ця команда повністю видалить пакет з вашої системи.

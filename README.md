# Obsidian Book Search Plugin

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/anpigon/obsidian-book-search-plugin/release.yml?logo=github)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/anpigon/obsidian-book-search-plugin?sort=semver)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/anpigon/obsidian-book-search-plugin/total)
[![Korean](https://img.shields.io/badge/Language-한국어-blueviolet)](README.ko.md)
[![Русский](https://img.shields.io/badge/Language-Русский-blue)](#русский)

Easily create book notes.

<br>

---

## 🇷🇺 Русский

Этот форк добавляет поддержку **ЛитРес** — крупнейшего российского книжного сервиса. По умолчанию используется ЛитРес, регистрация не требуется.

### Установка через BRAT

1. Установи плагин [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. Открой настройки BRAT → **Add Beta Plugin**
3. Введи: `https://github.com/malexple/obsidian-book-search-plugin`

### Поиск русских книг

Поиск работает по названию, автору или ISBN. Данные берутся с ЛитРес без авторизации.

Пример шаблона для русских книг:

```
***
tag: 📚Книга
title: "{{title}}"
author: [{{author}}]
category: [{{category}}]
publisher: {{publisher}}
publish: {{publishDate}}
isbn: {{isbn10}} {{isbn13}}
cover: {{coverUrl}}
status: не читал
created: {{DATE:YYYY-MM-DD HH:mm:ss}}
updated: {{DATE:YYYY-MM-DD HH:mm:ss}}
***



# {{title}}

{{description}}
```

### Отображение книг через Dataview

```dataview
TABLE WITHOUT ID
    status as Статус,
    "![|60](" + cover + ")" as Обложка,
    link(file.link, title) as Название,
    author as Автор,
    publisher as Издатель
FROM #📚Книга
WHERE !contains(file.path, "Templates")
SORT status DESC, file.ctime ASC
```

### Провайдеры поиска

| Провайдер | Язык | Авторизация |
|-----------|------|-------------|
| **LitRes** (по умолчанию) | 🇷🇺 Русский | Не требуется |
| Google Books | 🌍 Все языки | Не требуется (API ключ опционально) |
| Naver | 🇰🇷 Корейский | Client ID + Secret |

---

## Changelog

To view the changelog for the latest and previous versions, please click [here](https://github.com/anpigon/obsidian-book-search-plugin/releases).

<br>

## Demo

[https://user-images.githubusercontent.com/3969643/184918274-8ad24546-2e01-4288-a855-c8eeb1feca7d.mp4](https://user-images.githubusercontent.com/3969643/184918274-8ad24546-2e01-4288-a855-c8eeb1feca7d.mp4)

<br>

## Description

Use to query book using:

- A book title, author, publisher or ISBN (10 or 13).

Supports Google Books API, Naver Books API, and **LitRes** (Russian books, no auth required).

<br>

## Installation (via BRAT)

1. Install [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Open BRAT settings → Add Beta Plugin
3. Enter: `https://github.com/malexple/obsidian-book-search-plugin`

### Enhancements: Cover Image Display in Search Results

We've introduced a new setting that allows users to display cover images alongside book suggestions in the search results.

By default, this feature is **disabled**. To enable:

1. Go to the plugin settings.
2. Find the **"Show Cover Images in Search"** option.
3. Switch the toggle to **on**.

#### CSS Styling for Cover Images

```css
.book-suggestion-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.book-cover-image {
  max-width: 100px;
  max-height: 100px;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 3px;
}

.book-text-info {
  flex-grow: 1;
}
```

<br>

## How to use

### 1. Click the ribbon icon, or execute the command "Create new book note".

<img width="600" src="https://user-images.githubusercontent.com/3969643/161973483-ab007598-e0b8-433f-9697-75ee0ef74195.png">

### 2. Search for books by keywords.

<img width="600" src="https://user-images.githubusercontent.com/3969643/161973979-51f642c9-626a-4015-a7e9-dfdbe6ec2cbc.png">

### 3. Select the book from the search results.

<img width="600" src="https://user-images.githubusercontent.com/3969643/161974310-13c3b39b-51dc-472f-b787-db64f74caf74.png">

### 4. Voila! A note has been created.

<img width="600" src="https://user-images.githubusercontent.com/3969643/161974593-1b7bfe69-cb9d-47d7-a43d-1d725295a122.png">

<br>

## How to use settings

<img width="700" src="https://user-images.githubusercontent.com/3969643/184919550-68eff0e4-2b02-41bb-8f17-30a5354359a3.png">

### New file location

Set the folder location where the new file is created. Otherwise, a new file is created in the Obsidian Root folder.

### New file name

You can set the file name format. The default format is `{{title}} - {{author}}`.

### Template file

You can set the template file location.

### Service Provider

Choose between **LitRes** (Russian, default), **Google Books** (global), or **Naver** (Korean).

### Cover Image Saving

Automatically downloads and saves book cover images into your vault. Use `{{localCoverImage}}` in templates.

### How to add a Google API Key

- Create a project on [Google Cloud](https://console.cloud.google.com/projectcreate)
- Enable the [Books API](https://console.cloud.google.com/apis/library/books.googleapis.com)
- Create an [API key](https://console.cloud.google.com/apis/credentials)
- Add the key in plugin settings under "Set API Key"

<br>

## Example template

```
***
tag: 📚Book
title: "{{title}}"
subtitle: "{{subtitle}}"
author: [{{author}}]
category: [{{category}}]
publisher: {{publisher}}
publish: {{publishDate}}
total: {{totalPage}}
isbn: {{isbn10}} {{isbn13}}
cover: {{coverUrl}}
localCover: {{localCoverImage}}
status: unread
created: {{DATE:YYYY-MM-DD HH:mm:ss}}
updated: {{DATE:YYYY-MM-DD HH:mm:ss}}
***

<%* if (tp.frontmatter.cover && tp.frontmatter.cover.trim() !== "") { tR += `![cover|150](${tp.frontmatter.cover})` } %>

# {{title}}
```

<br>

## Template variables definitions

| Field           | Description                                      |
| --------------- | ------------------------------------------------ |
| title           | The title of the book                            |
| subtitle        | The subtitle of the book                         |
| author          | Comma-separated authors string                   |
| authors         | Array of author names                            |
| category        | Comma-separated categories string                |
| categories      | Array of categories                              |
| description     | Book description                                 |
| publisher       | The publisher of the book                        |
| totalPage       | Total number of pages                            |
| coverUrl        | Book cover image URL                             |
| coverSmallUrl   | Smaller book cover image URL                     |
| localCoverImage | Local path for downloaded cover image            |
| publishDate     | Year the book was published                      |
| isbn10          | ISBN-10                                          |
| isbn13          | ISBN-13                                          |

<br>

## Dataview rendering

```dataview
TABLE WITHOUT ID
    status as Status,
    "![|60](" + cover + ")" as Cover,
    link(file.link, title) as Title,
    author as Author,
    join(list(publisher, publish)) as Publisher
FROM #📚Book
WHERE !contains(file.path, "Templates")
SORT status DESC, file.ctime ASC
```

<br>

## License

Licensed under the GNU AGPLv3 license. Refer to [LICENSE](https://github.com/SilentVoid13/Templater/blob/master/LICENSE.TXT) for more information.

<br>

## Contributing

Feel free to contribute via [issues](https://github.com/anpigon/obsidian-book-search-plugin/issues) or [pull requests](https://github.com/anpigon/obsidian-book-search-plugin/pulls).

<br>

## Support

If this plugin helped you :)

**🇷🇺 Поддержать рублями:** [boosty.to/malexple](https://boosty.to/malexple)

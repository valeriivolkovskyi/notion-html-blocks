# notion-html-blocks
`notion-html-blocks` is a zero-dependency library capable of rendering blocks from the Notion API into HTML.
Through the use of the [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js) it's possible to
extract specific page blocks which then can be converted into HTML.

### Motivation
It`s  could be useful when you want to use Notion like CMS for your project


### How to use

```javascript
import { renderBlocks } from 'notion-html-block'

// use notion SDK to get blocks
const pageBlocks = await notion.blocks.children.list({ block_id: id });

// retrieve nested blocks
for (const block of pageBlocks.results) {
  if (block.has_children) {
    block.children = await getPageBlocks(block.id);
  }
}

// get html for blocks list
const content = renderBlocks(pageBlocks.results);
```

Example output for toggleable heading block:

```html
<div class="n-toggle-heading">
    <h1 class="n-heading-1 n-toggleable n-toggleable-closed">Toggle Heading</h1>
    <p class="n-paragraph">Hidden content</p>
</div>
```


Also, it's possible to render one certain block:

```javascript
const block = {
  "object": "block",
  "type": "paragraph",
  "paragraph": {
    "rich_text": [
        //...
    ],
  }
  //...
};

const content = renderBlock(block)
```
### Recipies

Generate static files for your static site generator:
```javascript
import fs from "fs";
const content = renderBlocks(blocks);

fs.writeFile('./blocks.html', content)
fs.writeFile('./blocks.html', JSON.stringify({blocks: content}))
```


If you need to insert result  to DOM, you should use `DOMParser`:
```javascript
const parser = new DOMParser();

const html = parser.parseFromString(`<div id="my-content">${renderBlocks(blocks)}</div>`, 'text/html');
const content = html.getElementById("my-content")
document.body.append(content);
```
or  `<template>` element:
```javascript
const template = document.createElement('template');
template.innerHTML = renderBlock(block);

const html = template.content.children;
document.body.append(html);
```

### Supported types:
* divider
* code
* image
* bulleted_list_item
* paragraph
* heading_1
* heading_2
* heading_3
* numbered_list_item
* quote
* toggle
* callout
* table

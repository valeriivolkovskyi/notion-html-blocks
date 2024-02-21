# notion-html-blocks

`notion-html-blocks` is a zero-dependency library capable of rendering blocks from the Notion API into HTML.
Through the use of the [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js) it's possible to
extract specific page blocks which then can be converted into HTML content like this:

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
const html = renderBlocks(pageBlocks.results);
```

Example output for toggleable heading block:

```html
<h1 class="n-heading-1 n-toggleable n-toggleable-closed">Toggle Heading</h1>
```

### Motivation
It`s  could be useful when you want to use Notion like CMS for your project

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

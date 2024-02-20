/**
 * @typedef {import('./transformNotionBlocks.js').BlockData} BlockData
 */

import {transformBlockList, transformBlock} from './transformNotionBlocks.js'
import {renderToString} from './rendering.js'

/**
 *
 * @param {BlockData} block
 * @return {string}
 */
export function renderBlock(block) {
  const element = transformBlock(block);
  return renderToString(element);
}

/**
 *
 * @param {import('./transformNotionBlocks.js').BlockData[]} blocks
 * @return {string}
 */
export function renderBlockList(blocks) {
  const elements = transformBlockList(blocks);
  return renderToString(elements);
}



const testData = [
    {
  "object": "block",
  "id": "c56ba85c-4458-4b2e-a596-2bb42e2a0c3e",
  "parent": {
    "type": "page_id",
    "page_id": "5de27ba6-306a-446e-ad8c-3429474ee452"
  },
  "created_time": "2024-02-11T22:24:00.000Z",
  "last_edited_time": "2024-02-19T20:51:00.000Z",
  "created_by": {
    "object": "user",
    "id": "93bfee87-3786-4846-8b2b-e66cc624a7e8"
  },
  "last_edited_by": {
    "object": "user",
    "id": "93bfee87-3786-4846-8b2b-e66cc624a7e8"
  },
  "has_children": false,
  "archived": false,
  "type": "paragraph",
  "paragraph": {
    "rich_text": [
      {
        "type": "text",
        "text": { "content": "Content is here", "link": null },
        "annotations": {
          "bold": false,
          "italic": false,
          "strikethrough": false,
          "underline": false,
          "code": false,
          "color": "default"
        },
        "plain_text": "Content is here",
        "href": null
      }
    ],
    "color": "default"
  }
},
  {
    "object": "block",
    "id": "5629bbb9-54fb-41ad-9875-8715137e6877",
    "parent": {
      "type": "page_id",
      "page_id": "5de27ba6-306a-446e-ad8c-3429474ee452"
    },
    "created_time": "2024-02-11T22:39:00.000Z",
    "last_edited_time": "2024-02-15T23:33:00.000Z",
    "created_by": {
      "object": "user",
      "id": "93bfee87-3786-4846-8b2b-e66cc624a7e8"
    },
    "last_edited_by": {
      "object": "user",
      "id": "93bfee87-3786-4846-8b2b-e66cc624a7e8"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "This is my Article about ObserveR ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "This is my Article about ObserveR ",
          "href": null
        },
        {
          "type": "text",
          "text": { "content": "Pattern ", "link": null },
          "annotations": {
            "bold": true,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Pattern ",
          "href": null
        },
        {
          "type": "text",
          "text": { "content": "code", "link": null },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": true,
            "color": "default"
          },
          "plain_text": "code",
          "href": null
        },
        {
          "type": "text",
          "text": { "content": " variabe", "link": null },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " variabe",
          "href": null
        }
      ],
      "color": "default"
    }
  }]

const test = renderBlockList(testData)

console.log(test)
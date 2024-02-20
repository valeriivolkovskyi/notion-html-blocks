/**
 * @typedef {string | null} ParsedContent
 * @typedef {{ rich_text: Array<RichTextData>, color: ApiColorType, is_toggleable: boolean }} HeaderInformation
 * @typedef {import("@notionhq/client/build/src/api-endpoints").BlockObjectResponse} BlockData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ImageBlockObjectResponse} ImageBlockData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ParagraphBlockObjectResponse} ParagraphBlockData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").RichTextItemResponse}  RichTextData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").TextRichTextItemResponse} TextData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ApiColor} ApiColorType
 * @typedef {import("@notionhq/client/build/src/api-endpoints").Heading1BlockObjectResponse} HeadingBlockData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").CodeBlockObjectResponse} CodeBlockData
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ListBlockChildrenResponse} ListBlockChildrenResponse
 * @typedef {import("@notionhq/client/build/src/api-endpoints").PartialBlockObjectResponse} PartialBlockObjectResponse
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ColumnListBlockObjectResponse} Column
 * @typedef {import("@notionhq/client/build/src/api-endpoints").ColumnBlockObjectResponse} ColumnBlock
 * @typedef {import("@notionhq/client/build/src/api-endpoints").TableBlockObjectResponse} Table
 *
 */

import { createElement, renderToString } from "./rendering.js";
import PARAMS from "./params.js";
import t from "./blockTypes.js";
import {
	mapBlockToTag,
	parseClasses,
	createAnnotatedTextElement,
} from "./helpers.js";

// next block

const blockTransformers = {
	[t.divider]: () => createElement("hr", { className: "divider" }, null),
	[t.code]: (block) => createCodeElement(block),
	[t.image]: (data) => createImageElement(data),
	[t.bulleted_list_item]: (block) => createRichTextHTMLElement(block),
	[t.paragraph]: (block) => createRichTextHTMLElement(block),
	[t.heading_1]: (block) => createRichTextHTMLElement(block),
	[t.heading_2]: (block) => createRichTextHTMLElement(block),
	[t.heading_3]: (block) => createRichTextHTMLElement(block),
	[t.numbered_list_item]: (block) => createRichTextHTMLElement(block),
	[t.quote]: (block) => createRichTextHTMLElement(block),
	[t.toggle]: (block) => createRichTextHTMLElement(block),
	[t.callout]: (block) => createRichTextHTMLElement(block),
	[t.table]: (block) => createTable(block),
	[t.table_of_contents]: (block) => null,
	[t.column]: (block) => {
		console.log("****** Column", block);
		return null;
	},
	[t.column_list]: (block) => createColumn(block.children),
	// [t.video]: () => null,
	// [t.to_do]: () => null,
	// [t.child_database]: () => null,
	// [t.bookmark]: () => null,
	// [t.breadcrumb]: () => null,
	// [t.child_page]: () => null,
	// [t.embed]: () => null,
	// [t.equation]: () => null,
	// [t.file]: () => null,
	// [t.link_preview]: () => null,
	// [t.mention]: () => null,
	// [t.pdf]: () => null,
	// [t.synced_block]: () => null,
};

/**
 *
 * @param { ColumnBlock } data
 * @return {Element | null}
 */
function createColumn(data) {
		data.results;
}

/**
 *
 * @param {Table} block
 * @return {Element|null}
 */
function createTable(block) {
	const { table, children } = block;
	const rows = children.results;
	const {has_column_header, has_row_header} = table
	if (!rows.length) return null;

	let props = {};

	if (has_column_header || has_row_header) {
		props.className = `${PARAMS.classPrefix}-${has_column_header ? 'column-header' : 'row-header'}`;
	}

	const tableRows = rows.map((block, index) => {
		const cells = block.table_row.cells.map((cell) => {
			const textContent = createRichText(cell);
			return createElement('td', {}, textContent);
		});

		return createElement('tr', {}, cells);
	});

	return createElement('table', props, tableRows);
}

/**
 *
 * @param {ImageBlockData} imageBlockData
 * @return {Element}
 */
function createImageElement(imageBlockData) {
	const { type, caption } = imageBlockData.image;
	const imageFileInfo = imageBlockData.image[type];
	if (imageFileInfo.url.length === 0) return null;

	const src = imageFileInfo.url;
	const alt = caption.map((text) => text.plain_text).join("");
	const captionText = createRichText(caption);

	return createElement("div", { className: "n-image" }, [
		createElement("img", { src, alt }, null),
		createElement("p", {}, captionText),
	]);
}

/**
 * @param {CodeBlockData} codeBlockData
 * @return {Element}
 */
function createCodeElement(codeBlockData) {
	const { rich_text, caption, language } = codeBlockData.code;

	const plainTextFromCode = rich_text.map((text) => text.plain_text).join("");
	const codeCaption = createRichText(caption);

	return createElement("div", { className: `${PARAMS.classPrefix}-code` }, ...[
		codeCaption &&
			createElement(
				"p",
				{ className: `${PARAMS.classPrefix}-code-caption` },
				codeCaption,
			),
		createElement(
			"code",
			{ className: `${PARAMS.classPrefix}-code-${language}` },
			plainTextFromCode,
		),
	]);
}

/**
 *
 * @param {BlockData } block
 */
function getChildren(block) {
	return transformBlockList(block.children);
}

/**
 *
 * @param {BlockData} block
 */
function createRichTextHTMLElement(block) {
	const type = block.type;
	const HTMLTag = mapBlockToTag(type);
	const className = parseClasses(block[type], type);
	const content = createRichText(block[type].rich_text);
	const children = block.has_children ? getChildren(block) : null;

	if (
		(type === t.heading_1 || type === t.heading_2 || type === t.heading_3) &&
		block.has_children
	) {
		const heading = createElement(HTMLTag, { className }, content);
		return createElement(
			"div",
			{ className: `${PARAMS.classPrefix}-toggle-heading` },
			...[heading, children],
		);
	}

	if (type === t.callout) {
		const icon = block.callout.icon.emoji;
		if (icon) {
			return createElement(HTMLTag, { className }, icon, content, children);
		}
	}

	return createElement(HTMLTag, { className }, content, children);
}

/**
 *
 * @param {RichTextData[]} richText
 * @returns {Element[]}
 */
function createRichText(richText) {
	return richText.map(createAnnotatedTextElement);
}

/**
 * @param {Array<BlockData>} blocks
 * @returns {Element[]}
 */
export function transformBlockList(blocks) {
	const HTMLElements = [];

	const readyBlocks = new Set();

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];

		if (
			blockTransformers.hasOwnProperty(block.type) &&
			!readyBlocks.has(block)
		) {
			let element = blockTransformers[block.type](block);

			if (
				block.type === t.bulleted_list_item ||
				block.type === t.numbered_list_item
			) {
				let right = i + 1;
				const siblings = [element];

				while (blocks[right]?.type === block.type) {
					const elem = blockTransformers[block.type](blocks[right]);
					siblings.push(elem);
					readyBlocks.add(blocks[right]);
					right++;
				}

				element = createElement(
					block.type === t.bulleted_list_item ? "ul" : "ol",
					{
						className: `${PARAMS.classPrefix}-${block.type}`,
					},
					...siblings,
				);
			}

			if (element !== null) {
				HTMLElements.push(element);
			}
		}
	}

	return HTMLElements;
}

/**
 *
 * @param  {BlockData} block
 */
export function transformBlock(block) {
	if (blockTransformers.hasOwnProperty(block.type)) {
		return blockTransformers[block.type](block);
	}
}
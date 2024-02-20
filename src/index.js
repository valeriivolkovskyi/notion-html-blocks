/**
 * @typedef {import('./transformNotionBlocks.js').BlockData} BlockData
 */

import { transformBlockList, transformBlock } from "./transformNotionBlocks.js";
import { renderToString } from "./rendering.js";

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
 * @param {BlockData[]} blocks
 * @return {string}
 */
export function renderBlockList(blocks) {
	const elements = transformBlockList(blocks);

	// @ts-ignore
	return renderToString(elements);
}

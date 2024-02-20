/**
 * @typedef {number | string | Element | Element[] } Children
 * @typedef {{type: string, props: {}, children: Children[]}} Element
 *
 */

import xss from "xss";

const voidElements = [
	"area",
	"base",
	"br",
	"hr",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
];

/**
 *
 * @param {{}} props
 * @return {string}
 */
const renderProps = (props) => {
	return Object.entries(props)
		.map(
			([key, value]) =>
				` ${key === "className" ? "class" : xss(key)}="${xss(value)}"`,
		)
		.join("");
};

/**
 *
 * @param { Children[] } children
 * @return {string}
 */
const renderChildren = (children = []) =>
	children
		.flatMap((child) => {
			if (Array.isArray(child)) {
				return child.map((c) => (c ? renderToString(c) : ""));
			} else if (elementIsObject(child)) {
				return child ? renderToString(child) : "";
			} else {
				return child ? xss(child.toString()) : "";
			}
		})
		.join("");

/**
 *
 * @param {Element[] | Children[]} elements
 * @return {string}
 */
const renderElements = (elements) => {
	return elements.map((element) => renderToString(element)).join("");
};

/**
 *
 * @param {Children} element
 * @return {boolean}
 */
const elementIsObject = (element) => typeof element === "object";

/**
 *
 * @param {Children} element
 * @return {boolean}
 */
const elementIsStringOrNumber = (element) =>
	typeof element === "string" || typeof element === "number";

/**
 *
 * @param {Element | Element[] | Children | Children[] }  element
 * @return {string}
 */
export const renderToString = (element) => {
	if (Array.isArray(element)) {
		return renderElements(element);
	}

	if (elementIsStringOrNumber(element)) {
		return xss(element.toString());
	}
	// @ts-ignore
	const { type, props, children } = element;

	if (voidElements.includes(type)) {
		return `<${type}${renderProps(props)}>`; // no end tag for void HTML elements
	}

	return `<${type}${renderProps(props)}>${renderChildren(children)}</${type}>`;
};

/**
 *
 * @param { string} type
 * @param {{}} props
 * @param  {Children[]} children - The rest of the arguments
 * @return {Element}
 */
export const createElement = (type, props = null, ...children) => ({
	type,
	props,
	children,
});

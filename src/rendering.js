/**
 * @typedef {number | string | Element | Element[]} Children
 * @typedef {{type: string, props: {}, children: Children | Children[]}} Element
 *
 */

import xss from "xss";

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
 * @param { Children } children
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

const extractElementProperties = (element) => {
	return {
		type: element.type,
		props: element.props || {},
		children: element.children || [],
	};
};

/**
 *
 * @param {Element[]} elements
 * @return {string}
 */
const renderElements = (elements) => {
	return elements.map((element) => renderToString(element)).join("");
};

/**
 *
 * @param {Element} element
 * @return {boolean}
 */
const elementIsObject = (element) => typeof element === "object";

/**
 *
 * @param {Element} element
 * @return {boolean}
 */
const elementIsStringOrNumber = (element) =>
	typeof element === "string" || typeof element === "number";

/**
 *
 * @param {Element | Element[] }  element
 * @return {string}
 */
export const renderToString = (element) => {
	if (Array.isArray(element)) {
		return renderElements(element);
	}

	if (elementIsStringOrNumber(element)) {
		return xss(element.toString());
	}

	const { type, props, children } = extractElementProperties(element);
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

	if (voidElements.includes(type)) {
		return `<${type}${renderProps(props)}>`; // no end tag for void HTML elements
	}

	return `<${type}${renderProps(props)}>${renderChildren(children)}</${type}>`;
};

/**
 *
 * @param { string} type
 * @param {{}} props
 * @param {Children[]} children
 * @return {Element}
 */
export const createElement = (type, props = null, ...children) => ({
	type,
	props,
	children,
});

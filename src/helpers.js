import {createElement} from "./rendering.js";
import PARAMS from "./params.js";
import types from "./blockTypes.js";

export const mapBlockToTag = (blockType) => {
	switch (blockType) {
		case types.paragraph:
			return "p";
		case types.heading_1:
			return "h1";
		case types.heading_2:
			return "h2";
		case types.heading_3:
			return "h3";
		case types.bulleted_list_item:
			return "li";
		case types.numbered_list_item:
			return "li";
		case types.image:
			return "img";
		case types.divider:
			return "div";
		case types.code:
			return "code";
		case types.quote:
			return "blockquote";
		default:
			return "div";
	}
};

/**
 *
 * @param {string} color
 */
function parseColor(color) {
	if (!color || color === "default") return "";

	return color.replaceAll("_", "-");
}

/**
 *
 * @param {boolean} isToggleable
 */
function parseToggleable(isToggleable) {
	return isToggleable ? ["toggleable", "toggleable-closed"] : [""];
}

export function parseClasses(element, type) {
	const baseClass = type;
	const color = parseColor(element.color);
	const toggleable = parseToggleable(element.is_toggleable);

	return [baseClass, color, ...toggleable]
		.filter(Boolean)
		.map((c) => `${PARAMS.classPrefix}-${c.replaceAll("_", "-")}`)
		.join(" ");
}

/**
 *
 * @param {TextData} textData
 * @return {Element}
 */
export function createAnnotatedTextElement(textData) {
	const { href, text, annotations } = textData;
	let result = text.content;
	const transformers = [
		(content) =>
			href !== null ? createElement("a", { href }, content) : content,
		(content) => (annotations.bold ? createElement("b", {}, content) : content),
		(content) =>
			annotations.italic ? createElement("i", {}, content) : content,
		(content) =>
			annotations.strikethrough ? createElement("s", {}, content) : content,
		(content) =>
			annotations.underline ? createElement("u", {}, content) : content,
		(content) =>
			annotations.code
				? createElement(
						"code",
						{ className: `${PARAMS.classPrefix}-inline-code` },
						content,
				  )
				: content,
		// Adjusted to add possible handling of an undefined color.
		(content) => {
			const color = annotations.color ? parseColor(annotations.color) : "";
			return color !== ""
				? createElement("span", { className: `nc-${color}` }, content)
				: content;
		},
	];
	transformers.forEach((transform) => {
		result = transform(result);
	});
	return result;
}

export default { mapBlockToTag, parseClasses, createAnnotatedTextElement };
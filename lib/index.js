//
// index.js
// @trenskow/object-http-header-value
//
// Created by Kristian Trenskow on 2026/05/21
// See license in LICENSE.
//

import caseit from '@trenskow/caseit';
import merge from '@trenskow/merge';
import keyd from 'keyd';

const defaultOptions = (options = {}, defaults = {}) => {

	options = merge(defaults, options);

	if (typeof options.delimiter === 'string') {
		options.delimiter = {
			value: options.delimiter
		};
	}

	return merge({
		delimiter: {
			value: '; ',
			item: ', ',
			key: '.'
		}
	}, options);

};

const decode = (value, options = {}) => {

	if (typeof value !== 'string') {
		throw new Error('Input must be a string.');
	}

	options = defaultOptions(options, {
		keyCasing: undefined,
		delimiter: {
			value: /;\s?/,
			item: /,\s?/,
			key: '.'
		},
		autoWrap: false
	});

	const result = value
		.split(options.delimiter.item)
		.filter((value) => value)
		.map((value) => keyd.expand(
			Object.fromEntries(
				value
					.split(options.delimiter.value)
					.map((value) => {
						return value
							.split('=')
							.map(decodeURIComponent);
					})
					.map(([keyPath, value]) => [
						options.keyCasing ? keyPath
							.split(options.delimiter.key)
							.map((key) => caseit(key, options.keyCasing))
							.join(options.delimiter.key) : keyPath,
						value])), {
				separator: options.delimiter.key
			}));

	if (result.length > 1 || options.autoWrap === true) {
		return result;
	}

	return result[0];

};

const encode = (array, options = {}) => {

	if (!Array.isArray(array)) {
		return encode([array], options);
	}

	options = defaultOptions(options, {
		keyCasing: undefined,
		undefinedValues: 'strip'
	});

	return array
		.map((item) => Object.entries(
			keyd.collapse(item, {
				separator: options.delimiter.key
			}))
			.filter(([, value]) => options.undefinedValues === 'keep' || typeof value !== 'undefined')
			.map(([keyPath, value]) => [
				encodeURIComponent(
					options.keyCasing ? keyPath
						.split(options.delimiter.key)
						.map((key) => caseit(key, options.keyCasing))
						.join(options.delimiter.key) : keyPath),
				typeof value !== 'undefined' ? encodeURIComponent(value) : undefined
			].filter((value) => value).join('='))
			.join(options.delimiter.value))
		.join(options.delimiter.item);

};

export {
	encode,
	decode
};

export default {
	encode,
	decode
};

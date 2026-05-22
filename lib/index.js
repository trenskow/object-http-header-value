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

	if (typeof options.deliminator === 'string') {
		options.deliminator = {
			value: options.deliminator
		};
	}

	return merge({
		deliminator: {
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
		deliminator: {
			value: /;\s?/,
			item: /,\s?/,
			key: '.'
		},
		autoWrap: false
	});

	const result = value
		.split(options.deliminator.item)
		.filter((value) => value)
		.map((value) => keyd.expand(
			Object.fromEntries(
				value
					.split(options.deliminator.value)
					.map((value) => {
						return value
							.split('=')
							.map(decodeURIComponent);
					})
					.map(([keyPath, value]) => [
						options.keyCasing ? keyPath
							.split(options.deliminator.key)
							.map((key) => caseit(key, options.keyCasing))
							.join(options.deliminator.key) : keyPath,
						value])), {
				separator: options.deliminator.key
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
		keyCasing: undefined
	});

	return array
		.map((item) => Object.entries(
			keyd.collapse(item, {
				separator: options.deliminator.key
			}))
			.map(([keyPath, value]) => [
				encodeURIComponent(
					options.keyCasing ? keyPath
						.split(options.deliminator.key)
						.map((key) => caseit(key, options.keyCasing))
						.join(options.deliminator.key) : keyPath),
				encodeURIComponent(value)
			].filter((value) => value).join('='))
			.join(options.deliminator.value))
		.join(options.deliminator.item);

};

export {
	encode,
	decode
};

export default {
	encode,
	decode
};

//
// index.js
// @trenskow/object-http-header-value
//
// Created by Kristian Trenskow on 2026/05/21
// See license in LICENSE.
//

import caseit from '@trenskow/caseit';
import merge from '@trenskow/merge';

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
			item: ', '
		}
	}, options);

};

const decode = (value, options = {}) => {

	if (typeof value !== 'string') {
		throw new Error('Input must be a string.');
	}

	options = defaultOptions(options, {
		keyCasing: 'camel',
		deliminator: {
			value: /;\s?/,
			item: /,\s?/
		},
		autoWrap: false
	});

	const result = value
		.split(options.deliminator.item)
		.map((value) => Object.fromEntries(
			value
				.split(options.deliminator.value)
				.map((value) => {
					return value
						.split('=')
						.map(decodeURIComponent);
				})
				.map(([key, value]) => [caseit(key, options.keyCasing), value])));

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
		keyCasing: 'http'
	});

	return array
		.map((item) => Object.entries(item)
			.map(([key, value]) => [
				encodeURIComponent(caseit(key, options.keyCasing)),
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

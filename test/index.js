//
// index.js
// @trenskow/object-http-header-value
//
// Created by Kristian Trenskow on 2026/05/21
// See license in LICENSE.
//

import { expect } from 'chai';

import { decode, encode } from '../index.js';

describe('@trenskow/object-http-header-value', () => {

	describe('decode', () => {

		it('must come back with decoded array value.', () => {
			expect(decode('First-Value=first, Second-Value=second; First-Value=second, Second-Value=first'))
				.to.eql([{
					firstValue: 'first',
					secondValue: 'second'
				}, {
					firstValue: 'second',
					secondValue: 'first'
				}]);
		});

		it('must come back with decoded object.', () => {
			expect(decode('First-Value=first, Second-Value=second'))
				.to.eql({
					firstValue: 'first',
					secondValue: 'second'
				});
		});

		it('must come back with decoded array when options are different', () => {
			expect(decode('first_value=first?second_value=second|first_value=second?second_value=first', {
				keyCasing: 'snake',
				deliminator: {
					value: '?',
					item: '|'
				}
			})).to.eql([{
				first_value: 'first',
				second_value: 'second'
			}, {
				first_value: 'second',
				second_value: 'first'
			}]);
		});

	});

	describe('encode', () => {

		it('must come back with correctly encoded format for array.', () => {
			expect(encode([{
				firstValue: 'first',
				secondValue: 'second'
			}, {
				firstValue: 'second',
				secondValue: 'first'
			}])).to.equal('First-Value=first, Second-Value=second; First-Value=second, Second-Value=first');
		});

		it('must come back with correctly encoded format for object.', () => {
			expect(encode({
				firstValue: 'first',
				secondValue: 'second'
			})).to.equal('First-Value=first, Second-Value=second');
		});

		it ('must come back with correct encoding when options are different.', () => {
			expect(encode([{
				firstValue: 'first',
				secondValue: 'second'
			}, {
				firstValue: 'second',
				secondValue: 'first'
			}], {
				keyCasing: 'snake',
				deliminator: {
					value: '?',
					item: '|'
				}
			})).to.equal('first_value=first?second_value=second|first_value=second?second_value=first');
		});

	});

});

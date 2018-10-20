import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/calc';

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		sourceType: 'module'
	}
});

ruleTester.run('arithmetic/calc', rule, {
	valid: [
		'const a = 123',
		'const a = 123; const b = a + 2',
		'const a = "123" + 2',
		'const a = 2 << 1',
		'const a = Math.pow(2, 2)',
		'const b = 2 / 0'
	],
	invalid: [
		{
			code: 'const a = 1 + 1;',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: '1 + 1 can be calculated.'
				}
			],
			output: 'const a = 2;'
		},
		{
			code: 'const a = 100 - 1;',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: '100 - 1 can be calculated.'
				}
			],
			output: 'const a = 99;'
		},
		{
			code: 'const a = 10 + 2 / 6;',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: '2 / 6 can be calculated.'
				}
			],
			output: 'const a = 10 + 0.3333333333333333;'
		},
		{
			code: 'const a = Math.floor(2.4);',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: 'Math.floor(2.4) can be calculated.'
				}
			],
			output: 'const a = 2;'
		},
		{
			code: 'const a = Math.ceil(2.4);',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: 'Math.ceil(2.4) can be calculated.'
				}
			],
			output: 'const a = 3;'
		},
		{
			code: 'const a = Math.round(2.4);',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: 'Math.round(2.4) can be calculated.'
				}
			],
			output: 'const a = 2;'
		},
		{
			code: 'const z = 1.3 | 0;',
			errors: [
				{
					ruleId: 'arithmetic/calc',
					message: '1.3 | 0 can be calculated'
				}
			],
			output: 'const z = 1;'
		}
	]
});

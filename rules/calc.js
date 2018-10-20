const create = context => {
	function arithmeticFix(node) {
		const {left, right, operator} = node;
		const supportedOperators = ['+', '-', '*', '/', '%', '|'];
		if (
			typeof left.value === 'number' &&
			typeof right.value === 'number' &&
			supportedOperators.includes(operator)
		) {
			if (right.value === 0 && operator === '/') {
				return;
			}
			context.report({
				node,
				message: `${left.value} ${operator} ${right.value} can be calculated.`,
				fix: fixer => {
					if (operator === '+') {
						return fixer.replaceText(node, String(left.value + right.value));
					}
					if (operator === '-') {
						return fixer.replaceText(node, String(left.value - right.value));
					}
					if (operator === '/') {
						return fixer.replaceText(node, String(left.value / right.value));
					}
					if (operator === '*') {
						return fixer.replaceText(node, String(left.value * right.value));
					}
					if (operator === '%') {
						return fixer.replaceText(node, String(left.value % right.value));
					}
					if (operator === '|') {
						return fixer.replaceText(node, String(left.value | right.value));
					}
					return;
				}
			});
		}
	}

	function fnFix(node) {
		const {callee} = node;
		const fixable = ['floor', 'ceil', 'round'];
		if (
			callee.object &&
			callee.property &&
			callee.object.name === 'Math' &&
			fixable.includes(callee.property.name)
		) {
			if (
				node.arguments &&
				node.arguments.length > 0 &&
				typeof node.arguments[0].value === 'number'
			) {
				context.report({
					node,
					message: `Math.${callee.property.name}(${
						node.arguments[0].value
					}) can be calculated.`,
					fix: fixer => {
						if (callee.property.name === 'floor') {
							return fixer.replaceText(
								node,
								String(Math.floor(node.arguments[0].value))
							);
						}
						if (callee.property.name === 'ceil') {
							return fixer.replaceText(
								node,
								String(Math.ceil(node.arguments[0].value))
							);
						}
						if (callee.property.name === 'round') {
							return fixer.replaceText(
								node,
								String(Math.round(node.arguments[0].value))
							);
						}
						return;
					}
				});
			}
			return;
		}
	}

	return {
		BinaryExpression: arithmeticFix,
		CallExpression: fnFix
	};
};

module.exports = {
	create,
	meta: {
		fixable: 'code'
	}
};

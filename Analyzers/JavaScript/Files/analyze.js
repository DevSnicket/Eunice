const
	addFromCall = require("./analyze/addFromCall"),
	addFunctionExpression = require("./analyze/addFunctionExpression"),
	addVariables = require("./analyze/addVariables"),
	createDeclarations = require("./analyze/createDeclarations"),
	createDependsUpons = require("./analyze/createDependsUpons"),
	createFileItems = require("./analyze/createFileItems"),
	createUndeclaredVariableReferences = require("./analyze/createUndeclaredVariableReferences");

module.exports =
	({ file, walk }) => {
		const
			declarations = createDeclarations(),
			dependsUpons = createDependsUpons();

		walk(
			file,
			createVisitors({
				declarations,
				dependsUpons,
			})
		);

		const items =
			createFileItems({
				declarations,
				dependsUpons,
			});

		/* istanbul ignore next: error is only thrown when there is gap in the implementation */
		if (declarations.any())
			throw new Error("Unhandled declarations.");
		/* istanbul ignore next: error is only thrown when there is gap in the implementation */
		else if (dependsUpons.any())
			throw new Error("Unhandled dependencies.");
		else
			return items;
	};

function createVisitors({
	declarations,
	dependsUpons,
}) {
	const undeclaredVariableReferences = createUndeclaredVariableReferences();

	return (
		{
			ArrowFunctionExpression:
				visitFunctionExpression,
			CallExpression:
				visitCallExpression,
			FunctionDeclaration:
				visitFunctionDeclaration,
			FunctionExpression:
				visitFunctionExpression,
			VariableDeclaration:
				visitVariableDeclaration,
		}
	);

	function visitFunctionExpression(
		functionExpression,
		ancestors
	) {
		addFunctionExpression({
			addDeclarationIn:
				declarations.addDeclarationIn,
			ancestors,
			createFunctionDeclaration,
			findParentFunctionFromAncestors,
			functionExpression,
		});
	}

	function visitCallExpression(
		callExpression,
		ancestors
	) {
		addFromCall({
			addDependsUponIdentifierFrom:
				dependsUpons.addIdentifierFrom,
			addUndeclaredVariableNameReference:
				variableName =>
					undeclaredVariableReferences.addAncestorsFor({
						ancestors,
						variableName,
					}),
			callExpression,
			findDeclarationAndParent:
				declarations.findDeclarationAndParent,
			findParentFunction:
				() => findParentFunctionFromAncestors(ancestors),
		});
	}

	function visitFunctionDeclaration(
		functionDeclaration,
		ancestors
	) {
		declarations.addDeclarationIn({
			declaration:
				createFunctionDeclaration({
					identifier:
						functionDeclaration.id.name,
					node:
						functionDeclaration,
				}),
			parent:
				findParentFunctionFromAncestors(ancestors),
		});
	}

	function createFunctionDeclaration({
		identifier,
		node,
	}) {
		const items =
			declarations.createItemsFor(node);

		return (
			{
				id: identifier,
				isFunction: true,
				...dependsUpons.createPropertyFor(node),
				...items && { items },
			}
		);
	}

	function visitVariableDeclaration(
		variableDeclaration,
		ancestors
	) {
		addVariables({
			addDeclarationsIn:
				declarations.addDeclarationsIn,
			isFunctionType,
			isVariableReferencedBy:
				undeclaredVariableReferences.hasReferenceTo,
			parent:
				findParentFunctionFromAncestors(ancestors),
			variableDeclaration,
		});
	}
}

function findParentFunctionFromAncestors(
	ancestors
) {
	for (let index = ancestors.length - 2; index; index--) {
		const ancestor = ancestors[index];

		if (isFunctionType(ancestor.type) && !ancestor.expression)
			return ancestor;
	}

	return null;
}

function isFunctionType(
	type
) {
	return (
		type === "ArrowFunctionExpression"
		||
		type === "FunctionDeclaration"
		||
		type === "FunctionExpression"
	);
}
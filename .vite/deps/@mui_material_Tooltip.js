import { n as __commonJSMin, o as __toESM, t as require_react } from "./react-Dc_4GEhg.js";
import { t as require_react_dom } from "./react-dom-gzy-90ZU.js";
import { a as memoize, i as init_emotion_memoize_esm, n as init_emotion_is_prop_valid_esm, o as require_jsx_runtime, r as isPropValid } from "./emotion-is-prop-valid.esm-BWxFxQl5.js";
//#region node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js
/** @license React v16.13.1
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_development$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		"use strict";
		var hasSymbol = typeof Symbol === "function" && Symbol.for;
		var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
		var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
		var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
		var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
		var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
		var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
		var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
		var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
		var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
		var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
		var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
		var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
		var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
		var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
		var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
		var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
		var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
		var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
		function isValidElementType(type) {
			return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
		}
		function typeOf(object) {
			if (typeof object === "object" && object !== null) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = object.type;
						switch (type) {
							case REACT_ASYNC_MODE_TYPE:
							case REACT_CONCURRENT_MODE_TYPE:
							case REACT_FRAGMENT_TYPE:
							case REACT_PROFILER_TYPE:
							case REACT_STRICT_MODE_TYPE:
							case REACT_SUSPENSE_TYPE: return type;
							default:
								var $$typeofType = type && type.$$typeof;
								switch ($$typeofType) {
									case REACT_CONTEXT_TYPE:
									case REACT_FORWARD_REF_TYPE:
									case REACT_LAZY_TYPE:
									case REACT_MEMO_TYPE:
									case REACT_PROVIDER_TYPE: return $$typeofType;
									default: return $$typeof;
								}
						}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var AsyncMode = REACT_ASYNC_MODE_TYPE;
		var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
		var ContextConsumer = REACT_CONTEXT_TYPE;
		var ContextProvider = REACT_PROVIDER_TYPE;
		var Element = REACT_ELEMENT_TYPE;
		var ForwardRef = REACT_FORWARD_REF_TYPE;
		var Fragment = REACT_FRAGMENT_TYPE;
		var Lazy = REACT_LAZY_TYPE;
		var Memo = REACT_MEMO_TYPE;
		var Portal = REACT_PORTAL_TYPE;
		var Profiler = REACT_PROFILER_TYPE;
		var StrictMode = REACT_STRICT_MODE_TYPE;
		var Suspense = REACT_SUSPENSE_TYPE;
		var hasWarnedAboutDeprecatedIsAsyncMode = false;
		function isAsyncMode(object) {
			if (!hasWarnedAboutDeprecatedIsAsyncMode) {
				hasWarnedAboutDeprecatedIsAsyncMode = true;
				console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
			}
			return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
		}
		function isConcurrentMode(object) {
			return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
		}
		function isContextConsumer(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		}
		function isContextProvider(object) {
			return typeOf(object) === REACT_PROVIDER_TYPE;
		}
		function isElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function isForwardRef(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		}
		function isFragment(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		}
		function isLazy(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		}
		function isMemo(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		}
		function isPortal(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		}
		function isProfiler(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		}
		function isStrictMode(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		}
		function isSuspense(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		}
		exports.AsyncMode = AsyncMode;
		exports.ConcurrentMode = ConcurrentMode;
		exports.ContextConsumer = ContextConsumer;
		exports.ContextProvider = ContextProvider;
		exports.Element = Element;
		exports.ForwardRef = ForwardRef;
		exports.Fragment = Fragment;
		exports.Lazy = Lazy;
		exports.Memo = Memo;
		exports.Portal = Portal;
		exports.Profiler = Profiler;
		exports.StrictMode = StrictMode;
		exports.Suspense = Suspense;
		exports.isAsyncMode = isAsyncMode;
		exports.isConcurrentMode = isConcurrentMode;
		exports.isContextConsumer = isContextConsumer;
		exports.isContextProvider = isContextProvider;
		exports.isElement = isElement;
		exports.isForwardRef = isForwardRef;
		exports.isFragment = isFragment;
		exports.isLazy = isLazy;
		exports.isMemo = isMemo;
		exports.isPortal = isPortal;
		exports.isProfiler = isProfiler;
		exports.isStrictMode = isStrictMode;
		exports.isSuspense = isSuspense;
		exports.isValidElementType = isValidElementType;
		exports.typeOf = typeOf;
	})();
}));
//#endregion
//#region node_modules/prop-types/node_modules/react-is/index.js
var require_react_is$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_development$2();
}));
//#endregion
//#region node_modules/object-assign/index.js
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var require_object_assign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
		if (val === null || val === void 0) throw new TypeError("Object.assign cannot be called with null or undefined");
		return Object(val);
	}
	function shouldUseNative() {
		try {
			if (!Object.assign) return false;
			var test1 = /* @__PURE__ */ new String("abc");
			test1[5] = "de";
			if (Object.getOwnPropertyNames(test1)[0] === "5") return false;
			var test2 = {};
			for (var i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
			if (Object.getOwnPropertyNames(test2).map(function(n) {
				return test2[n];
			}).join("") !== "0123456789") return false;
			var test3 = {};
			"abcdefghijklmnopqrst".split("").forEach(function(letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") return false;
			return true;
		} catch (err) {
			return false;
		}
	}
	module.exports = shouldUseNative() ? Object.assign : function(target, source) {
		var from;
		var to = toObject(target);
		var symbols;
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
			for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) if (propIsEnumerable.call(from, symbols[i])) to[symbols[i]] = from[symbols[i]];
			}
		}
		return to;
	};
}));
//#endregion
//#region node_modules/prop-types/lib/ReactPropTypesSecret.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_ReactPropTypesSecret = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
}));
//#endregion
//#region node_modules/prop-types/lib/has.js
var require_has = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
}));
//#endregion
//#region node_modules/prop-types/checkPropTypes.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_checkPropTypes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var printWarning = function() {};
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	var loggedTypeFailures = {};
	var has = require_has();
	printWarning = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	/**
	* Assert that the values match with the type specs.
	* Error messages are memorized and will only be shown once.
	*
	* @param {object} typeSpecs Map of name to a ReactPropType
	* @param {object} values Runtime values that need to be type-checked
	* @param {string} location e.g. "prop", "context", "child context"
	* @param {string} componentName Name of the component for error messages.
	* @param {?Function} getStack Returns the component stack.
	* @private
	*/
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
		for (var typeSpecName in typeSpecs) if (has(typeSpecs, typeSpecName)) {
			var error;
			try {
				if (typeof typeSpecs[typeSpecName] !== "function") {
					var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
					err.name = "Invariant Violation";
					throw err;
				}
				error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
			} catch (ex) {
				error = ex;
			}
			if (error && !(error instanceof Error)) printWarning((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).");
			if (error instanceof Error && !(error.message in loggedTypeFailures)) {
				loggedTypeFailures[error.message] = true;
				var stack = getStack ? getStack() : "";
				printWarning("Failed " + location + " type: " + error.message + (stack != null ? stack : ""));
			}
		}
	}
	/**
	* Resets warning cache when testing.
	*
	* @private
	*/
	checkPropTypes.resetWarningCache = function() {
		loggedTypeFailures = {};
	};
	module.exports = checkPropTypes;
}));
//#endregion
//#region node_modules/prop-types/factoryWithTypeCheckers.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_factoryWithTypeCheckers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ReactIs = require_react_is$2();
	var assign = require_object_assign();
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	var has = require_has();
	var checkPropTypes = require_checkPropTypes();
	var printWarning = function() {};
	printWarning = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	function emptyFunctionThatReturnsNull() {
		return null;
	}
	module.exports = function(isValidElement, throwOnDirectAccess) {
		var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
		var FAUX_ITERATOR_SYMBOL = "@@iterator";
		/**
		* Returns the iterator method function contained on the iterable object.
		*
		* Be sure to invoke the function with the iterable as context:
		*
		*     var iteratorFn = getIteratorFn(myIterable);
		*     if (iteratorFn) {
		*       var iterator = iteratorFn.call(myIterable);
		*       ...
		*     }
		*
		* @param {?object} maybeIterable
		* @return {?function}
		*/
		function getIteratorFn(maybeIterable) {
			var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
			if (typeof iteratorFn === "function") return iteratorFn;
		}
		/**
		* Collection of methods that allow declaration and validation of props that are
		* supplied to React components. Example usage:
		*
		*   var Props = require('ReactPropTypes');
		*   var MyArticle = React.createClass({
		*     propTypes: {
		*       // An optional string prop named "description".
		*       description: Props.string,
		*
		*       // A required enum prop named "category".
		*       category: Props.oneOf(['News','Photos']).isRequired,
		*
		*       // A prop named "dialog" that requires an instance of Dialog.
		*       dialog: Props.instanceOf(Dialog).isRequired
		*     },
		*     render: function() { ... }
		*   });
		*
		* A more formal specification of how these methods are used:
		*
		*   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
		*   decl := ReactPropTypes.{type}(.isRequired)?
		*
		* Each and every declaration produces a function with the same signature. This
		* allows the creation of custom validation functions. For example:
		*
		*  var MyLink = React.createClass({
		*    propTypes: {
		*      // An optional string or URI prop named "href".
		*      href: function(props, propName, componentName) {
		*        var propValue = props[propName];
		*        if (propValue != null && typeof propValue !== 'string' &&
		*            !(propValue instanceof URI)) {
		*          return new Error(
		*            'Expected a string or an URI for ' + propName + ' in ' +
		*            componentName
		*          );
		*        }
		*      }
		*    },
		*    render: function() {...}
		*  });
		*
		* @internal
		*/
		var ANONYMOUS = "<<anonymous>>";
		var ReactPropTypes = {
			array: createPrimitiveTypeChecker("array"),
			bigint: createPrimitiveTypeChecker("bigint"),
			bool: createPrimitiveTypeChecker("boolean"),
			func: createPrimitiveTypeChecker("function"),
			number: createPrimitiveTypeChecker("number"),
			object: createPrimitiveTypeChecker("object"),
			string: createPrimitiveTypeChecker("string"),
			symbol: createPrimitiveTypeChecker("symbol"),
			any: createAnyTypeChecker(),
			arrayOf: createArrayOfTypeChecker,
			element: createElementTypeChecker(),
			elementType: createElementTypeTypeChecker(),
			instanceOf: createInstanceTypeChecker,
			node: createNodeChecker(),
			objectOf: createObjectOfTypeChecker,
			oneOf: createEnumTypeChecker,
			oneOfType: createUnionTypeChecker,
			shape: createShapeTypeChecker,
			exact: createStrictShapeTypeChecker
		};
		/**
		* inlined Object.is polyfill to avoid requiring consumers ship their own
		* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
		*/
		function is(x, y) {
			if (x === y) return x !== 0 || 1 / x === 1 / y;
			else return x !== x && y !== y;
		}
		/**
		* We use an Error-like object for backward compatibility as people may call
		* PropTypes directly and inspect their output. However, we don't use real
		* Errors anymore. We don't inspect their stack anyway, and creating them
		* is prohibitively expensive if they are created too often, such as what
		* happens in oneOfType() for any type before the one that matched.
		*/
		function PropTypeError(message, data) {
			this.message = message;
			this.data = data && typeof data === "object" ? data : {};
			this.stack = "";
		}
		PropTypeError.prototype = Error.prototype;
		function createChainableTypeChecker(validate) {
			var manualPropTypeCallCache = {};
			var manualPropTypeWarningCount = 0;
			function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
				componentName = componentName || ANONYMOUS;
				propFullName = propFullName || propName;
				if (secret !== ReactPropTypesSecret) {
					if (throwOnDirectAccess) {
						var err = /* @__PURE__ */ new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
						err.name = "Invariant Violation";
						throw err;
					} else if (typeof console !== "undefined") {
						var cacheKey = componentName + ":" + propName;
						if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
							printWarning("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.");
							manualPropTypeCallCache[cacheKey] = true;
							manualPropTypeWarningCount++;
						}
					}
				}
				if (props[propName] == null) {
					if (isRequired) {
						if (props[propName] === null) return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
						return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
					}
					return null;
				} else return validate(props, propName, componentName, location, propFullName);
			}
			var chainedCheckType = checkType.bind(null, false);
			chainedCheckType.isRequired = checkType.bind(null, true);
			return chainedCheckType;
		}
		function createPrimitiveTypeChecker(expectedType) {
			function validate(props, propName, componentName, location, propFullName, secret) {
				var propValue = props[propName];
				if (getPropType(propValue) !== expectedType) {
					var preciseType = getPreciseType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."), { expectedType });
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createAnyTypeChecker() {
			return createChainableTypeChecker(emptyFunctionThatReturnsNull);
		}
		function createArrayOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
				var propValue = props[propName];
				if (!Array.isArray(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
				}
				for (var i = 0; i < propValue.length; i++) {
					var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!isValidElement(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!ReactIs.isValidElementType(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createInstanceTypeChecker(expectedClass) {
			function validate(props, propName, componentName, location, propFullName) {
				if (!(props[propName] instanceof expectedClass)) {
					var expectedClassName = expectedClass.name || ANONYMOUS;
					var actualClassName = getClassName(props[propName]);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createEnumTypeChecker(expectedValues) {
			if (!Array.isArray(expectedValues)) {
				if (arguments.length > 1) printWarning("Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).");
				else printWarning("Invalid argument supplied to oneOf, expected an array.");
				return emptyFunctionThatReturnsNull;
			}
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				for (var i = 0; i < expectedValues.length; i++) if (is(propValue, expectedValues[i])) return null;
				var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
					if (getPreciseType(value) === "symbol") return String(value);
					return value;
				});
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createObjectOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
				for (var key in propValue) if (has(propValue, key)) {
					var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createUnionTypeChecker(arrayOfTypeCheckers) {
			if (!Array.isArray(arrayOfTypeCheckers)) {
				printWarning("Invalid argument supplied to oneOfType, expected an instance of array.");
				return emptyFunctionThatReturnsNull;
			}
			for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
				var checker = arrayOfTypeCheckers[i];
				if (typeof checker !== "function") {
					printWarning("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + ".");
					return emptyFunctionThatReturnsNull;
				}
			}
			function validate(props, propName, componentName, location, propFullName) {
				var expectedTypes = [];
				for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
					var checker = arrayOfTypeCheckers[i];
					var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
					if (checkerResult == null) return null;
					if (checkerResult.data && has(checkerResult.data, "expectedType")) expectedTypes.push(checkerResult.data.expectedType);
				}
				var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createNodeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				if (!isNode(props[propName])) return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function invalidValidatorError(componentName, location, propFullName, key, type) {
			return new PropTypeError((componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`.");
		}
		function createShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in shapeTypes) {
					var checker = shapeTypes[key];
					if (typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createStrictShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in assign({}, props[propName], shapeTypes)) {
					var checker = shapeTypes[key];
					if (has(shapeTypes, key) && typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					if (!checker) return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function isNode(propValue) {
			switch (typeof propValue) {
				case "number":
				case "string":
				case "undefined": return true;
				case "boolean": return !propValue;
				case "object":
					if (Array.isArray(propValue)) return propValue.every(isNode);
					if (propValue === null || isValidElement(propValue)) return true;
					var iteratorFn = getIteratorFn(propValue);
					if (iteratorFn) {
						var iterator = iteratorFn.call(propValue);
						var step;
						if (iteratorFn !== propValue.entries) {
							while (!(step = iterator.next()).done) if (!isNode(step.value)) return false;
						} else while (!(step = iterator.next()).done) {
							var entry = step.value;
							if (entry) {
								if (!isNode(entry[1])) return false;
							}
						}
					} else return false;
					return true;
				default: return false;
			}
		}
		function isSymbol(propType, propValue) {
			if (propType === "symbol") return true;
			if (!propValue) return false;
			if (propValue["@@toStringTag"] === "Symbol") return true;
			if (typeof Symbol === "function" && propValue instanceof Symbol) return true;
			return false;
		}
		function getPropType(propValue) {
			var propType = typeof propValue;
			if (Array.isArray(propValue)) return "array";
			if (propValue instanceof RegExp) return "object";
			if (isSymbol(propType, propValue)) return "symbol";
			return propType;
		}
		function getPreciseType(propValue) {
			if (typeof propValue === "undefined" || propValue === null) return "" + propValue;
			var propType = getPropType(propValue);
			if (propType === "object") {
				if (propValue instanceof Date) return "date";
				else if (propValue instanceof RegExp) return "regexp";
			}
			return propType;
		}
		function getPostfixForTypeWarning(value) {
			var type = getPreciseType(value);
			switch (type) {
				case "array":
				case "object": return "an " + type;
				case "boolean":
				case "date":
				case "regexp": return "a " + type;
				default: return type;
			}
		}
		function getClassName(propValue) {
			if (!propValue.constructor || !propValue.constructor.name) return ANONYMOUS;
			return propValue.constructor.name;
		}
		ReactPropTypes.checkPropTypes = checkPropTypes;
		ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
		ReactPropTypes.PropTypes = ReactPropTypes;
		return ReactPropTypes;
	};
}));
//#endregion
//#region node_modules/prop-types/index.js
var require_prop_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ReactIs = require_react_is$2();
	module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, true);
}));
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/@mui/utils/useLazyRef/useLazyRef.mjs
var UNINITIALIZED = {};
/**
* A React.useRef() that is initialized lazily with a function. Note that it accepts an optional
* initialization argument, so the initialization function doesn't need to be an inline closure.
*
* @usage
*   const ref = useLazyRef(sortColumns, columns)
*/
function useLazyRef(init, initArg) {
	const ref = import_react.useRef(UNINITIALIZED);
	if (ref.current === UNINITIALIZED) ref.current = init(initArg);
	return ref;
}
//#endregion
//#region node_modules/@mui/utils/useOnMount/useOnMount.mjs
var EMPTY = [];
/**
* A React.useEffect equivalent that runs once, when the component is mounted.
*/
function useOnMount(fn) {
	import_react.useEffect(fn, EMPTY);
}
//#endregion
//#region node_modules/@mui/utils/useTimeout/useTimeout.mjs
var Timeout = class Timeout {
	static create() {
		return new Timeout();
	}
	currentId = null;
	/**
	* Executes `fn` after `delay`, clearing any previously scheduled call.
	*/
	start(delay, fn) {
		this.clear();
		this.currentId = setTimeout(() => {
			this.currentId = null;
			fn();
		}, delay);
	}
	clear = () => {
		if (this.currentId !== null) {
			clearTimeout(this.currentId);
			this.currentId = null;
		}
	};
	disposeEffect = () => {
		return this.clear;
	};
};
function useTimeout() {
	const timeout = useLazyRef(Timeout.create).current;
	useOnMount(timeout.disposeEffect);
	return timeout;
}
//#endregion
//#region node_modules/@mui/utils/chainPropTypes/chainPropTypes.mjs
function chainPropTypes(propType1, propType2) {
	return function validate(...args) {
		return propType1(...args) || propType2(...args);
	};
}
//#endregion
//#region node_modules/@mui/utils/elementAcceptingRef/elementAcceptingRef.mjs
function isClassComponent(elementType) {
	const { prototype = {} } = elementType;
	return Boolean(prototype.isReactComponent);
}
function acceptingRef(props, propName, componentName, location, propFullName) {
	const element = props[propName];
	const safePropName = propFullName || propName;
	if (element == null || typeof window === "undefined") return null;
	let warningHint;
	const elementType = element.type;
	/**
	* Blacklisting instead of whitelisting
	*
	* Blacklisting will miss some components, such as React.Fragment. Those will at least
	* trigger a warning in React.
	* We can't whitelist because there is no safe way to detect React.forwardRef
	* or class components. "Safe" means there's no public API.
	*
	*/
	if (typeof elementType === "function" && !isClassComponent(elementType)) warningHint = "Did you accidentally use a plain function component for an element instead?";
	if (warningHint !== void 0) return /* @__PURE__ */ new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`);
	return null;
}
var elementAcceptingRef = chainPropTypes(import_prop_types.default.element, acceptingRef);
elementAcceptingRef.isRequired = chainPropTypes(import_prop_types.default.element.isRequired, acceptingRef);
//#endregion
//#region node_modules/@mui/utils/composeClasses/composeClasses.mjs
/**
* Compose classes from multiple sources.
*
* @example
* ```tsx
* const slots = {
*  root: ['root', 'primary'],
*  label: ['label'],
* };
*
* const getUtilityClass = (slot) => `MuiButton-${slot}`;
*
* const classes = {
*   root: 'my-root-class',
* };
*
* const output = composeClasses(slots, getUtilityClass, classes);
* // {
* //   root: 'MuiButton-root MuiButton-primary my-root-class',
* //   label: 'MuiButton-label',
* // }
* ```
*
* @param slots a list of classes for each possible slot
* @param getUtilityClass a function to resolve the class based on the slot name
* @param classes the input classes from props
* @returns the resolved classes for all slots
*/
function composeClasses(slots, getUtilityClass, classes = void 0) {
	const output = {};
	for (const slotName in slots) {
		const slot = slots[slotName];
		let buffer = "";
		let start = true;
		for (let i = 0; i < slot.length; i += 1) {
			const value = slot[i];
			if (value) {
				buffer += (start === true ? "" : " ") + getUtilityClass(value);
				start = false;
				if (classes && classes[value]) buffer += " " + classes[value];
			}
		}
		output[slotName] = buffer;
	}
	return output;
}
//#endregion
//#region node_modules/@mui/utils/isFocusVisible/isFocusVisible.mjs
/**
* Returns a boolean indicating if the event's target has :focus-visible
*/
function isFocusVisible(element) {
	try {
		return element.matches(":focus-visible");
	} catch (error) {
		if (!window.navigator.userAgent.includes("jsdom")) console.warn(["MUI: The `:focus-visible` pseudo class is not supported in this browser.", "Some components rely on this feature to work properly."].join("\n"));
	}
	return false;
}
//#endregion
//#region node_modules/@mui/utils/getReactElementRef/getReactElementRef.mjs
/**
* Returns the ref of a React element handling differences between React 19 and older versions.
* It will throw runtime error if the element is not a valid React element.
*
* @param element React.ReactElement
* @returns React.Ref<any> | null
*/
function getReactElementRef(element) {
	if (parseInt("19.2.7", 10) >= 19) return element?.props?.ref || null;
	return element?.ref || null;
}
//#endregion
//#region node_modules/@mui/utils/fastDeepAssign/fastDeepAssign.mjs
/**
* Assigns props from one object to another. Focused on performance, only normal objects with no
* prototype are supported.
*/
function fastDeepAssign(target, source) {
	const sourceIsArray = Array.isArray(source);
	const targetIsArray = Array.isArray(target);
	if (isPrimitive(source)) return source;
	else if (isPrimitiveOrBuiltIn(target)) return clone(source);
	else if (sourceIsArray && targetIsArray) return mergeArray(target, source);
	else if (sourceIsArray !== targetIsArray) return clone(source);
	else return mergeObject(target, source);
}
function cloneArray(value) {
	let i = 0;
	const il = value.length;
	const result = new Array(il);
	for (i = 0; i < il; i += 1) result[i] = clone(value[i]);
	return result;
}
function cloneObject(target) {
	const result = {};
	for (const key in target) {
		if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
		result[key] = clone(target[key]);
	}
	return result;
}
function mergeArray(target, source) {
	const tl = target.length;
	for (let i = 0; i < source.length; i += 1) target[tl + i] = clone(source[i]);
	return target;
}
function isMergeableObject(value) {
	return typeof value === "object" && value !== null && !(value instanceof RegExp) && !(value instanceof Date);
}
function isPrimitive(value) {
	return typeof value !== "object" || value === null;
}
function isPrimitiveOrBuiltIn(value) {
	return typeof value !== "object" || value === null || value instanceof RegExp || value instanceof Date;
}
function clone(entry) {
	return isMergeableObject(entry) ? Array.isArray(entry) ? cloneArray(entry) : cloneObject(entry) : entry;
}
function mergeObject(target, source) {
	for (const key in source) {
		if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
		if (key in target) target[key] = fastDeepAssign(target[key], source[key]);
		else target[key] = clone(source[key]);
	}
	return target;
}
//#endregion
//#region node_modules/@mui/utils/capitalize/capitalize.mjs
function capitalize(string) {
	if (typeof string !== "string") throw new Error("MUI: `capitalize(string)` expects a string argument.");
	return string.charAt(0).toUpperCase() + string.slice(1);
}
//#endregion
//#region node_modules/@mui/system/responsivePropType/responsivePropType.mjs
var responsivePropType = import_prop_types.default.oneOfType([
	import_prop_types.default.number,
	import_prop_types.default.string,
	import_prop_types.default.object,
	import_prop_types.default.array
]);
//#endregion
//#region node_modules/@mui/utils/isObjectEmpty/isObjectEmpty.mjs
function isObjectEmpty$1(object) {
	if (object == null) return true;
	for (const _ in object) return false;
	return true;
}
//#endregion
//#region node_modules/react-is/cjs/react-is.development.js
/**
* @license React
* react-is.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_development$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function typeOf(object) {
			if ("object" === typeof object && null !== object) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE: switch (object = object.type, object) {
						case REACT_FRAGMENT_TYPE:
						case REACT_PROFILER_TYPE:
						case REACT_STRICT_MODE_TYPE:
						case REACT_SUSPENSE_TYPE:
						case REACT_SUSPENSE_LIST_TYPE:
						case REACT_VIEW_TRANSITION_TYPE: return object;
						default: switch (object = object && object.$$typeof, object) {
							case REACT_CONTEXT_TYPE:
							case REACT_FORWARD_REF_TYPE:
							case REACT_LAZY_TYPE:
							case REACT_MEMO_TYPE: return object;
							case REACT_CONSUMER_TYPE: return object;
							default: return $$typeof;
						}
					}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
		exports.ContextConsumer = REACT_CONSUMER_TYPE;
		exports.ContextProvider = REACT_CONTEXT_TYPE;
		exports.Element = REACT_ELEMENT_TYPE;
		exports.ForwardRef = REACT_FORWARD_REF_TYPE;
		exports.Fragment = REACT_FRAGMENT_TYPE;
		exports.Lazy = REACT_LAZY_TYPE;
		exports.Memo = REACT_MEMO_TYPE;
		exports.Portal = REACT_PORTAL_TYPE;
		exports.Profiler = REACT_PROFILER_TYPE;
		exports.StrictMode = REACT_STRICT_MODE_TYPE;
		exports.Suspense = REACT_SUSPENSE_TYPE;
		exports.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
		exports.isContextConsumer = function(object) {
			return typeOf(object) === REACT_CONSUMER_TYPE;
		};
		exports.isContextProvider = function(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		};
		exports.isElement = function(object) {
			return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
		};
		exports.isForwardRef = function(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		};
		exports.isFragment = function(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		};
		exports.isLazy = function(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		};
		exports.isMemo = function(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		};
		exports.isPortal = function(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		};
		exports.isProfiler = function(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		};
		exports.isStrictMode = function(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		};
		exports.isSuspense = function(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		};
		exports.isSuspenseList = function(object) {
			return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
		};
		exports.isValidElementType = function(type) {
			return "string" === typeof type || "function" === typeof type || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || "object" === typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || void 0 !== type.getModuleId) ? !0 : !1;
		};
		exports.typeOf = typeOf;
	})();
}));
//#endregion
//#region node_modules/@mui/utils/deepmerge/deepmerge.mjs
var import_react_is = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_development$1();
})))();
function isPlainObject(item) {
	if (typeof item !== "object" || item === null) return false;
	const prototype = Object.getPrototypeOf(item);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
}
function deepClone(source) {
	if (/*#__PURE__*/ import_react.isValidElement(source) || (0, import_react_is.isValidElementType)(source) || !isPlainObject(source)) return source;
	const output = {};
	Object.keys(source).forEach((key) => {
		output[key] = deepClone(source[key]);
	});
	return output;
}
/**
* Merge objects deeply.
* It will shallow copy React elements.
*
* If `options.clone` is set to `false` the source object will be merged directly into the target object.
*
* @example
* ```ts
* deepmerge({ a: { b: 1 }, d: 2 }, { a: { c: 2 }, d: 4 });
* // => { a: { b: 1, c: 2 }, d: 4 }
* ````
*
* @param target The target object.
* @param source The source object.
* @param options The merge options.
* @param options.clone Set to `false` to merge the source object directly into the target object.
* @returns The merged object.
*/
function deepmerge(target, source, options = { clone: true }) {
	const output = options.clone ? { ...target } : target;
	if (isPlainObject(target) && isPlainObject(source)) Object.keys(source).forEach((key) => {
		if (/*#__PURE__*/ import_react.isValidElement(source[key]) || (0, import_react_is.isValidElementType)(source[key])) output[key] = source[key];
		else if (isPlainObject(source[key]) && Object.prototype.hasOwnProperty.call(target, key) && isPlainObject(target[key])) output[key] = deepmerge(target[key], source[key], options);
		else if (options.clone) output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
		else output[key] = source[key];
	});
	return output;
}
//#endregion
//#region node_modules/@mui/system/cssContainerQueries/cssContainerQueries.mjs
var MIN_WIDTH_PATTERN = /min-width:\s*([0-9.]+)/;
/**
* WARN: Mutably updates the `css` object.
* For using in `sx` prop to sort the breakpoint from low to high.
* Note: this function does not work and will not support multiple units.
*       e.g. input: { '@container (min-width:300px)': '1rem', '@container (min-width:40rem)': '2rem' }
*            output: { '@container (min-width:40rem)': '2rem', '@container (min-width:300px)': '1rem' } // since 40 < 300 even though 40rem > 300px
*/
function sortContainerQueries(theme, css) {
	if (!theme.containerQueries || !hasContainerQuery(css)) return css;
	const keys = [];
	for (const key in css) if (key.startsWith("@container")) keys.push(key);
	keys.sort((a, b) => {
		return +(a.match(MIN_WIDTH_PATTERN)?.[1] || 0) - +(b.match(MIN_WIDTH_PATTERN)?.[1] || 0);
	});
	const result = css;
	for (let i = 0; i < keys.length; i += 1) {
		const key = keys[i];
		const value = result[key];
		delete result[key];
		result[key] = value;
	}
	return result;
}
function hasContainerQuery(css) {
	for (const key in css) if (key.startsWith("@container")) return true;
	return false;
}
function isCqShorthand(breakpointKeys, value) {
	return value === "@" || value.startsWith("@") && (breakpointKeys.some((key) => value.startsWith(`@${key}`)) || !!value.match(/^@\d/));
}
function getContainerQuery(theme, shorthand) {
	const matches = shorthand.match(/^@([^/]+)?\/?(.+)?$/);
	if (!matches) throw new Error(`MUI: The provided shorthand ${`(${shorthand})`} is invalid. The format should be \`@<breakpoint | number>\` or \`@<breakpoint | number>/<container>\`.\nFor example, \`@sm\` or \`@600\` or \`@40rem/sidebar\`.`);
	const [, containerQuery, containerName] = matches;
	const value = Number.isNaN(+containerQuery) ? containerQuery || 0 : +containerQuery;
	return theme.containerQueries(containerName).up(value);
}
function cssContainerQueries(themeInput) {
	const toContainerQuery = (mediaQuery, name) => mediaQuery.replace("@media", name ? `@container ${name}` : "@container");
	function attachCq(node, name) {
		node.up = (...args) => toContainerQuery(themeInput.breakpoints.up(...args), name);
		node.down = (...args) => toContainerQuery(themeInput.breakpoints.down(...args), name);
		node.between = (...args) => toContainerQuery(themeInput.breakpoints.between(...args), name);
		node.only = (...args) => toContainerQuery(themeInput.breakpoints.only(...args), name);
		node.not = (...args) => {
			const result = toContainerQuery(themeInput.breakpoints.not(...args), name);
			if (result.includes("not all and")) return result.replace("not all and ", "").replace("min-width:", "width<").replace("max-width:", "width>").replace("and", "or");
			return result;
		};
	}
	const node = {};
	const containerQueries = (name) => {
		attachCq(node, name);
		return node;
	};
	attachCq(containerQueries);
	return {
		...themeInput,
		containerQueries
	};
}
//#endregion
//#region node_modules/@mui/system/createBreakpoints/createBreakpoints.mjs
init_emotion_is_prop_valid_esm();
var sortBreakpointsValues = (values) => {
	const breakpointsAsArray = Object.keys(values).map((key) => ({
		key,
		val: values[key]
	})) || [];
	breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
	return breakpointsAsArray.reduce((acc, obj) => {
		return {
			...acc,
			[obj.key]: obj.val
		};
	}, {});
};
function createBreakpoints(breakpoints) {
	const { values = {
		xs: 0,
		sm: 600,
		md: 900,
		lg: 1200,
		xl: 1536
	}, unit = "px", step = 5, ...other } = breakpoints;
	const sortedValues = sortBreakpointsValues(values);
	const keys = Object.keys(sortedValues);
	function up(key) {
		return `@media (min-width:${typeof values[key] === "number" ? values[key] : key}${unit})`;
	}
	function down(key) {
		return `@media (max-width:${(typeof values[key] === "number" ? values[key] : key) - step / 100}${unit})`;
	}
	function between(start, end) {
		const endIndex = keys.indexOf(end);
		return `@media (min-width:${typeof values[start] === "number" ? values[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values[keys[endIndex]] === "number" ? values[keys[endIndex]] : end) - step / 100}${unit})`;
	}
	function only(key) {
		if (keys.indexOf(key) + 1 < keys.length) return between(key, keys[keys.indexOf(key) + 1]);
		return up(key);
	}
	function not(key) {
		const keyIndex = keys.indexOf(key);
		if (keyIndex === 0) return up(keys[1]);
		if (keyIndex === keys.length - 1) return down(keys[keyIndex]);
		return between(key, keys[keys.indexOf(key) + 1]).replace("@media", "@media not all and");
	}
	const mediaKeys = [];
	for (let i = 0; i < keys.length; i += 1) mediaKeys.push(up(keys[i]));
	return {
		keys,
		values: sortedValues,
		up,
		down,
		between,
		only,
		not,
		unit,
		internal_mediaKeys: mediaKeys,
		...other
	};
}
//#endregion
//#region node_modules/@mui/system/breakpoints/breakpoints.mjs
var EMPTY_THEME$2 = {};
var values = {
	xs: 0,
	sm: 600,
	md: 900,
	lg: 1200,
	xl: 1536
};
var DEFAULT_BREAKPOINTS = createBreakpoints({ values });
var defaultContainerQueries = { containerQueries: (containerName) => ({ up: (key) => {
	let result = typeof key === "number" ? key : values[key] || key;
	if (typeof result === "number") result = `${result}px`;
	return containerName ? `@container ${containerName} (min-width:${result})` : `@container (min-width:${result})`;
} }) };
function handleBreakpoints(props, propValue, styleFromPropValue) {
	const result = {};
	return iterateBreakpoints(result, props.theme, propValue, (mediaKey, value, initialKey) => {
		const finalValue = styleFromPropValue(value, initialKey);
		if (mediaKey) result[mediaKey] = finalValue;
		else fastDeepAssign(result, finalValue);
	});
}
function iterateBreakpoints(target, theme, propValue, callback) {
	theme ??= EMPTY_THEME$2;
	if (Array.isArray(propValue)) {
		const breakpoints = theme.breakpoints ?? DEFAULT_BREAKPOINTS;
		for (let i = 0; i < propValue.length; i += 1) buildBreakpoint(target, breakpoints.up(breakpoints.keys[i]), propValue[i], void 0, callback);
		return target;
	}
	if (typeof propValue === "object") {
		const breakpoints = theme.breakpoints ?? DEFAULT_BREAKPOINTS;
		const breakpointValues = breakpoints.values ?? values;
		for (const key in propValue) if (isCqShorthand(breakpoints.keys, key)) {
			const containerKey = getContainerQuery(theme.containerQueries ? theme : defaultContainerQueries, key);
			if (containerKey) buildBreakpoint(target, containerKey, propValue[key], key, callback);
		} else if (key in breakpointValues) buildBreakpoint(target, breakpoints.up(key), propValue[key], key, callback);
		else {
			const cssKey = key;
			target[cssKey] = propValue[cssKey];
		}
		return target;
	}
	callback(void 0, propValue);
	return target;
}
function buildBreakpoint(target, mediaKey, value, initialKey, callback) {
	target[mediaKey] ??= {};
	callback(mediaKey, value, initialKey);
}
function createEmptyBreakpointObject(breakpoints = DEFAULT_BREAKPOINTS) {
	const { internal_mediaKeys: mediaKeys } = breakpoints;
	const result = {};
	for (let i = 0; i < mediaKeys.length; i += 1) result[mediaKeys[i]] = {};
	return result;
}
function removeUnusedBreakpoints(breakpoints, style) {
	const breakpointKeys = breakpoints.internal_mediaKeys;
	for (let i = 0; i < breakpointKeys.length; i += 1) {
		const key = breakpointKeys[i];
		if (isObjectEmpty$1(style[key])) delete style[key];
	}
	return style;
}
function hasBreakpoint(breakpoints, value) {
	if (Array.isArray(value)) return true;
	if (typeof value === "object" && value !== null) {
		for (let i = 0; i < breakpoints.keys.length; i += 1) if (breakpoints.keys[i] in value) return true;
		const valueKeys = Object.keys(value);
		for (let i = 0; i < valueKeys.length; i += 1) if (isCqShorthand(breakpoints.keys, valueKeys[i])) return true;
	}
	return false;
}
//#endregion
//#region node_modules/@mui/system/style/style.mjs
/**
* HACK: The `alternateProp` logic is there because our theme looks like this:
* {
*   typography: {
*     fontFamily: 'comic sans',
*     fontFamilyCode: 'courrier new',
*   }
* }
* And we support targetting:
* - `typography.fontFamily`     with `sx={{ fontFamily: 'default' }}`
* - `typography.fontFamilyCode` with `sx={{ fontFamily: 'code' }}`
*
* TODO(v7): Refactor our theme to look like this and remove the horrendous logic:
* {
*   typography: {
*     fontFamily: {
*       default: 'comic sans',
*       code: 'courrier new',
*     }
*   }
* }
*/
function getStyleValue2(themeMapping, transform, userValue, alternateProp) {
	let value;
	if (typeof themeMapping === "function") value = themeMapping(userValue);
	else if (Array.isArray(themeMapping)) value = themeMapping[userValue] || userValue;
	else if (typeof userValue === "string") value = getPath(themeMapping, userValue, true, alternateProp) || userValue;
	else value = userValue;
	if (transform) value = transform(value, userValue, themeMapping);
	return value;
}
function getPath(obj, pathInput, checkVars = true, alternateProp = void 0) {
	if (!obj || !pathInput) return null;
	const path = pathInput.split(".");
	if (obj.vars && checkVars) {
		const val = getPathImpl(obj.vars, path, alternateProp);
		if (val != null) return val;
	}
	return getPathImpl(obj, path, alternateProp);
}
function getPathImpl(object, path, alternateProp = void 0) {
	let lastResult = void 0;
	let result = object;
	let index = 0;
	while (index < path.length) {
		if (result === null || result === void 0) return result;
		lastResult = result;
		result = result[path[index]];
		index += 1;
	}
	if (alternateProp && result === void 0) {
		const lastKey = path[path.length - 1];
		const alternateKey = `${alternateProp}${lastKey === "default" ? "" : capitalize(lastKey)}`;
		return lastResult?.[alternateKey];
	}
	return result;
}
function style$1(options) {
	const { prop, cssProperty = options.prop, themeKey, transform } = options;
	const fn = (props) => {
		if (props[prop] == null) return null;
		const propValue = props[prop];
		const theme = props.theme;
		const themeMapping = getPath(theme, themeKey) || {};
		const styleFromPropValue = (valueFinal) => {
			const value = getStyleValue2(themeMapping, transform, valueFinal, prop);
			return cssProperty === false ? value : { [cssProperty]: value };
		};
		return handleBreakpoints(props, propValue, styleFromPropValue);
	};
	fn.propTypes = { [prop]: responsivePropType };
	fn.filterProps = [prop];
	return fn;
}
//#endregion
//#region node_modules/@mui/system/spacing/spacing.mjs
var EMPTY_THEME$1 = { internal_cache: {} };
var properties = {
	m: "margin",
	p: "padding"
};
var directions = {
	t: "Top",
	r: "Right",
	b: "Bottom",
	l: "Left",
	x: ["Left", "Right"],
	y: ["Top", "Bottom"]
};
var aliases = {
	marginX: "mx",
	marginY: "my",
	paddingX: "px",
	paddingY: "py"
};
var CSS_PROPERTIES = {};
for (const key in properties) CSS_PROPERTIES[key] = [properties[key]];
for (const keyProperty in properties) for (const keyDirection in directions) {
	const property = properties[keyProperty];
	const direction = directions[keyDirection];
	const value = Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
	CSS_PROPERTIES[keyProperty + keyDirection] = value;
}
for (const key in aliases) CSS_PROPERTIES[key] = CSS_PROPERTIES[aliases[key]];
var marginKeys = new Set([
	"m",
	"mt",
	"mr",
	"mb",
	"ml",
	"mx",
	"my",
	"margin",
	"marginTop",
	"marginRight",
	"marginBottom",
	"marginLeft",
	"marginX",
	"marginY",
	"marginInline",
	"marginInlineStart",
	"marginInlineEnd",
	"marginBlock",
	"marginBlockStart",
	"marginBlockEnd"
]);
var paddingKeys = new Set([
	"p",
	"pt",
	"pr",
	"pb",
	"pl",
	"px",
	"py",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"paddingX",
	"paddingY",
	"paddingInline",
	"paddingInlineStart",
	"paddingInlineEnd",
	"paddingBlock",
	"paddingBlockStart",
	"paddingBlockEnd"
]);
var spacingKeys = new Set([...marginKeys, ...paddingKeys]);
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
	const themeSpacing = getPath(theme, themeKey, true) ?? defaultValue;
	if (typeof themeSpacing === "number" || typeof themeSpacing === "string") return (val) => {
		if (typeof val === "string") return val;
		if (typeof val !== "number") console.error(`MUI: Expected ${propName} argument to be a number or a string, got ${val}.`);
		if (typeof themeSpacing === "string") {
			if (themeSpacing.startsWith("var(") && val === 0) return 0;
			if (themeSpacing.startsWith("var(") && val === 1) return themeSpacing;
			return `calc(${val} * ${themeSpacing})`;
		}
		return themeSpacing * val;
	};
	if (Array.isArray(themeSpacing)) return (val) => {
		if (typeof val === "string") return val;
		const abs = Math.abs(val);
		if (!Number.isInteger(abs)) console.error([`MUI: The \`theme.${themeKey}\` array type cannot be combined with non integer values.You should either use an integer value that can be used as index, or define the \`theme.${themeKey}\` as a number.`].join("\n"));
		else if (abs > themeSpacing.length - 1) console.error([
			`MUI: The value provided (${abs}) overflows.`,
			`The supported values are: ${JSON.stringify(themeSpacing)}.`,
			`${abs} > ${themeSpacing.length - 1}, you need to add the missing values.`
		].join("\n"));
		const transformed = themeSpacing[abs];
		if (val >= 0) return transformed;
		if (typeof transformed === "number") return -transformed;
		if (typeof transformed === "string" && transformed.startsWith("var(")) return `calc(-1 * ${transformed})`;
		return `-${transformed}`;
	};
	if (typeof themeSpacing === "function") return themeSpacing;
	console.error([`MUI: The \`theme.${themeKey}\` value (${themeSpacing}) is invalid.`, "It should be a number, an array or a function."].join("\n"));
	return () => void 0;
}
function createUnarySpacing(theme) {
	return createUnaryUnit(theme, "spacing", 8, "spacing");
}
function getValue(transformer, propValue) {
	if (typeof propValue === "string" || propValue == null) return propValue;
	return transformer(propValue);
}
var container = [""];
function style(props, keys) {
	const theme = props.theme ?? EMPTY_THEME$1;
	const transformer = theme?.internal_cache?.unarySpacing ?? createUnarySpacing(theme);
	const result = {};
	for (const prop in props) {
		if (!keys.has(prop)) continue;
		const cssProperties = CSS_PROPERTIES[prop] ?? (container[0] = prop, container);
		const propValue = props[prop];
		iterateBreakpoints(result, props.theme, propValue, (mediaKey, value) => {
			const target = mediaKey ? result[mediaKey] : result;
			for (let i = 0; i < cssProperties.length; i += 1) target[cssProperties[i]] = getValue(transformer, value);
		});
	}
	return result;
}
function margin(props) {
	return style(props, marginKeys);
}
margin.propTypes = Array.from(marginKeys).reduce((obj, key) => {
	obj[key] = responsivePropType;
	return obj;
}, {});
margin.filterProps = marginKeys;
function padding(props) {
	return style(props, paddingKeys);
}
padding.propTypes = Array.from(paddingKeys).reduce((obj, key) => {
	obj[key] = responsivePropType;
	return obj;
}, {});
padding.filterProps = paddingKeys;
function spacing(props) {
	return style(props, spacingKeys);
}
spacing.propTypes = Array.from(spacingKeys).reduce((obj, key) => {
	obj[key] = responsivePropType;
	return obj;
}, {});
spacing.filterProps = spacingKeys;
//#endregion
//#region node_modules/@mui/system/compose/compose.mjs
function compose(...styles) {
	const handlers = styles.reduce((acc, style) => {
		style.filterProps.forEach((prop) => {
			acc[prop] = style;
		});
		return acc;
	}, {});
	const fn = (props) => {
		const result = {};
		for (const prop in props) if (handlers[prop]) fastDeepAssign(result, handlers[prop](props));
		return result;
	};
	fn.propTypes = styles.reduce((acc, style) => Object.assign(acc, style.propTypes), {});
	fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);
	return fn;
}
//#endregion
//#region node_modules/@mui/system/borders/borders.mjs
function borderTransform(value) {
	if (typeof value !== "number") return value;
	return `${value}px solid`;
}
function createBorderStyle(prop, transform) {
	return style$1({
		prop,
		themeKey: "borders",
		transform
	});
}
var border = createBorderStyle("border", borderTransform);
var borderTop = createBorderStyle("borderTop", borderTransform);
var borderRight = createBorderStyle("borderRight", borderTransform);
var borderBottom = createBorderStyle("borderBottom", borderTransform);
var borderLeft = createBorderStyle("borderLeft", borderTransform);
var borderColor = createBorderStyle("borderColor");
var borderTopColor = createBorderStyle("borderTopColor");
var borderRightColor = createBorderStyle("borderRightColor");
var borderBottomColor = createBorderStyle("borderBottomColor");
var borderLeftColor = createBorderStyle("borderLeftColor");
var outline = createBorderStyle("outline", borderTransform);
var outlineColor = createBorderStyle("outlineColor");
var borderRadius = (props) => {
	if (props.borderRadius !== void 0 && props.borderRadius !== null) {
		const transformer = createUnaryUnit(props.theme, "shape.borderRadius", 4, "borderRadius");
		const styleFromPropValue = (propValue) => ({ borderRadius: getValue(transformer, propValue) });
		return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
	}
	return null;
};
borderRadius.propTypes = { borderRadius: responsivePropType };
borderRadius.filterProps = ["borderRadius"];
compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
//#endregion
//#region node_modules/@mui/system/cssGrid/cssGrid.mjs
var gap = (props) => {
	if (props.gap !== void 0 && props.gap !== null) {
		const transformer = createUnaryUnit(props.theme, "spacing", 8, "gap");
		const styleFromPropValue = (propValue) => ({ gap: getValue(transformer, propValue) });
		return handleBreakpoints(props, props.gap, styleFromPropValue);
	}
	return null;
};
gap.propTypes = { gap: responsivePropType };
gap.filterProps = ["gap"];
var columnGap = (props) => {
	if (props.columnGap !== void 0 && props.columnGap !== null) {
		const transformer = createUnaryUnit(props.theme, "spacing", 8, "columnGap");
		const styleFromPropValue = (propValue) => ({ columnGap: getValue(transformer, propValue) });
		return handleBreakpoints(props, props.columnGap, styleFromPropValue);
	}
	return null;
};
columnGap.propTypes = { columnGap: responsivePropType };
columnGap.filterProps = ["columnGap"];
var rowGap = (props) => {
	if (props.rowGap !== void 0 && props.rowGap !== null) {
		const transformer = createUnaryUnit(props.theme, "spacing", 8, "rowGap");
		const styleFromPropValue = (propValue) => ({ rowGap: getValue(transformer, propValue) });
		return handleBreakpoints(props, props.rowGap, styleFromPropValue);
	}
	return null;
};
rowGap.propTypes = { rowGap: responsivePropType };
rowGap.filterProps = ["rowGap"];
compose(gap, columnGap, rowGap, style$1({ prop: "gridColumn" }), style$1({ prop: "gridRow" }), style$1({ prop: "gridAutoFlow" }), style$1({ prop: "gridAutoColumns" }), style$1({ prop: "gridAutoRows" }), style$1({ prop: "gridTemplateColumns" }), style$1({ prop: "gridTemplateRows" }), style$1({ prop: "gridTemplateAreas" }), style$1({ prop: "gridArea" }));
//#endregion
//#region node_modules/@mui/system/palette/palette.mjs
function paletteTransform(value, userValue) {
	if (userValue === "grey") return userValue;
	return value;
}
compose(style$1({
	prop: "color",
	themeKey: "palette",
	transform: paletteTransform
}), style$1({
	prop: "bgcolor",
	cssProperty: "backgroundColor",
	themeKey: "palette",
	transform: paletteTransform
}), style$1({
	prop: "backgroundColor",
	themeKey: "palette",
	transform: paletteTransform
}));
//#endregion
//#region node_modules/@mui/system/sizing/sizing.mjs
function sizingTransform(value) {
	return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}
var width = style$1({
	prop: "width",
	transform: sizingTransform
});
var maxWidth = (props) => {
	if (props.maxWidth !== void 0 && props.maxWidth !== null) {
		const styleFromPropValue = (propValue) => {
			const breakpoint = props.theme?.breakpoints?.values?.[propValue] || values[propValue];
			if (!breakpoint) return { maxWidth: sizingTransform(propValue) };
			if (props.theme?.breakpoints?.unit !== "px") return { maxWidth: `${breakpoint}${props.theme.breakpoints.unit}` };
			return { maxWidth: breakpoint };
		};
		return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
	}
	return null;
};
maxWidth.filterProps = ["maxWidth"];
var minWidth = style$1({
	prop: "minWidth",
	transform: sizingTransform
});
var height = style$1({
	prop: "height",
	transform: sizingTransform
});
var maxHeight = style$1({
	prop: "maxHeight",
	transform: sizingTransform
});
var minHeight = style$1({
	prop: "minHeight",
	transform: sizingTransform
});
style$1({
	prop: "size",
	cssProperty: "width",
	transform: sizingTransform
});
style$1({
	prop: "size",
	cssProperty: "height",
	transform: sizingTransform
});
compose(width, maxWidth, minWidth, height, maxHeight, minHeight, style$1({ prop: "boxSizing" }));
//#endregion
//#region node_modules/@mui/system/styleFunctionSx/defaultSxConfig.mjs
var defaultSxConfig = {
	border: {
		themeKey: "borders",
		transform: borderTransform
	},
	borderTop: {
		themeKey: "borders",
		transform: borderTransform
	},
	borderRight: {
		themeKey: "borders",
		transform: borderTransform
	},
	borderBottom: {
		themeKey: "borders",
		transform: borderTransform
	},
	borderLeft: {
		themeKey: "borders",
		transform: borderTransform
	},
	borderColor: { themeKey: "palette" },
	borderTopColor: { themeKey: "palette" },
	borderRightColor: { themeKey: "palette" },
	borderBottomColor: { themeKey: "palette" },
	borderLeftColor: { themeKey: "palette" },
	outline: {
		themeKey: "borders",
		transform: borderTransform
	},
	outlineColor: { themeKey: "palette" },
	borderRadius: {
		themeKey: "shape.borderRadius",
		style: borderRadius
	},
	color: {
		themeKey: "palette",
		transform: paletteTransform
	},
	bgcolor: {
		themeKey: "palette",
		cssProperty: "backgroundColor",
		transform: paletteTransform
	},
	backgroundColor: {
		themeKey: "palette",
		transform: paletteTransform
	},
	p: { style: padding },
	pt: { style: padding },
	pr: { style: padding },
	pb: { style: padding },
	pl: { style: padding },
	px: { style: padding },
	py: { style: padding },
	padding: { style: padding },
	paddingTop: { style: padding },
	paddingRight: { style: padding },
	paddingBottom: { style: padding },
	paddingLeft: { style: padding },
	paddingX: { style: padding },
	paddingY: { style: padding },
	paddingInline: { style: padding },
	paddingInlineStart: { style: padding },
	paddingInlineEnd: { style: padding },
	paddingBlock: { style: padding },
	paddingBlockStart: { style: padding },
	paddingBlockEnd: { style: padding },
	m: { style: margin },
	mt: { style: margin },
	mr: { style: margin },
	mb: { style: margin },
	ml: { style: margin },
	mx: { style: margin },
	my: { style: margin },
	margin: { style: margin },
	marginTop: { style: margin },
	marginRight: { style: margin },
	marginBottom: { style: margin },
	marginLeft: { style: margin },
	marginX: { style: margin },
	marginY: { style: margin },
	marginInline: { style: margin },
	marginInlineStart: { style: margin },
	marginInlineEnd: { style: margin },
	marginBlock: { style: margin },
	marginBlockStart: { style: margin },
	marginBlockEnd: { style: margin },
	displayPrint: {
		cssProperty: false,
		transform: (value) => ({ "@media print": { display: value } })
	},
	display: {},
	overflow: {},
	textOverflow: {},
	visibility: {},
	whiteSpace: {},
	flexBasis: {},
	flexDirection: {},
	flexWrap: {},
	justifyContent: {},
	alignItems: {},
	alignContent: {},
	order: {},
	flex: {},
	flexGrow: {},
	flexShrink: {},
	alignSelf: {},
	justifyItems: {},
	justifySelf: {},
	gap: { style: gap },
	rowGap: { style: rowGap },
	columnGap: { style: columnGap },
	gridColumn: {},
	gridRow: {},
	gridAutoFlow: {},
	gridAutoColumns: {},
	gridAutoRows: {},
	gridTemplateColumns: {},
	gridTemplateRows: {},
	gridTemplateAreas: {},
	gridArea: {},
	position: {},
	zIndex: { themeKey: "zIndex" },
	top: {},
	right: {},
	bottom: {},
	left: {},
	boxShadow: { themeKey: "shadows" },
	width: { transform: sizingTransform },
	maxWidth: { style: maxWidth },
	minWidth: { transform: sizingTransform },
	height: { transform: sizingTransform },
	maxHeight: { transform: sizingTransform },
	minHeight: { transform: sizingTransform },
	boxSizing: {},
	font: { themeKey: "font" },
	fontFamily: { themeKey: "typography" },
	fontSize: { themeKey: "typography" },
	fontStyle: { themeKey: "typography" },
	fontWeight: { themeKey: "typography" },
	letterSpacing: {},
	textTransform: {},
	lineHeight: {},
	textAlign: {},
	typography: {
		cssProperty: false,
		themeKey: "typography"
	}
};
//#endregion
//#region node_modules/@mui/system/styleFunctionSx/styleFunctionSx.mjs
var EMPTY_THEME = {};
function unstable_createStyleFunctionSx() {
	function styleFunctionSx(props) {
		if (!props.sx) return null;
		const { sx, theme = EMPTY_THEME, nested } = props;
		const config = theme.unstable_sxConfig ?? defaultSxConfig;
		const wrapper = {
			sx: null,
			theme,
			nested: true
		};
		function process(sxInput) {
			let sxObject = sxInput;
			if (typeof sxInput === "function") sxObject = sxInput(theme);
			else if (typeof sxInput !== "object") return sxInput;
			if (!sxObject) return null;
			const breakpoints = theme.breakpoints ?? DEFAULT_BREAKPOINTS;
			const css = createEmptyBreakpointObject(breakpoints);
			for (const styleKey in sxObject) {
				const value = callIfFn(sxObject[styleKey], theme);
				if (value === null || value === void 0) continue;
				if (typeof value !== "object") {
					setThemeValue(css, styleKey, value, theme, config);
					continue;
				}
				if (config[styleKey]) {
					setThemeValue(css, styleKey, value, theme, config);
					continue;
				}
				if (hasBreakpoint(breakpoints, value)) iterateBreakpoints(css, props.theme, value, (mediaKey, finalValue) => {
					css[mediaKey][styleKey] = finalValue;
				});
				else {
					wrapper.sx = value;
					css[styleKey] = styleFunctionSx(wrapper);
				}
			}
			if (!nested && theme.modularCssLayers) return { "@layer sx": sortContainerQueries(theme, removeUnusedBreakpoints(breakpoints, css)) };
			return sortContainerQueries(theme, removeUnusedBreakpoints(breakpoints, css));
		}
		return Array.isArray(sx) ? sx.map(process) : process(sx);
	}
	styleFunctionSx.filterProps = ["sx"];
	return styleFunctionSx;
}
var styleFunctionSx_default = unstable_createStyleFunctionSx();
function setThemeValue(css, prop, value, theme, config) {
	const options = config[prop];
	if (!options) {
		css[prop] = value;
		return;
	}
	if (value == null) return;
	const { themeKey } = options;
	if (themeKey === "typography" && value === "inherit") {
		css[prop] = value;
		return;
	}
	const { style } = options;
	if (style) {
		fastDeepAssign(css, style({
			[prop]: value,
			theme
		}));
		return;
	}
	const { cssProperty = prop, transform } = options;
	const themeMapping = getPath(theme, themeKey);
	iterateBreakpoints(css, theme, value, (mediaKey, valueFinal) => {
		const finalValue = getStyleValue2(themeMapping, transform, valueFinal, prop);
		if (cssProperty === false) if (mediaKey) fastDeepAssign(css[mediaKey], finalValue);
		else fastDeepAssign(css, finalValue);
		else if (mediaKey) css[mediaKey][cssProperty] = finalValue;
		else css[cssProperty] = finalValue;
	});
}
function callIfFn(maybeFn, arg) {
	return typeof maybeFn === "function" ? maybeFn(arg) : maybeFn;
}
//#endregion
//#region node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
//#endregion
//#region node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js
var isDevelopment$3 = true;
function sheetForTag(tag) {
	if (tag.sheet) return tag.sheet;
	/* istanbul ignore next */
	for (var i = 0; i < document.styleSheets.length; i++) if (document.styleSheets[i].ownerNode === tag) return document.styleSheets[i];
}
function createStyleElement(options) {
	var tag = document.createElement("style");
	tag.setAttribute("data-emotion", options.key);
	if (options.nonce !== void 0) tag.setAttribute("nonce", options.nonce);
	tag.appendChild(document.createTextNode(""));
	tag.setAttribute("data-s", "");
	return tag;
}
var StyleSheet = /*#__PURE__*/ function() {
	function StyleSheet(options) {
		var _this = this;
		this._insertTag = function(tag) {
			var before;
			if (_this.tags.length === 0) if (_this.insertionPoint) before = _this.insertionPoint.nextSibling;
			else if (_this.prepend) before = _this.container.firstChild;
			else before = _this.before;
			else before = _this.tags[_this.tags.length - 1].nextSibling;
			_this.container.insertBefore(tag, before);
			_this.tags.push(tag);
		};
		this.isSpeedy = options.speedy === void 0 ? !isDevelopment$3 : options.speedy;
		this.tags = [];
		this.ctr = 0;
		this.nonce = options.nonce;
		this.key = options.key;
		this.container = options.container;
		this.prepend = options.prepend;
		this.insertionPoint = options.insertionPoint;
		this.before = null;
	}
	var _proto = StyleSheet.prototype;
	_proto.hydrate = function hydrate(nodes) {
		nodes.forEach(this._insertTag);
	};
	_proto.insert = function insert(rule) {
		if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) this._insertTag(createStyleElement(this));
		var tag = this.tags[this.tags.length - 1];
		var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;
		if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) console.error("You're attempting to insert the following rule:\n" + rule + "\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.");
		this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
		if (this.isSpeedy) {
			var sheet = sheetForTag(tag);
			try {
				sheet.insertRule(rule, sheet.cssRules.length);
			} catch (e) {
				if (!/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
			}
		} else tag.appendChild(document.createTextNode(rule));
		this.ctr++;
	};
	_proto.flush = function flush() {
		this.tags.forEach(function(tag) {
			var _tag$parentNode;
			return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
		});
		this.tags = [];
		this.ctr = 0;
		this._alreadyInsertedOrderInsensitiveRule = false;
	};
	return StyleSheet;
}();
//#endregion
//#region node_modules/stylis/src/Enum.js
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
//#endregion
//#region node_modules/stylis/src/Utility.js
/**
* @param {number}
* @return {number}
*/
var abs = Math.abs;
/**
* @param {number}
* @return {string}
*/
var from = String.fromCharCode;
/**
* @param {object}
* @return {object}
*/
var assign = Object.assign;
/**
* @param {string} value
* @param {number} length
* @return {number}
*/
function hash$2(value, length) {
	return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
/**
* @param {string} value
* @return {string}
*/
function trim(value) {
	return value.trim();
}
/**
* @param {string} value
* @param {RegExp} pattern
* @return {string?}
*/
function match(value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value;
}
/**
* @param {string} value
* @param {(string|RegExp)} pattern
* @param {string} replacement
* @return {string}
*/
function replace(value, pattern, replacement) {
	return value.replace(pattern, replacement);
}
/**
* @param {string} value
* @param {string} search
* @return {number}
*/
function indexof(value, search) {
	return value.indexOf(search);
}
/**
* @param {string} value
* @param {number} index
* @return {number}
*/
function charat(value, index) {
	return value.charCodeAt(index) | 0;
}
/**
* @param {string} value
* @param {number} begin
* @param {number} end
* @return {string}
*/
function substr(value, begin, end) {
	return value.slice(begin, end);
}
/**
* @param {string} value
* @return {number}
*/
function strlen(value) {
	return value.length;
}
/**
* @param {any[]} value
* @return {number}
*/
function sizeof(value) {
	return value.length;
}
/**
* @param {any} value
* @param {any[]} array
* @return {any}
*/
function append(value, array) {
	return array.push(value), value;
}
/**
* @param {string[]} array
* @param {function} callback
* @return {string}
*/
function combine(array, callback) {
	return array.map(callback).join("");
}
//#endregion
//#region node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
/**
* @param {string} value
* @param {object | null} root
* @param {object | null} parent
* @param {string} type
* @param {string[] | string} props
* @param {object[] | string} children
* @param {number} length
*/
function node(value, root, parent, type, props, children, length) {
	return {
		value,
		root,
		parent,
		type,
		props,
		children,
		line,
		column,
		length,
		return: ""
	};
}
/**
* @param {object} root
* @param {object} props
* @return {object}
*/
function copy(root, props) {
	return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
}
/**
* @return {number}
*/
function char() {
	return character;
}
/**
* @return {number}
*/
function prev() {
	character = position > 0 ? charat(characters, --position) : 0;
	if (column--, character === 10) column = 1, line--;
	return character;
}
/**
* @return {number}
*/
function next() {
	character = position < length ? charat(characters, position++) : 0;
	if (column++, character === 10) column = 1, line++;
	return character;
}
/**
* @return {number}
*/
function peek() {
	return charat(characters, position);
}
/**
* @return {number}
*/
function caret() {
	return position;
}
/**
* @param {number} begin
* @param {number} end
* @return {string}
*/
function slice(begin, end) {
	return substr(characters, begin, end);
}
/**
* @param {number} type
* @return {number}
*/
function token(type) {
	switch (type) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
/**
* @param {string} value
* @return {any[]}
*/
function alloc(value) {
	return line = column = 1, length = strlen(characters = value), position = 0, [];
}
/**
* @param {any} value
* @return {any}
*/
function dealloc(value) {
	return characters = "", value;
}
/**
* @param {number} type
* @return {string}
*/
function delimit(type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
/**
* @param {number} type
* @return {string}
*/
function whitespace(type) {
	while (character = peek()) if (character < 33) next();
	else break;
	return token(type) > 2 || token(character) > 3 ? "" : " ";
}
/**
* @param {number} index
* @param {number} count
* @return {string}
*/
function escaping(index, count) {
	while (--count && next()) if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
/**
* @param {number} type
* @return {number}
*/
function delimiter(type) {
	while (next()) switch (character) {
		case type: return position;
		case 34:
		case 39:
			if (type !== 34 && type !== 39) delimiter(character);
			break;
		case 40:
			if (type === 41) delimiter(type);
			break;
		case 92:
			next();
			break;
	}
	return position;
}
/**
* @param {number} type
* @param {number} index
* @return {number}
*/
function commenter(type, index) {
	while (next()) if (type + character === 57) break;
	else if (type + character === 84 && peek() === 47) break;
	return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
/**
* @param {number} index
* @return {string}
*/
function identifier(index) {
	while (!token(peek())) next();
	return slice(index, position);
}
//#endregion
//#region node_modules/stylis/src/Parser.js
/**
* @param {string} value
* @return {object[]}
*/
function compile(value) {
	return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {string[]} rule
* @param {string[]} rules
* @param {string[]} rulesets
* @param {number[]} pseudo
* @param {number[]} points
* @param {string[]} declarations
* @return {object}
*/
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = "";
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;
	while (scanning) switch (previous = character, character = next()) {
		case 40: if (previous != 108 && charat(characters, length - 1) == 58) {
			if (indexof(characters += replace(delimit(character), "&", "&\f"), "&\f") != -1) ampersand = -1;
			break;
		}
		case 34:
		case 39:
		case 91:
			characters += delimit(character);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			characters += whitespace(previous);
			break;
		case 92:
			characters += escaping(caret() - 1, 7);
			continue;
		case 47:
			switch (peek()) {
				case 42:
				case 47:
					append(comment(commenter(next(), caret()), root, parent), declarations);
					break;
				default: characters += "/";
			}
			break;
		case 123 * variable: points[index++] = strlen(characters) * ampersand;
		case 125 * variable:
		case 59:
		case 0:
			switch (character) {
				case 0:
				case 125: scanning = 0;
				case 59 + offset:
					if (ampersand == -1) characters = replace(characters, /\f/g, "");
					if (property > 0 && strlen(characters) - length) append(property > 32 ? declaration(characters + ";", rule, parent, length - 1) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2), declarations);
					break;
				case 59: characters += ";";
				default:
					append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets);
					if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);
					else switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
						case 100:
						case 108:
						case 109:
						case 115:
							parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children);
							break;
						default: parse(characters, reference, reference, reference, [""], children, 0, points, children);
					}
			}
			index = offset = property = 0, variable = ampersand = 1, type = characters = "", length = pseudo;
			break;
		case 58: length = 1 + strlen(characters), property = previous;
		default:
			if (variable < 1) {
				if (character == 123) --variable;
				else if (character == 125 && variable++ == 0 && prev() == 125) continue;
			}
			switch (characters += from(character), character * variable) {
				case 38:
					ampersand = offset > 0 ? 1 : (characters += "\f", -1);
					break;
				case 44:
					points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
					break;
				case 64:
					if (peek() === 45) characters += delimit(next());
					atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
					break;
				case 45: if (previous === 45 && strlen(characters) == 2) variable = 0;
			}
	}
	return rulesets;
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} index
* @param {number} offset
* @param {string[]} rules
* @param {number[]} points
* @param {string} type
* @param {string[]} props
* @param {string[]} children
* @param {number} length
* @return {object}
*/
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [""];
	var size = sizeof(rule);
	for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length);
}
/**
* @param {number} value
* @param {object} root
* @param {object?} parent
* @return {object}
*/
function comment(value, root, parent) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} length
* @return {object}
*/
function declaration(value, root, parent, length) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length);
}
//#endregion
//#region node_modules/stylis/src/Serializer.js
/**
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function serialize(children, callback) {
	var output = "";
	var length = sizeof(children);
	for (var i = 0; i < length; i++) output += callback(children[i], i, children, callback) || "";
	return output;
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function stringify(element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break;
		case IMPORT:
		case DECLARATION: return element.return = element.return || element.value;
		case COMMENT: return "";
		case KEYFRAMES: return element.return = element.value + "{" + serialize(element.children, callback) + "}";
		case RULESET: element.value = element.props.join(",");
	}
	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
//#endregion
//#region node_modules/stylis/src/Middleware.js
/**
* @param {function[]} collection
* @return {function}
*/
function middleware(collection) {
	var length = sizeof(collection);
	return function(element, index, children, callback) {
		var output = "";
		for (var i = 0; i < length; i++) output += collection[i](element, index, children, callback) || "";
		return output;
	};
}
//#endregion
//#region node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js
var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
	var previous = 0;
	var character = 0;
	while (true) {
		previous = character;
		character = peek();
		if (previous === 38 && character === 12) points[index] = 1;
		if (token(character)) break;
		next();
	}
	return slice(begin, position);
};
var toRules = function toRules(parsed, points) {
	var index = -1;
	var character = 44;
	do
		switch (token(character)) {
			case 0:
				if (character === 38 && peek() === 12) points[index] = 1;
				parsed[index] += identifierWithPointTracking(position - 1, points, index);
				break;
			case 2:
				parsed[index] += delimit(character);
				break;
			case 4: if (character === 44) {
				parsed[++index] = peek() === 58 ? "&\f" : "";
				points[index] = parsed[index].length;
				break;
			}
			default: parsed[index] += from(character);
		}
	while (character = next());
	return parsed;
};
var getRules = function getRules(value, points) {
	return dealloc(toRules(alloc(value), points));
};
var fixedElements = /* #__PURE__ */ new WeakMap();
var compat = function compat(element) {
	if (element.type !== "rule" || !element.parent || element.length < 1) return;
	var value = element.value;
	var parent = element.parent;
	var isImplicitRule = element.column === parent.column && element.line === parent.line;
	while (parent.type !== "rule") {
		parent = parent.parent;
		if (!parent) return;
	}
	if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) return;
	if (isImplicitRule) return;
	fixedElements.set(element, true);
	var points = [];
	var rules = getRules(value, points);
	var parentRules = parent.props;
	for (var i = 0, k = 0; i < rules.length; i++) for (var j = 0; j < parentRules.length; j++, k++) element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
};
var removeLabel = function removeLabel(element) {
	if (element.type === "decl") {
		var value = element.value;
		if (value.charCodeAt(0) === 108 && value.charCodeAt(2) === 98) {
			element["return"] = "";
			element.value = "";
		}
	}
};
var ignoreFlag = "emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason";
var isIgnoringComment = function isIgnoringComment(element) {
	return element.type === "comm" && element.children.indexOf(ignoreFlag) > -1;
};
var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
	return function(element, index, children) {
		if (element.type !== "rule" || cache.compat) return;
		var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);
		if (unsafePseudoClasses) {
			var commentContainer = !!element.parent ? element.parent.children : children;
			for (var i = commentContainer.length - 1; i >= 0; i--) {
				var node = commentContainer[i];
				if (node.line < element.line) break;
				if (node.column < element.column) {
					if (isIgnoringComment(node)) return;
					break;
				}
			}
			unsafePseudoClasses.forEach(function(unsafePseudoClass) {
				console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split("-child")[0] + "-of-type\".");
			});
		}
	};
};
var isImportRule = function isImportRule(element) {
	return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};
var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
	for (var i = index - 1; i >= 0; i--) if (!isImportRule(children[i])) return true;
	return false;
};
var nullifyElement = function nullifyElement(element) {
	element.type = "";
	element.value = "";
	element["return"] = "";
	element.children = "";
	element.props = "";
};
var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
	if (!isImportRule(element)) return;
	if (element.parent) {
		console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
		nullifyElement(element);
	} else if (isPrependedWithRegularRules(index, children)) {
		console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
		nullifyElement(element);
	}
};
function prefix(value, length) {
	switch (hash$2(value, length)) {
		case 5103: return WEBKIT + "print-" + value + value;
		case 5737:
		case 4201:
		case 3177:
		case 3433:
		case 1641:
		case 4457:
		case 2921:
		case 5572:
		case 6356:
		case 5844:
		case 3191:
		case 6645:
		case 3005:
		case 6391:
		case 5879:
		case 5623:
		case 6135:
		case 4599:
		case 4855:
		case 4215:
		case 6389:
		case 5109:
		case 5365:
		case 5621:
		case 3829: return WEBKIT + value + value;
		case 5349:
		case 4246:
		case 4810:
		case 6968:
		case 2756: return WEBKIT + value + MOZ + value + MS + value + value;
		case 6828:
		case 4268: return WEBKIT + value + MS + value + value;
		case 6165: return WEBKIT + value + MS + "flex-" + value + value;
		case 5187: return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
		case 5443: return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
		case 4675: return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
		case 5548: return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
		case 5292: return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
		case 6060: return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
		case 4554: return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
		case 6187: return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
		case 5495:
		case 3959: return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
		case 4968: return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
		case 4095:
		case 3583:
		case 4068:
		case 2532: return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
		case 8116:
		case 7059:
		case 5753:
		case 5535:
		case 5445:
		case 5701:
		case 4933:
		case 4677:
		case 5533:
		case 5789:
		case 5021:
		case 4765:
			if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
				case 109: if (charat(value, length + 4) !== 45) break;
				case 102: return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length + 3) == 108 ? "$3" : "$2-$3")) + value;
				case 115: return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length) + value : value;
			}
			break;
		case 4949: if (charat(value, length + 1) !== 115) break;
		case 6444:
			switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
				case 107: return replace(value, ":", ":" + WEBKIT) + value;
				case 101: return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
			}
			break;
		case 5936:
			switch (charat(value, length + 11)) {
				case 114: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
				case 108: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
				case 45: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
			}
			return WEBKIT + value + MS + value + value;
	}
	return value;
}
var defaultStylisPlugins = [function prefixer(element, index, children, callback) {
	if (element.length > -1) {
		if (!element["return"]) switch (element.type) {
			case DECLARATION:
				element["return"] = prefix(element.value, element.length);
				break;
			case KEYFRAMES: return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
			case RULESET: if (element.length) return combine(element.props, function(value) {
				switch (match(value, /(::plac\w+|:read-\w+)/)) {
					case ":read-only":
					case ":read-write": return serialize([copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] })], callback);
					case "::placeholder": return serialize([
						copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }),
						copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }),
						copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] })
					], callback);
				}
				return "";
			});
		}
	}
}];
var getSourceMap;
var sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
getSourceMap = function getSourceMap(styles) {
	var matches = styles.match(sourceMapPattern);
	if (!matches) return;
	return matches[matches.length - 1];
};
var createCache = function createCache(options) {
	var key = options.key;
	if (!key) throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\nIf multiple caches share the same key they might \"fight\" for each other's style elements.");
	if (key === "css") {
		var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
		Array.prototype.forEach.call(ssrStyles, function(node) {
			if (node.getAttribute("data-emotion").indexOf(" ") === -1) return;
			document.head.appendChild(node);
			node.setAttribute("data-s", "");
		});
	}
	var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
	if (/[^a-z-]/.test(key)) throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
	var inserted = {};
	var container;
	var nodesToHydrate = [];
	container = options.container || document.head;
	Array.prototype.forEach.call(document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function(node) {
		var attrib = node.getAttribute("data-emotion").split(" ");
		for (var i = 1; i < attrib.length; i++) inserted[attrib[i]] = true;
		nodesToHydrate.push(node);
	});
	var _insert;
	var omnipresentPlugins = [compat, removeLabel];
	omnipresentPlugins.push(createUnsafeSelectorsAlarm({ get compat() {
		return cache.compat;
	} }), incorrectImportAlarm);
	var currentSheet;
	var finalizingPlugins = [stringify, function(element) {
		if (!element.root) {
			if (element["return"]) currentSheet.insert(element["return"]);
			else if (element.value && element.type !== "comm") currentSheet.insert(element.value + "{}");
		}
	}];
	var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
	var stylis = function stylis(styles) {
		return serialize(compile(styles), serializer);
	};
	_insert = function insert(selector, serialized, sheet, shouldCache) {
		currentSheet = sheet;
		if (getSourceMap) {
			var sourceMap = getSourceMap(serialized.styles);
			if (sourceMap) currentSheet = { insert: function insert(rule) {
				sheet.insert(rule + sourceMap);
			} };
		}
		stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
		if (shouldCache) cache.inserted[serialized.name] = true;
	};
	var cache = {
		key,
		sheet: new StyleSheet({
			key,
			container,
			nonce: options.nonce,
			speedy: options.speedy,
			prepend: options.prepend,
			insertionPoint: options.insertionPoint
		}),
		nonce: options.nonce,
		inserted,
		registered: {},
		insert: _insert
	};
	cache.sheet.hydrate(nodesToHydrate);
	return cache;
};
//#endregion
//#region node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js
/** @license React v16.13.1
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		"use strict";
		var hasSymbol = typeof Symbol === "function" && Symbol.for;
		var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
		var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
		var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
		var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
		var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
		var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
		var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
		var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
		var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
		var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
		var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
		var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
		var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
		var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
		var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
		var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
		var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
		var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
		function isValidElementType(type) {
			return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
		}
		function typeOf(object) {
			if (typeof object === "object" && object !== null) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = object.type;
						switch (type) {
							case REACT_ASYNC_MODE_TYPE:
							case REACT_CONCURRENT_MODE_TYPE:
							case REACT_FRAGMENT_TYPE:
							case REACT_PROFILER_TYPE:
							case REACT_STRICT_MODE_TYPE:
							case REACT_SUSPENSE_TYPE: return type;
							default:
								var $$typeofType = type && type.$$typeof;
								switch ($$typeofType) {
									case REACT_CONTEXT_TYPE:
									case REACT_FORWARD_REF_TYPE:
									case REACT_LAZY_TYPE:
									case REACT_MEMO_TYPE:
									case REACT_PROVIDER_TYPE: return $$typeofType;
									default: return $$typeof;
								}
						}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var AsyncMode = REACT_ASYNC_MODE_TYPE;
		var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
		var ContextConsumer = REACT_CONTEXT_TYPE;
		var ContextProvider = REACT_PROVIDER_TYPE;
		var Element = REACT_ELEMENT_TYPE;
		var ForwardRef = REACT_FORWARD_REF_TYPE;
		var Fragment = REACT_FRAGMENT_TYPE;
		var Lazy = REACT_LAZY_TYPE;
		var Memo = REACT_MEMO_TYPE;
		var Portal = REACT_PORTAL_TYPE;
		var Profiler = REACT_PROFILER_TYPE;
		var StrictMode = REACT_STRICT_MODE_TYPE;
		var Suspense = REACT_SUSPENSE_TYPE;
		var hasWarnedAboutDeprecatedIsAsyncMode = false;
		function isAsyncMode(object) {
			if (!hasWarnedAboutDeprecatedIsAsyncMode) {
				hasWarnedAboutDeprecatedIsAsyncMode = true;
				console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
			}
			return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
		}
		function isConcurrentMode(object) {
			return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
		}
		function isContextConsumer(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		}
		function isContextProvider(object) {
			return typeOf(object) === REACT_PROVIDER_TYPE;
		}
		function isElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function isForwardRef(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		}
		function isFragment(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		}
		function isLazy(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		}
		function isMemo(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		}
		function isPortal(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		}
		function isProfiler(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		}
		function isStrictMode(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		}
		function isSuspense(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		}
		exports.AsyncMode = AsyncMode;
		exports.ConcurrentMode = ConcurrentMode;
		exports.ContextConsumer = ContextConsumer;
		exports.ContextProvider = ContextProvider;
		exports.Element = Element;
		exports.ForwardRef = ForwardRef;
		exports.Fragment = Fragment;
		exports.Lazy = Lazy;
		exports.Memo = Memo;
		exports.Portal = Portal;
		exports.Profiler = Profiler;
		exports.StrictMode = StrictMode;
		exports.Suspense = Suspense;
		exports.isAsyncMode = isAsyncMode;
		exports.isConcurrentMode = isConcurrentMode;
		exports.isContextConsumer = isContextConsumer;
		exports.isContextProvider = isContextProvider;
		exports.isElement = isElement;
		exports.isForwardRef = isForwardRef;
		exports.isFragment = isFragment;
		exports.isLazy = isLazy;
		exports.isMemo = isMemo;
		exports.isPortal = isPortal;
		exports.isProfiler = isProfiler;
		exports.isStrictMode = isStrictMode;
		exports.isSuspense = isSuspense;
		exports.isValidElementType = isValidElementType;
		exports.typeOf = typeOf;
	})();
}));
//#endregion
//#region node_modules/hoist-non-react-statics/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_development();
}));
//#endregion
//#region node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var require_hoist_non_react_statics_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reactIs = require_react_is();
	/**
	* Copyright 2015, Yahoo! Inc.
	* Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	*/
	var REACT_STATICS = {
		childContextTypes: true,
		contextType: true,
		contextTypes: true,
		defaultProps: true,
		displayName: true,
		getDefaultProps: true,
		getDerivedStateFromError: true,
		getDerivedStateFromProps: true,
		mixins: true,
		propTypes: true,
		type: true
	};
	var KNOWN_STATICS = {
		name: true,
		length: true,
		prototype: true,
		caller: true,
		callee: true,
		arguments: true,
		arity: true
	};
	var FORWARD_REF_STATICS = {
		"$$typeof": true,
		render: true,
		defaultProps: true,
		displayName: true,
		propTypes: true
	};
	var MEMO_STATICS = {
		"$$typeof": true,
		compare: true,
		defaultProps: true,
		displayName: true,
		propTypes: true,
		type: true
	};
	var TYPE_STATICS = {};
	TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
	TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
	function getStatics(component) {
		if (reactIs.isMemo(component)) return MEMO_STATICS;
		return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
	}
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
		if (typeof sourceComponent !== "string") {
			if (objectPrototype) {
				var inheritedComponent = getPrototypeOf(sourceComponent);
				if (inheritedComponent && inheritedComponent !== objectPrototype) hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
			}
			var keys = getOwnPropertyNames(sourceComponent);
			if (getOwnPropertySymbols) keys = keys.concat(getOwnPropertySymbols(sourceComponent));
			var targetStatics = getStatics(targetComponent);
			var sourceStatics = getStatics(sourceComponent);
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
					var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
					try {
						defineProperty(targetComponent, key, descriptor);
					} catch (e) {}
				}
			}
		}
		return targetComponent;
	}
	module.exports = hoistNonReactStatics;
}));
//#endregion
//#region node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js
var isBrowser$1 = true;
function getRegisteredStyles(registered, registeredStyles, classNames) {
	var rawClassName = "";
	classNames.split(" ").forEach(function(className) {
		if (registered[className] !== void 0) registeredStyles.push(registered[className] + ";");
		else if (className) rawClassName += className + " ";
	});
	return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
	var className = cache.key + "-" + serialized.name;
	if ((isStringTag === false || isBrowser$1 === false) && cache.registered[className] === void 0) cache.registered[className] = serialized.styles;
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
	registerStyles(cache, serialized, isStringTag);
	var className = cache.key + "-" + serialized.name;
	if (cache.inserted[serialized.name] === void 0) {
		var current = serialized;
		do {
			cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
			current = current.next;
		} while (current !== void 0);
	}
};
//#endregion
//#region node_modules/@emotion/hash/dist/emotion-hash.esm.js
function murmur2(str) {
	var h = 0;
	var k, i = 0, len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
		k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
		k ^= k >>> 24;
		h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	switch (len) {
		case 3: h ^= (str.charCodeAt(i + 2) & 255) << 16;
		case 2: h ^= (str.charCodeAt(i + 1) & 255) << 8;
		case 1:
			h ^= str.charCodeAt(i) & 255;
			h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	h ^= h >>> 13;
	h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	return ((h ^ h >>> 15) >>> 0).toString(36);
}
//#endregion
//#region node_modules/@emotion/unitless/dist/emotion-unitless.esm.js
var unitlessKeys = {
	animationIterationCount: 1,
	aspectRatio: 1,
	borderImageOutset: 1,
	borderImageSlice: 1,
	borderImageWidth: 1,
	boxFlex: 1,
	boxFlexGroup: 1,
	boxOrdinalGroup: 1,
	columnCount: 1,
	columns: 1,
	flex: 1,
	flexGrow: 1,
	flexPositive: 1,
	flexShrink: 1,
	flexNegative: 1,
	flexOrder: 1,
	gridRow: 1,
	gridRowEnd: 1,
	gridRowSpan: 1,
	gridRowStart: 1,
	gridColumn: 1,
	gridColumnEnd: 1,
	gridColumnSpan: 1,
	gridColumnStart: 1,
	msGridRow: 1,
	msGridRowSpan: 1,
	msGridColumn: 1,
	msGridColumnSpan: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	scale: 1,
	tabSize: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1,
	WebkitLineClamp: 1,
	fillOpacity: 1,
	floodOpacity: 1,
	stopOpacity: 1,
	strokeDasharray: 1,
	strokeDashoffset: 1,
	strokeMiterlimit: 1,
	strokeOpacity: 1,
	strokeWidth: 1
};
//#endregion
//#region node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js
init_emotion_memoize_esm();
var isDevelopment$2 = true;
var ILLEGAL_ESCAPE_SEQUENCE_ERROR$1 = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var isCustomProperty = function isCustomProperty(property) {
	return property.charCodeAt(1) === 45;
};
var isProcessableValue = function isProcessableValue(value) {
	return value != null && typeof value !== "boolean";
};
var processStyleName = /* #__PURE__ */ memoize(function(styleName) {
	return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
});
var processStyleValue = function processStyleValue(key, value) {
	switch (key) {
		case "animation":
		case "animationName": if (typeof value === "string") return value.replace(animationRegex, function(match, p1, p2) {
			cursor = {
				name: p1,
				styles: p2,
				next: cursor
			};
			return p1;
		});
	}
	if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) return value + "px";
	return value;
};
var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
var contentValues = [
	"normal",
	"none",
	"initial",
	"inherit",
	"unset"
];
var oldProcessStyleValue = processStyleValue;
var msPattern = /^-ms-/;
var hyphenPattern = /-(.)/g;
var hyphenatedCache = {};
processStyleValue = function processStyleValue(key, value) {
	if (key === "content") {
		if (typeof value !== "string" || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== "\"" && value.charAt(0) !== "'")) throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
	}
	var processed = oldProcessStyleValue(key, value);
	if (processed !== "" && !isCustomProperty(key) && key.indexOf("-") !== -1 && hyphenatedCache[key] === void 0) {
		hyphenatedCache[key] = true;
		console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, "ms-").replace(hyphenPattern, function(str, _char) {
			return _char.toUpperCase();
		}) + "?");
	}
	return processed;
};
var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
function handleInterpolation(mergedProps, registered, interpolation) {
	if (interpolation == null) return "";
	var componentSelector = interpolation;
	if (componentSelector.__emotion_styles !== void 0) {
		if (String(componentSelector) === "NO_COMPONENT_SELECTOR") throw new Error(noComponentSelectorMessage);
		return componentSelector;
	}
	switch (typeof interpolation) {
		case "boolean": return "";
		case "object":
			var keyframes = interpolation;
			if (keyframes.anim === 1) {
				cursor = {
					name: keyframes.name,
					styles: keyframes.styles,
					next: cursor
				};
				return keyframes.name;
			}
			var serializedStyles = interpolation;
			if (serializedStyles.styles !== void 0) {
				var next = serializedStyles.next;
				if (next !== void 0) while (next !== void 0) {
					cursor = {
						name: next.name,
						styles: next.styles,
						next: cursor
					};
					next = next.next;
				}
				return serializedStyles.styles + ";";
			}
			return createStringFromObject(mergedProps, registered, interpolation);
		case "function":
			if (mergedProps !== void 0) {
				var previousCursor = cursor;
				var result = interpolation(mergedProps);
				cursor = previousCursor;
				return handleInterpolation(mergedProps, registered, result);
			} else console.error("Functions that are interpolated in css calls will be stringified.\nIf you want to have a css call based on props, create a function that returns a css call like this\nlet dynamicStyle = (props) => css`color: ${props.color}`\nIt can be called directly with props or interpolated in a styled call like this\nlet SomeComponent = styled('div')`${dynamicStyle}`");
			break;
		case "string":
			var matched = [];
			var replaced = interpolation.replace(animationRegex, function(_match, _p1, p2) {
				var fakeVarName = "animation" + matched.length;
				matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, "") + "`");
				return "${" + fakeVarName + "}";
			});
			if (matched.length) console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(matched, ["`" + replaced + "`"]).join("\n") + "\n\nYou should wrap it with `css` like this:\n\ncss`" + replaced + "`");
			break;
	}
	var asString = interpolation;
	if (registered == null) return asString;
	var cached = registered[asString];
	return cached !== void 0 ? cached : asString;
}
function createStringFromObject(mergedProps, registered, obj) {
	var string = "";
	if (Array.isArray(obj)) for (var i = 0; i < obj.length; i++) string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
	else for (var key in obj) {
		var value = obj[key];
		if (typeof value !== "object") {
			var asString = value;
			if (registered != null && registered[asString] !== void 0) string += key + "{" + registered[asString] + "}";
			else if (isProcessableValue(asString)) string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
		} else {
			if (key === "NO_COMPONENT_SELECTOR" && isDevelopment$2) throw new Error(noComponentSelectorMessage);
			if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
				for (var _i = 0; _i < value.length; _i++) if (isProcessableValue(value[_i])) string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
			} else {
				var interpolated = handleInterpolation(mergedProps, registered, value);
				switch (key) {
					case "animation":
					case "animationName":
						string += processStyleName(key) + ":" + interpolated + ";";
						break;
					default:
						if (key === "undefined") console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
						string += key + "{" + interpolated + "}";
				}
			}
		}
	}
	return string;
}
var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g;
var cursor;
function serializeStyles(args, registered, mergedProps) {
	if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) return args[0];
	var stringMode = true;
	var styles = "";
	cursor = void 0;
	var strings = args[0];
	if (strings == null || strings.raw === void 0) {
		stringMode = false;
		styles += handleInterpolation(mergedProps, registered, strings);
	} else {
		var asTemplateStringsArr = strings;
		if (asTemplateStringsArr[0] === void 0) console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
		styles += asTemplateStringsArr[0];
	}
	for (var i = 1; i < args.length; i++) {
		styles += handleInterpolation(mergedProps, registered, args[i]);
		if (stringMode) {
			var templateStringsArr = strings;
			if (templateStringsArr[i] === void 0) console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR$1);
			styles += templateStringsArr[i];
		}
	}
	labelPattern.lastIndex = 0;
	var identifierName = "";
	var match;
	while ((match = labelPattern.exec(styles)) !== null) identifierName += "-" + match[1];
	return {
		name: murmur2(styles) + identifierName,
		styles,
		next: cursor,
		toString: function toString() {
			return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
		}
	};
}
//#endregion
//#region node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js
var syncFallback = function syncFallback(create) {
	return create();
};
var useInsertionEffect = import_react.useInsertionEffect ? import_react.useInsertionEffect : false;
var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
var useInsertionEffectWithLayoutFallback = useInsertionEffect || import_react.useLayoutEffect;
//#endregion
//#region node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js
var EmotionCacheContext = /* #__PURE__ */ import_react.createContext(typeof HTMLElement !== "undefined" ? /* #__PURE__ */ createCache({ key: "css" }) : null);
EmotionCacheContext.displayName = "EmotionCacheContext";
EmotionCacheContext.Provider;
var withEmotionCache = function withEmotionCache(func) {
	return /*#__PURE__*/ (0, import_react.forwardRef)(function(props, ref) {
		return func(props, (0, import_react.useContext)(EmotionCacheContext), ref);
	});
};
var ThemeContext = /* #__PURE__ */ import_react.createContext({});
ThemeContext.displayName = "EmotionThemeContext";
var hasOwn = {}.hasOwnProperty;
var getLastPart = function getLastPart(functionName) {
	var parts = functionName.split(".");
	return parts[parts.length - 1];
};
var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
	var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
	if (match) return getLastPart(match[1]);
	match = /^([A-Za-z0-9$.]+)@/.exec(line);
	if (match) return getLastPart(match[1]);
};
var internalReactFunctionNames = /* #__PURE__ */ new Set([
	"renderWithHooks",
	"processChild",
	"finishClassComponent",
	"renderToString"
]);
var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
	return identifier.replace(/\$/g, "-");
};
var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
	if (!stackTrace) return void 0;
	var lines = stackTrace.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var functionName = getFunctionNameFromStackTraceLine(lines[i]);
		if (!functionName) continue;
		if (internalReactFunctionNames.has(functionName)) break;
		if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
	}
};
var typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
var labelPropName = "__EMOTION_LABEL_PLEASE_DO_NOT_USE__";
var createEmotionProps = function createEmotionProps(type, props) {
	if (typeof props.css === "string" && props.css.indexOf(":") !== -1) throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
	var newProps = {};
	for (var _key in props) if (hasOwn.call(props, _key)) newProps[_key] = props[_key];
	newProps[typePropName] = type;
	if (typeof globalThis !== "undefined" && !!globalThis.EMOTION_RUNTIME_AUTO_LABEL && !!props.css && (typeof props.css !== "object" || !("name" in props.css) || typeof props.css.name !== "string" || props.css.name.indexOf("-") === -1)) {
		var label = getLabelFromStackTrace((/* @__PURE__ */ new Error()).stack);
		if (label) newProps[labelPropName] = label;
	}
	return newProps;
};
var Insertion$2 = function Insertion(_ref) {
	var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
	registerStyles(cache, serialized, isStringTag);
	useInsertionEffectAlwaysWithSyncFallback(function() {
		return insertStyles(cache, serialized, isStringTag);
	});
	return null;
};
var Emotion = /* #__PURE__ */ withEmotionCache(function(props, cache, ref) {
	var cssProp = props.css;
	if (typeof cssProp === "string" && cache.registered[cssProp] !== void 0) cssProp = cache.registered[cssProp];
	var WrappedComponent = props[typePropName];
	var registeredStyles = [cssProp];
	var className = "";
	if (typeof props.className === "string") className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
	else if (props.className != null) className = props.className + " ";
	var serialized = serializeStyles(registeredStyles, void 0, import_react.useContext(ThemeContext));
	if (serialized.name.indexOf("-") === -1) {
		var labelFromStack = props[labelPropName];
		if (labelFromStack) serialized = serializeStyles([serialized, "label:" + labelFromStack + ";"]);
	}
	className += cache.key + "-" + serialized.name;
	var newProps = {};
	for (var _key2 in props) if (hasOwn.call(props, _key2) && _key2 !== "css" && _key2 !== typePropName && _key2 !== labelPropName) newProps[_key2] = props[_key2];
	newProps.className = className;
	if (ref) newProps.ref = ref;
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(Insertion$2, {
		cache,
		serialized,
		isStringTag: typeof WrappedComponent === "string"
	}), /*#__PURE__*/ import_react.createElement(WrappedComponent, newProps));
});
Emotion.displayName = "EmotionCssPropInternal";
var Emotion$1 = Emotion;
require_hoist_non_react_statics_cjs();
var isDevelopment$1 = true;
var pkg = {
	name: "@emotion/react",
	version: "11.14.0",
	main: "dist/emotion-react.cjs.js",
	module: "dist/emotion-react.esm.js",
	types: "dist/emotion-react.cjs.d.ts",
	exports: {
		".": {
			types: {
				"import": "./dist/emotion-react.cjs.mjs",
				"default": "./dist/emotion-react.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				worker: {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./dist/emotion-react.development.edge-light.esm.js",
					"import": "./dist/emotion-react.development.edge-light.cjs.mjs",
					"default": "./dist/emotion-react.development.edge-light.cjs.js"
				},
				browser: {
					module: "./dist/emotion-react.browser.development.esm.js",
					"import": "./dist/emotion-react.browser.development.cjs.mjs",
					"default": "./dist/emotion-react.browser.development.cjs.js"
				},
				module: "./dist/emotion-react.development.esm.js",
				"import": "./dist/emotion-react.development.cjs.mjs",
				"default": "./dist/emotion-react.development.cjs.js"
			},
			"edge-light": {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			worker: {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			workerd: {
				module: "./dist/emotion-react.edge-light.esm.js",
				"import": "./dist/emotion-react.edge-light.cjs.mjs",
				"default": "./dist/emotion-react.edge-light.cjs.js"
			},
			browser: {
				module: "./dist/emotion-react.browser.esm.js",
				"import": "./dist/emotion-react.browser.cjs.mjs",
				"default": "./dist/emotion-react.browser.cjs.js"
			},
			module: "./dist/emotion-react.esm.js",
			"import": "./dist/emotion-react.cjs.mjs",
			"default": "./dist/emotion-react.cjs.js"
		},
		"./jsx-runtime": {
			types: {
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				worker: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.edge-light.cjs.js"
				},
				browser: {
					module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.esm.js",
					"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.mjs",
					"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.development.cjs.js"
				},
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.development.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.development.cjs.js"
			},
			"edge-light": {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			worker: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			workerd: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.edge-light.cjs.js"
			},
			browser: {
				module: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js",
				"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.mjs",
				"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.cjs.js"
			},
			module: "./jsx-runtime/dist/emotion-react-jsx-runtime.esm.js",
			"import": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.mjs",
			"default": "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
		},
		"./_isolated-hnrs": {
			types: {
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				worker: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.edge-light.cjs.js"
				},
				browser: {
					module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js",
					"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.mjs",
					"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.cjs.js"
				},
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.development.cjs.js"
			},
			"edge-light": {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			worker: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			workerd: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.edge-light.cjs.js"
			},
			browser: {
				module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js",
				"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.mjs",
				"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.cjs.js"
			},
			module: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.esm.js",
			"import": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.mjs",
			"default": "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
		},
		"./jsx-dev-runtime": {
			types: {
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
			},
			development: {
				"edge-light": {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				worker: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				workerd: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.edge-light.cjs.js"
				},
				browser: {
					module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.esm.js",
					"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.mjs",
					"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.development.cjs.js"
				},
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.development.cjs.js"
			},
			"edge-light": {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			worker: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			workerd: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.edge-light.cjs.js"
			},
			browser: {
				module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.esm.js",
				"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.mjs",
				"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.cjs.js"
			},
			module: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.esm.js",
			"import": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.mjs",
			"default": "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
		},
		"./package.json": "./package.json",
		"./types/css-prop": "./types/css-prop.d.ts",
		"./macro": {
			types: {
				"import": "./macro.d.mts",
				"default": "./macro.d.ts"
			},
			"default": "./macro.js"
		}
	},
	imports: {
		"#is-development": {
			development: "./src/conditions/true.ts",
			"default": "./src/conditions/false.ts"
		},
		"#is-browser": {
			"edge-light": "./src/conditions/false.ts",
			workerd: "./src/conditions/false.ts",
			worker: "./src/conditions/false.ts",
			browser: "./src/conditions/true.ts",
			"default": "./src/conditions/is-browser.ts"
		}
	},
	files: [
		"src",
		"dist",
		"jsx-runtime",
		"jsx-dev-runtime",
		"_isolated-hnrs",
		"types/css-prop.d.ts",
		"macro.*"
	],
	sideEffects: false,
	author: "Emotion Contributors",
	license: "MIT",
	scripts: { "test:typescript": "dtslint types" },
	dependencies: {
		"@babel/runtime": "^7.18.3",
		"@emotion/babel-plugin": "^11.13.5",
		"@emotion/cache": "^11.14.0",
		"@emotion/serialize": "^1.3.3",
		"@emotion/use-insertion-effect-with-fallbacks": "^1.2.0",
		"@emotion/utils": "^1.4.2",
		"@emotion/weak-memoize": "^0.4.0",
		"hoist-non-react-statics": "^3.3.1"
	},
	peerDependencies: { react: ">=16.8.0" },
	peerDependenciesMeta: { "@types/react": { optional: true } },
	devDependencies: {
		"@definitelytyped/dtslint": "0.0.112",
		"@emotion/css": "11.13.5",
		"@emotion/css-prettifier": "1.2.0",
		"@emotion/server": "11.11.0",
		"@emotion/styled": "11.14.0",
		"@types/hoist-non-react-statics": "^3.3.5",
		"html-tag-names": "^1.1.2",
		react: "16.14.0",
		"svg-tag-names": "^1.1.1",
		typescript: "^5.4.5"
	},
	repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
	publishConfig: { access: "public" },
	"umd:main": "dist/emotion-react.umd.min.js",
	preconstruct: {
		entrypoints: [
			"./index.ts",
			"./jsx-runtime.ts",
			"./jsx-dev-runtime.ts",
			"./_isolated-hnrs.ts"
		],
		umdName: "emotionReact",
		exports: { extra: {
			"./types/css-prop": "./types/css-prop.d.ts",
			"./macro": {
				types: {
					"import": "./macro.d.mts",
					"default": "./macro.d.ts"
				},
				"default": "./macro.js"
			}
		} }
	}
};
var jsx = function jsx(type, props) {
	var args = arguments;
	if (props == null || !hasOwn.call(props, "css")) return import_react.createElement.apply(void 0, args);
	var argsLength = args.length;
	var createElementArgArray = new Array(argsLength);
	createElementArgArray[0] = Emotion$1;
	createElementArgArray[1] = createEmotionProps(type, props);
	for (var i = 2; i < argsLength; i++) createElementArgArray[i] = args[i];
	return import_react.createElement.apply(null, createElementArgArray);
};
(function(_jsx) {
	var JSX;
	JSX || (JSX = _jsx.JSX || (_jsx.JSX = {}));
})(jsx || (jsx = {}));
var warnedAboutCssPropForGlobal = false;
var Global = /* #__PURE__ */ withEmotionCache(function(props, cache) {
	if (!warnedAboutCssPropForGlobal && ("className" in props && props.className || "css" in props && props.css)) {
		console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
		warnedAboutCssPropForGlobal = true;
	}
	var styles = props.styles;
	var serialized = serializeStyles([styles], void 0, import_react.useContext(ThemeContext));
	var sheetRef = import_react.useRef();
	useInsertionEffectWithLayoutFallback(function() {
		var key = cache.key + "-global";
		var sheet = new cache.sheet.constructor({
			key,
			nonce: cache.sheet.nonce,
			container: cache.sheet.container,
			speedy: cache.sheet.isSpeedy
		});
		var rehydrating = false;
		var node = document.querySelector("style[data-emotion=\"" + key + " " + serialized.name + "\"]");
		if (cache.sheet.tags.length) sheet.before = cache.sheet.tags[0];
		if (node !== null) {
			rehydrating = true;
			node.setAttribute("data-emotion", key);
			sheet.hydrate([node]);
		}
		sheetRef.current = [sheet, rehydrating];
		return function() {
			sheet.flush();
		};
	}, [cache]);
	useInsertionEffectWithLayoutFallback(function() {
		var sheetRefCurrent = sheetRef.current;
		var sheet = sheetRefCurrent[0];
		if (sheetRefCurrent[1]) {
			sheetRefCurrent[1] = false;
			return;
		}
		if (serialized.next !== void 0) insertStyles(cache, serialized.next, true);
		if (sheet.tags.length) {
			sheet.before = sheet.tags[sheet.tags.length - 1].nextElementSibling;
			sheet.flush();
		}
		cache.insert("", serialized, sheet, false);
	}, [cache, serialized.name]);
	return null;
});
Global.displayName = "EmotionGlobal";
var classnames = function classnames(args) {
	var len = args.length;
	var i = 0;
	var cls = "";
	for (; i < len; i++) {
		var arg = args[i];
		if (arg == null) continue;
		var toAdd = void 0;
		switch (typeof arg) {
			case "boolean": break;
			case "object":
				if (Array.isArray(arg)) toAdd = classnames(arg);
				else {
					if (arg.styles !== void 0 && arg.name !== void 0) console.error("You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.");
					toAdd = "";
					for (var k in arg) if (arg[k] && k) {
						toAdd && (toAdd += " ");
						toAdd += k;
					}
				}
				break;
			default: toAdd = arg;
		}
		if (toAdd) {
			cls && (cls += " ");
			cls += toAdd;
		}
	}
	return cls;
};
function merge(registered, css, className) {
	var registeredStyles = [];
	var rawClassName = getRegisteredStyles(registered, registeredStyles, className);
	if (registeredStyles.length < 2) return className;
	return rawClassName + css(registeredStyles);
}
var Insertion$1 = function Insertion(_ref) {
	var cache = _ref.cache, serializedArr = _ref.serializedArr;
	useInsertionEffectAlwaysWithSyncFallback(function() {
		for (var i = 0; i < serializedArr.length; i++) insertStyles(cache, serializedArr[i], false);
	});
	return null;
};
var ClassNames = /* #__PURE__ */ withEmotionCache(function(props, cache) {
	var hasRendered = false;
	var serializedArr = [];
	var css = function css() {
		if (hasRendered && isDevelopment$1) throw new Error("css can only be used during render");
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		var serialized = serializeStyles(args, cache.registered);
		serializedArr.push(serialized);
		registerStyles(cache, serialized, false);
		return cache.key + "-" + serialized.name;
	};
	var content = {
		css,
		cx: function cx() {
			if (hasRendered && isDevelopment$1) throw new Error("cx can only be used during render");
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
			return merge(cache.registered, css, classnames(args));
		},
		theme: import_react.useContext(ThemeContext)
	};
	var ele = props.children(content);
	hasRendered = true;
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(Insertion$1, {
		cache,
		serializedArr
	}), ele);
});
ClassNames.displayName = "EmotionClassNames";
var isBrowser = typeof document !== "undefined";
if (isBrowser && !(typeof jest !== "undefined" || typeof vi !== "undefined")) {
	var globalContext = typeof globalThis !== "undefined" ? globalThis : isBrowser ? window : global;
	var globalKey = "__EMOTION_REACT_" + pkg.version.split(".")[0] + "__";
	if (globalContext[globalKey]) console.warn("You are loading @emotion/react when it is already loaded. Running multiple instances may cause problems. This can happen if multiple versions are used, or if multiple builds of the same version are used.");
	globalContext[globalKey] = true;
}
//#endregion
//#region node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js
var isDevelopment = true;
var testOmitPropsOnStringTag = isPropValid;
var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
	return key !== "theme";
};
var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
	return typeof tag === "string" && tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
	var shouldForwardProp;
	if (options) {
		var optionsShouldForwardProp = options.shouldForwardProp;
		shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
			return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
		} : optionsShouldForwardProp;
	}
	if (typeof shouldForwardProp !== "function" && isReal) shouldForwardProp = tag.__emotion_forwardProp;
	return shouldForwardProp;
};
var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var Insertion = function Insertion(_ref) {
	var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
	registerStyles(cache, serialized, isStringTag);
	useInsertionEffectAlwaysWithSyncFallback(function() {
		return insertStyles(cache, serialized, isStringTag);
	});
	return null;
};
var createStyled$1 = function createStyled(tag, options) {
	if (tag === void 0) throw new Error("You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.");
	var isReal = tag.__emotion_real === tag;
	var baseTag = isReal && tag.__emotion_base || tag;
	var identifierName;
	var targetClassName;
	if (options !== void 0) {
		identifierName = options.label;
		targetClassName = options.target;
	}
	var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
	var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
	var shouldUseAs = !defaultShouldForwardProp("as");
	return function() {
		var args = arguments;
		var styles = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
		if (identifierName !== void 0) styles.push("label:" + identifierName + ";");
		if (args[0] == null || args[0].raw === void 0) styles.push.apply(styles, args);
		else {
			var templateStringsArr = args[0];
			if (templateStringsArr[0] === void 0) console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
			styles.push(templateStringsArr[0]);
			var len = args.length;
			var i = 1;
			for (; i < len; i++) {
				if (templateStringsArr[i] === void 0) console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
				styles.push(args[i], templateStringsArr[i]);
			}
		}
		var Styled = withEmotionCache(function(props, cache, ref) {
			var FinalTag = shouldUseAs && props.as || baseTag;
			var className = "";
			var classInterpolations = [];
			var mergedProps = props;
			if (props.theme == null) {
				mergedProps = {};
				for (var key in props) mergedProps[key] = props[key];
				mergedProps.theme = import_react.useContext(ThemeContext);
			}
			if (typeof props.className === "string") className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
			else if (props.className != null) className = props.className + " ";
			var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
			className += cache.key + "-" + serialized.name;
			if (targetClassName !== void 0) className += " " + targetClassName;
			var finalShouldForwardProp = shouldUseAs && shouldForwardProp === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
			var newProps = {};
			for (var _key in props) {
				if (shouldUseAs && _key === "as") continue;
				if (finalShouldForwardProp(_key)) newProps[_key] = props[_key];
			}
			newProps.className = className;
			if (ref) newProps.ref = ref;
			return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(Insertion, {
				cache,
				serialized,
				isStringTag: typeof FinalTag === "string"
			}), /*#__PURE__*/ import_react.createElement(FinalTag, newProps));
		});
		Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
		Styled.defaultProps = tag.defaultProps;
		Styled.__emotion_real = Styled;
		Styled.__emotion_base = baseTag;
		Styled.__emotion_styles = styles;
		Styled.__emotion_forwardProp = shouldForwardProp;
		Object.defineProperty(Styled, "toString", { value: function value() {
			if (targetClassName === void 0 && isDevelopment) return "NO_COMPONENT_SELECTOR";
			return "." + targetClassName;
		} });
		Styled.withComponent = function(nextTag, nextOptions) {
			return createStyled(nextTag, _extends({}, options, nextOptions, { shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true) })).apply(void 0, styles);
		};
		return Styled;
	};
};
//#endregion
//#region node_modules/@emotion/styled/dist/emotion-styled.browser.development.esm.js
var tags = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"big",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meta",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr",
	"circle",
	"clipPath",
	"defs",
	"ellipse",
	"foreignObject",
	"g",
	"image",
	"line",
	"linearGradient",
	"mask",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialGradient",
	"rect",
	"stop",
	"svg",
	"text",
	"tspan"
];
var styled$2 = createStyled$1.bind(null);
tags.forEach(function(tagName) {
	styled$2[tagName] = styled$2(tagName);
});
//#endregion
//#region node_modules/@mui/styled-engine/index.mjs
/**
* @mui/styled-engine v9.1.0
*
* @license MIT
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
function styled$1(tag, options) {
	const stylesFactory = styled$2(tag, options);
	return (...styles) => {
		const component = typeof tag === "string" ? `"${tag}"` : "component";
		if (styles.length === 0) console.error([`MUI: Seems like you called \`styled(${component})()\` without a \`style\` argument.`, "You must provide a `styles` argument: `styled(\"div\")(styleYouForgotToPass)`."].join("\n"));
		else if (styles.some((style) => style === void 0)) console.error(`MUI: the styled(${component})(...args) API requires all its args to be defined.`);
		return stylesFactory(...styles);
	};
}
/**
* For internal usage in `@mui/system` package
*/
function internal_mutateStyles(tag, processor) {
	if (Array.isArray(tag.__emotion_styles)) tag.__emotion_styles = processor(tag.__emotion_styles);
}
var wrapper = [];
function internal_serializeStyles(styles) {
	wrapper[0] = styles;
	return serializeStyles(wrapper);
}
/** Same as StyledOptions but shouldForwardProp must be a type guard */
/**
* @typeparam ComponentProps  Props which will be included when withComponent is called
* @typeparam SpecificComponentProps  Props which will *not* be included when withComponent is called
*/
//#endregion
//#region node_modules/@mui/system/createTheme/shape.mjs
var shape = { borderRadius: 4 };
//#endregion
//#region node_modules/@mui/system/createTheme/createSpacing.mjs
function createSpacing(spacingInput = 8, transform = createUnarySpacing({ spacing: spacingInput })) {
	if (spacingInput.mui) return spacingInput;
	const spacing = (...argsInput) => {
		if (!(argsInput.length <= 4)) console.error(`MUI: Too many arguments provided, expected between 0 and 4, got ${argsInput.length}`);
		return (argsInput.length === 0 ? [1] : argsInput).map((argument) => {
			const output = transform(argument);
			return typeof output === "number" ? `${output}px` : output;
		}).join(" ");
	};
	spacing.mui = true;
	return spacing;
}
//#endregion
//#region node_modules/@mui/system/createTheme/applyStyles.mjs
/**
* A universal utility to style components with multiple color modes. Always use it from the theme object.
* It works with:
*  - [Basic theme](https://mui.com/material-ui/customization/dark-mode/)
*  - [CSS theme variables](https://mui.com/material-ui/customization/css-theme-variables/overview/)
*  - Zero-runtime engine
*
* Tips: Use an array over object spread and place `theme.applyStyles()` last.
*
* With the styled function:
* ✅ [{ background: '#e5e5e5' }, theme.applyStyles('dark', { background: '#1c1c1c' })]
* 🚫 { background: '#e5e5e5', ...theme.applyStyles('dark', { background: '#1c1c1c' })}
*
* With the sx prop:
* ✅ [{ background: '#e5e5e5' }, theme => theme.applyStyles('dark', { background: '#1c1c1c' })]
* 🚫 { background: '#e5e5e5', ...theme => theme.applyStyles('dark', { background: '#1c1c1c' })}
*
* @example
* 1. using with `styled`:
* ```jsx
*   const Component = styled('div')(({ theme }) => [
*     { background: '#e5e5e5' },
*     theme.applyStyles('dark', {
*       background: '#1c1c1c',
*       color: '#fff',
*     }),
*   ]);
* ```
*
* @example
* 2. using with `sx` prop:
* ```jsx
*   <Box sx={[
*     { background: '#e5e5e5' },
*     theme => theme.applyStyles('dark', {
*        background: '#1c1c1c',
*        color: '#fff',
*      }),
*     ]}
*   />
* ```
*
* @example
* 3. theming a component:
* ```jsx
*   extendTheme({
*     components: {
*       MuiButton: {
*         styleOverrides: {
*           root: ({ theme }) => [
*             { background: '#e5e5e5' },
*             theme.applyStyles('dark', {
*               background: '#1c1c1c',
*               color: '#fff',
*             }),
*           ],
*         },
*       }
*     }
*   })
*```
*/
function applyStyles$1(key, styles) {
	const theme = this;
	if (theme.vars) {
		if (!theme.colorSchemes?.[key] || typeof theme.getColorSchemeSelector !== "function") return {};
		let selector = theme.getColorSchemeSelector(key);
		if (selector === "&") return styles;
		if (selector.includes("data-") || selector.includes(".")) selector = `*:where(${selector.replace(/\s*&$/, "")}) &`;
		return { [selector]: styles };
	}
	if (theme.palette.mode === key) return styles;
	return {};
}
//#endregion
//#region node_modules/@mui/system/createTheme/createTheme.mjs
function createTheme$1(options = {}, ...args) {
	const { breakpoints: breakpointsInput = {}, palette: paletteInput = {}, spacing: spacingInput, shape: shapeInput = {}, ...other } = options;
	const breakpoints = createBreakpoints(breakpointsInput);
	const spacing = createSpacing(spacingInput);
	let muiTheme = deepmerge({
		breakpoints,
		direction: "ltr",
		components: {},
		palette: {
			mode: "light",
			...paletteInput
		},
		spacing,
		shape: {
			...shape,
			...shapeInput
		}
	}, other);
	muiTheme = cssContainerQueries(muiTheme);
	muiTheme.applyStyles = applyStyles$1;
	muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
	muiTheme.unstable_sxConfig = {
		...defaultSxConfig,
		...other?.unstable_sxConfig
	};
	muiTheme.unstable_sx = function sx(props) {
		return styleFunctionSx_default({
			sx: props,
			theme: this
		});
	};
	muiTheme.internal_cache = {};
	return muiTheme;
}
//#endregion
//#region node_modules/@mui/system/useThemeWithoutDefault/useThemeWithoutDefault.mjs
function isObjectEmpty(obj) {
	return Object.keys(obj).length === 0;
}
function useTheme$2(defaultTheme = null) {
	const contextTheme = import_react.useContext(ThemeContext);
	return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme : contextTheme;
}
//#endregion
//#region node_modules/@mui/system/useTheme/useTheme.mjs
var systemDefaultTheme$1 = createTheme$1();
function useTheme$1(defaultTheme = systemDefaultTheme$1) {
	return useTheme$2(defaultTheme);
}
//#endregion
//#region node_modules/@mui/utils/ClassNameGenerator/ClassNameGenerator.mjs
var defaultGenerator = (componentName) => componentName;
var createClassNameGenerator = () => {
	let generate = defaultGenerator;
	return {
		configure(generator) {
			generate = generator;
		},
		generate(componentName) {
			return generate(componentName);
		},
		reset() {
			generate = defaultGenerator;
		}
	};
};
var ClassNameGenerator = createClassNameGenerator();
//#endregion
//#region node_modules/@mui/utils/generateUtilityClass/generateUtilityClass.mjs
var globalStateClasses = {
	active: "active",
	checked: "checked",
	completed: "completed",
	disabled: "disabled",
	error: "error",
	expanded: "expanded",
	focused: "focused",
	focusVisible: "focusVisible",
	open: "open",
	readOnly: "readOnly",
	required: "required",
	selected: "selected"
};
function generateUtilityClass(componentName, slot, globalStatePrefix = "Mui") {
	const globalStateClass = globalStateClasses[slot];
	return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator.generate(componentName)}-${slot}`;
}
//#endregion
//#region node_modules/@mui/utils/generateUtilityClasses/generateUtilityClasses.mjs
function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
	const result = {};
	slots.forEach((slot) => {
		result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
	});
	return result;
}
//#endregion
//#region node_modules/@mui/utils/getDisplayName/getDisplayName.mjs
function getFunctionComponentName(Component, fallback = "") {
	return Component.displayName || Component.name || fallback;
}
function getWrappedName(outerType, innerType, wrapperName) {
	const functionName = getFunctionComponentName(innerType);
	return outerType.displayName || (functionName !== "" ? `${wrapperName}(${functionName})` : wrapperName);
}
/**
* cherry-pick from
* https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/shared/getComponentName.js
* originally forked from recompose/getDisplayName
*/
function getDisplayName(Component) {
	if (Component == null) return;
	if (typeof Component === "string") return Component;
	if (typeof Component === "function") return getFunctionComponentName(Component, "Component");
	if (typeof Component === "object") switch (Component.$$typeof) {
		case import_react_is.ForwardRef: return getWrappedName(Component, Component.render, "ForwardRef");
		case import_react_is.Memo: return getWrappedName(Component, Component.type, "memo");
		default: return;
	}
}
//#endregion
//#region node_modules/@mui/system/preprocessStyles.mjs
function preprocessStyles(input) {
	const { variants, ...style } = input;
	const result = {
		variants,
		style: internal_serializeStyles(style),
		isProcessed: true
	};
	if (result.style === style) return result;
	if (variants) variants.forEach((variant) => {
		if (typeof variant.style !== "function") variant.style = internal_serializeStyles(variant.style);
	});
	return result;
}
//#endregion
//#region node_modules/@mui/system/createStyled/createStyled.mjs
var systemDefaultTheme = createTheme$1();
function shouldForwardProp(prop) {
	return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
function shallowLayer(serialized, layerName) {
	if (layerName && serialized && typeof serialized === "object" && serialized.styles && !serialized.styles.startsWith("@layer")) serialized.styles = `@layer ${layerName}{${String(serialized.styles)}}`;
	return serialized;
}
function defaultOverridesResolver(slot) {
	if (!slot) return null;
	return (_props, styles) => styles[slot];
}
function attachTheme(props, themeId, defaultTheme) {
	props.theme = isObjectEmpty$1(props.theme) ? defaultTheme : props.theme[themeId] || props.theme;
}
function processStyle(props, style, layerName) {
	const resolvedStyle = typeof style === "function" ? style(props) : style;
	if (Array.isArray(resolvedStyle)) return resolvedStyle.flatMap((subStyle) => processStyle(props, subStyle, layerName));
	if (Array.isArray(resolvedStyle?.variants)) {
		let rootStyle;
		if (resolvedStyle.isProcessed) rootStyle = layerName ? shallowLayer(resolvedStyle.style, layerName) : resolvedStyle.style;
		else {
			const { variants, ...otherStyles } = resolvedStyle;
			rootStyle = layerName ? shallowLayer(internal_serializeStyles(otherStyles), layerName) : otherStyles;
		}
		return processStyleVariants(props, resolvedStyle.variants, [rootStyle], layerName);
	}
	if (resolvedStyle?.isProcessed) return layerName ? shallowLayer(internal_serializeStyles(resolvedStyle.style), layerName) : resolvedStyle.style;
	return layerName ? shallowLayer(internal_serializeStyles(resolvedStyle), layerName) : resolvedStyle;
}
function processStyleVariants(props, variants, results = [], layerName = void 0) {
	let mergedState;
	variantLoop: for (let i = 0; i < variants.length; i += 1) {
		const variant = variants[i];
		if (typeof variant.props === "function") {
			mergedState ??= {
				...props,
				...props.ownerState,
				ownerState: props.ownerState
			};
			if (!variant.props(mergedState)) continue;
		} else for (const key in variant.props) if (props[key] !== variant.props[key] && props.ownerState?.[key] !== variant.props[key]) continue variantLoop;
		if (typeof variant.style === "function") {
			mergedState ??= {
				...props,
				...props.ownerState,
				ownerState: props.ownerState
			};
			results.push(layerName ? shallowLayer(internal_serializeStyles(variant.style(mergedState)), layerName) : variant.style(mergedState));
		} else results.push(layerName ? shallowLayer(internal_serializeStyles(variant.style), layerName) : variant.style);
	}
	return results;
}
function createStyled(input = {}) {
	const { themeId, defaultTheme = systemDefaultTheme, rootShouldForwardProp = shouldForwardProp, slotShouldForwardProp = shouldForwardProp } = input;
	function styleAttachTheme(props) {
		attachTheme(props, themeId, defaultTheme);
	}
	const styled = (tag, inputOptions = {}) => {
		internal_mutateStyles(tag, (styles) => styles.filter((style) => style !== styleFunctionSx_default));
		const { name: componentName, slot: componentSlot, skipVariantsResolver: inputSkipVariantsResolver, skipSx: inputSkipSx, overridesResolver = defaultOverridesResolver(lowercaseFirstLetter(componentSlot)), ...options } = inputOptions;
		const layerName = componentName && componentName.startsWith("Mui") || !!componentSlot ? "components" : "custom";
		const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : componentSlot && componentSlot !== "Root" && componentSlot !== "root" || false;
		const skipSx = inputSkipSx || false;
		let shouldForwardPropOption = shouldForwardProp;
		if (componentSlot === "Root" || componentSlot === "root") shouldForwardPropOption = rootShouldForwardProp;
		else if (componentSlot) shouldForwardPropOption = slotShouldForwardProp;
		else if (isStringTag(tag)) shouldForwardPropOption = void 0;
		const defaultStyledResolver = styled$1(tag, {
			shouldForwardProp: shouldForwardPropOption,
			label: generateStyledLabel(componentName, componentSlot),
			...options
		});
		const transformStyle = (style) => {
			if (style.__emotion_real === style) return style;
			if (typeof style === "function") return function styleFunctionProcessor(props) {
				return processStyle(props, style, props.theme.modularCssLayers ? layerName : void 0);
			};
			if (isPlainObject(style)) {
				const serialized = preprocessStyles(style);
				return function styleObjectProcessor(props) {
					if (!serialized.variants) return props.theme.modularCssLayers ? shallowLayer(serialized.style, layerName) : serialized.style;
					return processStyle(props, serialized, props.theme.modularCssLayers ? layerName : void 0);
				};
			}
			return style;
		};
		const muiStyledResolver = (...expressionsInput) => {
			const expressionsHead = [];
			const expressionsBody = expressionsInput.map(transformStyle);
			const expressionsTail = [];
			expressionsHead.push(styleAttachTheme);
			if (componentName && overridesResolver) expressionsTail.push(function styleThemeOverrides(props) {
				const styleOverrides = props.theme.components?.[componentName]?.styleOverrides;
				if (!styleOverrides) return null;
				const resolvedStyleOverrides = {};
				for (const slotKey in styleOverrides) resolvedStyleOverrides[slotKey] = processStyle(props, styleOverrides[slotKey], props.theme.modularCssLayers ? "theme" : void 0);
				return overridesResolver(props, resolvedStyleOverrides);
			});
			if (componentName && !skipVariantsResolver) expressionsTail.push(function styleThemeVariants(props) {
				const themeVariants = props.theme?.components?.[componentName]?.variants;
				if (!themeVariants) return null;
				return processStyleVariants(props, themeVariants, [], props.theme.modularCssLayers ? "theme" : void 0);
			});
			if (!skipSx) expressionsTail.push(styleFunctionSx_default);
			if (Array.isArray(expressionsBody[0])) {
				const inputStrings = expressionsBody.shift();
				const placeholdersHead = new Array(expressionsHead.length).fill("");
				const placeholdersTail = new Array(expressionsTail.length).fill("");
				let outputStrings;
				outputStrings = [
					...placeholdersHead,
					...inputStrings,
					...placeholdersTail
				];
				outputStrings.raw = [
					...placeholdersHead,
					...inputStrings.raw,
					...placeholdersTail
				];
				expressionsHead.unshift(outputStrings);
			}
			const Component = defaultStyledResolver(...[
				...expressionsHead,
				...expressionsBody,
				...expressionsTail
			]);
			if (tag.muiName) Component.muiName = tag.muiName;
			Component.displayName = generateDisplayName(componentName, componentSlot, tag);
			return Component;
		};
		if (defaultStyledResolver.withConfig) muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
		return muiStyledResolver;
	};
	return styled;
}
function generateDisplayName(componentName, componentSlot, tag) {
	if (componentName) return `${componentName}${capitalize(componentSlot || "")}`;
	return `Styled(${getDisplayName(tag)})`;
}
function generateStyledLabel(componentName, componentSlot) {
	let label;
	if (componentName) label = `${componentName}-${lowercaseFirstLetter(componentSlot || "Root")}`;
	return label;
}
function isStringTag(tag) {
	return typeof tag === "string" && tag.charCodeAt(0) > 96;
}
function lowercaseFirstLetter(string) {
	if (!string) return string;
	return string.charAt(0).toLowerCase() + string.slice(1);
}
//#endregion
//#region node_modules/@mui/utils/resolveProps/resolveProps.mjs
/**
* Add keys, values of `defaultProps` that does not exist in `props`
* @param defaultProps
* @param props
* @param mergeClassNameAndStyle If `true`, merges `className` and `style` props instead of overriding them.
*   When `false` (default), props override defaultProps. When `true`, `className` values are concatenated
*   and `style` objects are merged with props taking precedence.
* @returns resolved props
*/
function resolveProps(defaultProps, props, mergeClassNameAndStyle = false) {
	const output = { ...props };
	for (const key in defaultProps) if (Object.prototype.hasOwnProperty.call(defaultProps, key)) {
		const propName = key;
		if (propName === "components" || propName === "slots") output[propName] = {
			...defaultProps[propName],
			...output[propName]
		};
		else if (propName === "componentsProps" || propName === "slotProps") {
			const defaultSlotProps = defaultProps[propName];
			const slotProps = props[propName];
			if (!slotProps) output[propName] = defaultSlotProps || {};
			else if (!defaultSlotProps) output[propName] = slotProps;
			else {
				output[propName] = { ...slotProps };
				for (const slotKey in defaultSlotProps) if (Object.prototype.hasOwnProperty.call(defaultSlotProps, slotKey)) {
					const slotPropName = slotKey;
					output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName], mergeClassNameAndStyle);
				}
			}
		} else if (propName === "className" && mergeClassNameAndStyle && props.className !== void 0) output.className = clsx(defaultProps?.className, props?.className);
		else if (propName === "style" && mergeClassNameAndStyle && props.style) output.style = {
			...defaultProps?.style,
			...props?.style
		};
		else if (output[propName] === void 0) output[propName] = defaultProps[propName];
	}
	return output;
}
//#endregion
//#region node_modules/@mui/utils/useEnhancedEffect/useEnhancedEffect.mjs
/**
* A version of `React.useLayoutEffect` that does not show a warning when server-side rendering.
* This is useful for effects that are only needed for client-side rendering but not for SSR.
*
* Before you use this hook, make sure to read https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
* and confirm it doesn't apply to your use-case.
*/
var useEnhancedEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region node_modules/@mui/utils/clamp/clamp.mjs
function clamp(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
	return Math.max(min, Math.min(val, max));
}
//#endregion
//#region node_modules/@mui/system/colorManipulator/colorManipulator.mjs
/**
* Returns a number whose value is limited to the given range.
* @param {number} value The value to be clamped
* @param {number} min The lower boundary of the output range
* @param {number} max The upper boundary of the output range
* @returns {number} A number in the range [min, max]
*/
function clampWrapper(value, min = 0, max = 1) {
	if (value < min || value > max) console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
	return clamp(value, min, max);
}
/**
* Converts a color from CSS hex format to CSS rgb format.
* @param {string} color - Hex color, i.e. #nnn or #nnnnnn
* @returns {string} A CSS rgb color string
*/
function hexToRgb(color) {
	color = color.slice(1);
	const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, "g");
	let colors = color.match(re);
	if (colors && colors[0].length === 1) colors = colors.map((n) => n + n);
	if (color.length !== color.trim().length) console.error(`MUI: The color: "${color}" is invalid. Make sure the color input doesn't contain leading/trailing space.`);
	return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n, index) => {
		return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
	}).join(", ")})` : "";
}
/**
* Returns an object with the type and values of a color.
*
* Note: Does not support rgb % values.
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @returns {object} - A MUI color object: {type: string, values: number[]}
*/
function decomposeColor(color) {
	if (color.type) return color;
	if (color.charAt(0) === "#") return decomposeColor(hexToRgb(color));
	const marker = color.indexOf("(");
	const type = color.substring(0, marker);
	if (![
		"rgb",
		"rgba",
		"hsl",
		"hsla",
		"color"
	].includes(type)) throw new Error(`MUI: Unsupported \`${color}\` color.\nThe following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().`);
	let values = color.substring(marker + 1, color.length - 1);
	let colorSpace;
	if (type === "color") {
		values = values.split(" ");
		colorSpace = values.shift();
		if (values.length === 4 && values[3].charAt(0) === "/") values[3] = values[3].slice(1);
		if (![
			"srgb",
			"display-p3",
			"a98-rgb",
			"prophoto-rgb",
			"rec-2020"
		].includes(colorSpace)) throw new Error(`MUI: unsupported \`${colorSpace}\` color space.\nThe following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.`);
	} else values = values.split(",");
	values = values.map((value) => parseFloat(value));
	return {
		type,
		values,
		colorSpace
	};
}
/**
* Returns a channel created from the input color.
*
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @returns {string} - The channel for the color, that can be used in rgba or hsla colors
*/
var colorChannel = (color) => {
	const decomposedColor = decomposeColor(color);
	return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.includes("hsl") && idx !== 0 ? `${val}%` : val).join(" ");
};
var private_safeColorChannel = (color, warning) => {
	try {
		return colorChannel(color);
	} catch (error) {
		if (warning && true) console.warn(warning);
		return color;
	}
};
/**
* Converts a color object with type and values to a string.
* @param {object} color - Decomposed color
* @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla', 'color'
* @param {array} color.values - [n,n,n] or [n,n,n,n]
* @returns {string} A CSS color string
*/
function recomposeColor(color) {
	const { type, colorSpace } = color;
	let { values } = color;
	if (type.includes("rgb")) values = values.map((n, i) => i < 3 ? parseInt(n, 10) : n);
	else if (type.includes("hsl")) {
		values[1] = `${values[1]}%`;
		values[2] = `${values[2]}%`;
	}
	if (type.includes("color")) values = `${colorSpace} ${values.join(" ")}`;
	else values = `${values.join(", ")}`;
	return `${type}(${values})`;
}
/**
* Converts a color from hsl format to rgb format.
* @param {string} color - HSL color values
* @returns {string} rgb color values
*/
function hslToRgb(color) {
	color = decomposeColor(color);
	const { values } = color;
	const h = values[0];
	const s = values[1] / 100;
	const l = values[2] / 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	let type = "rgb";
	const rgb = [
		Math.round(f(0) * 255),
		Math.round(f(8) * 255),
		Math.round(f(4) * 255)
	];
	if (color.type === "hsla") {
		type += "a";
		rgb.push(values[3]);
	}
	return recomposeColor({
		type,
		values: rgb
	});
}
/**
* The relative brightness of any point in a color space,
* normalized to 0 for darkest black and 1 for lightest white.
*
* Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @returns {number} The relative brightness of the color in the range 0 - 1
*/
function getLuminance(color) {
	color = decomposeColor(color);
	let rgb = color.type === "hsl" || color.type === "hsla" ? decomposeColor(hslToRgb(color)).values : color.values;
	rgb = rgb.map((val) => {
		if (color.type !== "color") val /= 255;
		return val <= .03928 ? val / 12.92 : ((val + .055) / 1.055) ** 2.4;
	});
	return Number((.2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]).toFixed(3));
}
/**
* Calculates the contrast ratio between two colors.
*
* Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
* @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @returns {number} A contrast ratio value in the range 0 - 21.
*/
function getContrastRatio(foreground, background) {
	const lumA = getLuminance(foreground);
	const lumB = getLuminance(background);
	return (Math.max(lumA, lumB) + .05) / (Math.min(lumA, lumB) + .05);
}
/**
* Sets the absolute transparency of a color.
* Any existing alpha values are overwritten.
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @param {number} value - value to set the alpha channel to in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function alpha(color, value) {
	color = decomposeColor(color);
	value = clampWrapper(value);
	if (color.type === "rgb" || color.type === "hsl") color.type += "a";
	if (color.type === "color") color.values[3] = `/${value}`;
	else color.values[3] = value;
	return recomposeColor(color);
}
function private_safeAlpha(color, value, warning) {
	try {
		return alpha(color, value);
	} catch (error) {
		if (warning && true) console.warn(warning);
		return color;
	}
}
/**
* Darkens a color.
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @param {number} coefficient - multiplier in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function darken(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clampWrapper(coefficient);
	if (color.type.includes("hsl")) color.values[2] *= 1 - coefficient;
	else if (color.type.includes("rgb") || color.type.includes("color")) for (let i = 0; i < 3; i += 1) color.values[i] *= 1 - coefficient;
	return recomposeColor(color);
}
function private_safeDarken(color, coefficient, warning) {
	try {
		return darken(color, coefficient);
	} catch (error) {
		if (warning && true) console.warn(warning);
		return color;
	}
}
/**
* Lightens a color.
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @param {number} coefficient - multiplier in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function lighten(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clampWrapper(coefficient);
	if (color.type.includes("hsl")) color.values[2] += (100 - color.values[2]) * coefficient;
	else if (color.type.includes("rgb")) for (let i = 0; i < 3; i += 1) color.values[i] += (255 - color.values[i]) * coefficient;
	else if (color.type.includes("color")) for (let i = 0; i < 3; i += 1) color.values[i] += (1 - color.values[i]) * coefficient;
	return recomposeColor(color);
}
function private_safeLighten(color, coefficient, warning) {
	try {
		return lighten(color, coefficient);
	} catch (error) {
		if (warning && true) console.warn(warning);
		return color;
	}
}
/**
* Darken or lighten a color, depending on its luminance.
* Light colors are darkened, dark colors are lightened.
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
* @param {number} coefficient=0.15 - multiplier in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function emphasize(color, coefficient = .15) {
	return getLuminance(color) > .5 ? darken(color, coefficient) : lighten(color, coefficient);
}
function private_safeEmphasize(color, coefficient, warning) {
	try {
		return emphasize(color, coefficient);
	} catch (error) {
		if (warning && true) console.warn(warning);
		return color;
	}
}
//#endregion
//#region node_modules/@mui/utils/exactProp/exactProp.mjs
var specialProperty = "exact-prop: ​";
function exactProp(propTypes) {
	return {
		...propTypes,
		[specialProperty]: (props) => {
			const unsupportedProps = Object.keys(props).filter((prop) => !propTypes.hasOwnProperty(prop));
			if (unsupportedProps.length > 0) return /* @__PURE__ */ new Error(`The following props are not supported: ${unsupportedProps.map((prop) => `\`${prop}\``).join(", ")}. Please remove them.`);
			return null;
		}
	};
}
//#endregion
//#region node_modules/@mui/system/RtlProvider/index.mjs
var import_jsx_runtime = require_jsx_runtime();
var RtlContext = /*#__PURE__*/ import_react.createContext();
function RtlProvider({ value, ...props }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(RtlContext.Provider, {
		value: value ?? true,
		...props
	});
}
RtlProvider.propTypes = {
	children: import_prop_types.default.node,
	value: import_prop_types.default.bool
};
var useRtl = () => {
	return import_react.useContext(RtlContext) ?? false;
};
//#endregion
//#region node_modules/@mui/system/DefaultPropsProvider/DefaultPropsProvider.mjs
var PropsContext = /*#__PURE__*/ import_react.createContext(void 0);
function DefaultPropsProvider$1({ value, children }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(PropsContext.Provider, {
		value,
		children
	});
}
DefaultPropsProvider$1.propTypes = {
	/**
	* @ignore
	*/
	children: import_prop_types.default.node,
	/**
	* @ignore
	*/
	value: import_prop_types.default.object
};
function getThemeProps(params) {
	const { theme, name, props } = params;
	if (!theme || !theme.components || !theme.components[name]) return props;
	const config = theme.components[name];
	if (config.defaultProps) return resolveProps(config.defaultProps, props, theme.components.mergeClassNameAndStyle);
	if (!config.styleOverrides && !config.variants) return resolveProps(config, props, theme.components.mergeClassNameAndStyle);
	return props;
}
function useDefaultProps$1({ props, name }) {
	return getThemeProps({
		props,
		name,
		theme: { components: import_react.useContext(PropsContext) }
	});
}
//#endregion
//#region node_modules/@mui/utils/useId/useId.mjs
var globalId = 0;
function useGlobalId(idOverride) {
	const [defaultId, setDefaultId] = import_react.useState(idOverride);
	const id = idOverride || defaultId;
	import_react.useEffect(() => {
		if (defaultId == null) {
			globalId += 1;
			setDefaultId(`mui-${globalId}`);
		}
	}, [defaultId]);
	return id;
}
var maybeReactUseId = { ...import_react }.useId;
/**
*
* @example <div id={useId()} />
* @param idOverride
* @returns {string}
*/
function useId(idOverride) {
	if (maybeReactUseId !== void 0) {
		const reactId = maybeReactUseId();
		return idOverride ?? reactId;
	}
	return useGlobalId(idOverride);
}
//#endregion
//#region node_modules/@mui/system/memoTheme.mjs
var arg = { theme: void 0 };
/**
* Memoize style function on theme.
* Intended to be used in styled() calls that only need access to the theme.
*/
function unstable_memoTheme(styleFn) {
	let lastValue;
	let lastTheme;
	return function styleMemoized(props) {
		let value = lastValue;
		if (value === void 0 || props.theme !== lastTheme) {
			arg.theme = props.theme;
			value = preprocessStyles(styleFn(arg));
			lastValue = value;
			lastTheme = props.theme;
		}
		return value;
	};
}
//#endregion
//#region node_modules/@mui/system/cssVars/createGetCssVar.mjs
/**
* The benefit of this function is to help developers get CSS var from theme without specifying the whole variable
* and they does not need to remember the prefix (defined once).
*/
function createGetCssVar$1(prefix = "") {
	function appendVar(...vars) {
		if (!vars.length) return "";
		const value = vars[0];
		if (typeof value === "string" && !value.match(/(#|\(|\)|(-?(\d*\.)?\d+)(px|em|%|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc))|^(-?(\d*\.)?\d+)$|(\d+ \d+ \d+)/)) return `, var(--${prefix ? `${prefix}-` : ""}${value}${appendVar(...vars.slice(1))})`;
		return `, ${value}`;
	}
	const getCssVar = (field, ...fallbacks) => {
		return `var(--${prefix ? `${prefix}-` : ""}${field}${appendVar(...fallbacks)})`;
	};
	return getCssVar;
}
//#endregion
//#region node_modules/@mui/system/cssVars/cssVarsParser.mjs
/**
* This function create an object from keys, value and then assign to target
*
* @param {Object} obj : the target object to be assigned
* @param {string[]} keys
* @param {string | number} value
*
* @example
* const source = {}
* assignNestedKeys(source, ['palette', 'primary'], 'var(--palette-primary)')
* console.log(source) // { palette: { primary: 'var(--palette-primary)' } }
*
* @example
* const source = { palette: { primary: 'var(--palette-primary)' } }
* assignNestedKeys(source, ['palette', 'secondary'], 'var(--palette-secondary)')
* console.log(source) // { palette: { primary: 'var(--palette-primary)', secondary: 'var(--palette-secondary)' } }
*/
var assignNestedKeys = (obj, keys, value, arrayKeys = []) => {
	let temp = obj;
	keys.forEach((k, index) => {
		if (index === keys.length - 1) {
			if (Array.isArray(temp)) temp[Number(k)] = value;
			else if (temp && typeof temp === "object") temp[k] = value;
		} else if (temp && typeof temp === "object") {
			if (!temp[k]) temp[k] = arrayKeys.includes(k) ? [] : {};
			temp = temp[k];
		}
	});
};
/**
*
* @param {Object} obj : source object
* @param {Function} callback : a function that will be called when
*                   - the deepest key in source object is reached
*                   - the value of the deepest key is NOT `undefined` | `null`
*
* @example
* walkObjectDeep({ palette: { primary: { main: '#000000' } } }, console.log)
* // ['palette', 'primary', 'main'] '#000000'
*/
var walkObjectDeep = (obj, callback, shouldSkipPaths) => {
	function recurse(object, parentKeys = [], arrayKeys = []) {
		Object.entries(object).forEach(([key, value]) => {
			if (!shouldSkipPaths || shouldSkipPaths && !shouldSkipPaths([...parentKeys, key])) {
				if (value !== void 0 && value !== null) if (typeof value === "object" && Object.keys(value).length > 0) recurse(value, [...parentKeys, key], Array.isArray(value) ? [...arrayKeys, key] : arrayKeys);
				else callback([...parentKeys, key], value, arrayKeys);
			}
		});
	}
	recurse(obj);
};
var getCssValue = (keys, value) => {
	if (typeof value === "number") {
		if ([
			"lineHeight",
			"fontWeight",
			"opacity",
			"zIndex"
		].some((prop) => keys.includes(prop))) return value;
		if (keys[keys.length - 1].toLowerCase().includes("opacity")) return value;
		return `${value}px`;
	}
	return value;
};
/**
* a function that parse theme and return { css, vars }
*
* @param {Object} theme
* @param {{
*  prefix?: string,
*  shouldSkipGeneratingVar?: (objectPathKeys: Array<string>, value: string | number) => boolean
* }} options.
*  `prefix`: The prefix of the generated CSS variables. This function does not change the value.
*
* @returns {{ css: Object, vars: Object }} `css` is the stylesheet, `vars` is an object to get css variable (same structure as theme).
*
* @example
* const { css, vars } = parser({
*   fontSize: 12,
*   lineHeight: 1.2,
*   palette: { primary: { 500: 'var(--color)' } }
* }, { prefix: 'foo' })
*
* console.log(css) // { '--foo-fontSize': '12px', '--foo-lineHeight': 1.2, '--foo-palette-primary-500': 'var(--color)' }
* console.log(vars) // { fontSize: 'var(--foo-fontSize)', lineHeight: 'var(--foo-lineHeight)', palette: { primary: { 500: 'var(--foo-palette-primary-500)' } } }
*/
function cssVarsParser(theme, options) {
	const { prefix, shouldSkipGeneratingVar } = options || {};
	const css = {};
	const vars = {};
	const varsWithDefaults = {};
	walkObjectDeep(theme, (keys, value, arrayKeys) => {
		if (typeof value === "string" || typeof value === "number") {
			if (!shouldSkipGeneratingVar || !shouldSkipGeneratingVar(keys, value)) {
				const cssVar = `--${prefix ? `${prefix}-` : ""}${keys.join("-")}`;
				const resolvedValue = getCssValue(keys, value);
				Object.assign(css, { [cssVar]: resolvedValue });
				assignNestedKeys(vars, keys, `var(${cssVar})`, arrayKeys);
				assignNestedKeys(varsWithDefaults, keys, `var(${cssVar}, ${resolvedValue})`, arrayKeys);
			}
		}
	}, (keys) => keys[0] === "vars");
	return {
		css,
		vars,
		varsWithDefaults
	};
}
//#endregion
//#region node_modules/@mui/system/cssVars/prepareCssVars.mjs
function prepareCssVars(theme, parserConfig = {}) {
	const { getSelector = defaultGetSelector, disableCssColorScheme, colorSchemeSelector: selector, enableContrastVars } = parserConfig;
	const { colorSchemes = {}, components, defaultColorScheme = "light", ...otherTheme } = theme;
	const { vars: rootVars, css: rootCss, varsWithDefaults: rootVarsWithDefaults } = cssVarsParser(otherTheme, parserConfig);
	let themeVars = rootVarsWithDefaults;
	const colorSchemesMap = {};
	const { [defaultColorScheme]: defaultScheme, ...otherColorSchemes } = colorSchemes;
	Object.entries(otherColorSchemes || {}).forEach(([key, scheme]) => {
		const { vars, css, varsWithDefaults } = cssVarsParser(scheme, parserConfig);
		themeVars = deepmerge(themeVars, varsWithDefaults);
		colorSchemesMap[key] = {
			css,
			vars
		};
	});
	if (defaultScheme) {
		const { css, vars, varsWithDefaults } = cssVarsParser(defaultScheme, parserConfig);
		themeVars = deepmerge(themeVars, varsWithDefaults);
		colorSchemesMap[defaultColorScheme] = {
			css,
			vars
		};
	}
	function defaultGetSelector(colorScheme, cssObject) {
		let rule = selector;
		if (selector === "class") rule = ".%s";
		if (selector === "data") rule = "[data-%s]";
		if (selector?.startsWith("data-") && !selector.includes("%s")) rule = `[${selector}="%s"]`;
		if (colorScheme) {
			if (rule === "media") {
				if (theme.defaultColorScheme === colorScheme) return ":root";
				return { [`@media (prefers-color-scheme: ${colorSchemes[colorScheme]?.palette?.mode || colorScheme})`]: { ":root": cssObject } };
			}
			if (rule) {
				if (theme.defaultColorScheme === colorScheme) return `:root, ${rule.replace("%s", String(colorScheme))}`;
				return rule.replace("%s", String(colorScheme));
			}
		}
		return ":root";
	}
	const generateThemeVars = () => {
		let vars = { ...rootVars };
		Object.entries(colorSchemesMap).forEach(([, { vars: schemeVars }]) => {
			vars = deepmerge(vars, schemeVars);
		});
		return vars;
	};
	const generateStyleSheets = () => {
		const stylesheets = [];
		const colorScheme = theme.defaultColorScheme || "light";
		function insertStyleSheet(key, css) {
			if (Object.keys(css).length) stylesheets.push(typeof key === "string" ? { [key]: { ...css } } : key);
		}
		insertStyleSheet(getSelector(void 0, { ...rootCss }), rootCss);
		const { [colorScheme]: defaultSchemeVal, ...other } = colorSchemesMap;
		if (defaultSchemeVal) {
			const { css } = defaultSchemeVal;
			const cssColorSheme = colorSchemes[colorScheme]?.palette?.mode;
			const finalCss = !disableCssColorScheme && cssColorSheme ? {
				colorScheme: cssColorSheme,
				...css
			} : { ...css };
			insertStyleSheet(getSelector(colorScheme, { ...finalCss }), finalCss);
		}
		Object.entries(other).forEach(([key, { css }]) => {
			const cssColorSheme = colorSchemes[key]?.palette?.mode;
			const finalCss = !disableCssColorScheme && cssColorSheme ? {
				colorScheme: cssColorSheme,
				...css
			} : { ...css };
			insertStyleSheet(getSelector(key, { ...finalCss }), finalCss);
		});
		if (enableContrastVars) stylesheets.push({ ":root": {
			"--__l-threshold": "0.7",
			"--__l": "clamp(0, (l / var(--__l-threshold) - 1) * -infinity, 1)",
			"--__a": "clamp(0.87, (l / var(--__l-threshold) - 1) * -infinity, 1)"
		} });
		return stylesheets;
	};
	return {
		vars: themeVars,
		generateThemeVars,
		generateStyleSheets
	};
}
//#endregion
//#region node_modules/@mui/system/cssVars/getColorSchemeSelector.mjs
function createGetColorSchemeSelector(selector) {
	return function getColorSchemeSelector(colorScheme) {
		if (selector === "media") {
			if (colorScheme !== "light" && colorScheme !== "dark") console.error(`MUI: @media (prefers-color-scheme) supports only 'light' or 'dark', but receive '${colorScheme}'.`);
			return `@media (prefers-color-scheme: ${colorScheme})`;
		}
		if (selector) {
			if (selector.startsWith("data-") && !selector.includes("%s")) return `[${selector}="${colorScheme}"] &`;
			if (selector === "class") return `.${colorScheme} &`;
			if (selector === "data") return `[data-${colorScheme}] &`;
			return `${selector.replace("%s", colorScheme)} &`;
		}
		return "&";
	};
}
//#endregion
//#region node_modules/@mui/system/index.mjs
/**
* @mui/system v9.1.0
*
* @license MIT
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
//#endregion
//#region node_modules/@mui/material/colors/common.mjs
var common = {
	black: "#000",
	white: "#fff"
};
//#endregion
//#region node_modules/@mui/material/colors/grey.mjs
var grey = {
	50: "#fafafa",
	100: "#f5f5f5",
	200: "#eeeeee",
	300: "#e0e0e0",
	400: "#bdbdbd",
	500: "#9e9e9e",
	600: "#757575",
	700: "#616161",
	800: "#424242",
	900: "#212121",
	A100: "#f5f5f5",
	A200: "#eeeeee",
	A400: "#bdbdbd",
	A700: "#616161"
};
//#endregion
//#region node_modules/@mui/material/colors/purple.mjs
var purple = {
	50: "#f3e5f5",
	100: "#e1bee7",
	200: "#ce93d8",
	300: "#ba68c8",
	400: "#ab47bc",
	500: "#9c27b0",
	600: "#8e24aa",
	700: "#7b1fa2",
	800: "#6a1b9a",
	900: "#4a148c",
	A100: "#ea80fc",
	A200: "#e040fb",
	A400: "#d500f9",
	A700: "#aa00ff"
};
//#endregion
//#region node_modules/@mui/material/colors/red.mjs
var red = {
	50: "#ffebee",
	100: "#ffcdd2",
	200: "#ef9a9a",
	300: "#e57373",
	400: "#ef5350",
	500: "#f44336",
	600: "#e53935",
	700: "#d32f2f",
	800: "#c62828",
	900: "#b71c1c",
	A100: "#ff8a80",
	A200: "#ff5252",
	A400: "#ff1744",
	A700: "#d50000"
};
//#endregion
//#region node_modules/@mui/material/colors/orange.mjs
var orange = {
	50: "#fff3e0",
	100: "#ffe0b2",
	200: "#ffcc80",
	300: "#ffb74d",
	400: "#ffa726",
	500: "#ff9800",
	600: "#fb8c00",
	700: "#f57c00",
	800: "#ef6c00",
	900: "#e65100",
	A100: "#ffd180",
	A200: "#ffab40",
	A400: "#ff9100",
	A700: "#ff6d00"
};
//#endregion
//#region node_modules/@mui/material/colors/blue.mjs
var blue = {
	50: "#e3f2fd",
	100: "#bbdefb",
	200: "#90caf9",
	300: "#64b5f6",
	400: "#42a5f5",
	500: "#2196f3",
	600: "#1e88e5",
	700: "#1976d2",
	800: "#1565c0",
	900: "#0d47a1",
	A100: "#82b1ff",
	A200: "#448aff",
	A400: "#2979ff",
	A700: "#2962ff"
};
//#endregion
//#region node_modules/@mui/material/colors/lightBlue.mjs
var lightBlue = {
	50: "#e1f5fe",
	100: "#b3e5fc",
	200: "#81d4fa",
	300: "#4fc3f7",
	400: "#29b6f6",
	500: "#03a9f4",
	600: "#039be5",
	700: "#0288d1",
	800: "#0277bd",
	900: "#01579b",
	A100: "#80d8ff",
	A200: "#40c4ff",
	A400: "#00b0ff",
	A700: "#0091ea"
};
//#endregion
//#region node_modules/@mui/material/colors/green.mjs
var green = {
	50: "#e8f5e9",
	100: "#c8e6c9",
	200: "#a5d6a7",
	300: "#81c784",
	400: "#66bb6a",
	500: "#4caf50",
	600: "#43a047",
	700: "#388e3c",
	800: "#2e7d32",
	900: "#1b5e20",
	A100: "#b9f6ca",
	A200: "#69f0ae",
	A400: "#00e676",
	A700: "#00c853"
};
//#endregion
//#region node_modules/@mui/material/styles/createPalette.mjs
function getLight() {
	return {
		text: {
			primary: "rgba(0, 0, 0, 0.87)",
			secondary: "rgba(0, 0, 0, 0.6)",
			disabled: "rgba(0, 0, 0, 0.38)"
		},
		divider: "rgba(0, 0, 0, 0.12)",
		background: {
			paper: common.white,
			default: common.white
		},
		action: {
			active: "rgba(0, 0, 0, 0.54)",
			hover: "rgba(0, 0, 0, 0.04)",
			hoverOpacity: .04,
			selected: "rgba(0, 0, 0, 0.08)",
			selectedOpacity: .08,
			disabled: "rgba(0, 0, 0, 0.26)",
			disabledBackground: "rgba(0, 0, 0, 0.12)",
			disabledOpacity: .38,
			focus: "rgba(0, 0, 0, 0.12)",
			focusOpacity: .12,
			activatedOpacity: .12
		}
	};
}
var light = getLight();
function getDark() {
	return {
		text: {
			primary: common.white,
			secondary: "rgba(255, 255, 255, 0.7)",
			disabled: "rgba(255, 255, 255, 0.5)",
			icon: "rgba(255, 255, 255, 0.5)"
		},
		divider: "rgba(255, 255, 255, 0.12)",
		background: {
			paper: "#121212",
			default: "#121212"
		},
		action: {
			active: common.white,
			hover: "rgba(255, 255, 255, 0.08)",
			hoverOpacity: .08,
			selected: "rgba(255, 255, 255, 0.16)",
			selectedOpacity: .16,
			disabled: "rgba(255, 255, 255, 0.3)",
			disabledBackground: "rgba(255, 255, 255, 0.12)",
			disabledOpacity: .38,
			focus: "rgba(255, 255, 255, 0.12)",
			focusOpacity: .12,
			activatedOpacity: .24
		}
	};
}
var dark = getDark();
function addLightOrDark(intent, direction, shade, tonalOffset) {
	const tonalOffsetLight = tonalOffset.light || tonalOffset;
	const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
	if (!intent[direction]) {
		if (intent.hasOwnProperty(shade)) intent[direction] = intent[shade];
		else if (direction === "light") intent.light = lighten(intent.main, tonalOffsetLight);
		else if (direction === "dark") intent.dark = darken(intent.main, tonalOffsetDark);
	}
}
function mixLightOrDark(colorSpace, intent, direction, shade, tonalOffset) {
	const tonalOffsetLight = tonalOffset.light || tonalOffset;
	const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
	if (!intent[direction]) {
		if (intent.hasOwnProperty(shade)) intent[direction] = intent[shade];
		else if (direction === "light") intent.light = `color-mix(in ${colorSpace}, ${intent.main}, #fff ${(tonalOffsetLight * 100).toFixed(0)}%)`;
		else if (direction === "dark") intent.dark = `color-mix(in ${colorSpace}, ${intent.main}, #000 ${(tonalOffsetDark * 100).toFixed(0)}%)`;
	}
}
function getDefaultPrimary(mode = "light") {
	if (mode === "dark") return {
		main: blue[200],
		light: blue[50],
		dark: blue[400]
	};
	return {
		main: blue[700],
		light: blue[400],
		dark: blue[800]
	};
}
function getDefaultSecondary(mode = "light") {
	if (mode === "dark") return {
		main: purple[200],
		light: purple[50],
		dark: purple[400]
	};
	return {
		main: purple[500],
		light: purple[300],
		dark: purple[700]
	};
}
function getDefaultError(mode = "light") {
	if (mode === "dark") return {
		main: red[500],
		light: red[300],
		dark: red[700]
	};
	return {
		main: red[700],
		light: red[400],
		dark: red[800]
	};
}
function getDefaultInfo(mode = "light") {
	if (mode === "dark") return {
		main: lightBlue[400],
		light: lightBlue[300],
		dark: lightBlue[700]
	};
	return {
		main: lightBlue[700],
		light: lightBlue[500],
		dark: lightBlue[900]
	};
}
function getDefaultSuccess(mode = "light") {
	if (mode === "dark") return {
		main: green[400],
		light: green[300],
		dark: green[700]
	};
	return {
		main: green[800],
		light: green[500],
		dark: green[900]
	};
}
function getDefaultWarning(mode = "light") {
	if (mode === "dark") return {
		main: orange[400],
		light: orange[300],
		dark: orange[700]
	};
	return {
		main: "#ed6c02",
		light: orange[500],
		dark: orange[900]
	};
}
function contrastColor(background) {
	return `oklch(from ${background} var(--__l) 0 h / var(--__a))`;
}
function createPalette(palette) {
	const { mode = "light", contrastThreshold = 3, tonalOffset = .2, colorSpace, ...other } = palette;
	const primary = palette.primary || getDefaultPrimary(mode);
	const secondary = palette.secondary || getDefaultSecondary(mode);
	const error = palette.error || getDefaultError(mode);
	const info = palette.info || getDefaultInfo(mode);
	const success = palette.success || getDefaultSuccess(mode);
	const warning = palette.warning || getDefaultWarning(mode);
	function getContrastText(background) {
		if (colorSpace) return contrastColor(background);
		const contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
		{
			const contrast = getContrastRatio(background, contrastText);
			if (contrast < 3) console.error([
				`MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`,
				"falls below the WCAG recommended absolute minimum contrast ratio of 3:1.",
				"https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"
			].join("\n"));
		}
		return contrastText;
	}
	const augmentColor = ({ color, name, mainShade = 500, lightShade = 300, darkShade = 700 }) => {
		color = { ...color };
		if (!color.main && color[mainShade]) color.main = color[mainShade];
		if (!color.hasOwnProperty("main")) throw new Error(`MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.\nThe color object needs to have a \`main\` property or a \`${mainShade}\` property.`);
		if (typeof color.main !== "string") throw new Error(`MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.\n\`color.main\` should be a string, but \`${JSON.stringify(color.main)}\` was provided instead.\n
Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });`);
		if (colorSpace) {
			mixLightOrDark(colorSpace, color, "light", lightShade, tonalOffset);
			mixLightOrDark(colorSpace, color, "dark", darkShade, tonalOffset);
		} else {
			addLightOrDark(color, "light", lightShade, tonalOffset);
			addLightOrDark(color, "dark", darkShade, tonalOffset);
		}
		if (!color.contrastText) color.contrastText = getContrastText(color.main);
		return color;
	};
	let modeHydrated;
	if (mode === "light") modeHydrated = getLight();
	else if (mode === "dark") modeHydrated = getDark();
	if (!modeHydrated) console.error(`MUI: The palette mode \`${mode}\` is not supported.`);
	return deepmerge({
		common: { ...common },
		mode,
		primary: augmentColor({
			color: primary,
			name: "primary"
		}),
		secondary: augmentColor({
			color: secondary,
			name: "secondary",
			mainShade: "A400",
			lightShade: "A200",
			darkShade: "A700"
		}),
		error: augmentColor({
			color: error,
			name: "error"
		}),
		warning: augmentColor({
			color: warning,
			name: "warning"
		}),
		info: augmentColor({
			color: info,
			name: "info"
		}),
		success: augmentColor({
			color: success,
			name: "success"
		}),
		grey,
		contrastThreshold,
		getContrastText,
		augmentColor,
		tonalOffset,
		...modeHydrated
	}, other);
}
//#endregion
//#region node_modules/@mui/system/cssVars/prepareTypographyVars.mjs
function prepareTypographyVars(typography) {
	const vars = {};
	Object.entries(typography).forEach((entry) => {
		const [key, value] = entry;
		if (typeof value === "object") vars[key] = `${value.fontStyle ? `${value.fontStyle} ` : ""}${value.fontVariant ? `${value.fontVariant} ` : ""}${value.fontWeight ? `${value.fontWeight} ` : ""}${value.fontStretch ? `${value.fontStretch} ` : ""}${value.fontSize || ""}${value.lineHeight ? `/${value.lineHeight} ` : ""}${value.fontFamily || ""}`;
	});
	return vars;
}
//#endregion
//#region node_modules/@mui/material/styles/createMixins.mjs
function createMixins(breakpoints, mixins) {
	return {
		toolbar: {
			minHeight: 56,
			[breakpoints.up("xs")]: { "@media (orientation: landscape)": { minHeight: 48 } },
			[breakpoints.up("sm")]: { minHeight: 64 }
		},
		...mixins
	};
}
//#endregion
//#region node_modules/@mui/material/styles/createTypography.mjs
function round$2(value) {
	return Math.round(value * 1e5) / 1e5;
}
var caseAllCaps = { textTransform: "uppercase" };
var defaultFontFamily = "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif";
/**
* @see @link{https://m2.material.io/design/typography/the-type-system.html}
* @see @link{https://m2.material.io/design/typography/understanding-typography.html}
*/
function createTypography(palette, typography) {
	const { fontFamily = defaultFontFamily, fontSize = 14, fontWeightLight = 300, fontWeightRegular = 400, fontWeightMedium = 500, fontWeightBold = 700, htmlFontSize = 16, allVariants, pxToRem: pxToRem2, ...other } = typeof typography === "function" ? typography(palette) : typography;
	if (typeof fontSize !== "number") console.error("MUI: `fontSize` is required to be a number.");
	if (typeof htmlFontSize !== "number") console.error("MUI: `htmlFontSize` is required to be a number.");
	const coef = fontSize / 14;
	const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
	const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => ({
		fontFamily,
		fontWeight,
		fontSize: pxToRem(size),
		lineHeight,
		...fontFamily === defaultFontFamily ? { letterSpacing: `${round$2(letterSpacing / size)}em` } : {},
		...casing,
		...allVariants
	});
	return deepmerge({
		htmlFontSize,
		pxToRem,
		fontFamily,
		fontSize,
		fontWeightLight,
		fontWeightRegular,
		fontWeightMedium,
		fontWeightBold,
		h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
		h2: buildVariant(fontWeightLight, 60, 1.2, -.5),
		h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
		h4: buildVariant(fontWeightRegular, 34, 1.235, .25),
		h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
		h6: buildVariant(fontWeightMedium, 20, 1.6, .15),
		subtitle1: buildVariant(fontWeightRegular, 16, 1.75, .15),
		subtitle2: buildVariant(fontWeightMedium, 14, 1.57, .1),
		body1: buildVariant(fontWeightRegular, 16, 1.5, .15),
		body2: buildVariant(fontWeightRegular, 14, 1.43, .15),
		button: buildVariant(fontWeightMedium, 14, 1.75, .4, caseAllCaps),
		caption: buildVariant(fontWeightRegular, 12, 1.66, .4),
		overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
		inherit: {
			fontFamily: "inherit",
			fontWeight: "inherit",
			fontSize: "inherit",
			lineHeight: "inherit",
			letterSpacing: "inherit"
		}
	}, other, { clone: false });
}
//#endregion
//#region node_modules/@mui/material/styles/shadows.mjs
var shadowKeyUmbraOpacity = .2;
var shadowKeyPenumbraOpacity = .14;
var shadowAmbientShadowOpacity = .12;
function createShadow(...px) {
	return [
		`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`,
		`${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`,
		`${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`
	].join(",");
}
var shadows = [
	"none",
	createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
	createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
	createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
	createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
	createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
	createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
	createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
	createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
	createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
	createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
	createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
	createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
	createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
	createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
	createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
	createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
	createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
	createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
	createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
	createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
	createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
	createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
	createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
	createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)
];
//#endregion
//#region node_modules/@mui/material/styles/createTransitions.mjs
var DEFAULT_TRANSITION_PROPS = ["all"];
var EMPTY_OPTIONS = {};
var easing = {
	easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
	easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
	easeIn: "cubic-bezier(0.4, 0, 1, 1)",
	sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
var duration = {
	shortest: 150,
	shorter: 200,
	short: 250,
	standard: 300,
	complex: 375,
	enteringScreen: 225,
	leavingScreen: 195
};
function formatMs(milliseconds) {
	return `${Math.round(milliseconds)}ms`;
}
function getAutoHeightDuration(height) {
	if (!height) return 0;
	const constant = height / 36;
	return Math.min(Math.round((4 + 15 * constant ** .25 + constant / 5) * 10), 3e3);
}
function createTransitions(inputTransitions) {
	const transitions = { ...inputTransitions };
	delete transitions.reducedMotion;
	const mergedEasing = {
		...easing,
		...transitions.easing
	};
	const mergedDuration = {
		...duration,
		...transitions.duration
	};
	const createTransitionValue = (props = DEFAULT_TRANSITION_PROPS, options = EMPTY_OPTIONS) => {
		const { duration: durationOption = mergedDuration.standard, easing: easingOption = mergedEasing.easeInOut, delay = 0, ...other } = options;
		{
			const isString = (value) => typeof value === "string";
			const isNumber = (value) => !Number.isNaN(parseFloat(value));
			if (!isString(props) && !Array.isArray(props)) console.error("MUI: Argument \"props\" must be a string or Array.");
			if (!isNumber(durationOption) && !isString(durationOption)) console.error(`MUI: Argument "duration" must be a number or a string but found ${durationOption}.`);
			if (!isString(easingOption)) console.error("MUI: Argument \"easing\" must be a string.");
			if (!isNumber(delay) && !isString(delay)) console.error("MUI: Argument \"delay\" must be a number or a string.");
			if (typeof options !== "object") console.error(["MUI: Secong argument of transition.create must be an object.", "Arguments should be either `create('prop1', options)` or `create(['prop1', 'prop2'], options)`"].join("\n"));
			if (Object.keys(other).length !== 0) console.error(`MUI: Unrecognized argument(s) [${Object.keys(other).join(",")}].`);
		}
		return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
	};
	return {
		getAutoHeightDuration,
		create: transitions.create ?? createTransitionValue,
		...transitions,
		easing: mergedEasing,
		duration: mergedDuration
	};
}
//#endregion
//#region node_modules/@mui/material/styles/createMotion.mjs
var EMPTY_MOTION = {};
function createMotion(inputMotion = EMPTY_MOTION) {
	return {
		reducedMotion: "never",
		...inputMotion
	};
}
//#endregion
//#region node_modules/@mui/material/styles/zIndex.mjs
var zIndex = {
	mobileStepper: 1e3,
	fab: 1050,
	speedDial: 1050,
	appBar: 1100,
	drawer: 1200,
	modal: 1300,
	snackbar: 1400,
	tooltip: 1500
};
//#endregion
//#region node_modules/@mui/material/styles/stringifyTheme.mjs
function isSerializable(val) {
	return isPlainObject(val) || typeof val === "undefined" || typeof val === "string" || typeof val === "boolean" || typeof val === "number" || Array.isArray(val);
}
/**
* `baseTheme` usually comes from `createTheme()` or `extendTheme()`.
*
* This function is intended to be used with zero-runtime CSS-in-JS like Pigment CSS
* For example, in a Next.js project:
*
* ```js
* // next.config.js
* const { extendTheme } = require('@mui/material/styles');
*
* const theme = extendTheme();
* // `.toRuntimeSource` is Pigment CSS specific to create a theme that is available at runtime.
* theme.toRuntimeSource = stringifyTheme;
*
* module.exports = withPigment({
*  theme,
* });
* ```
*/
function stringifyTheme(baseTheme = {}) {
	const serializableTheme = { ...baseTheme };
	function serializeTheme(object) {
		const array = Object.entries(object);
		for (let index = 0; index < array.length; index++) {
			const [key, value] = array[index];
			if (!isSerializable(value) || key.startsWith("unstable_") || key.startsWith("internal_")) delete object[key];
			else if (isPlainObject(value)) {
				object[key] = { ...value };
				serializeTheme(object[key]);
			}
		}
	}
	serializeTheme(serializableTheme);
	return `import { unstable_createBreakpoints as createBreakpoints, createTransitions } from '@mui/material/styles';

const theme = ${JSON.stringify(serializableTheme, null, 2)};

theme.breakpoints = createBreakpoints(theme.breakpoints || {});
theme.motion = { reducedMotion: 'never', ...theme.motion };
theme.transitions = createTransitions(theme.transitions || {});

export default theme;`;
}
//#endregion
//#region node_modules/@mui/material/styles/createThemeNoVars.mjs
function coefficientToPercentage(coefficient) {
	if (typeof coefficient === "number") return `${(coefficient * 100).toFixed(0)}%`;
	return `calc((${coefficient}) * 100%)`;
}
var parseAddition = (str) => {
	if (!Number.isNaN(+str)) return +str;
	const numbers = str.match(/\d*\.?\d+/g);
	if (!numbers) return 0;
	let sum = 0;
	for (let i = 0; i < numbers.length; i += 1) sum += +numbers[i];
	return sum;
};
function attachColorManipulators(theme) {
	Object.assign(theme, {
		alpha(color, coefficient) {
			const obj = this || theme;
			if (obj.colorSpace) return `oklch(from ${color} l c h / ${typeof coefficient === "string" ? `calc(${coefficient})` : coefficient})`;
			if (obj.vars) return `rgba(${color.replace(/var\(--([^,\s)]+)(?:,[^)]+)?\)+/g, "var(--$1Channel)")} / ${typeof coefficient === "string" ? `calc(${coefficient})` : coefficient})`;
			return alpha(color, parseAddition(coefficient));
		},
		lighten(color, coefficient) {
			const obj = this || theme;
			if (obj.colorSpace) return `color-mix(in ${obj.colorSpace}, ${color}, #fff ${coefficientToPercentage(coefficient)})`;
			return lighten(color, coefficient);
		},
		darken(color, coefficient) {
			const obj = this || theme;
			if (obj.colorSpace) return `color-mix(in ${obj.colorSpace}, ${color}, #000 ${coefficientToPercentage(coefficient)})`;
			return darken(color, coefficient);
		}
	});
}
function createThemeNoVars(options = {}, ...args) {
	const { breakpoints: breakpointsInput, mixins: mixinsInput = {}, spacing: spacingInput, palette: paletteInput = {}, motion: motionInput = {}, transitions: transitionsInput = {}, typography: typographyInput = {}, shape: shapeInput, colorSpace, ...other } = options;
	if (options.vars && options.generateThemeVars === void 0) throw new Error("MUI: `vars` is a private field used for CSS variables support.\nPlease use another name or follow the [docs](https://mui.com/material-ui/customization/css-theme-variables/usage/) to enable the feature.");
	const palette = createPalette({
		...paletteInput,
		colorSpace
	});
	const systemTheme = createTheme$1(options);
	let muiTheme = deepmerge(systemTheme, {
		mixins: createMixins(systemTheme.breakpoints, mixinsInput),
		palette,
		shadows: shadows.slice(),
		typography: createTypography(palette, typographyInput),
		motion: createMotion(motionInput),
		transitions: createTransitions(transitionsInput),
		zIndex: { ...zIndex }
	});
	muiTheme = deepmerge(muiTheme, other);
	muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
	delete muiTheme.transitions.reducedMotion;
	{
		const stateClasses = [
			"active",
			"checked",
			"completed",
			"disabled",
			"error",
			"expanded",
			"focused",
			"focusVisible",
			"required",
			"selected"
		];
		const traverse = (node, component) => {
			let key;
			for (key in node) {
				const child = node[key];
				if (stateClasses.includes(key) && Object.keys(child).length > 0) {
					{
						const stateClass = generateUtilityClass("", key);
						console.error([
							`MUI: The \`${component}\` component increases the CSS specificity of the \`${key}\` internal state.`,
							"You can not override it like this: ",
							JSON.stringify(node, null, 2),
							"",
							`Instead, you need to use the '&.${stateClass}' syntax:`,
							JSON.stringify({ root: { [`&.${stateClass}`]: child } }, null, 2),
							"",
							"https://mui.com/r/state-classes-guide"
						].join("\n"));
					}
					node[key] = {};
				}
			}
		};
		Object.keys(muiTheme.components).forEach((component) => {
			const styleOverrides = muiTheme.components[component].styleOverrides;
			if (styleOverrides && component.startsWith("Mui")) traverse(styleOverrides, component);
		});
	}
	muiTheme.unstable_sxConfig = {
		...defaultSxConfig,
		...other?.unstable_sxConfig
	};
	muiTheme.unstable_sx = function sx(props) {
		return styleFunctionSx_default({
			sx: props,
			theme: this
		});
	};
	muiTheme.toRuntimeSource = stringifyTheme;
	attachColorManipulators(muiTheme);
	return muiTheme;
}
//#endregion
//#region node_modules/@mui/material/styles/getOverlayAlpha.mjs
function getOverlayAlpha(elevation) {
	let alphaValue;
	if (elevation < 1) alphaValue = 5.11916 * elevation ** 2;
	else alphaValue = 4.5 * Math.log(elevation + 1) + 2;
	return Math.round(alphaValue * 10) / 1e3;
}
//#endregion
//#region node_modules/@mui/material/styles/createColorScheme.mjs
var defaultDarkOverlays = [...Array(25)].map((_, index) => {
	if (index === 0) return "none";
	const overlay = getOverlayAlpha(index);
	return `linear-gradient(rgba(255 255 255 / ${overlay}), rgba(255 255 255 / ${overlay}))`;
});
function getOpacity(mode) {
	return {
		inputPlaceholder: mode === "dark" ? .5 : .42,
		inputUnderline: mode === "dark" ? .7 : .42,
		switchTrackDisabled: mode === "dark" ? .2 : .12,
		switchTrack: mode === "dark" ? .3 : .38
	};
}
function getOverlays(mode) {
	return mode === "dark" ? defaultDarkOverlays : [];
}
function createColorScheme(options) {
	const { palette: paletteInput = { mode: "light" }, opacity, overlays, colorSpace, ...other } = options;
	const palette = createPalette({
		...paletteInput,
		colorSpace
	});
	return {
		palette,
		opacity: {
			...getOpacity(palette.mode),
			...opacity
		},
		overlays: overlays || getOverlays(palette.mode),
		...other
	};
}
//#endregion
//#region node_modules/@mui/material/styles/shouldSkipGeneratingVar.mjs
function shouldSkipGeneratingVar(keys) {
	return keys[0] === "motion" || !!keys[0].match(/(cssVarPrefix|colorSchemeSelector|modularCssLayers|rootSelector|typography|mixins|breakpoints|direction|transitions)/) || !!keys[0].match(/sxConfig$/) || keys[0] === "palette" && !!keys[1]?.match(/(mode|contrastThreshold|tonalOffset)/);
}
//#endregion
//#region node_modules/@mui/material/styles/excludeVariablesFromRoot.mjs
/**
* @internal These variables should not appear in the :root stylesheet when the `defaultColorScheme="dark"`
*/
var excludeVariablesFromRoot = (cssVarPrefix) => [
	...[...Array(25)].map((_, index) => `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}overlays-${index}`),
	`--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkBg`,
	`--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkColor`
];
//#endregion
//#region node_modules/@mui/material/styles/createGetSelector.mjs
var createGetSelector_default = (theme) => (colorScheme, css) => {
	const root = theme.rootSelector || ":root";
	const selector = theme.colorSchemeSelector;
	let rule = selector;
	if (selector === "class") rule = ".%s";
	if (selector === "data") rule = "[data-%s]";
	if (selector?.startsWith("data-") && !selector.includes("%s")) rule = `[${selector}="%s"]`;
	if (theme.defaultColorScheme === colorScheme) {
		if (colorScheme === "dark") {
			const excludedVariables = {};
			excludeVariablesFromRoot(theme.cssVarPrefix).forEach((cssVar) => {
				excludedVariables[cssVar] = css[cssVar];
				delete css[cssVar];
			});
			if (rule === "media") return {
				[root]: css,
				[`@media (prefers-color-scheme: dark)`]: { [root]: excludedVariables }
			};
			if (rule) return {
				[rule.replace("%s", colorScheme)]: excludedVariables,
				[`${root}, ${rule.replace("%s", colorScheme)}`]: css
			};
			return { [root]: {
				...css,
				...excludedVariables
			} };
		}
		if (rule && rule !== "media") return `${root}, ${rule.replace("%s", String(colorScheme))}`;
	} else if (colorScheme) {
		if (rule === "media") return { [`@media (prefers-color-scheme: ${String(colorScheme)})`]: { [root]: css } };
		if (rule) return rule.replace("%s", String(colorScheme));
	}
	return root;
};
//#endregion
//#region node_modules/@mui/material/styles/createThemeWithVars.mjs
function assignNode(obj, keys) {
	keys.forEach((k) => {
		if (!obj[k]) obj[k] = {};
	});
}
function setColor(obj, key, defaultValue) {
	if (!obj[key] && defaultValue) obj[key] = defaultValue;
}
function toRgb(color) {
	if (typeof color !== "string" || !color.startsWith("hsl")) return color;
	return hslToRgb(color);
}
function setColorChannel(obj, key) {
	if (!(`${key}Channel` in obj)) obj[`${key}Channel`] = private_safeColorChannel(toRgb(obj[key]), `MUI: Can't create \`palette.${key}Channel\` because \`palette.${key}\` is not one of these formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().
To suppress this warning, you need to explicitly provide the \`palette.${key}Channel\` as a string (in rgb format, for example "12 12 12") or undefined if you want to remove the channel token.`);
}
function getSpacingVal(spacingInput) {
	if (typeof spacingInput === "number") return `${spacingInput}px`;
	if (typeof spacingInput === "string" || typeof spacingInput === "function" || Array.isArray(spacingInput)) return spacingInput;
	return "8px";
}
var silent = (fn) => {
	try {
		return fn();
	} catch (error) {}
};
var createGetCssVar = (cssVarPrefix = "mui") => createGetCssVar$1(cssVarPrefix);
function attachColorScheme$1(colorSpace, colorSchemes, scheme, restTheme, colorScheme) {
	if (!scheme) return;
	scheme = scheme === true ? {} : scheme;
	const mode = colorScheme === "dark" ? "dark" : "light";
	if (!restTheme) {
		colorSchemes[colorScheme] = createColorScheme({
			...scheme,
			palette: {
				mode,
				...scheme?.palette
			},
			colorSpace
		});
		return;
	}
	const { palette, ...muiTheme } = createThemeNoVars({
		...restTheme,
		palette: {
			mode,
			...scheme?.palette
		},
		colorSpace
	});
	colorSchemes[colorScheme] = {
		...scheme,
		palette,
		opacity: {
			...getOpacity(mode),
			...scheme?.opacity
		},
		overlays: scheme?.overlays || getOverlays(mode)
	};
	return muiTheme;
}
/**
* A default `createThemeWithVars` comes with a single color scheme, either `light` or `dark` based on the `defaultColorScheme`.
* This is better suited for apps that only need a single color scheme.
*
* To enable built-in `light` and `dark` color schemes, either:
* 1. provide a `colorSchemeSelector` to define how the color schemes will change.
* 2. provide `colorSchemes.dark` will set `colorSchemeSelector: 'media'` by default.
*/
function createThemeWithVars(options = {}, ...args) {
	const { colorSchemes: colorSchemesInput = { light: true }, defaultColorScheme: defaultColorSchemeInput, disableCssColorScheme = false, cssVarPrefix = "mui", nativeColor = false, shouldSkipGeneratingVar: shouldSkipGeneratingVar$1 = shouldSkipGeneratingVar, colorSchemeSelector: selector = colorSchemesInput.light && colorSchemesInput.dark ? "media" : void 0, rootSelector = ":root", ...input } = options;
	const firstColorScheme = Object.keys(colorSchemesInput)[0];
	const defaultColorScheme = defaultColorSchemeInput || (colorSchemesInput.light && firstColorScheme !== "light" ? "light" : firstColorScheme);
	const getCssVar = createGetCssVar(cssVarPrefix);
	const { [defaultColorScheme]: defaultSchemeInput, light: builtInLight, dark: builtInDark, ...customColorSchemes } = colorSchemesInput;
	const colorSchemes = { ...customColorSchemes };
	let defaultScheme = defaultSchemeInput;
	if (defaultColorScheme === "dark" && !("dark" in colorSchemesInput) || defaultColorScheme === "light" && !("light" in colorSchemesInput)) defaultScheme = true;
	if (!defaultScheme) throw new Error(`MUI: The \`colorSchemes.${defaultColorScheme}\` option is either missing or invalid.`);
	let colorSpace;
	if (nativeColor) colorSpace = "oklch";
	const muiTheme = attachColorScheme$1(colorSpace, colorSchemes, defaultScheme, input, defaultColorScheme);
	if (builtInLight && !colorSchemes.light) attachColorScheme$1(colorSpace, colorSchemes, builtInLight, void 0, "light");
	if (builtInDark && !colorSchemes.dark) attachColorScheme$1(colorSpace, colorSchemes, builtInDark, void 0, "dark");
	let theme = {
		defaultColorScheme,
		...muiTheme,
		cssVarPrefix,
		colorSchemeSelector: selector,
		rootSelector,
		getCssVar,
		colorSchemes,
		font: {
			...prepareTypographyVars(muiTheme.typography),
			...muiTheme.font
		},
		spacing: getSpacingVal(input.spacing)
	};
	Object.keys(theme.colorSchemes).forEach((key) => {
		const palette = theme.colorSchemes[key].palette;
		const setCssVarColor = (cssVar) => {
			const tokens = cssVar.split("-");
			const color = tokens[1];
			const colorToken = tokens[2];
			return getCssVar(cssVar, palette[color][colorToken]);
		};
		if (palette.mode === "light") {
			setColor(palette.common, "background", "#fff");
			setColor(palette.common, "onBackground", "#000");
		}
		if (palette.mode === "dark") {
			setColor(palette.common, "background", "#000");
			setColor(palette.common, "onBackground", "#fff");
		}
		function colorMix(method, color, coefficient) {
			if (colorSpace) {
				let mixer;
				if (method === private_safeAlpha) mixer = `transparent ${((1 - coefficient) * 100).toFixed(0)}%`;
				if (method === private_safeDarken) mixer = `#000 ${(coefficient * 100).toFixed(0)}%`;
				if (method === private_safeLighten) mixer = `#fff ${(coefficient * 100).toFixed(0)}%`;
				return `color-mix(in ${colorSpace}, ${color}, ${mixer})`;
			}
			return method(color, coefficient);
		}
		assignNode(palette, [
			"Alert",
			"AppBar",
			"Avatar",
			"Button",
			"Chip",
			"FilledInput",
			"LinearProgress",
			"Skeleton",
			"Slider",
			"SnackbarContent",
			"SpeedDialAction",
			"StepConnector",
			"StepContent",
			"Switch",
			"TableCell",
			"Tooltip"
		]);
		if (palette.mode === "light") {
			setColor(palette.Alert, "errorColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-error-light") : palette.error.light, .6));
			setColor(palette.Alert, "infoColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-info-light") : palette.info.light, .6));
			setColor(palette.Alert, "successColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-success-light") : palette.success.light, .6));
			setColor(palette.Alert, "warningColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-warning-light") : palette.warning.light, .6));
			setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-main"));
			setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-main"));
			setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-main"));
			setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-main"));
			setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.main)));
			setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.main)));
			setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.main)));
			setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.main)));
			setColor(palette.Alert, "errorStandardBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-error-light") : palette.error.light, .9));
			setColor(palette.Alert, "infoStandardBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-info-light") : palette.info.light, .9));
			setColor(palette.Alert, "successStandardBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-success-light") : palette.success.light, .9));
			setColor(palette.Alert, "warningStandardBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-warning-light") : palette.warning.light, .9));
			setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
			setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
			setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
			setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
			setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-100"));
			setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-400"));
			setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-300"));
			setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-A100"));
			setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-400"));
			setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-700"));
			setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-700"));
			setColor(palette.FilledInput, "bg", "rgba(0, 0, 0, 0.06)");
			setColor(palette.FilledInput, "hoverBg", "rgba(0, 0, 0, 0.09)");
			setColor(palette.FilledInput, "disabledBg", "rgba(0, 0, 0, 0.12)");
			setColor(palette.LinearProgress, "primaryBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .62));
			setColor(palette.LinearProgress, "secondaryBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .62));
			setColor(palette.LinearProgress, "errorBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .62));
			setColor(palette.LinearProgress, "infoBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .62));
			setColor(palette.LinearProgress, "successBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .62));
			setColor(palette.LinearProgress, "warningBg", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-warning-light") : palette.warning.main, .62));
			setColor(palette.Skeleton, "bg", colorSpace ? colorMix(private_safeAlpha, nativeColor ? getCssVar("palette-text-primary") : palette.text.primary, .11) : `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.11)`);
			setColor(palette.Slider, "primaryTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .62));
			setColor(palette.Slider, "secondaryTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .62));
			setColor(palette.Slider, "errorTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .62));
			setColor(palette.Slider, "infoTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .62));
			setColor(palette.Slider, "successTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .62));
			setColor(palette.Slider, "warningTrack", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-warning-main") : palette.warning.main, .62));
			const snackbarContentBackground = colorSpace ? colorMix(private_safeDarken, nativeColor ? getCssVar("palette-background-default") : palette.background.default, .6825) : private_safeEmphasize(palette.background.default, .8);
			setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
			setColor(palette.SnackbarContent, "color", silent(() => colorSpace ? dark.text.primary : palette.getContrastText(snackbarContentBackground)));
			setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, .15));
			setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-400"));
			setColor(palette.StepContent, "border", setCssVarColor("palette-grey-400"));
			setColor(palette.Switch, "defaultColor", setCssVarColor("palette-common-white"));
			setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-100"));
			setColor(palette.Switch, "primaryDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .62));
			setColor(palette.Switch, "secondaryDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .62));
			setColor(palette.Switch, "errorDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .62));
			setColor(palette.Switch, "infoDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .62));
			setColor(palette.Switch, "successDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .62));
			setColor(palette.Switch, "warningDisabledColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-warning-main") : palette.warning.main, .62));
			setColor(palette.TableCell, "border", colorMix(private_safeLighten, private_safeAlpha(nativeColor ? getCssVar("palette-divider") : palette.divider, 1), .88));
			setColor(palette.Tooltip, "bg", colorMix(private_safeAlpha, nativeColor ? getCssVar("palette-grey-700") : palette.grey[700], .92));
		}
		if (palette.mode === "dark") {
			setColor(palette.Alert, "errorColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-error-light") : palette.error.light, .6));
			setColor(palette.Alert, "infoColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-info-light") : palette.info.light, .6));
			setColor(palette.Alert, "successColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-success-light") : palette.success.light, .6));
			setColor(palette.Alert, "warningColor", colorMix(private_safeLighten, nativeColor ? getCssVar("palette-warning-light") : palette.warning.light, .6));
			setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-dark"));
			setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-dark"));
			setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-dark"));
			setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-dark"));
			setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.dark)));
			setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.dark)));
			setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.dark)));
			setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.dark)));
			setColor(palette.Alert, "errorStandardBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-error-light") : palette.error.light, .9));
			setColor(palette.Alert, "infoStandardBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-info-light") : palette.info.light, .9));
			setColor(palette.Alert, "successStandardBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-success-light") : palette.success.light, .9));
			setColor(palette.Alert, "warningStandardBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-warning-light") : palette.warning.light, .9));
			setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
			setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
			setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
			setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
			setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-900"));
			setColor(palette.AppBar, "darkBg", setCssVarColor("palette-background-paper"));
			setColor(palette.AppBar, "darkColor", setCssVarColor("palette-text-primary"));
			setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-600"));
			setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-800"));
			setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-700"));
			setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-700"));
			setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-300"));
			setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-300"));
			setColor(palette.FilledInput, "bg", "rgba(255, 255, 255, 0.09)");
			setColor(palette.FilledInput, "hoverBg", "rgba(255, 255, 255, 0.13)");
			setColor(palette.FilledInput, "disabledBg", "rgba(255, 255, 255, 0.12)");
			setColor(palette.LinearProgress, "primaryBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .5));
			setColor(palette.LinearProgress, "secondaryBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .5));
			setColor(palette.LinearProgress, "errorBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .5));
			setColor(palette.LinearProgress, "infoBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .5));
			setColor(palette.LinearProgress, "successBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .5));
			setColor(palette.LinearProgress, "warningBg", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-warning-main") : palette.warning.main, .5));
			setColor(palette.Skeleton, "bg", colorSpace ? colorMix(private_safeAlpha, nativeColor ? getCssVar("palette-text-primary") : palette.text.primary, .13) : `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.13)`);
			setColor(palette.Slider, "primaryTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .5));
			setColor(palette.Slider, "secondaryTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .5));
			setColor(palette.Slider, "errorTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .5));
			setColor(palette.Slider, "infoTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .5));
			setColor(palette.Slider, "successTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .5));
			setColor(palette.Slider, "warningTrack", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-warning-light") : palette.warning.main, .5));
			const snackbarContentBackground = colorSpace ? colorMix(private_safeLighten, nativeColor ? getCssVar("palette-background-default") : palette.background.default, .985) : private_safeEmphasize(palette.background.default, .98);
			setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
			setColor(palette.SnackbarContent, "color", silent(() => colorSpace ? light.text.primary : palette.getContrastText(snackbarContentBackground)));
			setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, .15));
			setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-600"));
			setColor(palette.StepContent, "border", setCssVarColor("palette-grey-600"));
			setColor(palette.Switch, "defaultColor", setCssVarColor("palette-grey-300"));
			setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-600"));
			setColor(palette.Switch, "primaryDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-primary-main") : palette.primary.main, .55));
			setColor(palette.Switch, "secondaryDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-secondary-main") : palette.secondary.main, .55));
			setColor(palette.Switch, "errorDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-error-main") : palette.error.main, .55));
			setColor(palette.Switch, "infoDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-info-main") : palette.info.main, .55));
			setColor(palette.Switch, "successDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-success-main") : palette.success.main, .55));
			setColor(palette.Switch, "warningDisabledColor", colorMix(private_safeDarken, nativeColor ? getCssVar("palette-warning-light") : palette.warning.main, .55));
			setColor(palette.TableCell, "border", colorMix(private_safeDarken, private_safeAlpha(nativeColor ? getCssVar("palette-divider") : palette.divider, 1), .68));
			setColor(palette.Tooltip, "bg", colorMix(private_safeAlpha, nativeColor ? getCssVar("palette-grey-700") : palette.grey[700], .92));
		}
		if (!nativeColor) {
			setColorChannel(palette.background, "default");
			setColorChannel(palette.background, "paper");
			setColorChannel(palette.common, "background");
			setColorChannel(palette.common, "onBackground");
			setColorChannel(palette, "divider");
		}
		Object.keys(palette).forEach((color) => {
			const colors = palette[color];
			if (color !== "tonalOffset" && !nativeColor && colors && typeof colors === "object") {
				if (colors.main) setColor(palette[color], "mainChannel", private_safeColorChannel(toRgb(colors.main)));
				if (colors.light) setColor(palette[color], "lightChannel", private_safeColorChannel(toRgb(colors.light)));
				if (colors.dark) setColor(palette[color], "darkChannel", private_safeColorChannel(toRgb(colors.dark)));
				if (colors.contrastText) setColor(palette[color], "contrastTextChannel", private_safeColorChannel(toRgb(colors.contrastText)));
				if (color === "text") {
					setColorChannel(palette[color], "primary");
					setColorChannel(palette[color], "secondary");
				}
				if (color === "action") {
					if (colors.active) setColorChannel(palette[color], "active");
					if (colors.selected) setColorChannel(palette[color], "selected");
				}
			}
		});
	});
	theme = args.reduce((acc, argument) => deepmerge(acc, argument), theme);
	const parserConfig = {
		prefix: cssVarPrefix,
		disableCssColorScheme,
		shouldSkipGeneratingVar: shouldSkipGeneratingVar$1,
		getSelector: createGetSelector_default(theme),
		enableContrastVars: nativeColor
	};
	const { vars, generateThemeVars, generateStyleSheets } = prepareCssVars(theme, parserConfig);
	theme.vars = vars;
	Object.entries(theme.colorSchemes[theme.defaultColorScheme]).forEach(([key, value]) => {
		theme[key] = value;
	});
	theme.generateThemeVars = generateThemeVars;
	theme.generateStyleSheets = generateStyleSheets;
	theme.generateSpacing = function generateSpacing() {
		return createSpacing(input.spacing, createUnarySpacing(this));
	};
	theme.getColorSchemeSelector = createGetColorSchemeSelector(selector);
	theme.spacing = theme.generateSpacing();
	theme.shouldSkipGeneratingVar = shouldSkipGeneratingVar$1;
	theme.unstable_sxConfig = {
		...defaultSxConfig,
		...input?.unstable_sxConfig
	};
	theme.unstable_sx = function sx(props) {
		return styleFunctionSx_default({
			sx: props,
			theme: this
		});
	};
	theme.internal_cache = {};
	theme.toRuntimeSource = stringifyTheme;
	return theme;
}
//#endregion
//#region node_modules/@mui/material/styles/createTheme.mjs
function attachColorScheme(theme, scheme, colorScheme) {
	if (!theme.colorSchemes) return;
	if (colorScheme) theme.colorSchemes[scheme] = {
		...colorScheme !== true && colorScheme,
		palette: createPalette({
			...colorScheme === true ? {} : colorScheme.palette,
			mode: scheme
		})
	};
}
/**
* Generate a theme base on the options received.
* @param options Takes an incomplete theme object and adds the missing parts.
* @param args Deep merge the arguments with the about to be returned theme.
* @returns A complete, ready-to-use theme object.
*/
function createTheme(options = {}, ...args) {
	const { palette, cssVariables = false, colorSchemes: initialColorSchemes = !palette ? { light: true } : void 0, defaultColorScheme: initialDefaultColorScheme = palette?.mode, ...other } = options;
	const defaultColorSchemeInput = initialDefaultColorScheme || "light";
	const defaultScheme = initialColorSchemes?.[defaultColorSchemeInput];
	const colorSchemesInput = {
		...initialColorSchemes,
		...palette ? { [defaultColorSchemeInput]: {
			...typeof defaultScheme !== "boolean" && defaultScheme,
			palette
		} } : void 0
	};
	if (cssVariables === false) {
		if (!("colorSchemes" in options)) return createThemeNoVars(options, ...args);
		let paletteOptions = palette;
		if (!("palette" in options)) {
			if (colorSchemesInput[defaultColorSchemeInput]) {
				if (colorSchemesInput[defaultColorSchemeInput] !== true) paletteOptions = colorSchemesInput[defaultColorSchemeInput].palette;
				else if (defaultColorSchemeInput === "dark") paletteOptions = { mode: "dark" };
			}
		}
		const theme = createThemeNoVars({
			...options,
			palette: paletteOptions
		}, ...args);
		theme.defaultColorScheme = defaultColorSchemeInput;
		theme.colorSchemes = colorSchemesInput;
		if (theme.palette.mode === "light") {
			theme.colorSchemes.light = {
				...colorSchemesInput.light !== true && colorSchemesInput.light,
				palette: theme.palette
			};
			attachColorScheme(theme, "dark", colorSchemesInput.dark);
		}
		if (theme.palette.mode === "dark") {
			theme.colorSchemes.dark = {
				...colorSchemesInput.dark !== true && colorSchemesInput.dark,
				palette: theme.palette
			};
			attachColorScheme(theme, "light", colorSchemesInput.light);
		}
		return theme;
	}
	if (!palette && !("light" in colorSchemesInput) && defaultColorSchemeInput === "light") colorSchemesInput.light = true;
	return createThemeWithVars({
		...other,
		colorSchemes: colorSchemesInput,
		defaultColorScheme: defaultColorSchemeInput,
		...typeof cssVariables !== "boolean" && cssVariables
	}, ...args);
}
//#endregion
//#region node_modules/@mui/material/styles/defaultTheme.mjs
var defaultTheme = createTheme();
//#endregion
//#region node_modules/@mui/material/styles/identifier.mjs
var identifier_default = "$$material";
//#endregion
//#region node_modules/@mui/material/styles/useTheme.mjs
function useTheme() {
	const theme = useTheme$1(defaultTheme);
	import_react.useDebugValue(theme);
	return theme["$$material"] || theme;
}
//#endregion
//#region node_modules/@mui/material/styles/slotShouldForwardProp.mjs
function slotShouldForwardProp(prop) {
	return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
//#endregion
//#region node_modules/@mui/material/styles/rootShouldForwardProp.mjs
var rootShouldForwardProp = (prop) => slotShouldForwardProp(prop) && prop !== "classes";
//#endregion
//#region node_modules/@mui/material/styles/styled.mjs
var styled = createStyled({
	themeId: identifier_default,
	defaultTheme,
	rootShouldForwardProp
});
//#endregion
//#region node_modules/@mui/material/utils/memoTheme.mjs
var memoTheme = unstable_memoTheme;
//#endregion
//#region node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.mjs
function DefaultPropsProvider(props) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DefaultPropsProvider$1, { ...props });
}
DefaultPropsProvider.propTypes = {
	/**
	* @ignore
	*/
	children: import_prop_types.default.node,
	/**
	* @ignore
	*/
	value: import_prop_types.default.object.isRequired
};
function useDefaultProps(params) {
	return useDefaultProps$1(params);
}
//#endregion
//#region node_modules/@mui/material/utils/capitalize.mjs
var capitalize_default = capitalize;
//#endregion
//#region node_modules/@mui/utils/useValueAsRef/useValueAsRef.mjs
/**
* Copied from `@base-ui/utils/useValueAsRef`.
*
* Stores the latest value in a stable ref. The ref updates after React commits,
* so effects and delayed callbacks can read the current value without depending
* on it and rerunning.
*/
function useValueAsRef(value) {
	const latest = useLazyRef(() => createValueRef(value)).current;
	latest.next = value;
	useEnhancedEffect(latest.effect);
	return latest;
}
function createValueRef(value) {
	const latest = {
		current: value,
		next: value,
		effect: () => {
			latest.current = latest.next;
		}
	};
	return latest;
}
//#endregion
//#region node_modules/react-transition-group/esm/TransitionGroupContext.js
var TransitionGroupContext_default = import_react.createContext(null);
//#endregion
//#region node_modules/@mui/material/transitions/utils.mjs
var reflow = (node) => node.scrollTop;
var EMPTY_STYLE = {};
function normalizedTransitionCallback(nodeRef, callback) {
	return (maybeIsAppearing) => {
		if (callback) {
			const node = nodeRef.current;
			if (maybeIsAppearing === void 0) callback(node);
			else callback(node, maybeIsAppearing);
		}
	};
}
/**
* Return the child style for a transition. Reuse predefined style objects when
* no custom styles are present so memoized children see the same object.
*/
function getTransitionChildStyle(state, inProp, baseStyles, hiddenStyles, styleProp, childStyle) {
	const base = state === "exited" && !inProp ? hiddenStyles : baseStyles[state] || baseStyles.exited;
	return styleProp || childStyle ? {
		...base,
		...styleProp,
		...childStyle
	} : base;
}
function getTransitionProps(props, options) {
	const { timeout, easing, style = EMPTY_STYLE } = props;
	return {
		duration: style.transitionDuration ?? (typeof timeout === "number" ? timeout : timeout[options.mode] || 0),
		easing: style.transitionTimingFunction ?? (typeof easing === "object" ? easing[options.mode] : easing),
		delay: style.transitionDelay
	};
}
//#endregion
//#region node_modules/@mui/material/internal/Transition.mjs
function resolveTimeouts(timeout) {
	if (timeout == null) return {
		appear: void 0,
		enter: void 0,
		exit: void 0
	};
	if (typeof timeout === "number") return {
		appear: timeout,
		enter: timeout,
		exit: timeout
	};
	const enter = timeout.enter;
	const exit = timeout.exit;
	return {
		appear: timeout.appear !== void 0 ? timeout.appear : enter,
		enter,
		exit
	};
}
/**
* Resolves the authored completion timeout for the current transition phase.
* Auto durations are read by the caller at scheduling time so Grow/Collapse
* can pass the latest measured value without storing it in React state.
*/
function getCompletionTimeout(params) {
	if (params.autoTimeout != null) return params.autoTimeout;
	const resolved = resolveTimeouts(params.timeout);
	if (params.currentStatus === "entering") return params.isAppearing ? resolved.appear ?? resolved.enter ?? null : resolved.enter ?? null;
	return resolved.exit ?? null;
}
function Transition(props) {
	const { in: inProp = false, appear = false, enter = true, exit = true, mountOnEnter = false, unmountOnExit = false, timeout, addEndListener, reduceMotion = false, getAutoTimeout, nodeRef, onEnter, onEntering, onEntered, onExit, onExiting, onExited, children, ...childProps } = props;
	const parentGroup = import_react.useContext(TransitionGroupContext_default);
	const shouldEnterOnMount = parentGroup && !parentGroup.isMounting ? enter : appear;
	const [status, setStatus] = import_react.useState(() => {
		if (inProp) return shouldEnterOnMount ? "exited" : "entered";
		if (mountOnEnter || unmountOnExit) return "unmounted";
		return "exited";
	});
	const statusRef = import_react.useRef(status);
	statusRef.current = status;
	const shouldAppearOnMountRef = import_react.useRef(inProp && shouldEnterOnMount);
	const mountedRef = import_react.useRef(false);
	const nextCallbackRef = import_react.useRef(null);
	const lastFiredStatusRef = import_react.useRef(status);
	const isAppearingRef = import_react.useRef(false);
	const transitionReduceMotionRef = import_react.useRef(reduceMotion);
	const propsRef = useValueAsRef({
		timeout,
		addEndListener,
		reduceMotion,
		getAutoTimeout,
		onEnter,
		onEntering,
		onEntered,
		onExit,
		onExiting,
		onExited,
		enter,
		exit,
		mountOnEnter,
		unmountOnExit,
		nodeRef,
		parentGroup
	});
	const cancelPendingCallback = import_react.useCallback(() => {
		if (nextCallbackRef.current !== null) {
			nextCallbackRef.current.cancel();
			nextCallbackRef.current = null;
		}
	}, []);
	const makeCallback = import_react.useCallback((handler) => {
		let active = true;
		const wrapped = () => {
			if (active) {
				active = false;
				nextCallbackRef.current = null;
				handler();
			}
		};
		wrapped.cancel = () => {
			active = false;
		};
		nextCallbackRef.current = wrapped;
		return wrapped;
	}, []);
	const scheduleTransitionEnd = import_react.useCallback((nextStatus, currentStatus) => {
		let timeoutId;
		const clearTimer = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		const done = makeCallback(() => {
			clearTimer();
			statusRef.current = nextStatus;
			setStatus(nextStatus);
		});
		const cancelDone = done.cancel;
		done.cancel = () => {
			clearTimer();
			cancelDone();
		};
		const node = propsRef.current.nodeRef.current;
		const listener = propsRef.current.addEndListener;
		const hasAutoTimeout = propsRef.current.getAutoTimeout !== void 0;
		const autoTimeout = propsRef.current.getAutoTimeout?.();
		const authoredTimeout = getCompletionTimeout({
			currentStatus,
			isAppearing: isAppearingRef.current,
			timeout: propsRef.current.timeout,
			autoTimeout
		});
		const transitionReduceMotion = transitionReduceMotionRef.current;
		const fallbackTimeout = authoredTimeout ?? (transitionReduceMotion && hasAutoTimeout ? 0 : null);
		const scheduleTimer = (value) => {
			timeoutId = setTimeout(done, value);
		};
		if (!node) {
			console.warn([
				"MUI: The transition child does not expose a DOM element.",
				"Make sure the child accepts a ref and forwards it to the underlying DOM element.",
				"The transition animation cannot be observed without a DOM element and will be skipped."
			].join("\n"));
			scheduleTimer(0);
			return;
		}
		if (listener) {
			if (fallbackTimeout != null) scheduleTimer(transitionReduceMotion ? 0 : fallbackTimeout);
			if (listener.length >= 2) listener(node, done);
			else listener(done);
			return;
		}
		scheduleTimer(transitionReduceMotion ? 0 : authoredTimeout ?? 0);
	}, [makeCallback, propsRef]);
	const performEnter = import_react.useCallback((mounting) => {
		const current = propsRef.current;
		const isAppearing = current.parentGroup ? current.parentGroup.isMounting : mounting;
		isAppearingRef.current = isAppearing;
		if (!mounting && !current.enter) {
			statusRef.current = "entered";
			setStatus("entered");
			return;
		}
		transitionReduceMotionRef.current = current.reduceMotion;
		current.onEnter?.(isAppearing);
		statusRef.current = "entering";
		setStatus("entering");
	}, [propsRef]);
	const performExit = import_react.useCallback(() => {
		const current = propsRef.current;
		if (!current.exit) {
			statusRef.current = "exited";
			setStatus("exited");
			return;
		}
		transitionReduceMotionRef.current = current.reduceMotion;
		current.onExit?.();
		statusRef.current = "exiting";
		setStatus("exiting");
	}, [propsRef]);
	const updateStatus = import_react.useCallback((mounting, nextStatus) => {
		cancelPendingCallback();
		if (nextStatus === "entering") {
			const current = propsRef.current;
			if (current.mountOnEnter || current.unmountOnExit) {
				const node = current.nodeRef.current;
				if (node) reflow(node);
			}
			performEnter(mounting);
		} else performExit();
	}, [
		cancelPendingCallback,
		performEnter,
		performExit,
		propsRef
	]);
	useEnhancedEffect(() => {
		mountedRef.current = true;
		if (shouldAppearOnMountRef.current) {
			shouldAppearOnMountRef.current = false;
			updateStatus(true, "entering");
		}
		return () => {
			mountedRef.current = false;
			cancelPendingCallback();
		};
	}, [cancelPendingCallback, updateStatus]);
	useEnhancedEffect(() => {
		if (!mountedRef.current) return;
		const current = statusRef.current;
		if (inProp) {
			if (current === "unmounted") {
				statusRef.current = "exited";
				setStatus("exited");
			} else if (current !== "entering" && current !== "entered") updateStatus(false, "entering");
		} else if (current === "entering" || current === "entered") updateStatus(false, "exiting");
		else if (current === "exited" && unmountOnExit) {
			statusRef.current = "unmounted";
			setStatus("unmounted");
		}
	}, [
		inProp,
		status,
		unmountOnExit,
		updateStatus
	]);
	useEnhancedEffect(() => {
		if (status === "unmounted" || lastFiredStatusRef.current === "unmounted") {
			lastFiredStatusRef.current = status;
			return;
		}
		if (lastFiredStatusRef.current === status) return;
		lastFiredStatusRef.current = status;
		const current = propsRef.current;
		if (status === "entering") {
			current.onEntering?.(isAppearingRef.current);
			scheduleTransitionEnd("entered", "entering");
		} else if (status === "exiting") {
			current.onExiting?.();
			scheduleTransitionEnd("exited", "exiting");
		} else if (status === "entered") current.onEntered?.(isAppearingRef.current);
		else if (status === "exited") current.onExited?.();
	}, [
		propsRef,
		scheduleTransitionEnd,
		status
	]);
	if (status === "unmounted") return null;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TransitionGroupContext_default.Provider, {
		value: null,
		children: children(status, childProps)
	});
}
Transition.propTypes = {
	/**
	* @ignore
	*/
	addEndListener: import_prop_types.default.func,
	/**
	* @ignore
	*/
	appear: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	children: import_prop_types.default.func.isRequired,
	/**
	* @ignore
	*/
	enter: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	exit: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	getAutoTimeout: import_prop_types.default.func,
	/**
	* @ignore
	*/
	in: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	mountOnEnter: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	nodeRef: import_prop_types.default.shape({ current: (props, propName) => {
		if (props[propName] == null) return null;
		if (typeof props[propName] !== "object" || props[propName].nodeType !== 1) return /* @__PURE__ */ new Error(`Expected prop '${propName}' to be of type Element`);
		return null;
	} }).isRequired,
	/**
	* @ignore
	*/
	onEnter: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onEntered: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onEntering: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExit: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExited: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExiting: import_prop_types.default.func,
	/**
	* @ignore
	*/
	reduceMotion: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	timeout: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.shape({
		appear: import_prop_types.default.number,
		enter: import_prop_types.default.number,
		exit: import_prop_types.default.number
	})]),
	/**
	* @ignore
	*/
	unmountOnExit: import_prop_types.default.bool
};
//#endregion
//#region node_modules/@mui/material/transitions/useReducedMotion.mjs
var MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
var REDUCED_MOTION_DURATION = 0;
var REDUCED_MOTION_DELAY = "0ms";
var NOOP = () => {};
var getDefaultSnapshot = () => false;
var getReducedMotionSnapshot = () => true;
var subscribeNoop = () => NOOP;
/**
* Subscribes to the OS reduced-motion media query only when the theme mode needs it.
* React 17 reads the media query after mount, matching useMediaQuery's fallback path.
*/
function useReducedMotionMediaQueryOld(enabled) {
	const [queryState, setQueryState] = import_react.useState(() => ({
		enabled,
		matches: enabled ? null : false
	}));
	let matches = queryState.matches;
	if (queryState.enabled !== enabled) {
		matches = null;
		if (!enabled) matches = false;
	}
	useEnhancedEffect(() => {
		const setResolvedMatches = (nextMatches) => {
			setQueryState((previousState) => {
				if (previousState.enabled === enabled && previousState.matches === nextMatches) return previousState;
				return {
					enabled,
					matches: nextMatches
				};
			});
		};
		if (!enabled) {
			if (queryState.enabled) setResolvedMatches(false);
			return;
		}
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
			setResolvedMatches(false);
			return;
		}
		const mediaQueryList = window.matchMedia(MEDIA_QUERY);
		const update = () => {
			setResolvedMatches(mediaQueryList.matches);
		};
		update();
		mediaQueryList.addEventListener("change", update);
		return () => {
			mediaQueryList.removeEventListener("change", update);
		};
	}, [enabled, queryState.enabled]);
	return matches;
}
var maybeReactUseSyncExternalStore = { ...import_react }.useSyncExternalStore;
/**
* React 18+ can read the media query during client renders, so newly mounted
* transitions do not start from the SSR-safe reduced-motion default.
*/
function useReducedMotionMediaQueryNew(enabled) {
	const getServerSnapshot = enabled ? getReducedMotionSnapshot : getDefaultSnapshot;
	const [getSnapshot, subscribe] = import_react.useMemo(() => {
		if (!enabled || typeof window === "undefined" || typeof window.matchMedia !== "function") return [getDefaultSnapshot, subscribeNoop];
		const mediaQueryList = window.matchMedia(MEDIA_QUERY);
		return [() => mediaQueryList.matches, (notify) => {
			mediaQueryList.addEventListener("change", notify);
			return () => {
				mediaQueryList.removeEventListener("change", notify);
			};
		}];
	}, [enabled]);
	return maybeReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
var useReducedMotionMediaQuery = maybeReactUseSyncExternalStore !== void 0 ? useReducedMotionMediaQueryNew : useReducedMotionMediaQueryOld;
/**
* Resolves whether a Material UI transition should reduce motion and provides
* adjusted CSS transition timing for MUI-owned duration/delay values.
*/
function useReducedMotion(mode, disablePrefersReducedMotion) {
	const prefersReducedMotion = useReducedMotionMediaQuery(!disablePrefersReducedMotion && mode === "system");
	const shouldReduceMotion = !disablePrefersReducedMotion && (mode === "always" || mode === "system" && prefersReducedMotion !== false);
	return import_react.useMemo(() => ({
		shouldReduceMotion,
		getTransitionTiming(timing) {
			if (!shouldReduceMotion) return timing;
			return {
				duration: REDUCED_MOTION_DURATION,
				delay: REDUCED_MOTION_DELAY
			};
		}
	}), [shouldReduceMotion]);
}
//#endregion
//#region node_modules/@mui/utils/useForkRef/useForkRef.mjs
/**
* Merges refs into a single memoized callback ref or `null`.
*
* ```tsx
* const rootRef = React.useRef<Instance>(null);
* const refFork = useForkRef(rootRef, props.ref);
*
* return (
*   <Root {...props} ref={refFork} />
* );
* ```
*
* @param {Array<React.Ref<Instance> | undefined>} refs The ref array.
* @returns {React.RefCallback<Instance> | null} The new ref callback.
*/
function useForkRef(...refs) {
	const cleanupRef = import_react.useRef(void 0);
	const refEffect = import_react.useCallback((instance) => {
		const cleanups = refs.map((ref) => {
			if (ref == null) return null;
			if (typeof ref === "function") {
				const refCallback = ref;
				const refCleanup = refCallback(instance);
				return typeof refCleanup === "function" ? refCleanup : () => {
					refCallback(null);
				};
			}
			ref.current = instance;
			return () => {
				ref.current = null;
			};
		});
		return () => {
			cleanups.forEach((refCleanup) => refCleanup?.());
		};
	}, refs);
	return import_react.useMemo(() => {
		if (refs.every((ref) => ref == null)) return null;
		return (value) => {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = void 0;
			}
			if (value != null) cleanupRef.current = refEffect(value);
		};
	}, refs);
}
//#endregion
//#region node_modules/@mui/material/utils/useForkRef.mjs
var useForkRef_default = useForkRef;
//#endregion
//#region node_modules/@mui/material/Grow/Grow.mjs
function getScale(value) {
	return `scale(${value}, ${value ** 2})`;
}
var styles = {
	entering: {
		opacity: 1,
		transform: getScale(1)
	},
	entered: {
		opacity: 1,
		transform: "none"
	},
	exiting: {
		opacity: 0,
		transform: getScale(.75)
	},
	exited: {
		opacity: 0,
		transform: getScale(.75)
	}
};
var hiddenStyles = {
	opacity: 0,
	transform: getScale(.75),
	visibility: "hidden"
};
/**
* The Grow transition is used by the [Tooltip](/material-ui/react-tooltip/) and
* [Popover](/material-ui/react-popover/) components.
*/
var Grow = /*#__PURE__*/ import_react.forwardRef(function Grow(props, ref) {
	const { addEndListener, appear = true, children, disablePrefersReducedMotion = false, easing, in: inProp, onEnter, onEntered, onEntering, onExit, onExited, onExiting, style, timeout = "auto", ...other } = props;
	const autoTimeout = import_react.useRef(null);
	const theme = useTheme();
	const reducedMotion = useReducedMotion(theme.motion.reducedMotion, disablePrefersReducedMotion);
	const nodeRef = import_react.useRef(null);
	const handleRef = useForkRef_default(nodeRef, getReactElementRef(children), ref);
	const handleEntering = normalizedTransitionCallback(nodeRef, onEntering);
	const handleEnter = normalizedTransitionCallback(nodeRef, (node, isAppearing) => {
		if (!reducedMotion.shouldReduceMotion) reflow(node);
		const { duration: transitionDuration, delay, easing: transitionTimingFunction } = getTransitionProps({
			style,
			timeout,
			easing
		}, { mode: "enter" });
		let duration;
		if (timeout === "auto" && !reducedMotion.shouldReduceMotion) {
			duration = theme.transitions.getAutoHeightDuration(node.clientHeight);
			autoTimeout.current = duration;
		} else {
			duration = transitionDuration;
			autoTimeout.current = null;
		}
		const transitionTiming = reducedMotion.getTransitionTiming({
			duration,
			delay
		});
		node.style.transition = [theme.transitions.create("opacity", {
			duration: transitionTiming.duration,
			delay: transitionTiming.delay
		}), theme.transitions.create("transform", {
			duration: typeof transitionTiming.duration === "string" ? transitionTiming.duration : transitionTiming.duration * .666,
			delay: transitionTiming.delay,
			easing: transitionTimingFunction
		})].join(",");
		if (onEnter) onEnter(node, isAppearing);
	});
	const handleEntered = normalizedTransitionCallback(nodeRef, onEntered);
	const handleExiting = normalizedTransitionCallback(nodeRef, onExiting);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Transition, {
		appear,
		in: inProp,
		nodeRef,
		onEnter: handleEnter,
		onEntered: handleEntered,
		onEntering: handleEntering,
		onExit: normalizedTransitionCallback(nodeRef, (node) => {
			const { duration: transitionDuration, delay, easing: transitionTimingFunction } = getTransitionProps({
				style,
				timeout,
				easing
			}, { mode: "exit" });
			let duration;
			if (timeout === "auto" && !reducedMotion.shouldReduceMotion) {
				duration = theme.transitions.getAutoHeightDuration(node.clientHeight);
				autoTimeout.current = duration;
			} else {
				duration = transitionDuration;
				autoTimeout.current = null;
			}
			const transitionTiming = reducedMotion.getTransitionTiming({
				duration,
				delay
			});
			node.style.transition = [theme.transitions.create("opacity", {
				duration: transitionTiming.duration,
				delay: transitionTiming.delay
			}), theme.transitions.create("transform", {
				duration: typeof transitionTiming.duration === "string" ? transitionTiming.duration : transitionTiming.duration * .666,
				delay: transitionTiming.delay || (typeof transitionTiming.duration === "string" ? transitionTiming.duration : transitionTiming.duration * .333),
				easing: transitionTimingFunction
			})].join(",");
			node.style.opacity = 0;
			node.style.transform = getScale(.75);
			if (onExit) onExit(node);
		}),
		onExited: normalizedTransitionCallback(nodeRef, (node) => {
			node.style.transition = "";
			if (onExited) onExited(node);
		}),
		onExiting: handleExiting,
		addEndListener: addEndListener ? (next) => {
			addEndListener(nodeRef.current, next);
		} : void 0,
		getAutoTimeout: timeout === "auto" ? () => autoTimeout.current : void 0,
		reduceMotion: reducedMotion.shouldReduceMotion,
		timeout: timeout === "auto" ? null : timeout,
		...other,
		children: (state, { ownerState, ...restChildProps }) => {
			const childStyle = getTransitionChildStyle(state, inProp, styles, hiddenStyles, style, children.props.style);
			return /*#__PURE__*/ import_react.cloneElement(children, {
				style: childStyle,
				ref: handleRef,
				...restChildProps
			});
		}
	});
});
Grow.propTypes = {
	/**
	* Add a custom transition end trigger.
	* Use it when you need custom logic to decide when the transition has ended.
	* Note: Timeouts are still used as a fallback if provided.
	*
	* @param {HTMLElement} node The transitioning DOM node.
	* @param {Function} done Call this when the transition has finished.
	*/
	addEndListener: import_prop_types.default.func,
	/**
	* Perform the enter transition when it first mounts if `in` is also `true`.
	* Set this to `false` to disable this behavior.
	* @default true
	*/
	appear: import_prop_types.default.bool,
	/**
	* A single child content element.
	*/
	children: elementAcceptingRef.isRequired,
	/**
	* If `true`, the transition ignores `theme.motion.reducedMotion` and keeps its normal timing.
	* @default false
	*/
	disablePrefersReducedMotion: import_prop_types.default.bool,
	/**
	* The transition timing function.
	* You may specify a single easing or a object containing enter and exit values.
	*/
	easing: import_prop_types.default.oneOfType([import_prop_types.default.shape({
		enter: import_prop_types.default.string,
		exit: import_prop_types.default.string
	}), import_prop_types.default.string]),
	/**
	* If `true`, the component will transition in.
	*/
	in: import_prop_types.default.bool,
	/**
	* @ignore
	*/
	onEnter: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onEntered: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onEntering: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExit: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExited: import_prop_types.default.func,
	/**
	* @ignore
	*/
	onExiting: import_prop_types.default.func,
	/**
	* @ignore
	*/
	style: import_prop_types.default.object,
	/**
	* The duration for the transition, in milliseconds.
	* You may specify a single timeout for all transitions, or individually with an object.
	*
	* Set to 'auto' to automatically calculate transition time based on height.
	* @default 'auto'
	*/
	timeout: import_prop_types.default.oneOfType([
		import_prop_types.default.oneOf(["auto"]),
		import_prop_types.default.number,
		import_prop_types.default.shape({
			appear: import_prop_types.default.number,
			enter: import_prop_types.default.number,
			exit: import_prop_types.default.number
		})
	])
};
if (Grow) Grow.muiSupportAuto = true;
//#endregion
//#region node_modules/@mui/utils/refType/refType.mjs
var refType = import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]);
//#endregion
//#region node_modules/@mui/utils/HTMLElementType/HTMLElementType.mjs
function HTMLElementType(props, propName, componentName, location, propFullName) {
	const propValue = props[propName];
	const safePropName = propFullName || propName;
	if (propValue == null) return null;
	if (propValue && propValue.nodeType !== 1) return /* @__PURE__ */ new Error(`Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an HTMLElement.`);
	return null;
}
//#endregion
//#region node_modules/@mui/utils/ownerDocument/ownerDocument.mjs
function ownerDocument(node) {
	return node && node.ownerDocument || document;
}
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [
	"top",
	bottom,
	right,
	left
];
var start = "start";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /*#__PURE__*/ basePlacements.reduce(function(acc, placement) {
	return acc.concat([placement + "-" + start, placement + "-end"]);
}, []);
var placements = /*#__PURE__*/ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
	return acc.concat([
		placement,
		placement + "-" + start,
		placement + "-end"
	]);
}, []);
var modifierPhases = [
	"beforeRead",
	"read",
	"afterRead",
	"beforeMain",
	"main",
	"afterMain",
	"beforeWrite",
	"write",
	"afterWrite"
];
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
	return element ? (element.nodeName || "").toLowerCase() : null;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
	if (node == null) return window;
	if (node.toString() !== "[object Window]") {
		var ownerDocument = node.ownerDocument;
		return ownerDocument ? ownerDocument.defaultView || window : window;
	}
	return node;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
	return node instanceof getWindow(node).Element || node instanceof Element;
}
function isHTMLElement$1(node) {
	return node instanceof getWindow(node).HTMLElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
	if (typeof ShadowRoot === "undefined") return false;
	return node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot;
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
	var state = _ref.state;
	Object.keys(state.elements).forEach(function(name) {
		var style = state.styles[name] || {};
		var attributes = state.attributes[name] || {};
		var element = state.elements[name];
		if (!isHTMLElement$1(element) || !getNodeName(element)) return;
		Object.assign(element.style, style);
		Object.keys(attributes).forEach(function(name) {
			var value = attributes[name];
			if (value === false) element.removeAttribute(name);
			else element.setAttribute(name, value === true ? "" : value);
		});
	});
}
function effect$2(_ref2) {
	var state = _ref2.state;
	var initialStyles = {
		popper: {
			position: state.options.strategy,
			left: "0",
			top: "0",
			margin: "0"
		},
		arrow: { position: "absolute" },
		reference: {}
	};
	Object.assign(state.elements.popper.style, initialStyles.popper);
	state.styles = initialStyles;
	if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
	return function() {
		Object.keys(state.elements).forEach(function(name) {
			var element = state.elements[name];
			var attributes = state.attributes[name] || {};
			var style = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]).reduce(function(style, property) {
				style[property] = "";
				return style;
			}, {});
			if (!isHTMLElement$1(element) || !getNodeName(element)) return;
			Object.assign(element.style, style);
			Object.keys(attributes).forEach(function(attribute) {
				element.removeAttribute(attribute);
			});
		});
	};
}
var applyStyles_default = {
	name: "applyStyles",
	enabled: true,
	phase: "write",
	fn: applyStyles,
	effect: effect$2,
	requires: ["computeStyles"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
	return placement.split("-")[0];
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round$1 = Math.round;
//#endregion
//#region node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
	var uaData = navigator.userAgentData;
	if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map(function(item) {
		return item.brand + "/" + item.version;
	}).join(" ");
	return navigator.userAgent;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
	return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	var clientRect = element.getBoundingClientRect();
	var scaleX = 1;
	var scaleY = 1;
	if (includeScale && isHTMLElement$1(element)) {
		scaleX = element.offsetWidth > 0 ? round$1(clientRect.width) / element.offsetWidth || 1 : 1;
		scaleY = element.offsetHeight > 0 ? round$1(clientRect.height) / element.offsetHeight || 1 : 1;
	}
	var visualViewport = (isElement(element) ? getWindow(element) : window).visualViewport;
	var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
	var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
	var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
	var width = clientRect.width / scaleX;
	var height = clientRect.height / scaleY;
	return {
		width,
		height,
		top: y,
		right: x + width,
		bottom: y + height,
		left: x,
		x,
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
	var clientRect = getBoundingClientRect(element);
	var width = element.offsetWidth;
	var height = element.offsetHeight;
	if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
	if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
	return {
		x: element.offsetLeft,
		y: element.offsetTop,
		width,
		height
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
	var rootNode = child.getRootNode && child.getRootNode();
	if (parent.contains(child)) return true;
	else if (rootNode && isShadowRoot(rootNode)) {
		var next = child;
		do {
			if (next && parent.isSameNode(next)) return true;
			next = next.parentNode || next.host;
		} while (next);
	}
	return false;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle(element) {
	return getWindow(element).getComputedStyle(element);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
	return [
		"table",
		"td",
		"th"
	].indexOf(getNodeName(element)) >= 0;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
	return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
	if (getNodeName(element) === "html") return element;
	return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
	if (!isHTMLElement$1(element) || getComputedStyle(element).position === "fixed") return null;
	return element.offsetParent;
}
function getContainingBlock(element) {
	var isFirefox = /firefox/i.test(getUAString());
	if (/Trident/i.test(getUAString()) && isHTMLElement$1(element)) {
		if (getComputedStyle(element).position === "fixed") return null;
	}
	var currentNode = getParentNode(element);
	if (isShadowRoot(currentNode)) currentNode = currentNode.host;
	while (isHTMLElement$1(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
		var css = getComputedStyle(currentNode);
		if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode;
		else currentNode = currentNode.parentNode;
	}
	return null;
}
function getOffsetParent(element) {
	var window = getWindow(element);
	var offsetParent = getTrueOffsetParent(element);
	while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") offsetParent = getTrueOffsetParent(offsetParent);
	if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) return window;
	return offsetParent || getContainingBlock(element) || window;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
	return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/within.js
function within(min$2, value, max$2) {
	return max(min$2, min(value, max$2));
}
function withinMaxClamp(min, value, max) {
	var v = within(min, value, max);
	return v > max ? max : v;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
	return Object.assign({}, getFreshSideObject(), paddingObject);
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
	return keys.reduce(function(hashMap, key) {
		hashMap[key] = value;
		return hashMap;
	}, {});
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject(padding, state) {
	padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, { placement: state.placement })) : padding;
	return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
	var _state$modifiersData$;
	var state = _ref.state, name = _ref.name, options = _ref.options;
	var arrowElement = state.elements.arrow;
	var popperOffsets = state.modifiersData.popperOffsets;
	var basePlacement = getBasePlacement(state.placement);
	var axis = getMainAxisFromPlacement(basePlacement);
	var len = ["left", "right"].indexOf(basePlacement) >= 0 ? "height" : "width";
	if (!arrowElement || !popperOffsets) return;
	var paddingObject = toPaddingObject(options.padding, state);
	var arrowRect = getLayoutRect(arrowElement);
	var minProp = axis === "y" ? "top" : left;
	var maxProp = axis === "y" ? bottom : right;
	var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	var arrowOffsetParent = getOffsetParent(arrowElement);
	var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	var centerToReference = endDiff / 2 - startDiff / 2;
	var min = paddingObject[minProp];
	var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	var offset = within(min, center, max);
	var axisProp = axis;
	state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function effect$1(_ref2) {
	var state = _ref2.state;
	var _options$element = _ref2.options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
	if (arrowElement == null) return;
	if (typeof arrowElement === "string") {
		arrowElement = state.elements.popper.querySelector(arrowElement);
		if (!arrowElement) return;
	}
	if (!contains(state.elements.popper, arrowElement)) return;
	state.elements.arrow = arrowElement;
}
var arrow_default = {
	name: "arrow",
	enabled: true,
	phase: "main",
	fn: arrow,
	effect: effect$1,
	requires: ["popperOffsets"],
	requiresIfExists: ["preventOverflow"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
	return placement.split("-")[1];
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
	top: "auto",
	right: "auto",
	bottom: "auto",
	left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
	var x = _ref.x, y = _ref.y;
	var dpr = win.devicePixelRatio || 1;
	return {
		x: round$1(x * dpr) / dpr || 0,
		y: round$1(y * dpr) / dpr || 0
	};
}
function mapToStyles(_ref2) {
	var _Object$assign2;
	var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
	var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
	var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
		x,
		y
	}) : {
		x,
		y
	};
	x = _ref3.x;
	y = _ref3.y;
	var hasX = offsets.hasOwnProperty("x");
	var hasY = offsets.hasOwnProperty("y");
	var sideX = left;
	var sideY = "top";
	var win = window;
	if (adaptive) {
		var offsetParent = getOffsetParent(popper);
		var heightProp = "clientHeight";
		var widthProp = "clientWidth";
		if (offsetParent === getWindow(popper)) {
			offsetParent = getDocumentElement(popper);
			if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
				heightProp = "scrollHeight";
				widthProp = "scrollWidth";
			}
		}
		offsetParent = offsetParent;
		if (placement === "top" || (placement === "left" || placement === "right") && variation === "end") {
			sideY = bottom;
			var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
			y -= offsetY - popperRect.height;
			y *= gpuAcceleration ? 1 : -1;
		}
		if (placement === "left" || (placement === "top" || placement === "bottom") && variation === "end") {
			sideX = right;
			var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
			x -= offsetX - popperRect.width;
			x *= gpuAcceleration ? 1 : -1;
		}
	}
	var commonStyles = Object.assign({ position }, adaptive && unsetSides);
	var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
		x,
		y
	}, getWindow(popper)) : {
		x,
		y
	};
	x = _ref4.x;
	y = _ref4.y;
	if (gpuAcceleration) {
		var _Object$assign;
		return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	}
	return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
	var state = _ref5.state, options = _ref5.options;
	var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
	var commonStyles = {
		placement: getBasePlacement(state.placement),
		variation: getVariation(state.placement),
		popper: state.elements.popper,
		popperRect: state.rects.popper,
		gpuAcceleration,
		isFixed: state.options.strategy === "fixed"
	};
	if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.popperOffsets,
		position: state.options.strategy,
		adaptive,
		roundOffsets
	})));
	if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.arrow,
		position: "absolute",
		adaptive: false,
		roundOffsets
	})));
	state.attributes.popper = Object.assign({}, state.attributes.popper, { "data-popper-placement": state.placement });
}
var computeStyles_default = {
	name: "computeStyles",
	enabled: true,
	phase: "beforeWrite",
	fn: computeStyles,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = { passive: true };
function effect(_ref) {
	var state = _ref.state, instance = _ref.instance, options = _ref.options;
	var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
	var window = getWindow(state.elements.popper);
	var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
	if (scroll) scrollParents.forEach(function(scrollParent) {
		scrollParent.addEventListener("scroll", instance.update, passive);
	});
	if (resize) window.addEventListener("resize", instance.update, passive);
	return function() {
		if (scroll) scrollParents.forEach(function(scrollParent) {
			scrollParent.removeEventListener("scroll", instance.update, passive);
		});
		if (resize) window.removeEventListener("resize", instance.update, passive);
	};
}
var eventListeners_default = {
	name: "eventListeners",
	enabled: true,
	phase: "write",
	fn: function fn() {},
	effect,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash$1 = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function getOppositePlacement(placement) {
	return placement.replace(/left|right|bottom|top/g, function(matched) {
		return hash$1[matched];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash = {
	start: "end",
	end: "start"
};
function getOppositeVariationPlacement(placement) {
	return placement.replace(/start|end/g, function(matched) {
		return hash[matched];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
	var win = getWindow(node);
	return {
		scrollLeft: win.pageXOffset,
		scrollTop: win.pageYOffset
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
	return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
	var win = getWindow(element);
	var html = getDocumentElement(element);
	var visualViewport = win.visualViewport;
	var width = html.clientWidth;
	var height = html.clientHeight;
	var x = 0;
	var y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		var layoutViewport = isLayoutViewport();
		if (layoutViewport || !layoutViewport && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	return {
		width,
		height,
		x: x + getWindowScrollBarX(element),
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
	var _element$ownerDocumen;
	var html = getDocumentElement(element);
	var winScroll = getWindowScroll(element);
	var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	var y = -winScroll.scrollTop;
	if (getComputedStyle(body || html).direction === "rtl") x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	return {
		width,
		height,
		x,
		y
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
	var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
	return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
	if ([
		"html",
		"body",
		"#document"
	].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
	if (isHTMLElement$1(node) && isScrollParent(node)) return node;
	return getScrollParent(getParentNode(node));
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
	var _element$ownerDocumen;
	if (list === void 0) list = [];
	var scrollParent = getScrollParent(element);
	var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	var win = getWindow(scrollParent);
	var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	var updatedList = list.concat(target);
	return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
	return Object.assign({}, rect, {
		left: rect.x,
		top: rect.y,
		right: rect.x + rect.width,
		bottom: rect.y + rect.height
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
	var rect = getBoundingClientRect(element, false, strategy === "fixed");
	rect.top = rect.top + element.clientTop;
	rect.left = rect.left + element.clientLeft;
	rect.bottom = rect.top + element.clientHeight;
	rect.right = rect.left + element.clientWidth;
	rect.width = element.clientWidth;
	rect.height = element.clientHeight;
	rect.x = rect.left;
	rect.y = rect.top;
	return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
	return clippingParent === "viewport" ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
	var clippingParents = listScrollParents(getParentNode(element));
	var clipperElement = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0 && isHTMLElement$1(element) ? getOffsetParent(element) : element;
	if (!isElement(clipperElement)) return [];
	return clippingParents.filter(function(clippingParent) {
		return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
	});
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
	var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
	var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	var firstClippingParent = clippingParents[0];
	var clippingRect = clippingParents.reduce(function(accRect, clippingParent) {
		var rect = getClientRectFromMixedType(element, clippingParent, strategy);
		accRect.top = max(rect.top, accRect.top);
		accRect.right = min(rect.right, accRect.right);
		accRect.bottom = min(rect.bottom, accRect.bottom);
		accRect.left = max(rect.left, accRect.left);
		return accRect;
	}, getClientRectFromMixedType(element, firstClippingParent, strategy));
	clippingRect.width = clippingRect.right - clippingRect.left;
	clippingRect.height = clippingRect.bottom - clippingRect.top;
	clippingRect.x = clippingRect.left;
	clippingRect.y = clippingRect.top;
	return clippingRect;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
	var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
	var basePlacement = placement ? getBasePlacement(placement) : null;
	var variation = placement ? getVariation(placement) : null;
	var commonX = reference.x + reference.width / 2 - element.width / 2;
	var commonY = reference.y + reference.height / 2 - element.height / 2;
	var offsets;
	switch (basePlacement) {
		case "top":
			offsets = {
				x: commonX,
				y: reference.y - element.height
			};
			break;
		case bottom:
			offsets = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case right:
			offsets = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case left:
			offsets = {
				x: reference.x - element.width,
				y: commonY
			};
			break;
		default: offsets = {
			x: reference.x,
			y: reference.y
		};
	}
	var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
	if (mainAxis != null) {
		var len = mainAxis === "y" ? "height" : "width";
		switch (variation) {
			case start:
				offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
				break;
			case "end":
				offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
				break;
			default:
		}
	}
	return offsets;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
	if (options === void 0) options = {};
	var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
	var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
	var altContext = elementContext === "popper" ? reference : popper;
	var popperRect = state.rects.popper;
	var element = state.elements[altBoundary ? altContext : elementContext];
	var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
	var referenceClientRect = getBoundingClientRect(state.elements.reference);
	var popperOffsets = computeOffsets({
		reference: referenceClientRect,
		element: popperRect,
		strategy: "absolute",
		placement
	});
	var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	var elementClientRect = elementContext === "popper" ? popperClientRect : referenceClientRect;
	var overflowOffsets = {
		top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
		bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
		left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
		right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	};
	var offsetData = state.modifiersData.offset;
	if (elementContext === "popper" && offsetData) {
		var offset = offsetData[placement];
		Object.keys(overflowOffsets).forEach(function(key) {
			var multiply = ["right", "bottom"].indexOf(key) >= 0 ? 1 : -1;
			var axis = ["top", "bottom"].indexOf(key) >= 0 ? "y" : "x";
			overflowOffsets[key] += offset[axis] * multiply;
		});
	}
	return overflowOffsets;
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
	if (options === void 0) options = {};
	var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	var variation = getVariation(placement);
	var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement) {
		return getVariation(placement) === variation;
	}) : basePlacements;
	var allowedPlacements = placements$1.filter(function(placement) {
		return allowedAutoPlacements.indexOf(placement) >= 0;
	});
	if (allowedPlacements.length === 0) allowedPlacements = placements$1;
	var overflows = allowedPlacements.reduce(function(acc, placement) {
		acc[placement] = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			padding
		})[getBasePlacement(placement)];
		return acc;
	}, {});
	return Object.keys(overflows).sort(function(a, b) {
		return overflows[a] - overflows[b];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
	if (getBasePlacement(placement) === "auto") return [];
	var oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeVariationPlacement(placement),
		oppositePlacement,
		getOppositeVariationPlacement(oppositePlacement)
	];
}
function flip(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	if (state.modifiersData[name]._skip) return;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
	var preferredPlacement = state.options.placement;
	var isBasePlacement = getBasePlacement(preferredPlacement) === preferredPlacement;
	var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement) {
		return acc.concat(getBasePlacement(placement) === "auto" ? computeAutoPlacement(state, {
			placement,
			boundary,
			rootBoundary,
			padding,
			flipVariations,
			allowedAutoPlacements
		}) : placement);
	}, []);
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var checksMap = /* @__PURE__ */ new Map();
	var makeFallbackChecks = true;
	var firstFittingPlacement = placements[0];
	for (var i = 0; i < placements.length; i++) {
		var placement = placements[i];
		var _basePlacement = getBasePlacement(placement);
		var isStartVariation = getVariation(placement) === start;
		var isVertical = ["top", bottom].indexOf(_basePlacement) >= 0;
		var len = isVertical ? "width" : "height";
		var overflow = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			altBoundary,
			padding
		});
		var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : "top";
		if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
		var altVariationSide = getOppositePlacement(mainVariationSide);
		var checks = [];
		if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
		if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
		if (checks.every(function(check) {
			return check;
		})) {
			firstFittingPlacement = placement;
			makeFallbackChecks = false;
			break;
		}
		checksMap.set(placement, checks);
	}
	if (makeFallbackChecks) {
		var numberOfChecks = flipVariations ? 3 : 1;
		var _loop = function _loop(_i) {
			var fittingPlacement = placements.find(function(placement) {
				var checks = checksMap.get(placement);
				if (checks) return checks.slice(0, _i).every(function(check) {
					return check;
				});
			});
			if (fittingPlacement) {
				firstFittingPlacement = fittingPlacement;
				return "break";
			}
		};
		for (var _i = numberOfChecks; _i > 0; _i--) if (_loop(_i) === "break") break;
	}
	if (state.placement !== firstFittingPlacement) {
		state.modifiersData[name]._skip = true;
		state.placement = firstFittingPlacement;
		state.reset = true;
	}
}
var flip_default = {
	name: "flip",
	enabled: true,
	phase: "main",
	fn: flip,
	requiresIfExists: ["offset"],
	data: { _skip: false }
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
	if (preventedOffsets === void 0) preventedOffsets = {
		x: 0,
		y: 0
	};
	return {
		top: overflow.top - rect.height - preventedOffsets.y,
		right: overflow.right - rect.width + preventedOffsets.x,
		bottom: overflow.bottom - rect.height + preventedOffsets.y,
		left: overflow.left - rect.width - preventedOffsets.x
	};
}
function isAnySideFullyClipped(overflow) {
	return [
		"top",
		right,
		bottom,
		left
	].some(function(side) {
		return overflow[side] >= 0;
	});
}
function hide(_ref) {
	var state = _ref.state, name = _ref.name;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var preventedOffsets = state.modifiersData.preventOverflow;
	var referenceOverflow = detectOverflow(state, { elementContext: "reference" });
	var popperAltOverflow = detectOverflow(state, { altBoundary: true });
	var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	state.modifiersData[name] = {
		referenceClippingOffsets,
		popperEscapeOffsets,
		isReferenceHidden,
		hasPopperEscaped
	};
	state.attributes.popper = Object.assign({}, state.attributes.popper, {
		"data-popper-reference-hidden": isReferenceHidden,
		"data-popper-escaped": hasPopperEscaped
	});
}
var hide_default = {
	name: "hide",
	enabled: true,
	phase: "main",
	requiresIfExists: ["preventOverflow"],
	fn: hide
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset) {
	var basePlacement = getBasePlacement(placement);
	var invertDistance = ["left", "top"].indexOf(basePlacement) >= 0 ? -1 : 1;
	var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, { placement })) : offset, skidding = _ref[0], distance = _ref[1];
	skidding = skidding || 0;
	distance = (distance || 0) * invertDistance;
	return ["left", "right"].indexOf(basePlacement) >= 0 ? {
		x: distance,
		y: skidding
	} : {
		x: skidding,
		y: distance
	};
}
function offset(_ref2) {
	var state = _ref2.state, options = _ref2.options, name = _ref2.name;
	var _options$offset = options.offset, offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	var data = placements.reduce(function(acc, placement) {
		acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
		return acc;
	}, {});
	var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
	if (state.modifiersData.popperOffsets != null) {
		state.modifiersData.popperOffsets.x += x;
		state.modifiersData.popperOffsets.y += y;
	}
	state.modifiersData[name] = data;
}
var offset_default = {
	name: "offset",
	enabled: true,
	phase: "main",
	requires: ["popperOffsets"],
	fn: offset
};
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
	var state = _ref.state, name = _ref.name;
	state.modifiersData[name] = computeOffsets({
		reference: state.rects.reference,
		element: state.rects.popper,
		strategy: "absolute",
		placement: state.placement
	});
}
var popperOffsets_default = {
	name: "popperOffsets",
	enabled: true,
	phase: "read",
	fn: popperOffsets,
	data: {}
};
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
	return axis === "x" ? "y" : "x";
}
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	var overflow = detectOverflow(state, {
		boundary,
		rootBoundary,
		padding,
		altBoundary
	});
	var basePlacement = getBasePlacement(state.placement);
	var variation = getVariation(state.placement);
	var isBasePlacement = !variation;
	var mainAxis = getMainAxisFromPlacement(basePlacement);
	var altAxis = getAltAxis(mainAxis);
	var popperOffsets = state.modifiersData.popperOffsets;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, { placement: state.placement })) : tetherOffset;
	var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
		mainAxis: tetherOffsetValue,
		altAxis: tetherOffsetValue
	} : Object.assign({
		mainAxis: 0,
		altAxis: 0
	}, tetherOffsetValue);
	var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	var data = {
		x: 0,
		y: 0
	};
	if (!popperOffsets) return;
	if (checkMainAxis) {
		var _offsetModifierState$;
		var mainSide = mainAxis === "y" ? "top" : left;
		var altSide = mainAxis === "y" ? bottom : right;
		var len = mainAxis === "y" ? "height" : "width";
		var offset = popperOffsets[mainAxis];
		var min$1 = offset + overflow[mainSide];
		var max$1 = offset - overflow[altSide];
		var additive = tether ? -popperRect[len] / 2 : 0;
		var minLen = variation === "start" ? referenceRect[len] : popperRect[len];
		var maxLen = variation === "start" ? -popperRect[len] : -referenceRect[len];
		var arrowElement = state.elements.arrow;
		var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
			width: 0,
			height: 0
		};
		var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
		var arrowPaddingMin = arrowPaddingObject[mainSide];
		var arrowPaddingMax = arrowPaddingObject[altSide];
		var arrowLen = within(0, referenceRect[len], arrowRect[len]);
		var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
		var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
		var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
		var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
		var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
		var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
		var tetherMax = offset + maxOffset - offsetModifierValue;
		var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
		popperOffsets[mainAxis] = preventedOffset;
		data[mainAxis] = preventedOffset - offset;
	}
	if (checkAltAxis) {
		var _offsetModifierState$2;
		var _mainSide = mainAxis === "x" ? "top" : left;
		var _altSide = mainAxis === "x" ? bottom : right;
		var _offset = popperOffsets[altAxis];
		var _len = altAxis === "y" ? "height" : "width";
		var _min = _offset + overflow[_mainSide];
		var _max = _offset - overflow[_altSide];
		var isOriginSide = ["top", left].indexOf(basePlacement) !== -1;
		var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
		var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
		var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
		var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
		popperOffsets[altAxis] = _preventedOffset;
		data[altAxis] = _preventedOffset - _offset;
	}
	state.modifiersData[name] = data;
}
var preventOverflow_default = {
	name: "preventOverflow",
	enabled: true,
	phase: "main",
	fn: preventOverflow,
	requiresIfExists: ["offset"]
};
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
	return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
	if (node === getWindow(node) || !isHTMLElement$1(node)) return getWindowScroll(node);
	else return getHTMLElementScroll(node);
}
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
	var rect = element.getBoundingClientRect();
	var scaleX = round$1(rect.width) / element.offsetWidth || 1;
	var scaleY = round$1(rect.height) / element.offsetHeight || 1;
	return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	if (isFixed === void 0) isFixed = false;
	var isOffsetParentAnElement = isHTMLElement$1(offsetParent);
	var offsetParentIsScaled = isHTMLElement$1(offsetParent) && isElementScaled(offsetParent);
	var documentElement = getDocumentElement(offsetParent);
	var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
	var scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	var offsets = {
		x: 0,
		y: 0
	};
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isHTMLElement$1(offsetParent)) {
			offsets = getBoundingClientRect(offsetParent, true);
			offsets.x += offsetParent.clientLeft;
			offsets.y += offsetParent.clientTop;
		} else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
	}
	return {
		x: rect.left + scroll.scrollLeft - offsets.x,
		y: rect.top + scroll.scrollTop - offsets.y,
		width: rect.width,
		height: rect.height
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
	var map = /* @__PURE__ */ new Map();
	var visited = /* @__PURE__ */ new Set();
	var result = [];
	modifiers.forEach(function(modifier) {
		map.set(modifier.name, modifier);
	});
	function sort(modifier) {
		visited.add(modifier.name);
		[].concat(modifier.requires || [], modifier.requiresIfExists || []).forEach(function(dep) {
			if (!visited.has(dep)) {
				var depModifier = map.get(dep);
				if (depModifier) sort(depModifier);
			}
		});
		result.push(modifier);
	}
	modifiers.forEach(function(modifier) {
		if (!visited.has(modifier.name)) sort(modifier);
	});
	return result;
}
function orderModifiers(modifiers) {
	var orderedModifiers = order(modifiers);
	return modifierPhases.reduce(function(acc, phase) {
		return acc.concat(orderedModifiers.filter(function(modifier) {
			return modifier.phase === phase;
		}));
	}, []);
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn) {
	var pending;
	return function() {
		if (!pending) pending = new Promise(function(resolve) {
			Promise.resolve().then(function() {
				pending = void 0;
				resolve(fn());
			});
		});
		return pending;
	};
}
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
	var merged = modifiers.reduce(function(merged, current) {
		var existing = merged[current.name];
		merged[current.name] = existing ? Object.assign({}, existing, current, {
			options: Object.assign({}, existing.options, current.options),
			data: Object.assign({}, existing.data, current.data)
		}) : current;
		return merged;
	}, {});
	return Object.keys(merged).map(function(key) {
		return merged[key];
	});
}
//#endregion
//#region node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
	placement: "bottom",
	modifiers: [],
	strategy: "absolute"
};
function areValidElements() {
	for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
	return !args.some(function(element) {
		return !(element && typeof element.getBoundingClientRect === "function");
	});
}
function popperGenerator(generatorOptions) {
	if (generatorOptions === void 0) generatorOptions = {};
	var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	return function createPopper(reference, popper, options) {
		if (options === void 0) options = defaultOptions;
		var state = {
			placement: "bottom",
			orderedModifiers: [],
			options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
			modifiersData: {},
			elements: {
				reference,
				popper
			},
			attributes: {},
			styles: {}
		};
		var effectCleanupFns = [];
		var isDestroyed = false;
		var instance = {
			state,
			setOptions: function setOptions(setOptionsAction) {
				var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
				cleanupModifierEffects();
				state.options = Object.assign({}, defaultOptions, state.options, options);
				state.scrollParents = {
					reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
					popper: listScrollParents(popper)
				};
				var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
				state.orderedModifiers = orderedModifiers.filter(function(m) {
					return m.enabled;
				});
				runModifierEffects();
				return instance.update();
			},
			forceUpdate: function forceUpdate() {
				if (isDestroyed) return;
				var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
				if (!areValidElements(reference, popper)) return;
				state.rects = {
					reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === "fixed"),
					popper: getLayoutRect(popper)
				};
				state.reset = false;
				state.placement = state.options.placement;
				state.orderedModifiers.forEach(function(modifier) {
					return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
				});
				for (var index = 0; index < state.orderedModifiers.length; index++) {
					if (state.reset === true) {
						state.reset = false;
						index = -1;
						continue;
					}
					var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
					if (typeof fn === "function") state = fn({
						state,
						options: _options,
						name,
						instance
					}) || state;
				}
			},
			update: debounce(function() {
				return new Promise(function(resolve) {
					instance.forceUpdate();
					resolve(state);
				});
			}),
			destroy: function destroy() {
				cleanupModifierEffects();
				isDestroyed = true;
			}
		};
		if (!areValidElements(reference, popper)) return instance;
		instance.setOptions(options).then(function(state) {
			if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
		});
		function runModifierEffects() {
			state.orderedModifiers.forEach(function(_ref) {
				var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
				if (typeof effect === "function") {
					var cleanupFn = effect({
						state,
						name,
						instance,
						options
					});
					effectCleanupFns.push(cleanupFn || function noopFn() {});
				}
			});
		}
		function cleanupModifierEffects() {
			effectCleanupFns.forEach(function(fn) {
				return fn();
			});
			effectCleanupFns = [];
		}
		return instance;
	};
}
var createPopper = /*#__PURE__*/ popperGenerator({ defaultModifiers: [
	eventListeners_default,
	popperOffsets_default,
	computeStyles_default,
	applyStyles_default,
	offset_default,
	flip_default,
	preventOverflow_default,
	arrow_default,
	hide_default
] });
//#endregion
//#region node_modules/@mui/utils/isHostComponent/isHostComponent.mjs
/**
* Determines if a given element is a DOM element name (i.e. not a React component).
*/
function isHostComponent(element) {
	return typeof element === "string";
}
//#endregion
//#region node_modules/@mui/utils/appendOwnerState/appendOwnerState.mjs
/**
* Type of the ownerState based on the type of an element it applies to.
* This resolves to the provided OwnerState for React components and `undefined` for host components.
* Falls back to `OwnerState | undefined` when the exact type can't be determined in development time.
*/
/**
* Appends the ownerState object to the props, merging with the existing one if necessary.
*
* @param elementType Type of the element that owns the `existingProps`. If the element is a DOM node or undefined, `ownerState` is not applied.
* @param otherProps Props of the element.
* @param ownerState
*/
function appendOwnerState(elementType, otherProps, ownerState) {
	if (elementType === void 0 || isHostComponent(elementType)) return otherProps;
	return {
		...otherProps,
		ownerState: {
			...otherProps.ownerState,
			...ownerState
		}
	};
}
//#endregion
//#region node_modules/@mui/utils/isEventHandler/isEventHandler.mjs
function isEventHandler(key, value) {
	const thirdCharCode = key.charCodeAt(2);
	return key[0] === "o" && key[1] === "n" && thirdCharCode >= 65 && thirdCharCode <= 90 && typeof value === "function";
}
//#endregion
//#region node_modules/@mui/utils/extractEventHandlers/extractEventHandlers.mjs
/**
* Extracts event handlers from a given object.
* A prop is considered an event handler if it is a function and its name starts with `on`.
*
* @param object An object to extract event handlers from.
*/
function extractEventHandlers(object) {
	if (object === void 0) return {};
	const result = {};
	for (const prop of Object.keys(object)) if (isEventHandler(prop, object[prop])) result[prop] = object[prop];
	return result;
}
//#endregion
//#region node_modules/@mui/utils/omitEventHandlers/omitEventHandlers.mjs
/**
* Removes event handlers from the given object.
* A field is considered an event handler if it is a function with a name beginning with `on`.
*
* @param object Object to remove event handlers from.
* @returns Object with event handlers removed.
*/
function omitEventHandlers(object) {
	if (object === void 0) return {};
	const result = {};
	Object.keys(object).filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === "function")).forEach((prop) => {
		result[prop] = object[prop];
	});
	return result;
}
//#endregion
//#region node_modules/@mui/utils/mergeSlotProps/mergeSlotProps.mjs
/**
* Merges the slot component internal props (usually coming from a hook)
* with the externally provided ones.
*
* The merge order is (the latter overrides the former):
* 1. The internal props (specified as a getter function to work with get*Props hook result)
* 2. Additional props (specified internally on a Base UI component)
* 3. External props specified on the owner component. These should only be used on a root slot.
* 4. External props specified in the `slotProps.*` prop.
* 5. The `className` prop - combined from all the above.
* @param parameters
* @returns
*/
function mergeSlotProps(parameters) {
	const { getSlotProps, additionalProps, externalSlotProps, externalForwardedProps, className } = parameters;
	if (!getSlotProps) {
		const joinedClasses = clsx(additionalProps?.className, className, externalForwardedProps?.className, externalSlotProps?.className);
		const mergedStyle = {
			...additionalProps?.style,
			...externalForwardedProps?.style,
			...externalSlotProps?.style
		};
		const props = {
			...additionalProps,
			...externalForwardedProps,
			...externalSlotProps
		};
		if (joinedClasses.length > 0) props.className = joinedClasses;
		if (Object.keys(mergedStyle).length > 0) props.style = mergedStyle;
		return {
			props,
			internalRef: void 0
		};
	}
	const eventHandlers = extractEventHandlers({
		...externalForwardedProps,
		...externalSlotProps
	});
	const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
	const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
	const internalSlotProps = getSlotProps(eventHandlers);
	const joinedClasses = clsx(internalSlotProps?.className, additionalProps?.className, className, externalForwardedProps?.className, externalSlotProps?.className);
	const mergedStyle = {
		...internalSlotProps?.style,
		...additionalProps?.style,
		...externalForwardedProps?.style,
		...externalSlotProps?.style
	};
	const props = {
		...internalSlotProps,
		...additionalProps,
		...otherPropsWithoutEventHandlers,
		...componentsPropsWithoutEventHandlers
	};
	if (joinedClasses.length > 0) props.className = joinedClasses;
	if (Object.keys(mergedStyle).length > 0) props.style = mergedStyle;
	return {
		props,
		internalRef: internalSlotProps.ref
	};
}
//#endregion
//#region node_modules/@mui/utils/resolveComponentProps/resolveComponentProps.mjs
/**
* If `componentProps` is a function, calls it with the provided `ownerState`.
* Otherwise, just returns `componentProps`.
*/
function resolveComponentProps(componentProps, ownerState, slotState) {
	if (typeof componentProps === "function") return componentProps(ownerState, slotState);
	return componentProps;
}
//#endregion
//#region node_modules/@mui/utils/useSlotProps/useSlotProps.mjs
/**
* @ignore - do not document.
* Builds the props to be passed into the slot of an unstyled component.
* It merges the internal props of the component with the ones supplied by the user, allowing to customize the behavior.
* If the slot component is not a host component, it also merges in the `ownerState`.
*
* @param parameters.getSlotProps - A function that returns the props to be passed to the slot component.
*/
function useSlotProps(parameters) {
	const { elementType, externalSlotProps, ownerState, skipResolvingSlotProps = false, ...other } = parameters;
	const resolvedComponentsProps = skipResolvingSlotProps ? {} : resolveComponentProps(externalSlotProps, ownerState);
	const { props: mergedProps, internalRef } = mergeSlotProps({
		...other,
		externalSlotProps: resolvedComponentsProps
	});
	const ref = useForkRef(internalRef, resolvedComponentsProps?.ref, parameters.additionalProps?.ref);
	return appendOwnerState(elementType, {
		...mergedProps,
		ref
	}, ownerState);
}
//#endregion
//#region node_modules/@mui/material/utils/isLayoutSupported.mjs
function isLayoutSupported() {
	return !(/jsdom|HappyDOM/.test(window.navigator.userAgent) || false);
}
//#endregion
//#region node_modules/@mui/utils/setRef/setRef.mjs
/**
* TODO v5: consider making it private
*
* passes {value} to {ref}
*
* WARNING: Be sure to only call this inside a callback that is passed as a ref.
* Otherwise, make sure to cleanup the previous {ref} if it changes. See
* https://github.com/mui/material-ui/issues/13539
*
* Useful if you want to expose the ref of an inner component to the public API
* while still using it inside the component.
* @param ref A ref callback or ref object. If anything falsy, this is a no-op.
*/
function setRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
}
//#endregion
//#region node_modules/@mui/material/Portal/Portal.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function getContainer(container) {
	return typeof container === "function" ? container() : container;
}
/**
* Portals provide a first-class way to render children into a DOM node
* that exists outside the DOM hierarchy of the parent component.
*
* Demos:
*
* - [Portal](https://mui.com/material-ui/react-portal/)
*
* API:
*
* - [Portal API](https://mui.com/material-ui/api/portal/)
*/
var Portal = /*#__PURE__*/ import_react.forwardRef(function Portal(props, forwardedRef) {
	const { children, container, disablePortal = false } = props;
	const [mountNode, setMountNode] = import_react.useState(null);
	const handleRef = useForkRef(/*#__PURE__*/ import_react.isValidElement(children) ? getReactElementRef(children) : null, forwardedRef);
	useEnhancedEffect(() => {
		if (!disablePortal) setMountNode(getContainer(container) || document.body);
	}, [container, disablePortal]);
	useEnhancedEffect(() => {
		if (mountNode && !disablePortal) {
			setRef(forwardedRef, mountNode);
			return () => {
				setRef(forwardedRef, null);
			};
		}
	}, [
		forwardedRef,
		mountNode,
		disablePortal
	]);
	if (disablePortal) {
		if (/*#__PURE__*/ import_react.isValidElement(children)) {
			const newProps = { ref: handleRef };
			return /*#__PURE__*/ import_react.cloneElement(children, newProps);
		}
		return children;
	}
	return mountNode ? /*#__PURE__*/ import_react_dom.createPortal(children, mountNode) : mountNode;
});
Portal.propTypes = {
	/**
	* The children to render into the `container`.
	*/
	children: import_prop_types.default.node,
	/**
	* An HTML element or function that returns one.
	* The `container` will have the portal children appended to it.
	*
	* You can also provide a callback, which is called in a React layout effect.
	* This lets you set the container from a ref, and also makes server-side rendering possible.
	*
	* By default, it uses the body of the top-level document object,
	* so it's simply `document.body` most of the time.
	*/
	container: import_prop_types.default.oneOfType([HTMLElementType, import_prop_types.default.func]),
	/**
	* The `children` will be under the DOM hierarchy of the parent component.
	* @default false
	*/
	disablePortal: import_prop_types.default.bool
};
Portal["propTypes"] = exactProp(Portal.propTypes);
//#endregion
//#region node_modules/@mui/material/Popper/popperClasses.mjs
function getPopperUtilityClass(slot) {
	return generateUtilityClass("MuiPopper", slot);
}
generateUtilityClasses("MuiPopper", ["root"]);
//#endregion
//#region node_modules/@mui/material/Popper/BasePopper.mjs
function flipPlacement(placement, direction) {
	if (direction === "ltr") return placement;
	switch (placement) {
		case "bottom-end": return "bottom-start";
		case "bottom-start": return "bottom-end";
		case "top-end": return "top-start";
		case "top-start": return "top-end";
		default: return placement;
	}
}
function resolveAnchorEl(anchorEl) {
	return typeof anchorEl === "function" ? anchorEl() : anchorEl;
}
function isHTMLElement(element) {
	return element.nodeType !== void 0;
}
function isVirtualElement(element) {
	return !isHTMLElement(element);
}
var useUtilityClasses$1 = (ownerState) => {
	const { classes } = ownerState;
	return composeClasses({ root: ["root"] }, getPopperUtilityClass, classes);
};
var defaultPopperOptions = {};
var PopperTooltip = /*#__PURE__*/ import_react.forwardRef(function PopperTooltip(props, forwardedRef) {
	const { anchorEl, children, direction, disablePortal, modifiers, open, placement: initialPlacement, popperOptions, popperRef: popperRefProp, slotProps = {}, slots = {}, TransitionProps, ownerState: ownerStateProp, ...other } = props;
	const tooltipRef = import_react.useRef(null);
	const ownRef = useForkRef(tooltipRef, forwardedRef);
	const popperRef = import_react.useRef(null);
	const handlePopperRef = useForkRef(popperRef, popperRefProp);
	const handlePopperRefRef = import_react.useRef(handlePopperRef);
	useEnhancedEffect(() => {
		handlePopperRefRef.current = handlePopperRef;
	}, [handlePopperRef]);
	import_react.useImperativeHandle(popperRefProp, () => popperRef.current, []);
	const rtlPlacement = flipPlacement(initialPlacement, direction);
	/**
	* placement initialized from prop but can change during lifetime if modifiers.flip.
	* modifiers.flip is essentially a flip for controlled/uncontrolled behavior
	*/
	const [placement, setPlacement] = import_react.useState(rtlPlacement);
	const [resolvedAnchorElement, setResolvedAnchorElement] = import_react.useState(resolveAnchorEl(anchorEl));
	import_react.useEffect(() => {
		if (popperRef.current) popperRef.current.forceUpdate();
	});
	import_react.useEffect(() => {
		if (anchorEl) setResolvedAnchorElement(resolveAnchorEl(anchorEl));
	}, [anchorEl]);
	useEnhancedEffect(() => {
		if (!resolvedAnchorElement || !open) return;
		const handlePopperUpdate = (data) => {
			setPlacement(data.placement);
		};
		if (resolvedAnchorElement && isHTMLElement(resolvedAnchorElement) && resolvedAnchorElement.nodeType === 1) {
			const box = resolvedAnchorElement.getBoundingClientRect();
			if (isLayoutSupported() && box.top === 0 && box.left === 0 && box.right === 0 && box.bottom === 0) console.warn([
				"MUI: The `anchorEl` prop provided to the component is invalid.",
				"The anchor element should be part of the document layout.",
				"Make sure the element is present in the document or that it's not display none."
			].join("\n"));
		}
		let popperModifiers = [
			{
				name: "preventOverflow",
				options: { altBoundary: disablePortal }
			},
			{
				name: "flip",
				options: { altBoundary: disablePortal }
			},
			{
				name: "onUpdate",
				enabled: true,
				phase: "afterWrite",
				fn: ({ state }) => {
					handlePopperUpdate(state);
				}
			}
		];
		if (modifiers != null) popperModifiers = popperModifiers.concat(modifiers);
		if (popperOptions && popperOptions.modifiers != null) popperModifiers = popperModifiers.concat(popperOptions.modifiers);
		const popper = createPopper(resolvedAnchorElement, tooltipRef.current, {
			placement: rtlPlacement,
			...popperOptions,
			modifiers: popperModifiers
		});
		handlePopperRefRef.current(popper);
		const popperElement = tooltipRef.current;
		return () => {
			if (popperElement) {
				const { style } = popperElement;
				const position = style.position;
				const top = style.top;
				const left = style.left;
				const transform = style.transform;
				popper.destroy();
				style.position = position;
				style.top = top;
				style.left = left;
				style.transform = transform;
			} else popper.destroy();
			handlePopperRefRef.current(null);
		};
	}, [
		resolvedAnchorElement,
		disablePortal,
		modifiers,
		open,
		popperOptions,
		rtlPlacement
	]);
	const childProps = { placement };
	if (TransitionProps !== null) childProps.TransitionProps = TransitionProps;
	const classes = useUtilityClasses$1(props);
	const Root = slots.root ?? "div";
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Root, {
		...useSlotProps({
			elementType: Root,
			externalSlotProps: slotProps.root,
			externalForwardedProps: other,
			additionalProps: {
				role: "tooltip",
				ref: ownRef
			},
			ownerState: props,
			className: classes.root
		}),
		children: typeof children === "function" ? children(childProps) : children
	});
});
/**
* @ignore - internal component.
*/
var Popper$1 = /*#__PURE__*/ import_react.forwardRef(function Popper(props, forwardedRef) {
	const { anchorEl, children, container: containerProp, direction = "ltr", disablePortal = false, keepMounted = false, modifiers, open, placement = "bottom", popperOptions = defaultPopperOptions, popperRef, style, transition = false, slotProps = {}, slots = {}, ...other } = props;
	const [exited, setExited] = import_react.useState(true);
	const handleEnter = () => {
		setExited(false);
	};
	const handleExited = () => {
		setExited(true);
	};
	if (!keepMounted && !open && (!transition || exited)) return null;
	let container;
	if (containerProp) container = containerProp;
	else if (anchorEl) {
		const resolvedAnchorEl = resolveAnchorEl(anchorEl);
		container = resolvedAnchorEl && isHTMLElement(resolvedAnchorEl) ? ownerDocument(resolvedAnchorEl).body : ownerDocument(null).body;
	}
	const display = !open && keepMounted && (!transition || exited) ? "none" : void 0;
	const transitionProps = transition ? {
		in: open,
		onEnter: handleEnter,
		onExited: handleExited
	} : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Portal, {
		disablePortal,
		container,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(PopperTooltip, {
			anchorEl,
			direction,
			disablePortal,
			modifiers,
			ref: forwardedRef,
			open: transition ? !exited : open,
			placement,
			popperOptions,
			popperRef,
			slotProps,
			slots,
			...other,
			style: {
				position: "fixed",
				top: 0,
				left: 0,
				display,
				...style
			},
			TransitionProps: transitionProps,
			children
		})
	});
});
Popper$1.propTypes = {
	/**
	* An HTML element, [virtualElement](https://popper.js.org/docs/v2/virtual-elements/),
	* or a function that returns either.
	* It's used to set the position of the popper.
	* The return value will passed as the reference object of the Popper instance.
	*/
	anchorEl: chainPropTypes(import_prop_types.default.oneOfType([
		HTMLElementType,
		import_prop_types.default.object,
		import_prop_types.default.func
	]), (props) => {
		if (props.open) {
			const resolvedAnchorEl = resolveAnchorEl(props.anchorEl);
			if (resolvedAnchorEl && isHTMLElement(resolvedAnchorEl) && resolvedAnchorEl.nodeType === 1) {
				const box = resolvedAnchorEl.getBoundingClientRect();
				if (isLayoutSupported() && box.top === 0 && box.left === 0 && box.right === 0 && box.bottom === 0) return new Error([
					"MUI: The `anchorEl` prop provided to the component is invalid.",
					"The anchor element should be part of the document layout.",
					"Make sure the element is present in the document or that it's not display none."
				].join("\n"));
			} else if (!resolvedAnchorEl || typeof resolvedAnchorEl.getBoundingClientRect !== "function" || isVirtualElement(resolvedAnchorEl) && resolvedAnchorEl.contextElement != null && resolvedAnchorEl.contextElement.nodeType !== 1) return new Error([
				"MUI: The `anchorEl` prop provided to the component is invalid.",
				"It should be an HTML element instance or a virtualElement ",
				"(https://popper.js.org/docs/v2/virtual-elements/)."
			].join("\n"));
		}
		return null;
	}),
	/**
	* Popper render function or node.
	*/
	children: import_prop_types.default.oneOfType([import_prop_types.default.node, import_prop_types.default.func]),
	/**
	* An HTML element or function that returns one.
	* The `container` will have the portal children appended to it.
	*
	* You can also provide a callback, which is called in a React layout effect.
	* This lets you set the container from a ref, and also makes server-side rendering possible.
	*
	* By default, it uses the body of the top-level document object,
	* so it's simply `document.body` most of the time.
	*/
	container: import_prop_types.default.oneOfType([HTMLElementType, import_prop_types.default.func]),
	/**
	* Direction of the text.
	* @default 'ltr'
	*/
	direction: import_prop_types.default.oneOf(["ltr", "rtl"]),
	/**
	* The `children` will be under the DOM hierarchy of the parent component.
	* @default false
	*/
	disablePortal: import_prop_types.default.bool,
	/**
	* Always keep the children in the DOM.
	* This prop can be useful in SEO situation or
	* when you want to maximize the responsiveness of the Popper.
	* @default false
	*/
	keepMounted: import_prop_types.default.bool,
	/**
	* Popper.js is based on a "plugin-like" architecture,
	* most of its features are fully encapsulated "modifiers".
	*
	* A modifier is a function that is called each time Popper.js needs to
	* compute the position of the popper.
	* For this reason, modifiers should be very performant to avoid bottlenecks.
	* To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
	*/
	modifiers: import_prop_types.default.arrayOf(import_prop_types.default.shape({
		data: import_prop_types.default.object,
		effect: import_prop_types.default.func,
		enabled: import_prop_types.default.bool,
		fn: import_prop_types.default.func,
		name: import_prop_types.default.any,
		options: import_prop_types.default.object,
		phase: import_prop_types.default.oneOf([
			"afterMain",
			"afterRead",
			"afterWrite",
			"beforeMain",
			"beforeRead",
			"beforeWrite",
			"main",
			"read",
			"write"
		]),
		requires: import_prop_types.default.arrayOf(import_prop_types.default.string),
		requiresIfExists: import_prop_types.default.arrayOf(import_prop_types.default.string)
	})),
	/**
	* If `true`, the component is shown.
	*/
	open: import_prop_types.default.bool.isRequired,
	/**
	* Popper placement.
	* @default 'bottom'
	*/
	placement: import_prop_types.default.oneOf([
		"auto-end",
		"auto-start",
		"auto",
		"bottom-end",
		"bottom-start",
		"bottom",
		"left-end",
		"left-start",
		"left",
		"right-end",
		"right-start",
		"right",
		"top-end",
		"top-start",
		"top"
	]),
	/**
	* Options provided to the [`Popper.js`](https://popper.js.org/docs/v2/constructors/#options) instance.
	* @default {}
	*/
	popperOptions: import_prop_types.default.shape({
		modifiers: import_prop_types.default.array,
		onFirstUpdate: import_prop_types.default.func,
		placement: import_prop_types.default.oneOf([
			"auto-end",
			"auto-start",
			"auto",
			"bottom-end",
			"bottom-start",
			"bottom",
			"left-end",
			"left-start",
			"left",
			"right-end",
			"right-start",
			"right",
			"top-end",
			"top-start",
			"top"
		]),
		strategy: import_prop_types.default.oneOf(["absolute", "fixed"])
	}),
	/**
	* A ref that points to the used popper instance.
	*/
	popperRef: refType,
	/**
	* The props used for each slot inside the Popper.
	* @default {}
	*/
	slotProps: import_prop_types.default.shape({ root: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]) }),
	/**
	* The components used for each slot inside the Popper.
	* Either a string to use a HTML element or a component.
	* @default {}
	*/
	slots: import_prop_types.default.shape({ root: import_prop_types.default.elementType }),
	/**
	* Help supporting a react-transition-group/Transition component.
	* @default false
	*/
	transition: import_prop_types.default.bool
};
//#endregion
//#region node_modules/@mui/material/Popper/Popper.mjs
var PopperRoot = styled(Popper$1, {
	name: "MuiPopper",
	slot: "Root"
})({});
/**
*
* Demos:
*
* - [Autocomplete](https://mui.com/material-ui/react-autocomplete/)
* - [Menu](https://mui.com/material-ui/react-menu/)
* - [Popper](https://mui.com/material-ui/react-popper/)
*
* API:
*
* - [Popper API](https://mui.com/material-ui/api/popper/)
*/
var Popper = /*#__PURE__*/ import_react.forwardRef(function Popper(inProps, ref) {
	const isRtl = useRtl();
	const { anchorEl, component, container, disablePortal, keepMounted, modifiers, open, placement, popperOptions, popperRef, transition, slots, slotProps, ...other } = useDefaultProps({
		props: inProps,
		name: "MuiPopper"
	});
	const otherProps = {
		anchorEl,
		container,
		disablePortal,
		keepMounted,
		modifiers,
		open,
		placement,
		popperOptions,
		popperRef,
		transition,
		...other
	};
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(PopperRoot, {
		as: component,
		direction: isRtl ? "rtl" : "ltr",
		slots,
		slotProps,
		...otherProps,
		ref
	});
});
Popper.propTypes = {
	/**
	* An HTML element, [virtualElement](https://popper.js.org/docs/v2/virtual-elements/),
	* or a function that returns either.
	* It's used to set the position of the popper.
	* The return value will passed as the reference object of the Popper instance.
	*/
	anchorEl: import_prop_types.default.oneOfType([
		HTMLElementType,
		import_prop_types.default.object,
		import_prop_types.default.func
	]),
	/**
	* Popper render function or node.
	*/
	children: import_prop_types.default.oneOfType([import_prop_types.default.node, import_prop_types.default.func]),
	/**
	* The component used for the root node.
	* Either a string to use a HTML element or a component.
	*/
	component: import_prop_types.default.elementType,
	/**
	* An HTML element or function that returns one.
	* The `container` will have the portal children appended to it.
	*
	* You can also provide a callback, which is called in a React layout effect.
	* This lets you set the container from a ref, and also makes server-side rendering possible.
	*
	* By default, it uses the body of the top-level document object,
	* so it's simply `document.body` most of the time.
	*/
	container: import_prop_types.default.oneOfType([HTMLElementType, import_prop_types.default.func]),
	/**
	* The `children` will be under the DOM hierarchy of the parent component.
	* @default false
	*/
	disablePortal: import_prop_types.default.bool,
	/**
	* Always keep the children in the DOM.
	* This prop can be useful in SEO situation or
	* when you want to maximize the responsiveness of the Popper.
	* @default false
	*/
	keepMounted: import_prop_types.default.bool,
	/**
	* Popper.js is based on a "plugin-like" architecture,
	* most of its features are fully encapsulated "modifiers".
	*
	* A modifier is a function that is called each time Popper.js needs to
	* compute the position of the popper.
	* For this reason, modifiers should be very performant to avoid bottlenecks.
	* To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
	*/
	modifiers: import_prop_types.default.arrayOf(import_prop_types.default.shape({
		data: import_prop_types.default.object,
		effect: import_prop_types.default.func,
		enabled: import_prop_types.default.bool,
		fn: import_prop_types.default.func,
		name: import_prop_types.default.any,
		options: import_prop_types.default.object,
		phase: import_prop_types.default.oneOf([
			"afterMain",
			"afterRead",
			"afterWrite",
			"beforeMain",
			"beforeRead",
			"beforeWrite",
			"main",
			"read",
			"write"
		]),
		requires: import_prop_types.default.arrayOf(import_prop_types.default.string),
		requiresIfExists: import_prop_types.default.arrayOf(import_prop_types.default.string)
	})),
	/**
	* If `true`, the component is shown.
	*/
	open: import_prop_types.default.bool.isRequired,
	/**
	* Popper placement.
	* @default 'bottom'
	*/
	placement: import_prop_types.default.oneOf([
		"auto-end",
		"auto-start",
		"auto",
		"bottom-end",
		"bottom-start",
		"bottom",
		"left-end",
		"left-start",
		"left",
		"right-end",
		"right-start",
		"right",
		"top-end",
		"top-start",
		"top"
	]),
	/**
	* Options provided to the [`Popper.js`](https://popper.js.org/docs/v2/constructors/#options) instance.
	* @default {}
	*/
	popperOptions: import_prop_types.default.shape({
		modifiers: import_prop_types.default.array,
		onFirstUpdate: import_prop_types.default.func,
		placement: import_prop_types.default.oneOf([
			"auto-end",
			"auto-start",
			"auto",
			"bottom-end",
			"bottom-start",
			"bottom",
			"left-end",
			"left-start",
			"left",
			"right-end",
			"right-start",
			"right",
			"top-end",
			"top-start",
			"top"
		]),
		strategy: import_prop_types.default.oneOf(["absolute", "fixed"])
	}),
	/**
	* A ref that points to the used popper instance.
	*/
	popperRef: refType,
	/**
	* The props used for each slot inside the Popper.
	* @default {}
	*/
	slotProps: import_prop_types.default.shape({ root: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]) }),
	/**
	* The components used for each slot inside the Popper.
	* Either a string to use a HTML element or a component.
	* @default {}
	*/
	slots: import_prop_types.default.shape({ root: import_prop_types.default.elementType }),
	/**
	* The system prop that allows defining system overrides as well as additional CSS styles.
	*/
	sx: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.func,
			import_prop_types.default.object,
			import_prop_types.default.bool
		])),
		import_prop_types.default.func,
		import_prop_types.default.object
	]),
	/**
	* Help supporting a react-transition-group/Transition component.
	* @default false
	*/
	transition: import_prop_types.default.bool
};
//#endregion
//#region node_modules/@mui/utils/useEventCallback/useEventCallback.mjs
/**
* Inspired by https://github.com/facebook/react/issues/14099#issuecomment-440013892
* See RFC in https://github.com/reactjs/rfcs/pull/220
*/
function useEventCallback(fn) {
	const ref = import_react.useRef(fn);
	useEnhancedEffect(() => {
		ref.current = fn;
	});
	return import_react.useRef((...args) => (0, ref.current)(...args)).current;
}
//#endregion
//#region node_modules/@mui/material/utils/useEventCallback.mjs
var useEventCallback_default = useEventCallback;
//#endregion
//#region node_modules/@mui/material/utils/useId.mjs
var useId_default = useId;
//#endregion
//#region node_modules/@mui/utils/useControlled/useControlled.mjs
function useControlled(props) {
	const { controlled, default: defaultProp, name, state = "value" } = props;
	const { current: isControlled } = import_react.useRef(controlled !== void 0);
	const [valueState, setValue] = import_react.useState(defaultProp);
	const value = isControlled ? controlled : valueState;
	{
		import_react.useEffect(() => {
			if (isControlled !== (controlled !== void 0)) console.error([
				`MUI: A component is changing the ${isControlled ? "" : "un"}controlled ${state} state of ${name} to be ${isControlled ? "un" : ""}controlled.`,
				"Elements should not switch from uncontrolled to controlled (or vice versa).",
				`Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`,
				"The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
				"More info: https://fb.me/react-controlled-components"
			].join("\n"));
		}, [
			state,
			name,
			controlled
		]);
		const { current: defaultValue } = import_react.useRef(defaultProp);
		import_react.useEffect(() => {
			if (!isControlled && JSON.stringify(defaultProp) !== JSON.stringify(defaultValue)) console.error([`MUI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`].join("\n"));
		}, [JSON.stringify(defaultProp)]);
	}
	return [value, import_react.useCallback((newValue) => {
		if (!isControlled) setValue(newValue);
	}, [])];
}
//#endregion
//#region node_modules/@mui/material/utils/useControlled.mjs
var useControlled_default = useControlled;
//#endregion
//#region node_modules/@mui/material/utils/useSlot.mjs
/**
* An internal function to create a Material UI slot.
*
* This is an advanced version of Base UI `useSlotProps` because Material UI allows leaf component to be customized via `component` prop
* while Base UI does not need to support leaf component customization.
*
* @param {string} name: name of the slot
* @param {object} parameters
* @returns {[Slot, slotProps]} The slot's React component and the slot's props
*
* Note: the returned slot's props
* - will never contain `component` prop.
* - might contain `as` prop.
*/
function useSlot(name, parameters) {
	const { className, elementType: initialElementType, ownerState, externalForwardedProps, internalForwardedProps, shouldForwardComponentProp = false, ...useSlotPropsParams } = parameters;
	const { component: rootComponent, slots = { [name]: void 0 }, slotProps = { [name]: void 0 }, ...other } = externalForwardedProps;
	const elementType = slots[name] || initialElementType;
	const resolvedComponentsProps = resolveComponentProps(slotProps[name], ownerState);
	const { props: { component: slotComponent, ...mergedProps }, internalRef } = mergeSlotProps({
		className,
		...useSlotPropsParams,
		externalForwardedProps: name === "root" ? other : void 0,
		externalSlotProps: resolvedComponentsProps
	});
	const ref = useForkRef(internalRef, resolvedComponentsProps?.ref, parameters.ref);
	const LeafComponent = name === "root" ? slotComponent || rootComponent : slotComponent;
	return [elementType, appendOwnerState(elementType, {
		...name === "root" && !rootComponent && !slots[name] && internalForwardedProps,
		...name !== "root" && !slots[name] && internalForwardedProps,
		...mergedProps,
		...LeafComponent && !shouldForwardComponentProp && { as: LeafComponent },
		...LeafComponent && shouldForwardComponentProp && { component: LeafComponent },
		ref
	}, ownerState)];
}
//#endregion
//#region node_modules/@mui/material/Tooltip/tooltipClasses.mjs
function getTooltipUtilityClass(slot) {
	return generateUtilityClass("MuiTooltip", slot);
}
var tooltipClasses = generateUtilityClasses("MuiTooltip", [
	"popper",
	"popperInteractive",
	"popperArrow",
	"popperClose",
	"tooltip",
	"tooltipArrow",
	"touch",
	"tooltipPlacementLeft",
	"tooltipPlacementRight",
	"tooltipPlacementTop",
	"tooltipPlacementBottom",
	"arrow"
]);
//#endregion
//#region node_modules/@mui/material/Tooltip/Tooltip.mjs
function round(value) {
	return Math.round(value * 1e5) / 1e5;
}
var useUtilityClasses = (ownerState) => {
	const { classes, disableInteractive, arrow, touch, placement } = ownerState;
	return composeClasses({
		popper: [
			"popper",
			!disableInteractive && "popperInteractive",
			arrow && "popperArrow"
		],
		tooltip: [
			"tooltip",
			arrow && "tooltipArrow",
			touch && "touch",
			`tooltipPlacement${capitalize_default(placement.split("-")[0])}`
		],
		arrow: ["arrow"]
	}, getTooltipUtilityClass, classes);
};
var TooltipPopper = styled(Popper, {
	name: "MuiTooltip",
	slot: "Popper",
	overridesResolver: (props, styles) => {
		const { ownerState } = props;
		return [
			styles.popper,
			!ownerState.disableInteractive && styles.popperInteractive,
			ownerState.arrow && styles.popperArrow,
			!ownerState.open && styles.popperClose
		];
	}
})(memoTheme(({ theme }) => ({
	zIndex: (theme.vars || theme).zIndex.tooltip,
	pointerEvents: "none",
	variants: [{
		props: ({ ownerState, open }) => open && !ownerState.disableInteractive,
		style: { pointerEvents: "auto" }
	}, {
		props: ({ ownerState }) => ownerState.arrow,
		style: {
			[`&[data-popper-placement*="bottom"] .${tooltipClasses.arrow}`]: {
				top: 0,
				marginTop: "-0.71em",
				"&::before": { transformOrigin: "0 100%" }
			},
			[`&[data-popper-placement*="top"] .${tooltipClasses.arrow}`]: {
				bottom: 0,
				marginBottom: "-0.71em",
				"&::before": { transformOrigin: "100% 0" }
			},
			[`&[data-popper-placement*="right"] .${tooltipClasses.arrow}`]: {
				height: "1em",
				width: "0.71em",
				insetInlineStart: 0,
				marginInlineStart: "-0.71em",
				"&::before": { transformOrigin: "100% 100%" }
			},
			[`&[data-popper-placement*="left"] .${tooltipClasses.arrow}`]: {
				height: "1em",
				width: "0.71em",
				insetInlineEnd: 0,
				marginInlineEnd: "-0.71em",
				"&::before": { transformOrigin: "0 0" }
			}
		}
	}]
})));
var TooltipTooltip = styled("div", {
	name: "MuiTooltip",
	slot: "Tooltip",
	overridesResolver: (props, styles) => {
		const { ownerState } = props;
		return [
			styles.tooltip,
			ownerState.touch && styles.touch,
			ownerState.arrow && styles.tooltipArrow,
			styles[`tooltipPlacement${capitalize_default(ownerState.placement.split("-")[0])}`]
		];
	}
})(memoTheme(({ theme }) => ({
	backgroundColor: theme.vars ? theme.vars.palette.Tooltip.bg : theme.alpha(theme.palette.grey[700], .92),
	borderRadius: (theme.vars || theme).shape.borderRadius,
	color: (theme.vars || theme).palette.common.white,
	fontFamily: theme.typography.fontFamily,
	padding: "4px 8px",
	fontSize: theme.typography.pxToRem(11),
	maxWidth: 300,
	margin: 2,
	wordWrap: "break-word",
	fontWeight: theme.typography.fontWeightMedium,
	[`.${tooltipClasses.popper}[data-popper-placement*="left"] &`]: {
		transformOrigin: "right center",
		marginInlineEnd: "14px"
	},
	[`.${tooltipClasses.popper}[data-popper-placement*="right"] &`]: {
		transformOrigin: "left center",
		marginInlineStart: "14px"
	},
	[`.${tooltipClasses.popper}[data-popper-placement*="top"] &`]: {
		transformOrigin: "center bottom",
		marginBottom: "14px"
	},
	[`.${tooltipClasses.popper}[data-popper-placement*="bottom"] &`]: {
		transformOrigin: "center top",
		marginTop: "14px"
	},
	variants: [
		{
			props: ({ ownerState }) => ownerState.arrow,
			style: {
				position: "relative",
				marginBlock: 0
			}
		},
		{
			props: ({ ownerState }) => ownerState.touch,
			style: {
				padding: "8px 16px",
				fontSize: theme.typography.pxToRem(14),
				lineHeight: `${round(16 / 14)}em`,
				fontWeight: theme.typography.fontWeightRegular
			}
		},
		{
			props: ({ ownerState }) => ownerState.touch,
			style: {
				[`.${tooltipClasses.popper}[data-popper-placement*="left"] &`]: { marginInlineEnd: "24px" },
				[`.${tooltipClasses.popper}[data-popper-placement*="right"] &`]: { marginInlineStart: "24px" },
				[`.${tooltipClasses.popper}[data-popper-placement*="top"] &`]: { marginBottom: "24px" },
				[`.${tooltipClasses.popper}[data-popper-placement*="bottom"] &`]: { marginTop: "24px" }
			}
		}
	]
})));
var TooltipArrow = styled("span", {
	name: "MuiTooltip",
	slot: "Arrow"
})(memoTheme(({ theme }) => ({
	overflow: "hidden",
	position: "absolute",
	width: "1em",
	height: "0.71em",
	boxSizing: "border-box",
	color: theme.vars ? theme.vars.palette.Tooltip.bg : theme.alpha(theme.palette.grey[700], .9),
	"&::before": {
		content: "\"\"",
		margin: "auto",
		display: "block",
		width: "100%",
		height: "100%",
		backgroundColor: "currentColor",
		transform: "rotate(45deg)"
	}
})));
var hystersisOpen = false;
var hystersisTimer = new Timeout();
var cursorPosition = {
	x: 0,
	y: 0
};
function composeEventHandler(handler, eventHandler) {
	return (event, ...params) => {
		if (eventHandler) eventHandler(event, ...params);
		handler(event, ...params);
	};
}
var Tooltip = /*#__PURE__*/ import_react.forwardRef(function Tooltip(inProps, ref) {
	const props = useDefaultProps({
		props: inProps,
		name: "MuiTooltip"
	});
	const { arrow = false, children: childrenProp, classes: classesProp, describeChild = false, disableFocusListener = false, disableHoverListener = false, disableInteractive: disableInteractiveProp = false, disableTouchListener = false, enterDelay = 100, enterNextDelay = 0, enterTouchDelay = 700, followCursor = false, id: idProp, leaveDelay = 0, leaveTouchDelay = 1500, onClose, onOpen, open: openProp, placement = "bottom", slotProps = {}, slots = {}, title, ...other } = props;
	const children = /*#__PURE__*/ import_react.isValidElement(childrenProp) ? childrenProp : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", { children: childrenProp });
	const theme = useTheme();
	const [childNode, setChildNode] = import_react.useState();
	const [arrowRef, setArrowRef] = import_react.useState(null);
	const ignoreNonTouchEvents = import_react.useRef(false);
	const disableInteractive = disableInteractiveProp || followCursor;
	const closeTimer = useTimeout();
	const enterTimer = useTimeout();
	const leaveTimer = useTimeout();
	const touchTimer = useTimeout();
	const [openState, setOpenState] = useControlled_default({
		controlled: openProp,
		default: false,
		name: "Tooltip",
		state: "open"
	});
	let open = openState;
	{
		const { current: isControlled } = import_react.useRef(openProp !== void 0);
		import_react.useEffect(() => {
			if (childNode && childNode.disabled && !isControlled && title !== "" && childNode.tagName.toLowerCase() === "button") console.warn([
				"MUI: You are providing a disabled `button` child to the Tooltip component.",
				"A disabled element does not fire events.",
				"Tooltip needs to listen to the child element's events to display the title.",
				"",
				"Add a simple wrapper element, such as a `span`."
			].join("\n"));
		}, [
			title,
			childNode,
			isControlled
		]);
	}
	const id = useId_default(idProp);
	const prevUserSelect = import_react.useRef();
	const stopTouchInteraction = useEventCallback_default(() => {
		if (prevUserSelect.current !== void 0) {
			document.body.style.WebkitUserSelect = prevUserSelect.current;
			prevUserSelect.current = void 0;
		}
		touchTimer.clear();
	});
	import_react.useEffect(() => stopTouchInteraction, [stopTouchInteraction]);
	const handleOpen = (event) => {
		hystersisTimer.clear();
		hystersisOpen = true;
		setOpenState(true);
		if (onOpen && !open) onOpen(event);
	};
	const handleClose = useEventCallback_default(
		/**
		* @param {React.SyntheticEvent | Event} event
		*/
		(event) => {
			hystersisTimer.start(800 + leaveDelay, () => {
				hystersisOpen = false;
			});
			setOpenState(false);
			if (onClose && open) onClose(event);
			closeTimer.start(theme.transitions.duration.shortest, () => {
				ignoreNonTouchEvents.current = false;
			});
		}
	);
	const handleMouseOver = (event) => {
		if (childNode?.disabled) return;
		if (ignoreNonTouchEvents.current && event.type !== "touchstart") return;
		if (childNode) childNode.removeAttribute("title");
		enterTimer.clear();
		leaveTimer.clear();
		if (enterDelay || hystersisOpen && enterNextDelay) enterTimer.start(hystersisOpen ? enterNextDelay : enterDelay, () => {
			handleOpen(event);
		});
		else handleOpen(event);
	};
	const handleMouseLeave = (event) => {
		enterTimer.clear();
		leaveTimer.start(leaveDelay, () => {
			handleClose(event);
		});
	};
	const [, setChildIsFocusVisible] = import_react.useState(false);
	const handleBlur = (event) => {
		const target = event?.target ?? childNode;
		if (!target || target.disabled || !isFocusVisible(target)) {
			setChildIsFocusVisible(false);
			const closeEvent = event ?? new Event("blur");
			if (!event && target) {
				Object.defineProperty(closeEvent, "target", { value: target });
				Object.defineProperty(closeEvent, "currentTarget", { value: target });
			}
			handleMouseLeave(closeEvent);
		}
	};
	const handleFocus = (event) => {
		if (!childNode) setChildNode(event.currentTarget);
		if (isFocusVisible(event.target)) {
			const handleNativeBlur = (blurEvent) => {
				if (blurEvent.target.disabled) handleBlur(blurEvent);
				blurEvent.target.removeEventListener("blur", handleNativeBlur);
			};
			event.target.addEventListener("blur", handleNativeBlur);
			setChildIsFocusVisible(true);
			handleMouseOver(event);
		}
	};
	const detectTouchStart = (event) => {
		ignoreNonTouchEvents.current = true;
		const childrenProps = children.props;
		if (childrenProps.onTouchStart) childrenProps.onTouchStart(event);
	};
	const handleTouchStart = (event) => {
		detectTouchStart(event);
		leaveTimer.clear();
		closeTimer.clear();
		stopTouchInteraction();
		prevUserSelect.current = document.body.style.WebkitUserSelect;
		document.body.style.WebkitUserSelect = "none";
		touchTimer.start(enterTouchDelay, () => {
			document.body.style.WebkitUserSelect = prevUserSelect.current;
			handleMouseOver(event);
		});
	};
	const handleTouchEnd = (event) => {
		if (children.props.onTouchEnd) children.props.onTouchEnd(event);
		stopTouchInteraction();
		leaveTimer.start(leaveTouchDelay, () => {
			handleClose(event);
		});
	};
	import_react.useEffect(() => {
		if (!open) return;
		/**
		* @param {KeyboardEvent} nativeEvent
		*/
		function handleKeyDown(nativeEvent) {
			if (nativeEvent.key === "Escape") handleClose(nativeEvent);
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleClose, open]);
	const handleRef = useForkRef_default(getReactElementRef(children), setChildNode, ref);
	if (!title && title !== 0) open = false;
	const popperRef = import_react.useRef();
	const handleMouseMove = (event) => {
		const childrenProps = children.props;
		if (childrenProps.onMouseMove) childrenProps.onMouseMove(event);
		cursorPosition = {
			x: event.clientX,
			y: event.clientY
		};
		if (popperRef.current) popperRef.current.update();
	};
	const nameOrDescProps = {};
	const titleIsString = typeof title === "string";
	if (describeChild) {
		nameOrDescProps.title = !open && titleIsString && !disableHoverListener ? title : null;
		nameOrDescProps["aria-describedby"] = open ? id : null;
	} else {
		nameOrDescProps["aria-label"] = titleIsString ? title : null;
		nameOrDescProps["aria-labelledby"] = open && !titleIsString ? id : null;
	}
	const childrenProps = {
		...nameOrDescProps,
		...other,
		...children.props,
		className: clsx(other.className, children.props.className),
		onTouchStart: detectTouchStart,
		ref: handleRef,
		...followCursor ? { onMouseMove: handleMouseMove } : {}
	};
	childrenProps["data-mui-internal-clone-element"] = true;
	import_react.useEffect(() => {
		if (childNode && !childNode.getAttribute("data-mui-internal-clone-element")) console.error(["MUI: The `children` component of the Tooltip is not forwarding its props correctly.", "Please make sure that props are spread on the same element that the ref is applied to."].join("\n"));
	}, [childNode]);
	const interactiveWrapperListeners = {};
	if (!disableTouchListener) {
		childrenProps.onTouchStart = handleTouchStart;
		childrenProps.onTouchEnd = handleTouchEnd;
	}
	if (!disableHoverListener) {
		childrenProps.onMouseOver = composeEventHandler(handleMouseOver, childrenProps.onMouseOver);
		childrenProps.onMouseLeave = composeEventHandler(handleMouseLeave, childrenProps.onMouseLeave);
		if (!disableInteractive) {
			interactiveWrapperListeners.onMouseOver = handleMouseOver;
			interactiveWrapperListeners.onMouseLeave = handleMouseLeave;
		}
	}
	if (!disableFocusListener) {
		childrenProps.onFocus = composeEventHandler(handleFocus, childrenProps.onFocus);
		childrenProps.onBlur = composeEventHandler(handleBlur, childrenProps.onBlur);
		if (!disableInteractive) {
			interactiveWrapperListeners.onFocus = handleFocus;
			interactiveWrapperListeners.onBlur = handleBlur;
		}
	}
	if (children.props.title) console.error(["MUI: You have provided a `title` prop to the child of <Tooltip />.", `Remove this title prop \`${children.props.title}\` or the Tooltip component.`].join("\n"));
	const ownerState = {
		...props,
		arrow,
		disableInteractive,
		placement,
		touch: ignoreNonTouchEvents.current
	};
	const resolvedPopperProps = typeof slotProps.popper === "function" ? slotProps.popper(ownerState) : slotProps.popper;
	const popperOptions = import_react.useMemo(() => {
		let tooltipModifiers = [{
			name: "arrow",
			enabled: Boolean(arrowRef),
			options: {
				element: arrowRef,
				padding: 4
			}
		}];
		if (resolvedPopperProps?.popperOptions?.modifiers) tooltipModifiers = tooltipModifiers.concat(resolvedPopperProps.popperOptions.modifiers);
		return {
			...resolvedPopperProps?.popperOptions,
			modifiers: tooltipModifiers
		};
	}, [arrowRef, resolvedPopperProps?.popperOptions]);
	const classes = useUtilityClasses(ownerState);
	const externalForwardedProps = {
		slots,
		slotProps: {
			arrow: slotProps.arrow,
			popper: resolvedPopperProps,
			tooltip: slotProps.tooltip,
			transition: slotProps.transition
		}
	};
	const [PopperSlot, popperSlotProps] = useSlot("popper", {
		elementType: TooltipPopper,
		externalForwardedProps,
		ownerState,
		className: classes.popper
	});
	const [TransitionSlot, transitionSlotProps] = useSlot("transition", {
		elementType: Grow,
		externalForwardedProps,
		ownerState
	});
	const [TooltipSlot, tooltipSlotProps] = useSlot("tooltip", {
		elementType: TooltipTooltip,
		className: classes.tooltip,
		externalForwardedProps,
		ownerState
	});
	const [ArrowSlot, arrowSlotProps] = useSlot("arrow", {
		elementType: TooltipArrow,
		className: classes.arrow,
		externalForwardedProps,
		ownerState,
		ref: setArrowRef
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/*#__PURE__*/ import_react.cloneElement(children, childrenProps), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(PopperSlot, {
		as: Popper,
		placement,
		anchorEl: followCursor ? { getBoundingClientRect: () => ({
			top: cursorPosition.y,
			left: cursorPosition.x,
			right: cursorPosition.x,
			bottom: cursorPosition.y,
			width: 0,
			height: 0
		}) } : childNode,
		popperRef,
		open: childNode ? open : false,
		id,
		transition: true,
		...interactiveWrapperListeners,
		...popperSlotProps,
		popperOptions,
		children: ({ TransitionProps: TransitionPropsInner }) => /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TransitionSlot, {
			timeout: theme.transitions.duration.shorter,
			...TransitionPropsInner,
			...transitionSlotProps,
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(TooltipSlot, {
				...tooltipSlotProps,
				children: [title, arrow ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ArrowSlot, { ...arrowSlotProps }) : null]
			})
		})
	})] });
});
Tooltip.propTypes = {
	/**
	* If `true`, adds an arrow to the tooltip.
	* @default false
	*/
	arrow: import_prop_types.default.bool,
	/**
	* Tooltip reference element.
	*/
	children: elementAcceptingRef.isRequired,
	/**
	* Override or extend the styles applied to the component.
	*/
	classes: import_prop_types.default.object,
	/**
	* @ignore
	*/
	className: import_prop_types.default.string,
	/**
	* Set to `true` if the `title` acts as an accessible description.
	* By default the `title` acts as an accessible label for the child.
	* @default false
	*/
	describeChild: import_prop_types.default.bool,
	/**
	* Do not respond to focus-visible events.
	* @default false
	*/
	disableFocusListener: import_prop_types.default.bool,
	/**
	* Do not respond to hover events.
	* @default false
	*/
	disableHoverListener: import_prop_types.default.bool,
	/**
	* Makes a tooltip not interactive, i.e. it will close when the user
	* hovers over the tooltip before the `leaveDelay` is expired.
	* @default false
	*/
	disableInteractive: import_prop_types.default.bool,
	/**
	* Do not respond to long press touch events.
	* @default false
	*/
	disableTouchListener: import_prop_types.default.bool,
	/**
	* The number of milliseconds to wait before showing the tooltip.
	* This prop won't impact the enter touch delay (`enterTouchDelay`).
	* @default 100
	*/
	enterDelay: import_prop_types.default.number,
	/**
	* The number of milliseconds to wait before showing the tooltip when one was already recently opened.
	* @default 0
	*/
	enterNextDelay: import_prop_types.default.number,
	/**
	* The number of milliseconds a user must touch the element before showing the tooltip.
	* @default 700
	*/
	enterTouchDelay: import_prop_types.default.number,
	/**
	* If `true`, the tooltip follow the cursor over the wrapped element.
	* @default false
	*/
	followCursor: import_prop_types.default.bool,
	/**
	* This prop is used to help implement the accessibility logic.
	* If you don't provide this prop. It falls back to a randomly generated id.
	*/
	id: import_prop_types.default.string,
	/**
	* The number of milliseconds to wait before hiding the tooltip.
	* This prop won't impact the leave touch delay (`leaveTouchDelay`).
	* @default 0
	*/
	leaveDelay: import_prop_types.default.number,
	/**
	* The number of milliseconds after the user stops touching an element before hiding the tooltip.
	* @default 1500
	*/
	leaveTouchDelay: import_prop_types.default.number,
	/**
	* Callback fired when the component requests to be closed.
	*
	* @param {React.SyntheticEvent} event The event source of the callback.
	*/
	onClose: import_prop_types.default.func,
	/**
	* Callback fired when the component requests to be open.
	*
	* @param {React.SyntheticEvent} event The event source of the callback.
	*/
	onOpen: import_prop_types.default.func,
	/**
	* If `true`, the component is shown.
	*/
	open: import_prop_types.default.bool,
	/**
	* Tooltip placement.
	* @default 'bottom'
	*/
	placement: import_prop_types.default.oneOf([
		"auto-end",
		"auto-start",
		"auto",
		"bottom-end",
		"bottom-start",
		"bottom",
		"left-end",
		"left-start",
		"left",
		"right-end",
		"right-start",
		"right",
		"top-end",
		"top-start",
		"top"
	]),
	/**
	* The props used for each slot inside.
	* @default {}
	*/
	slotProps: import_prop_types.default.shape({
		arrow: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]),
		popper: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]),
		tooltip: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]),
		transition: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object])
	}),
	/**
	* The components used for each slot inside.
	* @default {}
	*/
	slots: import_prop_types.default.shape({
		arrow: import_prop_types.default.elementType,
		popper: import_prop_types.default.elementType,
		tooltip: import_prop_types.default.elementType,
		transition: import_prop_types.default.elementType
	}),
	/**
	* The system prop that allows defining system overrides as well as additional CSS styles.
	*/
	sx: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.func,
			import_prop_types.default.object,
			import_prop_types.default.bool
		])),
		import_prop_types.default.func,
		import_prop_types.default.object
	]),
	/**
	* Tooltip title. Zero-length titles string, undefined, null and false are never displayed.
	*/
	title: import_prop_types.default.node
};
//#endregion
export { Tooltip as default, getTooltipUtilityClass, tooltipClasses };

//# sourceMappingURL=@mui_material_Tooltip.js.map
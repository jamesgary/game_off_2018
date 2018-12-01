(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (!x.$)
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}



/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 * Copyright (c) 2018 Andrey Kuzmin
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Vector2

var _MJS_v2 = F2(function(x, y) {
    return new Float64Array([x, y]);
});

var _MJS_v2getX = function(a) {
    return a[0];
};

var _MJS_v2getY = function(a) {
    return a[1];
};

var _MJS_v2setX = F2(function(x, a) {
    return new Float64Array([x, a[1]]);
});

var _MJS_v2setY = F2(function(y, a) {
    return new Float64Array([a[0], y]);
});

var _MJS_v2toRecord = function(a) {
    return { x: a[0], y: a[1] };
};

var _MJS_v2fromRecord = function(r) {
    return new Float64Array([r.x, r.y]);
};

var _MJS_v2add = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
});

var _MJS_v2sub = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
});

var _MJS_v2negate = function(a) {
    var r = new Float64Array(2);
    r[0] = -a[0];
    r[1] = -a[1];
    return r;
};

var _MJS_v2direction = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    var im = 1.0 / _MJS_v2lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    return r;
});

function _MJS_v2lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
var _MJS_v2length = _MJS_v2lengthLocal;

var _MJS_v2lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1];
};

var _MJS_v2distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
});

var _MJS_v2distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
});

var _MJS_v2normalize = function(a) {
    var r = new Float64Array(2);
    var im = 1.0 / _MJS_v2lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    return r;
};

var _MJS_v2scale = F2(function(k, a) {
    var r = new Float64Array(2);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    return r;
});

var _MJS_v2dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
});

// Vector3

var _MJS_v3temp1Local = new Float64Array(3);
var _MJS_v3temp2Local = new Float64Array(3);
var _MJS_v3temp3Local = new Float64Array(3);

var _MJS_v3 = F3(function(x, y, z) {
    return new Float64Array([x, y, z]);
});

var _MJS_v3getX = function(a) {
    return a[0];
};

var _MJS_v3getY = function(a) {
    return a[1];
};

var _MJS_v3getZ = function(a) {
    return a[2];
};

var _MJS_v3setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2]]);
});

var _MJS_v3setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2]]);
});

var _MJS_v3setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z]);
});

var _MJS_v3toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2] };
};

var _MJS_v3fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z]);
};

var _MJS_v3add = F2(function(a, b) {
    var r = new Float64Array(3);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
});

function _MJS_v3subLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return r;
}
var _MJS_v3sub = F2(_MJS_v3subLocal);

var _MJS_v3negate = function(a) {
    var r = new Float64Array(3);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    return r;
};

function _MJS_v3directionLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    return _MJS_v3normalizeLocal(_MJS_v3subLocal(a, b, r), r);
}
var _MJS_v3direction = F2(_MJS_v3directionLocal);

function _MJS_v3lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
var _MJS_v3length = _MJS_v3lengthLocal;

var _MJS_v3lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
};

var _MJS_v3distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
});

var _MJS_v3distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
});

function _MJS_v3normalizeLocal(a, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    var im = 1.0 / _MJS_v3lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    return r;
}
var _MJS_v3normalize = _MJS_v3normalizeLocal;

var _MJS_v3scale = F2(function(k, a) {
    return new Float64Array([a[0] * k, a[1] * k, a[2] * k]);
});

var _MJS_v3dotLocal = function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
var _MJS_v3dot = F2(_MJS_v3dotLocal);

function _MJS_v3crossLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[1] * b[2] - a[2] * b[1];
    r[1] = a[2] * b[0] - a[0] * b[2];
    r[2] = a[0] * b[1] - a[1] * b[0];
    return r;
}
var _MJS_v3cross = F2(_MJS_v3crossLocal);

var _MJS_v3mul4x4 = F2(function(m, v) {
    var w;
    var tmp = _MJS_v3temp1Local;
    var r = new Float64Array(3);

    tmp[0] = m[3];
    tmp[1] = m[7];
    tmp[2] = m[11];
    w = _MJS_v3dotLocal(v, tmp) + m[15];
    tmp[0] = m[0];
    tmp[1] = m[4];
    tmp[2] = m[8];
    r[0] = (_MJS_v3dotLocal(v, tmp) + m[12]) / w;
    tmp[0] = m[1];
    tmp[1] = m[5];
    tmp[2] = m[9];
    r[1] = (_MJS_v3dotLocal(v, tmp) + m[13]) / w;
    tmp[0] = m[2];
    tmp[1] = m[6];
    tmp[2] = m[10];
    r[2] = (_MJS_v3dotLocal(v, tmp) + m[14]) / w;
    return r;
});

// Vector4

var _MJS_v4 = F4(function(x, y, z, w) {
    return new Float64Array([x, y, z, w]);
});

var _MJS_v4getX = function(a) {
    return a[0];
};

var _MJS_v4getY = function(a) {
    return a[1];
};

var _MJS_v4getZ = function(a) {
    return a[2];
};

var _MJS_v4getW = function(a) {
    return a[3];
};

var _MJS_v4setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2], a[3]]);
});

var _MJS_v4setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2], a[3]]);
});

var _MJS_v4setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z, a[3]]);
});

var _MJS_v4setW = F2(function(w, a) {
    return new Float64Array([a[0], a[1], a[2], w]);
});

var _MJS_v4toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2], w: a[3] };
};

var _MJS_v4fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z, r.w]);
};

var _MJS_v4add = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
});

var _MJS_v4sub = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return r;
});

var _MJS_v4negate = function(a) {
    var r = new Float64Array(4);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    r[3] = -a[3];
    return r;
};

var _MJS_v4direction = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    var im = 1.0 / _MJS_v4lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    r[2] = r[2] * im;
    r[3] = r[3] * im;
    return r;
});

function _MJS_v4lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
}
var _MJS_v4length = _MJS_v4lengthLocal;

var _MJS_v4lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

var _MJS_v4distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
});

var _MJS_v4distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
});

var _MJS_v4normalize = function(a) {
    var r = new Float64Array(4);
    var im = 1.0 / _MJS_v4lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    r[3] = a[3] * im;
    return r;
};

var _MJS_v4scale = F2(function(k, a) {
    var r = new Float64Array(4);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    r[2] = a[2] * k;
    r[3] = a[3] * k;
    return r;
});

var _MJS_v4dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
});

// Matrix4

var _MJS_m4x4temp1Local = new Float64Array(16);
var _MJS_m4x4temp2Local = new Float64Array(16);

var _MJS_m4x4identity = new Float64Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

var _MJS_m4x4fromRecord = function(r) {
    var m = new Float64Array(16);
    m[0] = r.m11;
    m[1] = r.m21;
    m[2] = r.m31;
    m[3] = r.m41;
    m[4] = r.m12;
    m[5] = r.m22;
    m[6] = r.m32;
    m[7] = r.m42;
    m[8] = r.m13;
    m[9] = r.m23;
    m[10] = r.m33;
    m[11] = r.m43;
    m[12] = r.m14;
    m[13] = r.m24;
    m[14] = r.m34;
    m[15] = r.m44;
    return m;
};

var _MJS_m4x4toRecord = function(m) {
    return {
        m11: m[0], m21: m[1], m31: m[2], m41: m[3],
        m12: m[4], m22: m[5], m32: m[6], m42: m[7],
        m13: m[8], m23: m[9], m33: m[10], m43: m[11],
        m14: m[12], m24: m[13], m34: m[14], m44: m[15]
    };
};

var _MJS_m4x4inverse = function(m) {
    var r = new Float64Array(16);

    r[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    r[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    r[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    r[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];

    if (det === 0) {
        return elm$core$Maybe$Nothing;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
        r[i] = r[i] * det;
    }

    return elm$core$Maybe$Just(r);
};

var _MJS_m4x4inverseOrthonormal = function(m) {
    var r = _MJS_m4x4transposeLocal(m);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -_MJS_v3dotLocal([r[0], r[4], r[8]], t);
    r[13] = -_MJS_v3dotLocal([r[1], r[5], r[9]], t);
    r[14] = -_MJS_v3dotLocal([r[2], r[6], r[10]], t);
    return r;
};

function _MJS_m4x4makeFrustumLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 * znear / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 * znear / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / (right - left);
    r[9] = (top + bottom) / (top - bottom);
    r[10] = -(zfar + znear) / (zfar - znear);
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -2 * zfar * znear / (zfar - znear);
    r[15] = 0;

    return r;
}
var _MJS_m4x4makeFrustum = F6(_MJS_m4x4makeFrustumLocal);

var _MJS_m4x4makePerspective = F4(function(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return _MJS_m4x4makeFrustumLocal(xmin, xmax, ymin, ymax, znear, zfar);
});

function _MJS_m4x4makeOrthoLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (zfar - znear);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(zfar + znear) / (zfar - znear);
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeOrtho = F6(_MJS_m4x4makeOrthoLocal);

var _MJS_m4x4makeOrtho2D = F4(function(left, right, bottom, top) {
    return _MJS_m4x4makeOrthoLocal(left, right, bottom, top, -1, 1);
});

function _MJS_m4x4mulLocal(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a41 = a[3];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a42 = a[7];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a43 = a[11];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];
    var a44 = a[15];
    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b41 = b[3];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b42 = b[7];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b43 = b[11];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];
    var b44 = b[15];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return r;
}
var _MJS_m4x4mul = F2(_MJS_m4x4mulLocal);

var _MJS_m4x4mulAffine = F2(function(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];

    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31;
    r[3] = 0;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32;
    r[7] = 0;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33;
    r[11] = 0;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    r[15] = 1;

    return r;
});

var _MJS_m4x4makeRotate = F2(function(angle, axis) {
    var r = new Float64Array(16);
    axis = _MJS_v3normalizeLocal(axis, _MJS_v3temp1Local);
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);

    r[0] = x * x * c1 + c;
    r[1] = y * x * c1 + z * s;
    r[2] = z * x * c1 - y * s;
    r[3] = 0;
    r[4] = x * y * c1 - z * s;
    r[5] = y * y * c1 + c;
    r[6] = y * z * c1 + x * s;
    r[7] = 0;
    r[8] = x * z * c1 + y * s;
    r[9] = y * z * c1 - x * s;
    r[10] = z * z * c1 + c;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});

var _MJS_m4x4rotate = F3(function(angle, axis, m) {
    var r = new Float64Array(16);
    var im = 1.0 / _MJS_v3lengthLocal(axis);
    var x = axis[0] * im;
    var y = axis[1] * im;
    var z = axis[2] * im;
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;
    var xyc1 = x * y * c1;
    var xzc1 = x * z * c1;
    var yzc1 = y * z * c1;
    var t11 = x * x * c1 + c;
    var t21 = xyc1 + zs;
    var t31 = xzc1 - ys;
    var t12 = xyc1 - zs;
    var t22 = y * y * c1 + c;
    var t32 = yzc1 + xs;
    var t13 = xzc1 + ys;
    var t23 = yzc1 - xs;
    var t33 = z * z * c1 + c;
    var m11 = m[0], m21 = m[1], m31 = m[2], m41 = m[3];
    var m12 = m[4], m22 = m[5], m32 = m[6], m42 = m[7];
    var m13 = m[8], m23 = m[9], m33 = m[10], m43 = m[11];
    var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];

    r[0] = m11 * t11 + m12 * t21 + m13 * t31;
    r[1] = m21 * t11 + m22 * t21 + m23 * t31;
    r[2] = m31 * t11 + m32 * t21 + m33 * t31;
    r[3] = m41 * t11 + m42 * t21 + m43 * t31;
    r[4] = m11 * t12 + m12 * t22 + m13 * t32;
    r[5] = m21 * t12 + m22 * t22 + m23 * t32;
    r[6] = m31 * t12 + m32 * t22 + m33 * t32;
    r[7] = m41 * t12 + m42 * t22 + m43 * t32;
    r[8] = m11 * t13 + m12 * t23 + m13 * t33;
    r[9] = m21 * t13 + m22 * t23 + m23 * t33;
    r[10] = m31 * t13 + m32 * t23 + m33 * t33;
    r[11] = m41 * t13 + m42 * t23 + m43 * t33;
    r[12] = m14,
    r[13] = m24;
    r[14] = m34;
    r[15] = m44;

    return r;
});

function _MJS_m4x4makeScale3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = x;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = y;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = z;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeScale3 = F3(_MJS_m4x4makeScale3Local);

var _MJS_m4x4makeScale = function(v) {
    return _MJS_m4x4makeScale3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4scale3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

var _MJS_m4x4scale = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

function _MJS_m4x4makeTranslate3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = 1;
    r[11] = 0;
    r[12] = x;
    r[13] = y;
    r[14] = z;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeTranslate3 = F3(_MJS_m4x4makeTranslate3Local);

var _MJS_m4x4makeTranslate = function(v) {
    return _MJS_m4x4makeTranslate3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4translate3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4translate = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4makeLookAt = F3(function(eye, center, up) {
    var z = _MJS_v3directionLocal(eye, center, _MJS_v3temp1Local);
    var x = _MJS_v3normalizeLocal(_MJS_v3crossLocal(up, z, _MJS_v3temp2Local), _MJS_v3temp2Local);
    var y = _MJS_v3normalizeLocal(_MJS_v3crossLocal(z, x, _MJS_v3temp3Local), _MJS_v3temp3Local);
    var tm1 = _MJS_m4x4temp1Local;
    var tm2 = _MJS_m4x4temp2Local;

    tm1[0] = x[0];
    tm1[1] = y[0];
    tm1[2] = z[0];
    tm1[3] = 0;
    tm1[4] = x[1];
    tm1[5] = y[1];
    tm1[6] = z[1];
    tm1[7] = 0;
    tm1[8] = x[2];
    tm1[9] = y[2];
    tm1[10] = z[2];
    tm1[11] = 0;
    tm1[12] = 0;
    tm1[13] = 0;
    tm1[14] = 0;
    tm1[15] = 1;

    tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
    tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
    tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
    tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

    return _MJS_m4x4mulLocal(tm1, tm2);
});


function _MJS_m4x4transposeLocal(m) {
    var r = new Float64Array(16);

    r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
    r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
    r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
    r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

    return r;
}
var _MJS_m4x4transpose = _MJS_m4x4transposeLocal;

var _MJS_m4x4makeBasis = F3(function(vx, vy, vz) {
    var r = new Float64Array(16);

    r[0] = vx[0];
    r[1] = vx[1];
    r[2] = vx[2];
    r[3] = 0;
    r[4] = vy[0];
    r[5] = vy[1];
    r[6] = vy[2];
    r[7] = 0;
    r[8] = vz[0];
    r[9] = vz[1];
    r[10] = vz[2];
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var author$project$Common$Grass = {$: 'Grass'};
var author$project$Common$Poop = {$: 'Poop'};
var author$project$Common$Water = {$: 'Water'};
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$List$cons = _List_cons;
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$Basics$sub = _Basics_sub;
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$Basics$le = _Utils_le;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm$core$String$lines = _String_lines;
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var elm$core$String$trim = _String_trim;
var author$project$Common$mapFromAscii = function (str) {
	return elm$core$Dict$fromList(
		elm$core$List$concat(
			A2(
				elm$core$List$indexedMap,
				F2(
					function (row, line) {
						return A2(
							elm$core$List$indexedMap,
							F2(
								function (col, _char) {
									return _Utils_Tuple2(
										_Utils_Tuple2(col, row),
										function () {
											switch (_char.valueOf()) {
												case '0':
													return author$project$Common$Grass;
												case '1':
													return author$project$Common$Water;
												default:
													return author$project$Common$Poop;
											}
										}());
								}),
							elm$core$String$toList(line));
					}),
				elm$core$String$lines(
					elm$core$String$trim(str)))));
};
var author$project$Game$DrawMap = function (a) {
	return {$: 'DrawMap', a: a};
};
var author$project$Game$Gun = {$: 'Gun'};
var author$project$Game$MainMenu = {$: 'MainMenu'};
var author$project$Common$tileToStr = function (tile) {
	switch (tile.$) {
		case 'Grass':
			return 'grass';
		case 'Water':
			return 'water';
		default:
			return 'poop';
	}
};
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var author$project$Game$drawMap = function (savedMap) {
	return A2(
		elm$core$List$map,
		function (_n0) {
			var _n1 = _n0.a;
			var x = _n1.a;
			var y = _n1.b;
			var tile = _n0.b;
			return {
				texture: author$project$Common$tileToStr(tile),
				x: x,
				y: y
			};
		},
		elm$core$Dict$toList(savedMap.map));
};
var elm$core$Basics$False = {$: 'False'};
var elm$core$Basics$True = {$: 'True'};
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (_n0.$ === 'Just') {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var elm$core$Set$empty = elm$core$Set$Set_elm_builtin(elm$core$Dict$empty);
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return elm$core$Set$Set_elm_builtin(
			A3(elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var elm$core$Set$fromList = function (list) {
	return A3(elm$core$List$foldl, elm$core$Set$insert, elm$core$Set$empty, list);
};
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var author$project$Game$possibleMoves = F2(
	function (map, _n0) {
		var col = _n0.a;
		var row = _n0.b;
		return elm$core$Set$fromList(
			A2(
				elm$core$List$map,
				elm$core$Tuple$first,
				A2(
					elm$core$List$filter,
					function (_n1) {
						var tile = _n1.b;
						switch (tile.$) {
							case 'Grass':
								return true;
							case 'Water':
								return false;
							default:
								return false;
						}
					},
					A2(
						elm$core$List$filterMap,
						function (pos) {
							return A2(
								elm$core$Maybe$map,
								elm$core$Tuple$pair(pos),
								A2(elm$core$Dict$get, pos, map));
						},
						_List_fromArray(
							[
								_Utils_Tuple2(col - 1, row),
								_Utils_Tuple2(col + 1, row),
								_Utils_Tuple2(col, row - 1),
								_Utils_Tuple2(col, row + 1),
								_Utils_Tuple2(col - 1, row - 1),
								_Utils_Tuple2(col - 1, row + 1),
								_Utils_Tuple2(col + 1, row - 1),
								_Utils_Tuple2(col + 1, row + 1)
							])))));
	});
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$pow = _Basics_pow;
var elm$core$Basics$sqrt = _Basics_sqrt;
var author$project$Game$pythagoreanCost = F2(
	function (_n0, _n1) {
		var x1 = _n0.a;
		var y1 = _n0.b;
		var x2 = _n1.a;
		var y2 = _n1.b;
		var dy = elm$core$Basics$abs(y1 - y2);
		var dx = elm$core$Basics$abs(x1 - x2);
		return elm$core$Basics$sqrt(
			A2(elm$core$Basics$pow, dx, 2) + A2(elm$core$Basics$pow, dy, 2));
	});
var author$project$Game$tilePosToFloats = function (_n0) {
	var col = _n0.a;
	var row = _n0.b;
	return _Utils_Tuple2(col, row);
};
var elm_explorations$linear_algebra$Math$Vector2$fromRecord = _MJS_v2fromRecord;
var author$project$Game$tupleToVec2 = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return elm_explorations$linear_algebra$Math$Vector2$fromRecord(
		{x: x, y: y});
};
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm_explorations$linear_algebra$Math$Vector2$add = _MJS_v2add;
var elm_explorations$linear_algebra$Math$Vector2$vec2 = _MJS_v2;
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === 'RBNode_elm_builtin') {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === 'RBNode_elm_builtin') {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === 'RBNode_elm_builtin') {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var elm$core$Set$diff = F2(
	function (_n0, _n1) {
		var dict1 = _n0.a;
		var dict2 = _n1.a;
		return elm$core$Set$Set_elm_builtin(
			A2(elm$core$Dict$diff, dict1, dict2));
	});
var elm$core$Set$foldl = F3(
	function (func, initialState, _n0) {
		var dict = _n0.a;
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (key, _n1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var elm$core$Set$remove = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return elm$core$Set$Set_elm_builtin(
			A2(elm$core$Dict$remove, key, dict));
	});
var elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3(elm$core$Dict$foldl, elm$core$Dict$insert, t2, t1);
	});
var elm$core$Set$union = F2(
	function (_n0, _n1) {
		var dict1 = _n0.a;
		var dict2 = _n1.a;
		return elm$core$Set$Set_elm_builtin(
			A2(elm$core$Dict$union, dict1, dict2));
	});
var elm$core$List$sortBy = _List_sortBy;
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var krisajenkins$elm_astar$AStar$Generalised$cheapestOpen = F2(
	function (costFn, model) {
		return A2(
			elm$core$Maybe$map,
			elm$core$Tuple$first,
			elm$core$List$head(
				A2(
					elm$core$List$sortBy,
					elm$core$Tuple$second,
					A2(
						elm$core$List$filterMap,
						function (position) {
							var _n0 = A2(elm$core$Dict$get, position, model.costs);
							if (_n0.$ === 'Nothing') {
								return elm$core$Maybe$Nothing;
							} else {
								var cost = _n0.a;
								return elm$core$Maybe$Just(
									_Utils_Tuple2(
										position,
										cost + costFn(position)));
							}
						},
						elm$core$Set$toList(model.openSet)))));
	});
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Elm$JsArray$push = _JsArray_push;
var elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					elm$core$Elm$JsArray$push,
					elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, elm$core$Elm$JsArray$empty));
				return A2(elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, subTree));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(
						elm$core$Array$insertTailInTree,
						shift - elm$core$Array$shiftStep,
						index,
						tail,
						elm$core$Elm$JsArray$singleton(value)));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		var originalTailLen = elm$core$Elm$JsArray$length(tail);
		var newTailLen = elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + elm$core$Array$shiftStep;
				var newTree = A4(
					elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					elm$core$Elm$JsArray$singleton(
						elm$core$Array$SubTree(tree)));
				return A4(elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4(elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4(elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			elm$core$Array$unsafeReplaceTail,
			A2(elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var krisajenkins$elm_astar$AStar$Generalised$reconstructPath = F2(
	function (cameFrom, goal) {
		var _n0 = A2(elm$core$Dict$get, goal, cameFrom);
		if (_n0.$ === 'Nothing') {
			return elm$core$Array$empty;
		} else {
			var next = _n0.a;
			return A2(
				elm$core$Array$push,
				goal,
				A2(krisajenkins$elm_astar$AStar$Generalised$reconstructPath, cameFrom, next));
		}
	});
var elm$core$Array$length = function (_n0) {
	var len = _n0.a;
	return len;
};
var krisajenkins$elm_astar$AStar$Generalised$updateCost = F3(
	function (current, neighbour, model) {
		var newCameFrom = A3(elm$core$Dict$insert, neighbour, current, model.cameFrom);
		var distanceTo = elm$core$Array$length(
			A2(krisajenkins$elm_astar$AStar$Generalised$reconstructPath, newCameFrom, neighbour));
		var newCosts = A3(elm$core$Dict$insert, neighbour, distanceTo, model.costs);
		var newModel = _Utils_update(
			model,
			{cameFrom: newCameFrom, costs: newCosts});
		var _n0 = A2(elm$core$Dict$get, neighbour, model.costs);
		if (_n0.$ === 'Nothing') {
			return newModel;
		} else {
			var previousDistance = _n0.a;
			return (_Utils_cmp(distanceTo, previousDistance) < 0) ? newModel : model;
		}
	});
var krisajenkins$elm_astar$AStar$Generalised$astar = F4(
	function (costFn, moveFn, goal, model) {
		astar:
		while (true) {
			var _n0 = A2(
				krisajenkins$elm_astar$AStar$Generalised$cheapestOpen,
				costFn(goal),
				model);
			if (_n0.$ === 'Nothing') {
				return elm$core$Maybe$Nothing;
			} else {
				var current = _n0.a;
				if (_Utils_eq(current, goal)) {
					return elm$core$Maybe$Just(
						A2(krisajenkins$elm_astar$AStar$Generalised$reconstructPath, model.cameFrom, goal));
				} else {
					var neighbours = moveFn(current);
					var modelPopped = _Utils_update(
						model,
						{
							evaluated: A2(elm$core$Set$insert, current, model.evaluated),
							openSet: A2(elm$core$Set$remove, current, model.openSet)
						});
					var newNeighbours = A2(elm$core$Set$diff, neighbours, modelPopped.evaluated);
					var modelWithNeighbours = _Utils_update(
						modelPopped,
						{
							openSet: A2(elm$core$Set$union, modelPopped.openSet, newNeighbours)
						});
					var modelWithCosts = A3(
						elm$core$Set$foldl,
						krisajenkins$elm_astar$AStar$Generalised$updateCost(current),
						modelWithNeighbours,
						newNeighbours);
					var $temp$costFn = costFn,
						$temp$moveFn = moveFn,
						$temp$goal = goal,
						$temp$model = modelWithCosts;
					costFn = $temp$costFn;
					moveFn = $temp$moveFn;
					goal = $temp$goal;
					model = $temp$model;
					continue astar;
				}
			}
		}
	});
var elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
	});
var elm$core$Set$singleton = function (key) {
	return elm$core$Set$Set_elm_builtin(
		A2(elm$core$Dict$singleton, key, _Utils_Tuple0));
};
var krisajenkins$elm_astar$AStar$Generalised$initialModel = function (start) {
	return {
		cameFrom: elm$core$Dict$empty,
		costs: A2(elm$core$Dict$singleton, start, 0),
		evaluated: elm$core$Set$empty,
		openSet: elm$core$Set$singleton(start)
	};
};
var krisajenkins$elm_astar$AStar$Generalised$findPath = F4(
	function (costFn, moveFn, start, end) {
		return A2(
			elm$core$Maybe$map,
			elm$core$Array$toList,
			A4(
				krisajenkins$elm_astar$AStar$Generalised$astar,
				costFn,
				moveFn,
				end,
				krisajenkins$elm_astar$AStar$Generalised$initialModel(start)));
	});
var krisajenkins$elm_astar$AStar$findPath = krisajenkins$elm_astar$AStar$Generalised$findPath;
var author$project$Game$init = function (session) {
	var savedMap = function () {
		var _n0 = elm$core$List$head(session.savedMaps);
		if (_n0.$ === 'Just') {
			var map = _n0.a;
			return map;
		} else {
			return {
				base: _Utils_Tuple2(2, 2),
				enemyTowers: elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(24, 7)
						])),
				hero: _Utils_Tuple2(3, 4),
				map: author$project$Common$mapFromAscii('\n11111111111111111111111111111\n10000000000011100000000000001\n10000000000001100000000000001\n10000000000000100000111000001\n10000000000001110000011000001\n10000000000000110000011000001\n10000000000000011000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n11111111111111111111111111111\n'),
				name: 'New Map',
				size: _Utils_Tuple2(6, 5)
			};
		}
	}();
	var c = session.c;
	return _Utils_Tuple2(
		{
			age: 0,
			base: {
				healthAmt: c.getFloat('base:healthMax'),
				healthMax: c.getFloat('base:healthMax'),
				pos: savedMap.base
			},
			bullets: _List_Nil,
			capacityLevel: 1,
			composts: _List_Nil,
			creeps: _List_Nil,
			crops: _List_Nil,
			enemyTowers: A2(
				elm$core$List$map,
				function (pos) {
					return {
						healthAmt: c.getFloat('enemyBase:healthMax'),
						healthMax: c.getFloat('enemyBase:healthMax'),
						pathToBase: A2(
							elm$core$Maybe$withDefault,
							_List_Nil,
							A4(
								krisajenkins$elm_astar$AStar$findPath,
								author$project$Game$pythagoreanCost,
								author$project$Game$possibleMoves(savedMap.map),
								pos,
								savedMap.base)),
						pos: pos,
						timeSinceLastSpawn: 0
					};
				},
				elm$core$Set$toList(savedMap.enemyTowers)),
			equipped: author$project$Game$Gun,
			fireRateLevel: 1,
			fx: _List_Nil,
			gameState: author$project$Game$MainMenu,
			hero: {
				acc: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0),
				healthAmt: c.getFloat('hero:healthMax'),
				healthMax: c.getFloat('hero:healthMax'),
				pos: A2(
					elm_explorations$linear_algebra$Math$Vector2$add,
					A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, 0.5),
					author$project$Game$tupleToVec2(
						author$project$Game$tilePosToFloats(savedMap.hero))),
				vel: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0)
			},
			inv: {compost: 0},
			isMouseDown: false,
			isPaused: false,
			map: savedMap.map,
			money: 0,
			moolahSeedAmt: 4,
			mousePos: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -99, -99),
			rangeLevel: 1,
			shouldShowHelp: false,
			slashEffects: _List_Nil,
			timeSinceLastFire: 0,
			timeSinceLastSlash: 99999,
			turretSeedAmt: 0,
			waterAmt: c.getFloat('waterGun:maxCapacity')
		},
		_List_fromArray(
			[
				author$project$Game$DrawMap(
				author$project$Game$drawMap(savedMap))
			]));
};
var author$project$Main$Game = function (a) {
	return {$: 'Game', a: a};
};
var elm$core$Debug$log = _Debug_log;
var author$project$Common$dlog = F2(
	function (str, val) {
		return A2(elm$core$Debug$log, str, val);
	});
var author$project$Main$Flags = F4(
	function (timestamp, windowWidth, windowHeight, persistence) {
		return {persistence: persistence, timestamp: timestamp, windowHeight: windowHeight, windowWidth: windowWidth};
	});
var author$project$Main$Persistence = F4(
	function (isConfigOpen, configFloats, savedMaps, openConfigAccordions) {
		return {configFloats: configFloats, isConfigOpen: isConfigOpen, openConfigAccordions: openConfigAccordions, savedMaps: savedMaps};
	});
var author$project$Common$ConfigFloat = F3(
	function (val, min, max) {
		return {max: max, min: min, val: val};
	});
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$float = _Json_decodeFloat;
var elm$json$Json$Decode$map3 = _Json_map3;
var author$project$Main$configFloatDecoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Common$ConfigFloat,
	A2(elm$json$Json$Decode$field, 'val', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'min', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'max', elm$json$Json$Decode$float));
var author$project$Common$SavedMap = F6(
	function (name, map, hero, enemyTowers, base, size) {
		return {base: base, enemyTowers: enemyTowers, hero: hero, map: map, name: name, size: size};
	});
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$Main$tileDecoder = A2(
	elm$json$Json$Decode$map,
	function (tile) {
		switch (tile) {
			case 'grass':
				return author$project$Common$Grass;
			case 'water':
				return author$project$Common$Water;
			default:
				return author$project$Common$Poop;
		}
	},
	elm$json$Json$Decode$string);
var elm$core$String$toInt = _String_toInt;
var elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		elm$json$Json$Decode$map,
		elm$core$Dict$fromList,
		elm$json$Json$Decode$keyValuePairs(decoder));
};
var author$project$Main$mapDecoder = A2(
	elm$json$Json$Decode$map,
	function (tilePosStrTileDict) {
		return elm$core$Dict$fromList(
			A2(
				elm$core$List$map,
				function (_n0) {
					var tilePosStr = _n0.a;
					var tile = _n0.b;
					var _n1 = A2(elm$core$String$split, ',', tilePosStr);
					if ((_n1.b && _n1.b.b) && (!_n1.b.b.b)) {
						var x = _n1.a;
						var _n2 = _n1.b;
						var y = _n2.a;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								A2(
									elm$core$Maybe$withDefault,
									0,
									elm$core$String$toInt(x)),
								A2(
									elm$core$Maybe$withDefault,
									0,
									elm$core$String$toInt(y))),
							tile);
					} else {
						return _Utils_Tuple2(
							_Utils_Tuple2(0, 0),
							tile);
					}
				},
				elm$core$Dict$toList(tilePosStrTileDict)));
	},
	elm$json$Json$Decode$dict(author$project$Main$tileDecoder));
var elm$json$Json$Decode$int = _Json_decodeInt;
var elm$json$Json$Decode$map2 = _Json_map2;
var author$project$Main$tilePosDecoder = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return _Utils_Tuple2(x, y);
		}),
	A2(elm$json$Json$Decode$field, 'x', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'y', elm$json$Json$Decode$int));
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$map6 = _Json_map6;
var author$project$Main$savedMapDecoder = A7(
	elm$json$Json$Decode$map6,
	author$project$Common$SavedMap,
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'map', author$project$Main$mapDecoder),
	A2(elm$json$Json$Decode$field, 'hero', author$project$Main$tilePosDecoder),
	A2(
		elm$json$Json$Decode$map,
		elm$core$Set$fromList,
		A2(
			elm$json$Json$Decode$field,
			'enemyTowers',
			elm$json$Json$Decode$list(author$project$Main$tilePosDecoder))),
	A2(elm$json$Json$Decode$field, 'base', author$project$Main$tilePosDecoder),
	A2(elm$json$Json$Decode$field, 'size', author$project$Main$tilePosDecoder));
var elm$json$Json$Decode$bool = _Json_decodeBool;
var elm$json$Json$Decode$map4 = _Json_map4;
var elm$json$Json$Decode$null = _Json_decodeNull;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$nullable = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				elm$json$Json$Decode$null(elm$core$Maybe$Nothing),
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder)
			]));
};
var author$project$Main$flagsDecoder = A5(
	elm$json$Json$Decode$map4,
	author$project$Main$Flags,
	A2(elm$json$Json$Decode$field, 'timestamp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'windowWidth', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'windowHeight', elm$json$Json$Decode$float),
	A2(
		elm$json$Json$Decode$field,
		'persistence',
		elm$json$Json$Decode$nullable(
			A5(
				elm$json$Json$Decode$map4,
				author$project$Main$Persistence,
				A2(elm$json$Json$Decode$field, 'isConfigOpen', elm$json$Json$Decode$bool),
				A2(
					elm$json$Json$Decode$field,
					'configFloats',
					elm$json$Json$Decode$dict(author$project$Main$configFloatDecoder)),
				A2(
					elm$json$Json$Decode$field,
					'savedMaps',
					elm$json$Json$Decode$list(author$project$Main$savedMapDecoder)),
				A2(
					elm$json$Json$Decode$field,
					'openConfigAccordions',
					A2(
						elm$json$Json$Decode$map,
						elm$core$Set$fromList,
						elm$json$Json$Decode$list(elm$json$Json$Decode$string)))))));
var elm$json$Json$Decode$decodeValue = _Json_run;
var author$project$Main$jsonToFlags = function (json) {
	var _n0 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$flagsDecoder, json);
	if (_n0.$ === 'Ok') {
		var flags = _n0.a;
		return flags;
	} else {
		var err = _n0.a;
		var _n1 = A2(
			author$project$Common$dlog,
			'flags bad man: ',
			elm$json$Json$Decode$errorToString(err));
		return {persistence: elm$core$Maybe$Nothing, timestamp: 0, windowHeight: 600, windowWidth: 800};
	}
};
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Main$encodeFxKind = function (fxKind) {
	switch (fxKind.$) {
		case 'Splash':
			return elm$json$Json$Encode$string('SPLASH');
		case 'CreepDeath':
			return elm$json$Json$Encode$string('CREEP_DEATH');
		default:
			return elm$json$Json$Encode$string('HARVEST');
	}
};
var author$project$Main$encodeShape = function (shape) {
	if (shape.$ === 'Rect') {
		return elm$json$Json$Encode$string('rect');
	} else {
		var left = shape.a;
		var top = shape.b;
		var right = shape.c;
		return elm$json$Json$Encode$string('arc');
	}
};
var elm$json$Json$Encode$float = _Json_wrap;
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var author$project$Main$encodeSprites = function (sprites) {
	return A2(
		elm$json$Json$Encode$list,
		function (_n0) {
			var x = _n0.x;
			var y = _n0.y;
			var texture = _n0.texture;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'x',
						elm$json$Json$Encode$float(x)),
						_Utils_Tuple2(
						'y',
						elm$json$Json$Encode$float(y)),
						_Utils_Tuple2(
						'texture',
						elm$json$Json$Encode$string(texture))
					]));
		},
		A2(
			elm$core$List$map,
			function (sprite) {
				return {texture: sprite.texture, x: sprite.x * 32, y: sprite.y * 32};
			},
			sprites));
};
var elm$json$Json$Encode$int = _Json_wrap;
var elm_explorations$linear_algebra$Math$Vector2$getX = _MJS_v2getX;
var elm_explorations$linear_algebra$Math$Vector2$getY = _MJS_v2getY;
var elm_explorations$linear_algebra$Math$Vector2$scale = _MJS_v2scale;
var author$project$Main$encodeSpriteLayer = function (layer) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(layer.name)),
				_Utils_Tuple2(
				'zOrder',
				elm$json$Json$Encode$int(layer.zOrder)),
				_Utils_Tuple2(
				'sprites',
				author$project$Main$encodeSprites(layer.sprites)),
				_Utils_Tuple2(
				'graphics',
				A2(
					elm$json$Json$Encode$list,
					function (graphic) {
						return elm$json$Json$Encode$object(
							_Utils_ap(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'x',
										elm$json$Json$Encode$float(graphic.x)),
										_Utils_Tuple2(
										'y',
										elm$json$Json$Encode$float(graphic.y)),
										_Utils_Tuple2(
										'width',
										elm$json$Json$Encode$float(graphic.width)),
										_Utils_Tuple2(
										'height',
										elm$json$Json$Encode$float(graphic.height)),
										_Utils_Tuple2(
										'bgColor',
										elm$json$Json$Encode$string(graphic.bgColor)),
										_Utils_Tuple2(
										'lineStyleWidth',
										elm$json$Json$Encode$float(graphic.lineStyleWidth)),
										_Utils_Tuple2(
										'lineStyleColor',
										elm$json$Json$Encode$string(graphic.lineStyleColor)),
										_Utils_Tuple2(
										'lineStyleAlpha',
										elm$json$Json$Encode$float(graphic.lineStyleAlpha)),
										_Utils_Tuple2(
										'alpha',
										elm$json$Json$Encode$float(graphic.alpha)),
										_Utils_Tuple2(
										'shape',
										author$project$Main$encodeShape(graphic.shape))
									]),
								function () {
									var _n0 = graphic.shape;
									if (_n0.$ === 'Rect') {
										return _List_Nil;
									} else {
										var left = _n0.a;
										var top = _n0.b;
										var right = _n0.c;
										return _List_fromArray(
											[
												_Utils_Tuple2(
												'arcLeftX',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getX(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, left)))),
												_Utils_Tuple2(
												'arcLeftY',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getY(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, left)))),
												_Utils_Tuple2(
												'arcTopX',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getX(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, top)))),
												_Utils_Tuple2(
												'arcTopY',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getY(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, top)))),
												_Utils_Tuple2(
												'arcRightX',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getX(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, right)))),
												_Utils_Tuple2(
												'arcRightY',
												elm$json$Json$Encode$float(
													elm_explorations$linear_algebra$Math$Vector2$getY(
														A2(elm_explorations$linear_algebra$Math$Vector2$scale, 32, right))))
											]);
									}
								}()));
					},
					A2(
						elm$core$List$map,
						function (graphic) {
							return {alpha: graphic.alpha, bgColor: graphic.bgColor, height: graphic.height * 32, lineStyleAlpha: graphic.lineStyleAlpha, lineStyleColor: graphic.lineStyleColor, lineStyleWidth: graphic.lineStyleWidth * 32, shape: graphic.shape, width: graphic.width * 32, x: graphic.x * 32, y: graphic.y * 32};
						},
						layer.graphics)))
			]));
};
var author$project$Main$performEffects = _Platform_outgoingPort(
	'performEffects',
	elm$json$Json$Encode$list(elm$core$Basics$identity));
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var elm$json$Json$Encode$bool = _Json_wrap;
var author$project$Main$performGameEffects = F3(
	function (session, effects, model) {
		return A2(
			elm$core$Tuple$mapSecond,
			elm$core$Platform$Cmd$batch,
			A3(
				elm$core$List$foldl,
				F2(
					function (effect, _n0) {
						var updatingModel = _n0.a;
						var updatingCmds = _n0.b;
						switch (effect.$) {
							case 'DrawSprites':
								var layers = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('DRAW')),
															_Utils_Tuple2(
															'layers',
															A2(elm$json$Json$Encode$list, author$project$Main$encodeSpriteLayer, layers))
														]))
												])),
										updatingCmds));
							case 'DrawMap':
								var sprites = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('DRAW_MAP')),
															_Utils_Tuple2(
															'sprites',
															author$project$Main$encodeSprites(sprites))
														]))
												])),
										updatingCmds));
							case 'DrawFx':
								var pos = effect.a;
								var kind = effect.b;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('DRAW_FX')),
															_Utils_Tuple2(
															'kind',
															author$project$Main$encodeFxKind(kind)),
															_Utils_Tuple2(
															'x',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getX(pos) * 32)),
															_Utils_Tuple2(
															'y',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getY(pos) * 32))
														]))
												])),
										updatingCmds));
							case 'MoveCamera':
								var pos = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('MOVE_CAMERA')),
															_Utils_Tuple2(
															'x',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getX(pos) * 32)),
															_Utils_Tuple2(
															'y',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getY(pos) * 32))
														]))
												])),
										updatingCmds));
							default:
								var hero = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('DRAW_HERO')),
															_Utils_Tuple2(
															'x',
															elm$json$Json$Encode$float(hero.x)),
															_Utils_Tuple2(
															'y',
															elm$json$Json$Encode$float(hero.y)),
															_Utils_Tuple2(
															'xDir',
															elm$json$Json$Encode$int(hero.xDir)),
															_Utils_Tuple2(
															'yDir',
															elm$json$Json$Encode$int(hero.yDir)),
															_Utils_Tuple2(
															'isWalking',
															elm$json$Json$Encode$bool(hero.isWalking)),
															_Utils_Tuple2(
															'equipped',
															elm$json$Json$Encode$string(hero.equipped))
														]))
												])),
										updatingCmds));
						}
					}),
				_Utils_Tuple2(model, _List_Nil),
				effects));
	});
var author$project$DefaultConfig$json = '\n{\n  "base:healthMax": {\n    "val": 12.9297505274916,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:attacker:melee:attackPerSecond": {\n    "val": 0.443713541020231,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:attacker:melee:damage": {\n    "val": 0.515080054610897,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:attacker:melee:health": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:attacker:melee:speed": {\n    "val": 0.907533821521658,\n    "min": 0,\n    "max": 1\n  },\n  "creeps:global:damage": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:global:health": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "creeps:global:speed": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "crops:moolah:absorptionRate": {\n    "val": 0.0487938596491228,\n    "min": 0,\n    "max": 1\n  },\n  "crops:moolah:cashValue": {\n    "val": 20,\n    "min": 0,\n    "max": 100\n  },\n  "crops:moolah:waterNeededToMature": {\n    "val": 0.50452302631579,\n    "min": 0,\n    "max": 1\n  },\n  "crops:soilWaterCapacity": {\n    "val": 0.212993421052632,\n    "min": 0,\n    "max": 2\n  },\n  "crops:turret:bulletMaxAge": {\n    "val": 3,\n    "min": 0,\n    "max": 25\n  },\n  "crops:turret:bulletSpeed": {\n    "val": 13,\n    "min": 0,\n    "max": 25\n  },\n  "crops:turret:healthMax": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "crops:turret:timeToSprout": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "crops:turret:waterNeededToMature": {\n    "val": 1,\n    "min": 0,\n    "max": 25\n  },\n  "crops:turret:absorptionRate": {\n    "val": 0,\n    "min": 0.05,\n    "max": 1\n  },\n  "enemyBase:creepsPerSpawn": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "enemyBase:healthMax": {\n    "val": 25,\n    "min": 0,\n    "max": 25\n  },\n  "enemyBase:secondsBetweenSpawnsAtDay": {\n    "val": 60,\n    "min": 0,\n    "max": 60\n  },\n  "enemyBase:secondsBetweenSpawnsAtNight": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "hero:acceleration": {\n    "val": 497.827975673328,\n    "min": 0,\n    "max": 1000.003\n  },\n  "hero:healthMax": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "hero:maxSpeed": {\n    "val": 6.58717105263158,\n    "min": 0,\n    "max": 15\n  },\n  "hero:size": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "hero:velocity": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "system:gameSpeed": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "system:tiles:grass:friction": {\n    "val": 97,\n    "min": 0,\n    "max": 100\n  },\n  "ui:meterWidth": {\n    "val": 225,\n    "min": 0,\n    "max": 225\n  },\n  "waterGun:ammoMax": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:bulletDmg": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:bulletMaxAge": {\n    "val": 0.3,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:bulletPushback": {\n    "val": 13.2090107980638,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:bulletSpeed": {\n    "val": 13.2090107980638,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:fireRate": {\n    "val": 5,\n    "min": 0,\n    "max": 25\n  },\n  "waterGun:maxCapacity": {\n    "val": 25,\n    "min": 0,\n    "max": 1000\n  },\n  "waterGun:refillRate": {\n    "val": 20.5721732654834,\n    "min": 0,\n    "max": 25\n  }\n}\n';
var elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var author$project$Main$defaultPersistence = {
	configFloats: A2(
		elm$core$Result$withDefault,
		elm$core$Dict$empty,
		A2(
			elm$json$Json$Decode$decodeString,
			elm$json$Json$Decode$dict(author$project$Main$configFloatDecoder),
			author$project$DefaultConfig$json)),
	isConfigOpen: false,
	openConfigAccordions: elm$core$Set$fromList(_List_Nil),
	savedMaps: _List_fromArray(
		[
			{
			base: _Utils_Tuple2(2, 2),
			enemyTowers: elm$core$Set$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(24, 7)
					])),
			hero: _Utils_Tuple2(3, 4),
			map: author$project$Common$mapFromAscii('\n11111111111111111111111111111\n10000000000011100000000000001\n10000000000001100000000000001\n10000000000000100000111000001\n10000000000001110000011000001\n10000000000000110000011000001\n10000000000000011000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n10000000000000000000011000001\n11111111111111111111111111111\n'),
			name: 'New Map',
			size: _Utils_Tuple2(6, 5)
		}
		])
};
var author$project$Main$makeC = function (configFloats) {
	return {
		getFloat: function (n) {
			var _n0 = A2(
				elm$core$Maybe$map,
				function ($) {
					return $.val;
				},
				A2(elm$core$Dict$get, n, configFloats));
			if (_n0.$ === 'Just') {
				var val = _n0.a;
				return val;
			} else {
				return A2(author$project$Common$dlog, 'YOU FOOOOL: ' + n, -1);
			}
		}
	};
};
var elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var elm$random$Random$next = function (_n0) {
	var state0 = _n0.a;
	var incr = _n0.b;
	return A2(elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var elm$random$Random$initialSeed = function (x) {
	var _n0 = elm$random$Random$next(
		A2(elm$random$Random$Seed, 0, 1013904223));
	var state1 = _n0.a;
	var incr = _n0.b;
	var state2 = (state1 + x) >>> 0;
	return elm$random$Random$next(
		A2(elm$random$Random$Seed, state2, incr));
};
var author$project$Main$sessionFromFlags = function (flags) {
	var persistence = A2(elm$core$Maybe$withDefault, author$project$Main$defaultPersistence, flags.persistence);
	return {
		c: author$project$Main$makeC(persistence.configFloats),
		configFloats: persistence.configFloats,
		isConfigOpen: persistence.isConfigOpen,
		keysPressed: elm$core$Set$empty,
		openConfigAccordions: persistence.openConfigAccordions,
		savedMaps: persistence.savedMaps,
		seed: elm$random$Random$initialSeed(flags.timestamp),
		windowHeight: flags.windowHeight,
		windowWidth: flags.windowWidth
	};
};
var author$project$Main$initGame = function (jsonFlags) {
	var flags = author$project$Main$jsonToFlags(jsonFlags);
	var session = author$project$Main$sessionFromFlags(flags);
	var _n0 = author$project$Game$init(session);
	var state = _n0.a;
	var effects = _n0.b;
	var model = {
		session: session,
		state: author$project$Main$Game(state)
	};
	return A3(author$project$Main$performGameEffects, session, effects, model);
};
var author$project$Main$init = author$project$Main$initGame;
var author$project$Main$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var author$project$Main$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var author$project$Main$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$browser$Browser$AnimationManager$init = elm$core$Task$succeed(
	A3(elm$browser$Browser$AnimationManager$State, _List_Nil, elm$core$Maybe$Nothing, 0));
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$core$String$length = _String_length;
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$core$Process$kill = _Scheduler_kill;
var elm$core$Process$spawn = _Scheduler_spawn;
var elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _n0) {
		var request = _n0.request;
		var oldTime = _n0.oldTime;
		var _n1 = _Utils_Tuple2(request, subs);
		if (_n1.a.$ === 'Nothing') {
			if (!_n1.b.b) {
				var _n2 = _n1.a;
				return elm$browser$Browser$AnimationManager$init;
			} else {
				var _n4 = _n1.a;
				return A2(
					elm$core$Task$andThen,
					function (pid) {
						return A2(
							elm$core$Task$andThen,
							function (time) {
								return elm$core$Task$succeed(
									A3(
										elm$browser$Browser$AnimationManager$State,
										subs,
										elm$core$Maybe$Just(pid),
										time));
							},
							elm$browser$Browser$AnimationManager$now);
					},
					elm$core$Process$spawn(
						A2(
							elm$core$Task$andThen,
							elm$core$Platform$sendToSelf(router),
							elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_n1.b.b) {
				var pid = _n1.a.a;
				return A2(
					elm$core$Task$andThen,
					function (_n3) {
						return elm$browser$Browser$AnimationManager$init;
					},
					elm$core$Process$kill(pid));
			} else {
				return elm$core$Task$succeed(
					A3(elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var elm$time$Time$millisToPosix = elm$time$Time$Posix;
var elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _n0) {
		var subs = _n0.subs;
		var oldTime = _n0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(
						elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			elm$core$Task$andThen,
			function (pid) {
				return A2(
					elm$core$Task$andThen,
					function (_n1) {
						return elm$core$Task$succeed(
							A3(
								elm$browser$Browser$AnimationManager$State,
								subs,
								elm$core$Maybe$Just(pid),
								newTime));
					},
					elm$core$Task$sequence(
						A2(elm$core$List$map, send, subs)));
			},
			elm$core$Process$spawn(
				A2(
					elm$core$Task$andThen,
					elm$core$Platform$sendToSelf(router),
					elm$browser$Browser$AnimationManager$rAF)));
	});
var elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Time(
				A2(elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Delta(
				A2(elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager(elm$browser$Browser$AnimationManager$init, elm$browser$Browser$AnimationManager$onEffects, elm$browser$Browser$AnimationManager$onSelfMsg, 0, elm$browser$Browser$AnimationManager$subMap);
var elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return elm$browser$Browser$AnimationManager$subscription(
		elm$browser$Browser$AnimationManager$Delta(tagger));
};
var elm$browser$Browser$Events$onAnimationFrameDelta = elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var elm$browser$Browser$Events$Document = {$: 'Document'};
var elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var elm$browser$Browser$Events$init = elm$core$Task$succeed(
	A2(elm$browser$Browser$Events$State, _List_Nil, elm$core$Dict$empty));
var elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var elm$browser$Browser$Events$spawn = F3(
	function (router, key, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						elm$core$Platform$sendToSelf,
						router,
						A2(elm$browser$Browser$Events$Event, key, event));
				}));
	});
var elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _n0) {
				stepState:
				while (true) {
					var list = _n0.a;
					var result = _n0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _n2 = list.a;
						var lKey = _n2.a;
						var lValue = _n2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_n0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_n0 = $temp$_n0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _n3 = A3(
			elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _n3.a;
		var intermediateResult = _n3.b;
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n4, result) {
					var k = _n4.a;
					var v = _n4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _n6) {
				var deads = _n6.a;
				var lives = _n6.b;
				var news = _n6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						elm$core$List$cons,
						A3(elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_n4, pid, _n5) {
				var deads = _n5.a;
				var lives = _n5.b;
				var news = _n5.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _n2, _n3) {
				var deads = _n3.a;
				var lives = _n3.b;
				var news = _n3.c;
				return _Utils_Tuple3(
					deads,
					A3(elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2(elm$core$List$map, elm$browser$Browser$Events$addKey, subs);
		var _n0 = A6(
			elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, elm$core$Dict$empty, _List_Nil));
		var deadPids = _n0.a;
		var livePids = _n0.b;
		var makeNewPids = _n0.c;
		return A2(
			elm$core$Task$andThen,
			function (pids) {
				return elm$core$Task$succeed(
					A2(
						elm$browser$Browser$Events$State,
						newSubs,
						A2(
							elm$core$Dict$union,
							livePids,
							elm$core$Dict$fromList(pids))));
			},
			A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$sequence(makeNewPids);
				},
				elm$core$Task$sequence(
					A2(elm$core$List$map, elm$core$Process$kill, deadPids))));
	});
var elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _n0, state) {
		var key = _n0.key;
		var event = _n0.event;
		var toMessage = function (_n2) {
			var subKey = _n2.a;
			var _n3 = _n2.b;
			var node = _n3.a;
			var name = _n3.b;
			var decoder = _n3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : elm$core$Maybe$Nothing;
		};
		var messages = A2(elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Platform$sendToApp(router),
					messages)));
	});
var elm$browser$Browser$Events$subMap = F2(
	function (func, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var decoder = _n0.c;
		return A3(
			elm$browser$Browser$Events$MySub,
			node,
			name,
			A2(elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager(elm$browser$Browser$Events$init, elm$browser$Browser$Events$onEffects, elm$browser$Browser$Events$onSelfMsg, 0, elm$browser$Browser$Events$subMap);
var elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return elm$browser$Browser$Events$subscription(
			A3(elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var elm$browser$Browser$Events$onKeyDown = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keydown');
var elm$browser$Browser$Events$onKeyUp = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keyup');
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Main$subscriptions = function (model) {
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				elm$browser$Browser$Events$onKeyDown(
				A2(
					elm$json$Json$Decode$map,
					author$project$Main$KeyDown,
					A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string))),
				elm$browser$Browser$Events$onKeyUp(
				A2(
					elm$json$Json$Decode$map,
					author$project$Main$KeyUp,
					A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string))),
				elm$core$Platform$Sub$batch(
				function () {
					var _n0 = model.state;
					if (_n0.$ === 'Game') {
						var gameModel = _n0.a;
						if (gameModel.isPaused) {
							return _List_Nil;
						} else {
							var _n1 = gameModel.gameState;
							switch (_n1.$) {
								case 'MainMenu':
									return _List_Nil;
								case 'Playing':
									return _List_fromArray(
										[
											elm$browser$Browser$Events$onAnimationFrameDelta(author$project$Main$Tick)
										]);
								case 'InStore':
									return _List_Nil;
								case 'GameOver':
									return _List_Nil;
								default:
									return _List_Nil;
							}
						}
					} else {
						var mapEditorModel = _n0.a;
						return _List_fromArray(
							[
								elm$browser$Browser$Events$onAnimationFrameDelta(author$project$Main$Tick)
							]);
					}
				}())
			]));
};
var author$project$Game$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var author$project$Game$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var author$project$Game$DrawHero = function (a) {
	return {$: 'DrawHero', a: a};
};
var author$project$Game$DrawSprites = function (a) {
	return {$: 'DrawSprites', a: a};
};
var author$project$Game$MoneyCrop = {$: 'MoneyCrop'};
var author$project$Game$MoveCamera = function (a) {
	return {$: 'MoveCamera', a: a};
};
var author$project$Game$Playing = {$: 'Playing'};
var author$project$Game$Seedling = function (a) {
	return {$: 'Seedling', a: a};
};
var author$project$Game$Turret = function (a) {
	return {$: 'Turret', a: a};
};
var author$project$Game$maxTimeToShowSlash = 0.1;
var author$project$Game$ageAll = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				age: delta + model.age,
				creeps: A2(
					elm$core$List$map,
					function (creep) {
						return _Utils_update(
							creep,
							{age: creep.age + delta});
					},
					model.creeps),
				slashEffects: A2(
					elm$core$List$filterMap,
					function (_n0) {
						var age = _n0.a;
						var slash = _n0.b;
						return (_Utils_cmp(age + delta, author$project$Game$maxTimeToShowSlash) > 0) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
							_Utils_Tuple2(age + delta, slash));
					},
					model.slashEffects),
				timeSinceLastSlash: delta + model.timeSinceLastSlash
			});
	});
var author$project$Game$vec2FromTilePos = function (tilePos) {
	return A2(
		elm_explorations$linear_algebra$Math$Vector2$add,
		A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, 0.5),
		author$project$Game$tupleToVec2(
			author$project$Game$tilePosToFloats(tilePos)));
};
var elm_explorations$linear_algebra$Math$Vector2$distance = _MJS_v2distance;
var author$project$Game$applyCreepDamageToBase = F3(
	function (session, delta, model) {
		var base = model.base;
		var numCreeps = elm$core$List$length(
			A2(
				elm$core$List$filter,
				function (creep) {
					return A2(
						elm_explorations$linear_algebra$Math$Vector2$distance,
						creep.pos,
						author$project$Game$vec2FromTilePos(base.pos)) < 1;
				},
				model.creeps));
		var creepDps = session.c.getFloat('creeps:attacker:melee:damage');
		var dmg = creepDps * delta;
		var newBase = _Utils_update(
			base,
			{healthAmt: base.healthAmt - (dmg * numCreeps)});
		return _Utils_update(
			model,
			{base: newBase});
	});
var elm_explorations$linear_algebra$Math$Vector2$distanceSquared = _MJS_v2distanceSquared;
var author$project$Game$isCreepOnHero = F2(
	function (hero, creep) {
		return _Utils_cmp(
			A2(
				elm_explorations$linear_algebra$Math$Vector2$distanceSquared,
				hero.pos,
				A2(
					elm_explorations$linear_algebra$Math$Vector2$add,
					A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, -0.0),
					creep.pos)),
			A2(elm$core$Basics$pow, 0.8, 2)) < 0;
	});
var author$project$Game$applyCreepDamageToHero = F3(
	function (session, delta, model) {
		var hero = model.hero;
		var numCreeps = elm$core$List$length(
			A2(
				elm$core$List$filter,
				author$project$Game$isCreepOnHero(model.hero),
				model.creeps));
		var creepDps = session.c.getFloat('creeps:attacker:melee:damage');
		var dmg = creepDps * delta;
		var newHero = _Utils_update(
			hero,
			{healthAmt: model.hero.healthAmt - (dmg * numCreeps)});
		return _Utils_update(
			model,
			{hero: newHero});
	});
var author$project$Game$MoolahCropSeed = {$: 'MoolahCropSeed'};
var author$project$Game$Scythe = {$: 'Scythe'};
var author$project$Game$TurretSeed = {$: 'TurretSeed'};
var author$project$Game$applyKeyDown = F2(
	function (str, model) {
		switch (str) {
			case '1':
				return _Utils_update(
					model,
					{equipped: author$project$Game$Gun});
			case '2':
				return _Utils_update(
					model,
					{equipped: author$project$Game$Scythe});
			case '3':
				return _Utils_update(
					model,
					{equipped: author$project$Game$MoolahCropSeed});
			case '4':
				return _Utils_update(
					model,
					{equipped: author$project$Game$TurretSeed});
			default:
				return model;
		}
	});
var author$project$Game$Can = {$: 'Can'};
var author$project$Game$Cant = {$: 'Cant'};
var author$project$Game$Shouldnt = {$: 'Shouldnt'};
var author$project$Game$zoomedTileSize = function (model) {
	return 32;
};
var author$project$Game$mouseGamePos = F2(
	function (session, model) {
		return A2(
			elm_explorations$linear_algebra$Math$Vector2$scale,
			1 / author$project$Game$zoomedTileSize(model),
			A2(
				elm_explorations$linear_algebra$Math$Vector2$add,
				A2(
					elm_explorations$linear_algebra$Math$Vector2$add,
					A2(elm_explorations$linear_algebra$Math$Vector2$vec2, session.windowWidth * (-0.5), session.windowHeight * (-0.5)),
					A2(
						elm_explorations$linear_algebra$Math$Vector2$scale,
						author$project$Game$zoomedTileSize(model),
						model.hero.pos)),
				model.mousePos));
	});
var elm$core$Basics$round = _Basics_round;
var elm_explorations$linear_algebra$Math$Vector2$toRecord = _MJS_v2toRecord;
var author$project$Game$hoveringTilePos = F2(
	function (session, model) {
		return function (_n0) {
			var x = _n0.x;
			var y = _n0.y;
			return elm$core$Maybe$Just(
				_Utils_Tuple2(
					elm$core$Basics$round((-0.5) + x),
					elm$core$Basics$round((-0.5) + y)));
		}(
			elm_explorations$linear_algebra$Math$Vector2$toRecord(
				A2(author$project$Game$mouseGamePos, session, model)));
	});
var author$project$Game$hoveringTile = F2(
	function (session, model) {
		var _n0 = A2(author$project$Game$hoveringTilePos, session, model);
		if (_n0.$ === 'Just') {
			var tile = _n0.a;
			return A2(elm$core$Dict$get, tile, model.map);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Dict$member = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$get, key, dict);
		if (_n0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var elm$core$Set$member = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return A2(elm$core$Dict$member, key, dict);
	});
var author$project$Game$canPlace = F2(
	function (session, model) {
		if (function () {
			var _n0 = model.equipped;
			switch (_n0.$) {
				case 'TurretSeed':
					return model.turretSeedAmt > 0;
				case 'MoolahCropSeed':
					return model.moolahSeedAmt > 0;
				case 'Gun':
					return false;
				default:
					return false;
			}
		}()) {
			var _n1 = A2(author$project$Game$hoveringTilePos, session, model);
			if (_n1.$ === 'Just') {
				var tilePos = _n1.a;
				if (_Utils_cmp(
					A2(
						elm_explorations$linear_algebra$Math$Vector2$distanceSquared,
						A2(
							elm_explorations$linear_algebra$Math$Vector2$add,
							A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, 0.5),
							author$project$Game$tupleToVec2(
								author$project$Game$tilePosToFloats(tilePos))),
						model.hero.pos),
					A2(elm$core$Basics$pow, 3, 2)) < 0) {
					var _n2 = A2(author$project$Game$hoveringTile, session, model);
					if ((_n2.$ === 'Just') && (_n2.a.$ === 'Grass')) {
						var _n3 = _n2.a;
						return function (bldgInWay) {
							return bldgInWay ? author$project$Game$Cant : author$project$Game$Can;
						}(
							A2(
								elm$core$Set$member,
								tilePos,
								elm$core$Set$fromList(
									elm$core$List$concat(
										_List_fromArray(
											[
												_List_fromArray(
												[model.base.pos]),
												A2(
												elm$core$List$map,
												function ($) {
													return $.pos;
												},
												model.enemyTowers),
												A2(
												elm$core$List$map,
												function ($) {
													return $.pos;
												},
												model.crops)
											])))));
					} else {
						return author$project$Game$Cant;
					}
				} else {
					return author$project$Game$Shouldnt;
				}
			} else {
				return author$project$Game$Cant;
			}
		} else {
			return author$project$Game$Shouldnt;
		}
	});
var author$project$Game$GameOver = {$: 'GameOver'};
var author$project$Game$Win = {$: 'Win'};
var author$project$Game$checkGameOver = F3(
	function (session, tick, model) {
		return _Utils_update(
			model,
			{
				gameState: ((model.hero.healthAmt <= 0) || (model.base.healthAmt <= 0)) ? author$project$Game$GameOver : ((!elm$core$List$length(model.enemyTowers)) ? author$project$Game$Win : model.gameState)
			});
	});
var author$project$Game$InStore = {$: 'InStore'};
var author$project$Game$vec2ToTuple = function (vec2) {
	return function (_n0) {
		var x = _n0.x;
		var y = _n0.y;
		return _Utils_Tuple2(x, y);
	}(
		elm_explorations$linear_algebra$Math$Vector2$toRecord(vec2));
};
var elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var author$project$Game$checkIfInStore = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				gameState: function (pos) {
					return _Utils_eq(pos, model.base.pos);
				}(
					A3(
						elm$core$Tuple$mapBoth,
						elm$core$Basics$floor,
						elm$core$Basics$floor,
						author$project$Game$vec2ToTuple(
							A2(
								elm_explorations$linear_algebra$Math$Vector2$add,
								A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0),
								model.hero.pos)))) ? author$project$Game$InStore : model.gameState
			});
	});
var author$project$Game$CreepDeath = {$: 'CreepDeath'};
var author$project$Game$DrawFx = F2(
	function (a, b) {
		return {$: 'DrawFx', a: a, b: b};
	});
var author$project$Game$Splash = {$: 'Splash'};
var author$project$Game$collidesWith = F2(
	function (_n0, _n1) {
		var v1 = _n0.a;
		var rad1 = _n0.b;
		var v2 = _n1.a;
		var rad2 = _n1.b;
		return _Utils_cmp(
			A2(elm_explorations$linear_algebra$Math$Vector2$distance, v1, v2),
			rad1 + rad2) < 1;
	});
var elm$core$Basics$cos = _Basics_cos;
var elm$core$Basics$sin = _Basics_sin;
var elm$core$Basics$fromPolar = function (_n0) {
	var radius = _n0.a;
	var theta = _n0.b;
	return _Utils_Tuple2(
		radius * elm$core$Basics$cos(theta),
		radius * elm$core$Basics$sin(theta));
};
var elm$core$Basics$pi = _Basics_pi;
var elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var elm$core$Bitwise$xor = _Bitwise_xor;
var elm$random$Random$peel = function (_n0) {
	var state = _n0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var elm$random$Random$float = F2(
	function (a, b) {
		return elm$random$Random$Generator(
			function (seed0) {
				var seed1 = elm$random$Random$next(seed0);
				var range = elm$core$Basics$abs(b - a);
				var n1 = elm$random$Random$peel(seed1);
				var n0 = elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 1.34217728e8) + lo) / 9.007199254740992e15;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					elm$random$Random$next(seed1));
			});
	});
var elm$random$Random$step = F2(
	function (_n0, seed) {
		var generator = _n0.a;
		return generator(seed);
	});
var elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var elm_community$list_extra$List$Extra$findIndex = elm_community$list_extra$List$Extra$findIndexHelp(0);
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var elm_community$list_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2(elm$core$List$take, n, xs),
			A2(elm$core$List$drop, n, xs));
	});
var elm_community$list_extra$List$Extra$splitWhen = F2(
	function (predicate, list) {
		return A2(
			elm$core$Maybe$map,
			function (i) {
				return A2(elm_community$list_extra$List$Extra$splitAt, i, list);
			},
			A2(elm_community$list_extra$List$Extra$findIndex, predicate, list));
	});
var author$project$Game$collideBulletsWithCreeps = F3(
	function (session, delta, model) {
		var _n0 = A3(
			elm$core$List$foldl,
			F2(
				function (bullet, tmp) {
					var _n1 = A2(
						elm_community$list_extra$List$Extra$splitWhen,
						function (creep) {
							return A2(
								author$project$Game$collidesWith,
								_Utils_Tuple2(bullet.pos, 0.1),
								_Utils_Tuple2(creep.pos, 0.5));
						},
						tmp.creeps);
					if ((_n1.$ === 'Just') && _n1.a.b.b) {
						var _n2 = _n1.a;
						var firstHalf = _n2.a;
						var _n3 = _n2.b;
						var foundCreep = _n3.a;
						var secondHalf = _n3.b;
						var pushback = author$project$Game$tupleToVec2(
							elm$core$Basics$fromPolar(
								_Utils_Tuple2(0.5, bullet.angle)));
						var newCreep = _Utils_update(
							foundCreep,
							{
								healthAmt: foundCreep.healthAmt - session.c.getFloat('waterGun:bulletDmg'),
								pos: A2(elm_explorations$linear_algebra$Math$Vector2$add, foundCreep.pos, pushback)
							});
						var _n4 = A2(
							elm$random$Random$step,
							A2(elm$random$Random$float, 0, 2 * elm$core$Basics$pi),
							tmp.seed);
						var angle = _n4.a;
						var newSeed = _n4.b;
						return {
							bullets: tmp.bullets,
							composts: (newCreep.healthAmt > 0) ? tmp.composts : A2(
								elm$core$List$cons,
								{age: 0, pos: foundCreep.pos},
								tmp.composts),
							creeps: (newCreep.healthAmt > 0) ? _Utils_ap(
								firstHalf,
								A2(elm$core$List$cons, newCreep, secondHalf)) : _Utils_ap(firstHalf, secondHalf),
							fx: (newCreep.healthAmt > 0) ? A2(
								elm$core$List$cons,
								A2(author$project$Game$DrawFx, foundCreep.pos, author$project$Game$Splash),
								tmp.fx) : _Utils_ap(
								_List_fromArray(
									[
										A2(author$project$Game$DrawFx, foundCreep.pos, author$project$Game$CreepDeath),
										A2(author$project$Game$DrawFx, foundCreep.pos, author$project$Game$Splash)
									]),
								tmp.fx),
							seed: newSeed
						};
					} else {
						return {
							bullets: A2(elm$core$List$cons, bullet, tmp.bullets),
							composts: tmp.composts,
							creeps: tmp.creeps,
							fx: tmp.fx,
							seed: tmp.seed
						};
					}
				}),
			{bullets: _List_Nil, composts: model.composts, creeps: model.creeps, fx: model.fx, seed: session.seed},
			model.bullets);
		var bullets = _n0.bullets;
		var creeps = _n0.creeps;
		var composts = _n0.composts;
		var seed = _n0.seed;
		var fx = _n0.fx;
		return _Utils_update(
			model,
			{
				bullets: bullets,
				composts: composts,
				creeps: creeps,
				fx: _Utils_ap(model.fx, fx)
			});
	});
var author$project$Game$collideBulletsWithEnemyTowers = F3(
	function (session, delta, model) {
		var _n0 = A3(
			elm$core$List$foldl,
			F2(
				function (bullet, tmp) {
					var _n1 = A2(
						elm_community$list_extra$List$Extra$splitWhen,
						function (enemyTower) {
							return A2(
								author$project$Game$collidesWith,
								_Utils_Tuple2(bullet.pos, 0.1),
								_Utils_Tuple2(
									author$project$Game$vec2FromTilePos(enemyTower.pos),
									0.5));
						},
						tmp.enemyTowers);
					if ((_n1.$ === 'Just') && _n1.a.b.b) {
						var _n2 = _n1.a;
						var firstHalf = _n2.a;
						var _n3 = _n2.b;
						var foundEnemyTower = _n3.a;
						var secondHalf = _n3.b;
						var newEnemyTower = _Utils_update(
							foundEnemyTower,
							{
								healthAmt: foundEnemyTower.healthAmt - session.c.getFloat('waterGun:bulletDmg')
							});
						var _n4 = A2(
							elm$random$Random$step,
							A2(elm$random$Random$float, 0, 2 * elm$core$Basics$pi),
							tmp.seed);
						var angle = _n4.a;
						var newSeed = _n4.b;
						return {
							bullets: tmp.bullets,
							composts: (newEnemyTower.healthAmt > 0) ? tmp.composts : A2(
								elm$core$List$cons,
								{
									age: 0,
									pos: author$project$Game$vec2FromTilePos(foundEnemyTower.pos)
								},
								tmp.composts),
							enemyTowers: (newEnemyTower.healthAmt > 0) ? _Utils_ap(
								firstHalf,
								A2(elm$core$List$cons, newEnemyTower, secondHalf)) : _Utils_ap(firstHalf, secondHalf),
							fx: A2(
								elm$core$List$cons,
								A2(author$project$Game$DrawFx, bullet.pos, author$project$Game$Splash),
								tmp.fx),
							seed: newSeed
						};
					} else {
						return {
							bullets: A2(elm$core$List$cons, bullet, tmp.bullets),
							composts: tmp.composts,
							enemyTowers: tmp.enemyTowers,
							fx: tmp.fx,
							seed: tmp.seed
						};
					}
				}),
			{bullets: _List_Nil, composts: model.composts, enemyTowers: model.enemyTowers, fx: model.fx, seed: session.seed},
			model.bullets);
		var bullets = _n0.bullets;
		var enemyTowers = _n0.enemyTowers;
		var composts = _n0.composts;
		var seed = _n0.seed;
		var fx = _n0.fx;
		return _Utils_update(
			model,
			{
				bullets: bullets,
				composts: composts,
				enemyTowers: enemyTowers,
				fx: _Utils_ap(model.fx, fx)
			});
	});
var author$project$Game$costForUpgrade = F3(
	function (session, model, upgrade) {
		switch (upgrade.$) {
			case 'Range':
				return model.rangeLevel * 20;
			case 'Capacity':
				return model.capacityLevel * 20;
			default:
				return model.fireRateLevel * 20;
		}
	});
var author$project$Game$Mature = {$: 'Mature'};
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var author$project$Game$cropsAbsorbWater = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				crops: A2(
					elm$core$List$map,
					function (crop) {
						var _n0 = crop.state;
						if (_n0.$ === 'Seedling') {
							var waterNeededToMature = _n0.a.waterNeededToMature;
							var waterConsumed = _n0.a.waterConsumed;
							var waterInSoil = _n0.a.waterInSoil;
							var waterCapacity = _n0.a.waterCapacity;
							var amtToAbsorb = A2(
								elm$core$Basics$min,
								delta * session.c.getFloat('crops:moolah:absorptionRate'),
								waterInSoil);
							return (_Utils_cmp(waterConsumed + amtToAbsorb, waterNeededToMature) > 0) ? _Utils_update(
								crop,
								{state: author$project$Game$Mature}) : _Utils_update(
								crop,
								{
									state: author$project$Game$Seedling(
										{waterCapacity: waterCapacity, waterConsumed: waterConsumed + amtToAbsorb, waterInSoil: waterInSoil - amtToAbsorb, waterNeededToMature: waterNeededToMature})
								});
						} else {
							return crop;
						}
					},
					model.crops)
			});
	});
var author$project$Game$angleToDir = function (angle) {
	return function (rads) {
		return ((_Utils_cmp(5 / 8, rads) < 0) && (_Utils_cmp(rads, 7 / 8) < 0)) ? _Utils_Tuple2(-1, 1) : (((_Utils_cmp(3 / 8, rads) < 0) && (_Utils_cmp(rads, 5 / 8) < 0)) ? _Utils_Tuple2(0, 1) : (((_Utils_cmp(1 / 8, rads) < 0) && (_Utils_cmp(rads, 3 / 8) < 0)) ? _Utils_Tuple2(1, 1) : (((_Utils_cmp((-1) / 8, rads) < 0) && (_Utils_cmp(rads, 1 / 8) < 0)) ? _Utils_Tuple2(1, 0) : (((_Utils_cmp((-3) / 8, rads) < 0) && (_Utils_cmp(rads, (-1) / 8) < 0)) ? _Utils_Tuple2(1, -1) : (((_Utils_cmp((-5) / 8, rads) < 0) && (_Utils_cmp(rads, (-3) / 8) < 0)) ? _Utils_Tuple2(0, -1) : (((_Utils_cmp((-7) / 8, rads) < 0) && (_Utils_cmp(rads, (-5) / 8) < 0)) ? _Utils_Tuple2(-1, -1) : _Utils_Tuple2(-1, 0)))))));
	}(angle / elm$core$Basics$pi);
};
var author$project$Game$equippableStr = function (equippable) {
	switch (equippable.$) {
		case 'Gun':
			return 'gun';
		case 'Scythe':
			return 'scythe';
		case 'MoolahCropSeed':
			return 'seed';
		default:
			return 'seed';
	}
};
var elm$core$Basics$atan2 = _Basics_atan2;
var elm$core$Basics$toPolar = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return _Utils_Tuple2(
		elm$core$Basics$sqrt((x * x) + (y * y)),
		A2(elm$core$Basics$atan2, y, x));
};
var elm_explorations$linear_algebra$Math$Vector2$sub = _MJS_v2sub;
var author$project$Game$mouseAngleToHero = F2(
	function (session, model) {
		var mousePos = A2(author$project$Game$mouseGamePos, session, model);
		var heroPos = model.hero.pos;
		var xDiff = elm_explorations$linear_algebra$Math$Vector2$getX(
			A2(elm_explorations$linear_algebra$Math$Vector2$sub, mousePos, heroPos));
		var yDiff = elm_explorations$linear_algebra$Math$Vector2$getY(
			A2(elm_explorations$linear_algebra$Math$Vector2$sub, mousePos, heroPos));
		var _n0 = elm$core$Basics$toPolar(
			_Utils_Tuple2(xDiff, yDiff));
		var mouseAngle = _n0.b;
		return mouseAngle;
	});
var author$project$Game$drawHero = F2(
	function (session, model) {
		var _n0 = (model.timeSinceLastSlash < 0.1) ? author$project$Game$angleToDir(
			function (angle) {
				return (_Utils_cmp(angle, -elm$core$Basics$pi) < 0) ? (angle + (2 * elm$core$Basics$pi)) : angle;
			}(
				A2(author$project$Game$mouseAngleToHero, session, model) - (elm$core$Basics$pi / 4))) : author$project$Game$angleToDir(
			A2(author$project$Game$mouseAngleToHero, session, model));
		var xDir = _n0.a;
		var yDir = _n0.b;
		return {
			equipped: author$project$Game$equippableStr(model.equipped),
			isWalking: A2(
				elm_explorations$linear_algebra$Math$Vector2$distance,
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0),
				model.hero.vel) > 0.1,
			x: elm_explorations$linear_algebra$Math$Vector2$getX(model.hero.pos),
			xDir: xDir,
			y: elm_explorations$linear_algebra$Math$Vector2$getY(model.hero.pos),
			yDir: yDir
		};
	});
var author$project$Common$Rect = {$: 'Rect'};
var author$project$Game$drawMeter = F5(
	function (pos, width, amt, max, color) {
		var outlineRatio = 5.0e-2;
		var offset = outlineRatio * width;
		var height = 0.1 * width;
		var _n0 = _Utils_Tuple2(
			elm_explorations$linear_algebra$Math$Vector2$getX(pos) - (width / 2),
			elm_explorations$linear_algebra$Math$Vector2$getY(pos) + 0.7);
		var x = _n0.a;
		var y = _n0.b;
		return _List_fromArray(
			[
				{alpha: 1, bgColor: '#000000', height: height + (offset * 2), lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width + (offset * 2), x: x - offset, y: y - offset},
				{alpha: 1, bgColor: color, height: height, lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width * (amt / max), x: x, y: y}
			]);
	});
var author$project$Game$drawHealthMeter = F4(
	function (pos, width, amt, max) {
		return A5(author$project$Game$drawMeter, pos, width, amt, max, '#00ff00');
	});
var author$project$Game$drawMaturityMeter = F5(
	function (pos, width, consumed, need, has) {
		var outlineRatio = 5.0e-2;
		var offset = outlineRatio * width;
		var height = 0.1 * width;
		var _n0 = _Utils_Tuple2(
			elm_explorations$linear_algebra$Math$Vector2$getX(pos) - (width / 2),
			elm_explorations$linear_algebra$Math$Vector2$getY(pos) + 0.7);
		var x = _n0.a;
		var y = _n0.b;
		return _List_fromArray(
			[
				{alpha: 1, bgColor: '#000000', height: height + (offset * 2), lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width + (offset * 2), x: x - offset, y: y - offset},
				{
				alpha: 1,
				bgColor: '#00eeee',
				height: height,
				lineStyleAlpha: 1,
				lineStyleColor: '#000000',
				lineStyleWidth: 0,
				shape: author$project$Common$Rect,
				width: width * A2(elm$core$Basics$min, 1, (consumed + has) / need),
				x: x,
				y: y
			},
				{alpha: 1, bgColor: '#00aa00', height: height, lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width * (consumed / need), x: x, y: y}
			]);
	});
var author$project$Game$drawSlash = F2(
	function (session, model) {
		return A2(
			elm$core$List$map,
			function (_n0) {
				var age = _n0.a;
				var slash = _n0.b;
				return _Utils_update(
					slash,
					{
						alpha: A2(elm$core$Basics$max, 0, (author$project$Game$maxTimeToShowSlash - age) / author$project$Game$maxTimeToShowSlash)
					});
			},
			model.slashEffects);
	});
var author$project$Game$drawWaterMeter = F4(
	function (pos, width, amt, max) {
		return A5(author$project$Game$drawMeter, pos, width, amt, max, '#00ffff');
	});
var author$project$Game$getSprites = F2(
	function (session, model) {
		var heroLayer = {
			graphics: _Utils_ap(
				A4(author$project$Game$drawHealthMeter, model.hero.pos, 1.4, model.hero.healthAmt, model.hero.healthMax),
				A2(author$project$Game$drawSlash, session, model)),
			name: 'hero',
			sprites: _List_Nil
		};
		var cursorLayer = {
			graphics: _List_Nil,
			name: 'cursor',
			sprites: function () {
				var tileCursor = function () {
					var _n11 = _Utils_Tuple2(
						A2(author$project$Game$canPlace, session, model),
						A2(author$project$Game$hoveringTilePos, session, model));
					_n11$2:
					while (true) {
						if (_n11.b.$ === 'Just') {
							switch (_n11.a.$) {
								case 'Can':
									var _n12 = _n11.a;
									var _n13 = _n11.b.a;
									var x = _n13.a;
									var y = _n13.b;
									return _List_fromArray(
										[
											{texture: 'selectedTile', x: x, y: y}
										]);
								case 'Shouldnt':
									var _n14 = _n11.a;
									var _n15 = _n11.b.a;
									var x = _n15.a;
									var y = _n15.b;
									return _List_Nil;
								default:
									break _n11$2;
							}
						} else {
							break _n11$2;
						}
					}
					return _List_Nil;
				}();
				var _n10 = model.equipped;
				switch (_n10.$) {
					case 'Gun':
						return _List_Nil;
					case 'Scythe':
						return _List_Nil;
					case 'MoolahCropSeed':
						return tileCursor;
					default:
						return tileCursor;
				}
			}()
		};
		var creepsLayer = {
			graphics: elm$core$List$concat(
				A2(
					elm$core$List$filterMap,
					function (creep) {
						return _Utils_eq(creep.healthAmt, creep.healthMax) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
							A4(author$project$Game$drawHealthMeter, creep.pos, 1, creep.healthAmt, creep.healthMax));
					},
					model.creeps)),
			name: 'creeps',
			sprites: A2(
				elm$core$List$map,
				function (creep) {
					return {
						texture: 'creep',
						x: elm_explorations$linear_algebra$Math$Vector2$getX(creep.pos) - 0.5,
						y: elm_explorations$linear_algebra$Math$Vector2$getY(creep.pos) - 0.25
					};
				},
				model.creeps)
		};
		var bulletsLayer = {
			graphics: _List_Nil,
			name: 'bullets',
			sprites: A2(
				elm$core$List$map,
				function (bullet) {
					return {
						texture: function () {
							var _n9 = bullet.kind;
							if (_n9.$ === 'PlayerBullet') {
								return 'bullet';
							} else {
								return 'plantBullet';
							}
						}(),
						x: elm_explorations$linear_algebra$Math$Vector2$getX(bullet.pos) - 0.5,
						y: elm_explorations$linear_algebra$Math$Vector2$getY(bullet.pos) - 0.5
					};
				},
				model.bullets)
		};
		var buildingsLayer = {
			graphics: elm$core$List$concat(
				_List_fromArray(
					[
						elm$core$List$concat(
						function () {
							var _n0 = model.base.pos;
							var x = _n0.a;
							var y = _n0.b;
							return _List_fromArray(
								[
									A4(
									author$project$Game$drawHealthMeter,
									A2(elm_explorations$linear_algebra$Math$Vector2$vec2, x + 0.5, y + 0),
									1,
									model.base.healthAmt,
									model.base.healthMax)
								]);
						}()),
						elm$core$List$concat(
						A2(
							elm$core$List$map,
							function (enemyTower) {
								var _n1 = enemyTower.pos;
								var etX = _n1.a;
								var etY = _n1.b;
								return A4(
									author$project$Game$drawHealthMeter,
									A2(elm_explorations$linear_algebra$Math$Vector2$vec2, etX + 0.5, etY + 0.5),
									2,
									enemyTower.healthAmt,
									enemyTower.healthMax);
							},
							model.enemyTowers)),
						elm$core$List$concat(
						elm$core$List$concat(
							A2(
								elm$core$List$map,
								function (crop) {
									var _n2 = crop.pos;
									var etX = _n2.a;
									var etY = _n2.b;
									var _n3 = crop.state;
									if (_n3.$ === 'Seedling') {
										var waterNeededToMature = _n3.a.waterNeededToMature;
										var waterConsumed = _n3.a.waterConsumed;
										var waterCapacity = _n3.a.waterCapacity;
										var waterInSoil = _n3.a.waterInSoil;
										return _List_fromArray(
											[
												A5(
												author$project$Game$drawMaturityMeter,
												A2(elm_explorations$linear_algebra$Math$Vector2$vec2, etX + 0.5, etY + 0.4),
												0.8,
												waterConsumed,
												waterNeededToMature,
												waterInSoil),
												A4(
												author$project$Game$drawWaterMeter,
												A2(elm_explorations$linear_algebra$Math$Vector2$vec2, etX + 0.5, etY + 0.6),
												0.8,
												waterInSoil,
												waterCapacity)
											]);
									} else {
										return _List_Nil;
									}
								},
								model.crops)))
					])),
			name: 'buildings',
			sprites: elm$core$List$concat(
				_List_fromArray(
					[
						function () {
						var _n4 = model.base.pos;
						var x = _n4.a;
						var y = _n4.b;
						return _List_fromArray(
							[
								{texture: 'base', x: x - 1, y: y - 1}
							]);
					}(),
						A2(
						elm$core$List$map,
						function (enemyTower) {
							var _n5 = enemyTower.pos;
							var etX = _n5.a;
							var etY = _n5.b;
							return {texture: 'enemyTower', x: etX, y: etY};
						},
						model.enemyTowers),
						A2(
						elm$core$List$map,
						function (crop) {
							var _n6 = crop.pos;
							var etX = _n6.a;
							var etY = _n6.b;
							return {
								texture: function () {
									var _n7 = crop.state;
									if (_n7.$ === 'Seedling') {
										var sData = _n7.a;
										return ((sData.waterConsumed / sData.waterNeededToMature) < 0.25) ? 'seedling' : 'young-money';
									} else {
										var _n8 = crop.kind;
										if (_n8.$ === 'MoneyCrop') {
											return 'mature-money';
										} else {
											return 'turret';
										}
									}
								}(),
								x: etX,
								y: etY
							};
						},
						model.crops)
					]))
		};
		return A2(
			elm$core$List$indexedMap,
			F2(
				function (i, layer) {
					return {graphics: layer.graphics, name: layer.name, sprites: layer.sprites, zOrder: i};
				}),
			_List_fromArray(
				[buildingsLayer, heroLayer, creepsLayer, bulletsLayer, cursorLayer]));
	});
var author$project$Game$PlayerBullet = {$: 'PlayerBullet'};
var author$project$Game$heroDir = F2(
	function (session, model) {
		return author$project$Game$angleToDir(
			A2(author$project$Game$mouseAngleToHero, session, model));
	});
var author$project$Game$barrelPos = F2(
	function (session, model) {
		return function (_n0) {
			var x = _n0.a;
			var y = _n0.b;
			return (!elm$core$Basics$round(y)) ? A2(elm_explorations$linear_algebra$Math$Vector2$vec2, x * 1, (y * 1) + 0.25) : ((elm$core$Basics$round(y) > 0) ? A2(elm_explorations$linear_algebra$Math$Vector2$vec2, x * 1, (y * 1) - 0.35) : A2(elm_explorations$linear_algebra$Math$Vector2$vec2, x * 1, (y * 1) + 0.35));
		}(
			A3(
				elm$core$Tuple$mapBoth,
				elm$core$Basics$toFloat,
				elm$core$Basics$toFloat,
				A2(author$project$Game$heroDir, session, model)));
	});
var author$project$Game$makeBullet = F3(
	function (kind, heroPos, aimPos) {
		return {
			age: 0,
			angle: elm$core$Basics$toPolar(
				author$project$Game$vec2ToTuple(
					A2(elm_explorations$linear_algebra$Math$Vector2$sub, aimPos, heroPos))).b,
			kind: kind,
			pos: heroPos
		};
	});
var author$project$Game$makePlayerBullets = F3(
	function (session, delta, model) {
		return (model.isMouseDown && (_Utils_eq(model.equipped, author$project$Game$Gun) && (model.waterAmt > 1))) ? ((_Utils_cmp(
			model.timeSinceLastFire,
			1 / ((model.fireRateLevel / 2) * session.c.getFloat('waterGun:fireRate'))) > 0) ? _Utils_update(
			model,
			{
				bullets: A2(
					elm$core$List$cons,
					function (bullet) {
						return _Utils_update(
							bullet,
							{
								pos: A2(
									elm_explorations$linear_algebra$Math$Vector2$add,
									bullet.pos,
									A2(author$project$Game$barrelPos, session, model))
							});
					}(
						A3(
							author$project$Game$makeBullet,
							author$project$Game$PlayerBullet,
							model.hero.pos,
							A2(author$project$Game$mouseGamePos, session, model))),
					model.bullets),
				timeSinceLastFire: 0,
				waterAmt: model.waterAmt - 1
			}) : _Utils_update(
			model,
			{timeSinceLastFire: model.timeSinceLastFire + delta})) : _Utils_update(
			model,
			{timeSinceLastFire: model.timeSinceLastFire + delta});
	});
var author$project$Common$Arc = F3(
	function (a, b, c) {
		return {$: 'Arc', a: a, b: b, c: c};
	});
var author$project$Game$scythePoints = F2(
	function (session, model) {
		var mouseAngle = A2(author$project$Game$mouseAngleToHero, session, model);
		var heroPos = model.hero.pos;
		var height = 2;
		var tippyTop = A2(
			elm_explorations$linear_algebra$Math$Vector2$add,
			heroPos,
			author$project$Game$tupleToVec2(
				function (_n4) {
					var x = _n4.x;
					var y = _n4.y;
					return function (_n5) {
						var r = _n5.a;
						var o = _n5.b;
						return elm$core$Basics$fromPolar(
							_Utils_Tuple2(r, o + mouseAngle));
					}(
						elm$core$Basics$toPolar(
							_Utils_Tuple2(x, y)));
				}(
					elm_explorations$linear_algebra$Math$Vector2$toRecord(
						A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 1.5 * height, 0)))));
		var halfWidth = 1;
		var leftCorner = A2(
			elm_explorations$linear_algebra$Math$Vector2$add,
			heroPos,
			author$project$Game$tupleToVec2(
				function (_n2) {
					var x = _n2.x;
					var y = _n2.y;
					return function (_n3) {
						var r = _n3.a;
						var o = _n3.b;
						return elm$core$Basics$fromPolar(
							_Utils_Tuple2(r, o + mouseAngle));
					}(
						elm$core$Basics$toPolar(
							_Utils_Tuple2(x, y)));
				}(
					elm_explorations$linear_algebra$Math$Vector2$toRecord(
						A2(elm_explorations$linear_algebra$Math$Vector2$vec2, height, -halfWidth)))));
		var rightCorner = A2(
			elm_explorations$linear_algebra$Math$Vector2$add,
			heroPos,
			author$project$Game$tupleToVec2(
				function (_n0) {
					var x = _n0.x;
					var y = _n0.y;
					return function (_n1) {
						var r = _n1.a;
						var o = _n1.b;
						return elm$core$Basics$fromPolar(
							_Utils_Tuple2(r, o + mouseAngle));
					}(
						elm$core$Basics$toPolar(
							_Utils_Tuple2(x, y)));
				}(
					elm_explorations$linear_algebra$Math$Vector2$toRecord(
						A2(elm_explorations$linear_algebra$Math$Vector2$vec2, height, halfWidth)))));
		return _Utils_Tuple3(leftCorner, tippyTop, rightCorner);
	});
var author$project$Game$makeSlashEffect = F2(
	function (session, model) {
		var heroPos = model.hero.pos;
		var height = 2;
		var halfWidth = 1;
		var _n0 = A2(author$project$Game$scythePoints, session, model);
		var leftCorner = _n0.a;
		var tippyTop = _n0.b;
		var rightCorner = _n0.c;
		return {
			alpha: 1,
			bgColor: '#ffffff',
			height: 100,
			lineStyleAlpha: 1,
			lineStyleColor: '#000000',
			lineStyleWidth: 0,
			shape: A3(author$project$Common$Arc, leftCorner, tippyTop, rightCorner),
			width: 60,
			x: elm_explorations$linear_algebra$Math$Vector2$getX(model.hero.pos),
			y: elm_explorations$linear_algebra$Math$Vector2$getY(model.hero.pos)
		};
	});
var author$project$Game$PlantBullet = {$: 'PlantBullet'};
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm_community$list_extra$List$Extra$minimumBy = F2(
	function (f, ls) {
		var minBy = F2(
			function (x, _n1) {
				var y = _n1.a;
				var fy = _n1.b;
				var fx = f(x);
				return (_Utils_cmp(fx, fy) < 0) ? _Utils_Tuple2(x, fx) : _Utils_Tuple2(y, fy);
			});
		if (ls.b) {
			if (!ls.b.b) {
				var l_ = ls.a;
				return elm$core$Maybe$Just(l_);
			} else {
				var l_ = ls.a;
				var ls_ = ls.b;
				return elm$core$Maybe$Just(
					A3(
						elm$core$List$foldl,
						minBy,
						_Utils_Tuple2(
							l_,
							f(l_)),
						ls_).a);
			}
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Game$makeTurretBullets = F3(
	function (session, delta, model) {
		var _n0 = A3(
			elm$core$List$foldl,
			F2(
				function (crop, _n1) {
					var bullets = _n1.a;
					var crops = _n1.b;
					var _n2 = _Utils_Tuple2(crop.state, crop.kind);
					if ((_n2.a.$ === 'Mature') && (_n2.b.$ === 'Turret')) {
						var _n3 = _n2.a;
						var timeSinceLastFire = _n2.b.a.timeSinceLastFire;
						var shotBullet = (timeSinceLastFire > 0.2) ? A2(
							elm$core$Maybe$andThen,
							function (closestCreep) {
								return (_Utils_cmp(
									A2(
										elm_explorations$linear_algebra$Math$Vector2$distanceSquared,
										closestCreep.pos,
										author$project$Game$vec2FromTilePos(crop.pos)),
									A2(elm$core$Basics$pow, 5, 2)) < 0) ? elm$core$Maybe$Just(
									A3(
										author$project$Game$makeBullet,
										author$project$Game$PlantBullet,
										author$project$Game$vec2FromTilePos(crop.pos),
										closestCreep.pos)) : elm$core$Maybe$Nothing;
							},
							A2(
								elm_community$list_extra$List$Extra$minimumBy,
								function (closestCreep) {
									return A2(
										elm_explorations$linear_algebra$Math$Vector2$distanceSquared,
										closestCreep.pos,
										author$project$Game$vec2FromTilePos(crop.pos));
								},
								model.creeps)) : elm$core$Maybe$Nothing;
						if (shotBullet.$ === 'Just') {
							var bullet = shotBullet.a;
							return _Utils_Tuple2(
								A2(elm$core$List$cons, bullet, bullets),
								A2(
									elm$core$List$cons,
									_Utils_update(
										crop,
										{
											kind: author$project$Game$Turret(
												{timeSinceLastFire: 0})
										}),
									crops));
						} else {
							return _Utils_Tuple2(
								bullets,
								A2(
									elm$core$List$cons,
									_Utils_update(
										crop,
										{
											kind: author$project$Game$Turret(
												{timeSinceLastFire: timeSinceLastFire + delta})
										}),
									crops));
						}
					} else {
						return _Utils_Tuple2(
							bullets,
							A2(elm$core$List$cons, crop, crops));
					}
				}),
			_Utils_Tuple2(model.bullets, _List_Nil),
			model.crops);
		var newBullets = _n0.a;
		var newCrops = _n0.b;
		return _Utils_update(
			model,
			{bullets: newBullets, crops: newCrops});
	});
var author$project$Game$moveBullets = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				bullets: A2(
					elm$core$List$filterMap,
					function (bullet) {
						var newAge = bullet.age + delta;
						var _n0 = function () {
							var _n1 = bullet.kind;
							if (_n1.$ === 'PlayerBullet') {
								return _Utils_Tuple2(
									session.c.getFloat('waterGun:bulletSpeed'),
									session.c.getFloat('waterGun:bulletMaxAge') * model.rangeLevel);
							} else {
								return _Utils_Tuple2(
									session.c.getFloat('crops:turret:bulletSpeed'),
									session.c.getFloat('crops:turret:bulletMaxAge'));
							}
						}();
						var speed = _n0.a;
						var maxAge = _n0.b;
						return (_Utils_cmp(newAge, maxAge) > 0) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
							_Utils_update(
								bullet,
								{
									age: bullet.age + delta,
									pos: A2(
										elm_explorations$linear_algebra$Math$Vector2$add,
										author$project$Game$tupleToVec2(
											elm$core$Basics$fromPolar(
												_Utils_Tuple2(speed * delta, bullet.angle))),
										bullet.pos)
								}));
					},
					model.bullets)
			});
	});
var elm$random$Random$map = F2(
	function (func, _n0) {
		var genA = _n0.a;
		return elm$random$Random$Generator(
			function (seed0) {
				var _n1 = genA(seed0);
				var a = _n1.a;
				var seed1 = _n1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var elm$random$Random$map2 = F3(
	function (func, _n0, _n1) {
		var genA = _n0.a;
		var genB = _n1.a;
		return elm$random$Random$Generator(
			function (seed0) {
				var _n2 = genA(seed0);
				var a = _n2.a;
				var seed1 = _n2.b;
				var _n3 = genB(seed1);
				var b = _n3.a;
				var seed2 = _n3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var elm$random$Random$pair = F2(
	function (genA, genB) {
		return A3(
			elm$random$Random$map2,
			F2(
				function (a, b) {
					return _Utils_Tuple2(a, b);
				}),
			genA,
			genB);
	});
var author$project$Game$vec2OffsetGenerator = F2(
	function (min, max) {
		return A2(
			elm$random$Random$map,
			author$project$Game$tupleToVec2,
			A2(
				elm$random$Random$pair,
				A2(elm$random$Random$float, min, max),
				A2(elm$random$Random$float, min, max)));
	});
var elm_explorations$linear_algebra$Math$Vector2$direction = _MJS_v2direction;
var author$project$Game$moveCreep = F4(
	function (session, model, delta, creep) {
		var _n0 = creep.path;
		if (!_n0.b) {
			return creep;
		} else {
			var nextTilePos = _n0.a;
			var rest = _n0.b;
			var speed = ((session.c.getFloat('creeps:global:speed') * session.c.getFloat('creeps:attacker:melee:speed')) * 0.4) * (1.1 + elm$core$Basics$sin(10 * creep.age));
			var _n1 = A2(
				elm$random$Random$step,
				A2(author$project$Game$vec2OffsetGenerator, -0.5, 0.5),
				creep.seed);
			var offset = _n1.a;
			var newSeed = _n1.b;
			var nextPos = A2(
				elm_explorations$linear_algebra$Math$Vector2$add,
				offset,
				author$project$Game$vec2FromTilePos(nextTilePos));
			var distToTravel = A2(elm_explorations$linear_algebra$Math$Vector2$distance, creep.pos, nextPos);
			var deltaNeededToTravel = distToTravel / speed;
			return (_Utils_cmp(deltaNeededToTravel, delta) < 0) ? _Utils_update(
				creep,
				{
					path: A2(elm$core$List$drop, 1, creep.path),
					pos: nextPos,
					seed: newSeed
				}) : _Utils_update(
				creep,
				{
					pos: A2(
						elm_explorations$linear_algebra$Math$Vector2$add,
						creep.pos,
						A2(
							elm_explorations$linear_algebra$Math$Vector2$scale,
							(-delta) * speed,
							A2(elm_explorations$linear_algebra$Math$Vector2$direction, creep.pos, nextPos)))
				});
		}
	});
var author$project$Game$moveCreeps = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				creeps: A2(
					elm$core$List$map,
					A3(author$project$Game$moveCreep, session, model, delta),
					model.creeps)
			});
	});
var author$project$Common$heroDirInput = function (keysPressed) {
	return elm_explorations$linear_algebra$Math$Vector2$fromRecord(
		{
			x: (A2(elm$core$Set$member, 'ArrowLeft', keysPressed) || A2(elm$core$Set$member, 'a', keysPressed)) ? (-1) : ((A2(elm$core$Set$member, 'ArrowRight', keysPressed) || A2(elm$core$Set$member, 'd', keysPressed)) ? 1 : 0),
			y: (A2(elm$core$Set$member, 'ArrowUp', keysPressed) || A2(elm$core$Set$member, 'w', keysPressed)) ? 1 : ((A2(elm$core$Set$member, 'ArrowDown', keysPressed) || A2(elm$core$Set$member, 's', keysPressed)) ? (-1) : 0)
		});
};
var author$project$Collision$neg = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return _Utils_Tuple2(-x, -y);
};
var author$project$Collision$sub = F2(
	function (_n0, _n1) {
		var ax = _n0.a;
		var ay = _n0.b;
		var bx = _n1.a;
		var by = _n1.b;
		return _Utils_Tuple2(bx - ax, by - ay);
	});
var author$project$Collision$calcMinkSupport = F3(
	function (_n0, _n1, d) {
		var objA = _n0.a;
		var suppA = _n0.b;
		var objB = _n1.a;
		var suppB = _n1.b;
		var maybep2 = A2(suppB, objB, d);
		var maybep1 = A2(
			suppA,
			objA,
			author$project$Collision$neg(d));
		var _n2 = _Utils_Tuple2(maybep1, maybep2);
		if ((_n2.a.$ === 'Just') && (_n2.b.$ === 'Just')) {
			var p1 = _n2.a.a;
			var p2 = _n2.b.a;
			return elm$core$Maybe$Just(
				A2(author$project$Collision$sub, p1, p2));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Collision$dot = F2(
	function (_n0, _n1) {
		var x1 = _n0.a;
		var y1 = _n0.b;
		var x2 = _n1.a;
		var y2 = _n1.b;
		return (x1 * x2) + (y1 * y2);
	});
var author$project$Collision$from = F2(
	function (_n0, _n1) {
		var ax = _n0.a;
		var ay = _n0.b;
		var bx = _n1.a;
		var by = _n1.b;
		return _Utils_Tuple2(bx - ax, by - ay);
	});
var author$project$Collision$isSameDirection = F2(
	function (a, b) {
		return A2(author$project$Collision$dot, a, b) > 0;
	});
var author$project$Collision$mul = F2(
	function (n, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(n * x, n * y);
	});
var author$project$Collision$trip = F3(
	function (a, b, c) {
		var cab = A2(
			author$project$Collision$mul,
			A2(author$project$Collision$dot, a, b),
			c);
		var bac = A2(
			author$project$Collision$mul,
			A2(author$project$Collision$dot, a, c),
			b);
		return A2(author$project$Collision$sub, cab, bac);
	});
var author$project$Collision$perp = F2(
	function (a, b) {
		return A3(author$project$Collision$trip, a, b, a);
	});
var author$project$Collision$handle0Simplex = F2(
	function (a, b) {
		var ab = A2(author$project$Collision$from, a, b);
		var a0 = author$project$Collision$neg(a);
		var _n0 = A2(author$project$Collision$isSameDirection, ab, a0) ? _Utils_Tuple2(
			_List_fromArray(
				[a, b]),
			A2(author$project$Collision$perp, ab, a0)) : _Utils_Tuple2(
			_List_fromArray(
				[a]),
			a0);
		var newSim = _n0.a;
		var newDir = _n0.b;
		return _Utils_Tuple2(
			false,
			_Utils_Tuple2(newSim, newDir));
	});
var author$project$Collision$handle1Simplex = F3(
	function (a, b, c) {
		var ac = A2(author$project$Collision$from, a, c);
		var ab = A2(author$project$Collision$from, a, b);
		var abp = A2(
			author$project$Collision$perp,
			ab,
			author$project$Collision$neg(ac));
		var acp = A2(
			author$project$Collision$perp,
			ac,
			author$project$Collision$neg(ab));
		var a0 = author$project$Collision$neg(a);
		return A2(author$project$Collision$isSameDirection, abp, a0) ? (A2(author$project$Collision$isSameDirection, ab, a0) ? _Utils_Tuple2(
			false,
			_Utils_Tuple2(
				_List_fromArray(
					[a, b]),
				abp)) : _Utils_Tuple2(
			false,
			_Utils_Tuple2(
				_List_fromArray(
					[a]),
				a0))) : (A2(author$project$Collision$isSameDirection, acp, a0) ? (A2(author$project$Collision$isSameDirection, ac, a0) ? _Utils_Tuple2(
			false,
			_Utils_Tuple2(
				_List_fromArray(
					[a, c]),
				acp)) : _Utils_Tuple2(
			false,
			_Utils_Tuple2(
				_List_fromArray(
					[a]),
				a0))) : _Utils_Tuple2(
			true,
			_Utils_Tuple2(
				_List_fromArray(
					[b, c]),
				a0)));
	});
var author$project$Collision$enclosesOrigin = F2(
	function (a, sim) {
		_n0$2:
		while (true) {
			if (sim.b) {
				if (!sim.b.b) {
					var b = sim.a;
					return A2(author$project$Collision$handle0Simplex, a, b);
				} else {
					if (!sim.b.b.b) {
						var b = sim.a;
						var _n1 = sim.b;
						var c = _n1.a;
						return A3(author$project$Collision$handle1Simplex, a, b, c);
					} else {
						break _n0$2;
					}
				}
			} else {
				break _n0$2;
			}
		}
		return _Utils_Tuple2(
			false,
			_Utils_Tuple2(
				sim,
				_Utils_Tuple2(0, 0)));
	});
var author$project$Collision$doSimplex = F5(
	function (limit, depth, minkA, minkB, _n3) {
		var sim = _n3.a;
		var d = _n3.b;
		var maybea = A3(author$project$Collision$calcMinkSupport, minkA, minkB, d);
		if (maybea.$ === 'Just') {
			var a = maybea.a;
			return A6(
				author$project$Collision$doSimplex2,
				limit,
				depth,
				minkA,
				minkB,
				_Utils_Tuple2(sim, d),
				a);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Collision$doSimplex2 = F6(
	function (limit, depth, minkA, minkB, _n0, a) {
		var sim = _n0.a;
		var d = _n0.b;
		var notPastOrig = A2(author$project$Collision$dot, a, d) < 0;
		var _n1 = A2(author$project$Collision$enclosesOrigin, a, sim);
		var intersects = _n1.a;
		var _n2 = _n1.b;
		var newSim = _n2.a;
		var newDir = _n2.b;
		return notPastOrig ? elm$core$Maybe$Just(
			_Utils_Tuple2(
				false,
				_Utils_Tuple2(
					_List_Nil,
					_Utils_Tuple2(depth, depth)))) : (intersects ? elm$core$Maybe$Just(
			_Utils_Tuple2(
				true,
				_Utils_Tuple2(sim, a))) : ((_Utils_cmp(depth, limit) > 0) ? elm$core$Maybe$Just(
			_Utils_Tuple2(
				false,
				_Utils_Tuple2(newSim, newDir))) : A5(
			author$project$Collision$doSimplex,
			limit,
			depth + 1,
			minkA,
			minkB,
			_Utils_Tuple2(newSim, newDir))));
	});
var author$project$Collision$getDirectionVector = F2(
	function (_n0, _n1) {
		var x1 = _n0.a;
		var y1 = _n0.b;
		var x2 = _n1.a;
		var y2 = _n1.b;
		var d = A3(
			author$project$Collision$trip,
			_Utils_Tuple2(x1, y1),
			_Utils_Tuple2(x2, y2),
			_Utils_Tuple2(x1, y1));
		var collinear = _Utils_eq(
			d,
			_Utils_Tuple2(0, 0));
		return collinear ? _Utils_Tuple2(y1, -x1) : d;
	});
var author$project$Collision$collision2 = F5(
	function (limit, minkA, minkB, c, b) {
		var cb = A2(author$project$Collision$from, c, b);
		var c0 = author$project$Collision$neg(c);
		var d = A2(author$project$Collision$getDirectionVector, cb, c0);
		var simplexResult = A5(
			author$project$Collision$doSimplex,
			limit,
			0,
			minkA,
			minkB,
			_Utils_Tuple2(
				_List_fromArray(
					[b, c]),
				d));
		if (simplexResult.$ === 'Just') {
			var _n1 = simplexResult.a;
			var intersects = _n1.a;
			return elm$core$Maybe$Just(intersects);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Collision$collision = F3(
	function (limit, minkA, minkB) {
		var d1 = _Utils_Tuple2(1.0, 0.0);
		var d2 = author$project$Collision$neg(d1);
		var maybeb = A3(author$project$Collision$calcMinkSupport, minkA, minkB, d2);
		var maybec = A3(author$project$Collision$calcMinkSupport, minkA, minkB, d1);
		var _n0 = _Utils_Tuple2(maybec, maybeb);
		if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
			var c = _n0.a.a;
			var b = _n0.b.a;
			return A5(author$project$Collision$collision2, limit, minkA, minkB, c, b);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Game$heroRad = 0.4;
var author$project$Game$isPassable = function (tile) {
	switch (tile.$) {
		case 'Water':
			return false;
		case 'Grass':
			return true;
		default:
			return false;
	}
};
var author$project$Game$polyFromSquare = F2(
	function (center, halfLength) {
		return function (_n0) {
			var x = _n0.x;
			var y = _n0.y;
			return _List_fromArray(
				[
					_Utils_Tuple2(x + halfLength, y - halfLength),
					_Utils_Tuple2(x + halfLength, y + halfLength),
					_Utils_Tuple2(x - halfLength, y + halfLength),
					_Utils_Tuple2(x - halfLength, y - halfLength)
				]);
		}(
			elm_explorations$linear_algebra$Math$Vector2$toRecord(center));
	});
var author$project$Game$dot = F2(
	function (_n0, _n1) {
		var x1 = _n0.a;
		var y1 = _n0.b;
		var x2 = _n1.a;
		var y2 = _n1.b;
		return (x1 * x2) + (y1 * y2);
	});
var elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$max, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Game$polySupport = F2(
	function (list, d) {
		var dotList = A2(
			elm$core$List$map,
			author$project$Game$dot(d),
			list);
		var decorated = A3(elm$core$List$map2, elm$core$Tuple$pair, dotList, list);
		var max = elm$core$List$maximum(decorated);
		if (max.$ === 'Just') {
			var _n1 = max.a;
			var m = _n1.a;
			var p = _n1.b;
			return elm$core$Maybe$Just(p);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var author$project$Game$isHeroColliding = F2(
	function (model, heroPos) {
		var heroPoly = A2(author$project$Game$polyFromSquare, heroPos, author$project$Game$heroRad);
		return function (doesCollide) {
			return doesCollide ? true : A2(
				elm$core$List$any,
				function (_n3) {
					var x = _n3.a;
					var y = _n3.b;
					return A2(
						elm$core$Maybe$withDefault,
						false,
						A3(
							author$project$Collision$collision,
							10,
							_Utils_Tuple2(heroPoly, author$project$Game$polySupport),
							_Utils_Tuple2(
								A2(
									author$project$Game$polyFromSquare,
									A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5 + x, 0.5 + y),
									0.5),
								author$project$Game$polySupport)));
				},
				function (_n2) {
					var x = _n2.a;
					var y = _n2.b;
					return _List_fromArray(
						[
							_Utils_Tuple2(x - 1, y - 1),
							_Utils_Tuple2(x - 1, y),
							_Utils_Tuple2(x - 1, y + 1),
							_Utils_Tuple2(x, y - 1),
							_Utils_Tuple2(x + 1, y - 1),
							_Utils_Tuple2(x + 1, y),
							_Utils_Tuple2(x + 1, y + 1)
						]);
				}(model.base.pos));
		}(
			A2(
				elm$core$List$any,
				function (_n1) {
					var x = _n1.a;
					var y = _n1.b;
					return author$project$Game$isPassable(
						A2(
							elm$core$Maybe$withDefault,
							author$project$Common$Water,
							A2(
								elm$core$Dict$get,
								_Utils_Tuple2(x, y),
								model.map))) ? false : A2(
						elm$core$Maybe$withDefault,
						false,
						A3(
							author$project$Collision$collision,
							10,
							_Utils_Tuple2(heroPoly, author$project$Game$polySupport),
							_Utils_Tuple2(
								A2(
									author$project$Game$polyFromSquare,
									A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5 + x, 0.1 + y),
									0.5),
								author$project$Game$polySupport)));
				},
				function (_n0) {
					var x = _n0.a;
					var y = _n0.b;
					return _List_fromArray(
						[
							_Utils_Tuple2(x - 1, y - 1),
							_Utils_Tuple2(x - 1, y),
							_Utils_Tuple2(x - 1, y + 1),
							_Utils_Tuple2(x, y - 1),
							_Utils_Tuple2(x, y),
							_Utils_Tuple2(x, y + 1),
							_Utils_Tuple2(x + 1, y - 1),
							_Utils_Tuple2(x + 1, y),
							_Utils_Tuple2(x + 1, y + 1)
						]);
				}(
					A3(
						elm$core$Tuple$mapBoth,
						elm$core$Basics$round,
						elm$core$Basics$round,
						author$project$Game$vec2ToTuple(
							A2(
								elm_explorations$linear_algebra$Math$Vector2$add,
								A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, -0.5),
								heroPos))))));
	});
var elm$core$Basics$not = _Basics_not;
var elm_explorations$linear_algebra$Math$Vector2$length = _MJS_v2length;
var elm_explorations$linear_algebra$Math$Vector2$normalize = _MJS_v2normalize;
var elm_explorations$linear_algebra$Math$Vector2$setY = _MJS_v2setY;
var author$project$Game$moveHero = F3(
	function (session, delta, model) {
		var newAcc = A2(
			elm_explorations$linear_algebra$Math$Vector2$scale,
			session.c.getFloat('hero:acceleration'),
			function (input) {
				return A2(
					elm_explorations$linear_algebra$Math$Vector2$setY,
					(-1) * elm_explorations$linear_algebra$Math$Vector2$getY(input),
					input);
			}(
				author$project$Common$heroDirInput(session.keysPressed)));
		var newVelUncapped = A2(
			elm_explorations$linear_algebra$Math$Vector2$scale,
			delta,
			A2(elm_explorations$linear_algebra$Math$Vector2$add, model.hero.vel, newAcc));
		var newVel = (_Utils_cmp(
			elm_explorations$linear_algebra$Math$Vector2$length(newVelUncapped),
			session.c.getFloat('hero:maxSpeed')) > 0) ? A2(
			elm_explorations$linear_algebra$Math$Vector2$scale,
			session.c.getFloat('hero:maxSpeed'),
			elm_explorations$linear_algebra$Math$Vector2$normalize(newVelUncapped)) : newVelUncapped;
		var newPos = A2(
			elm_explorations$linear_algebra$Math$Vector2$add,
			model.hero.pos,
			A2(elm_explorations$linear_algebra$Math$Vector2$scale, delta, newVel));
		var heroInput = function (input) {
			return A2(
				elm_explorations$linear_algebra$Math$Vector2$setY,
				(-1) * elm_explorations$linear_algebra$Math$Vector2$getY(input),
				input);
		}(
			author$project$Common$heroDirInput(session.keysPressed));
		var hero = model.hero;
		var _n0 = (!A2(author$project$Game$isHeroColliding, model, newPos)) ? _Utils_Tuple2(newPos, newVel) : ((!A2(
			author$project$Game$isHeroColliding,
			model,
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				elm_explorations$linear_algebra$Math$Vector2$getX(newPos),
				elm_explorations$linear_algebra$Math$Vector2$getY(hero.pos)))) ? _Utils_Tuple2(
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				elm_explorations$linear_algebra$Math$Vector2$getX(newPos),
				elm_explorations$linear_algebra$Math$Vector2$getY(hero.pos)),
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				elm_explorations$linear_algebra$Math$Vector2$getX(newVel),
				0)) : ((!A2(
			author$project$Game$isHeroColliding,
			model,
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				elm_explorations$linear_algebra$Math$Vector2$getX(hero.pos),
				elm_explorations$linear_algebra$Math$Vector2$getY(newPos)))) ? _Utils_Tuple2(
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				elm_explorations$linear_algebra$Math$Vector2$getX(hero.pos),
				elm_explorations$linear_algebra$Math$Vector2$getY(newPos)),
			A2(
				elm_explorations$linear_algebra$Math$Vector2$vec2,
				0,
				elm_explorations$linear_algebra$Math$Vector2$getY(newVel))) : _Utils_Tuple2(
			hero.pos,
			A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0))));
		var newestPos = _n0.a;
		var newestVel = _n0.b;
		var newHero = _Utils_update(
			hero,
			{pos: newestPos, vel: newestVel});
		return _Utils_update(
			model,
			{hero: newHero});
	});
var author$project$Game$heroWaterMax = F2(
	function (session, model) {
		return elm$core$Basics$round(
			session.c.getFloat('waterGun:maxCapacity')) * model.capacityLevel;
	});
var author$project$Game$getTilesSurroundingVec2 = F2(
	function (model, pos) {
		return A2(
			elm$core$List$map,
			function (neighborPos) {
				return A2(
					elm$core$Maybe$withDefault,
					author$project$Common$Water,
					A2(elm$core$Dict$get, neighborPos, model.map));
			},
			function (_n0) {
				var x = _n0.a;
				var y = _n0.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(x - 1, y - 1),
						_Utils_Tuple2(x - 1, y),
						_Utils_Tuple2(x - 1, y + 1),
						_Utils_Tuple2(x, y - 1),
						_Utils_Tuple2(x, y),
						_Utils_Tuple2(x, y + 1),
						_Utils_Tuple2(x + 1, y - 1),
						_Utils_Tuple2(x + 1, y),
						_Utils_Tuple2(x + 1, y + 1)
					]);
			}(
				A3(
					elm$core$Tuple$mapBoth,
					elm$core$Basics$round,
					elm$core$Basics$round,
					author$project$Game$vec2ToTuple(
						A2(
							elm_explorations$linear_algebra$Math$Vector2$add,
							A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, -0.5),
							pos)))));
	});
var author$project$Game$nearbyWater = function (model) {
	return A2(
		elm$core$List$any,
		function (tile) {
			return _Utils_eq(tile, author$project$Common$Water);
		},
		A2(author$project$Game$getTilesSurroundingVec2, model, model.hero.pos));
};
var author$project$Game$refillWater = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				waterAmt: author$project$Game$nearbyWater(model) ? A2(
					elm$core$Basics$min,
					model.waterAmt + (delta * session.c.getFloat('waterGun:refillRate')),
					A2(author$project$Game$heroWaterMax, session, model)) : model.waterAmt
			});
	});
var author$project$Game$creepRad = 0.4;
var author$project$Game$getSlashPoly = F2(
	function (session, model) {
		var _n0 = A2(author$project$Game$scythePoints, session, model);
		var leftCorner = _n0.a;
		var tippyTop = _n0.b;
		var rightCorner = _n0.c;
		return A2(
			elm$core$List$map,
			author$project$Game$vec2ToTuple,
			_List_fromArray(
				[leftCorner, tippyTop, rightCorner, model.hero.pos]));
	});
var author$project$Game$slashCreeps = F2(
	function (session, model) {
		var slashPoly = A2(author$project$Game$getSlashPoly, session, model);
		return A2(
			elm$core$List$filterMap,
			function (creep) {
				if (A2(
					elm$core$Maybe$withDefault,
					false,
					A3(
						author$project$Collision$collision,
						10,
						_Utils_Tuple2(slashPoly, author$project$Game$polySupport),
						_Utils_Tuple2(
							A2(author$project$Game$polyFromSquare, creep.pos, author$project$Game$creepRad),
							author$project$Game$polySupport)))) {
					var pushback = author$project$Game$tupleToVec2(
						elm$core$Basics$fromPolar(
							_Utils_Tuple2(
								0.5,
								A2(author$project$Game$mouseAngleToHero, session, model))));
					var damagedCreep = _Utils_update(
						creep,
						{
							healthAmt: creep.healthAmt - 2,
							pos: A2(elm_explorations$linear_algebra$Math$Vector2$add, creep.pos, pushback)
						});
					return (damagedCreep.healthAmt > 0) ? elm$core$Maybe$Just(damagedCreep) : elm$core$Maybe$Nothing;
				} else {
					return elm$core$Maybe$Just(creep);
				}
			},
			model.creeps);
	});
var author$project$Game$HarvestFx = {$: 'HarvestFx'};
var elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_n0, _n1) {
			var x = _n0.a;
			var y = _n0.b;
			var xs = _n1.a;
			var ys = _n1.b;
			return _Utils_Tuple2(
				A2(elm$core$List$cons, x, xs),
				A2(elm$core$List$cons, y, ys));
		});
	return A3(
		elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var author$project$Game$slashCrops = F2(
	function (session, model) {
		var slashPoly = A2(author$project$Game$getSlashPoly, session, model);
		return function (_n3) {
			var maybeCrops = _n3.a;
			var maybeFxs = _n3.b;
			return _Utils_Tuple2(
				A2(elm$core$List$filterMap, elm$core$Basics$identity, maybeCrops),
				A2(elm$core$List$filterMap, elm$core$Basics$identity, maybeFxs));
		}(
			elm$core$List$unzip(
				A2(
					elm$core$List$map,
					function (crop) {
						var _n0 = _Utils_Tuple2(crop.state, crop.kind);
						if ((_n0.a.$ === 'Mature') && (_n0.b.$ === 'MoneyCrop')) {
							var _n1 = _n0.a;
							var _n2 = _n0.b;
							return A2(
								elm$core$Maybe$withDefault,
								false,
								A3(
									author$project$Collision$collision,
									10,
									_Utils_Tuple2(slashPoly, author$project$Game$polySupport),
									_Utils_Tuple2(
										A2(
											author$project$Game$polyFromSquare,
											author$project$Game$vec2FromTilePos(crop.pos),
											0.5),
										author$project$Game$polySupport))) ? _Utils_Tuple2(
								elm$core$Maybe$Nothing,
								elm$core$Maybe$Just(
									A2(
										author$project$Game$DrawFx,
										author$project$Game$vec2FromTilePos(crop.pos),
										author$project$Game$HarvestFx))) : _Utils_Tuple2(
								elm$core$Maybe$Just(crop),
								elm$core$Maybe$Nothing);
						} else {
							return _Utils_Tuple2(
								elm$core$Maybe$Just(crop),
								elm$core$Maybe$Nothing);
						}
					},
					model.crops)));
	});
var author$project$Game$soilAbsorbWaterFromBullets = F3(
	function (session, delta, model) {
		return _Utils_update(
			model,
			{
				crops: A2(
					elm$core$List$map,
					function (crop) {
						var _n0 = crop.state;
						if (_n0.$ === 'Seedling') {
							var seedlingData = _n0.a;
							var numBullets = elm$core$List$length(
								A2(
									elm$core$List$filter,
									function (bullet) {
										return _Utils_eq(bullet.kind, author$project$Game$PlayerBullet) && _Utils_eq(
											crop.pos,
											A3(
												elm$core$Tuple$mapBoth,
												elm$core$Basics$floor,
												elm$core$Basics$floor,
												author$project$Game$vec2ToTuple(bullet.pos)));
									},
									model.bullets));
							return _Utils_update(
								crop,
								{
									state: author$project$Game$Seedling(
										_Utils_update(
											seedlingData,
											{
												waterInSoil: A2(elm$core$Basics$min, (delta * numBullets) + seedlingData.waterInSoil, seedlingData.waterCapacity)
											}))
								});
						} else {
							return crop;
						}
					},
					model.crops)
			});
	});
var author$project$Game$spawnCreeps = F3(
	function (session, delta, model) {
		var _n0 = A3(
			elm$core$List$foldl,
			F2(
				function (enemyTower, _n1) {
					var enemyTowers = _n1.a;
					var creeps = _n1.b;
					if (_Utils_cmp(
						enemyTower.timeSinceLastSpawn + delta,
						session.c.getFloat('enemyBase:secondsBetweenSpawnsAtDay')) > 0) {
						var seed = elm$random$Random$initialSeed(
							elm$core$Basics$round(1000 * delta));
						return _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_update(
									enemyTower,
									{timeSinceLastSpawn: 0}),
								enemyTowers),
							A2(
								elm$core$List$cons,
								{
									age: 0,
									healthAmt: session.c.getFloat('creeps:global:health') * session.c.getFloat('creeps:attacker:melee:health'),
									healthMax: session.c.getFloat('creeps:global:health') * session.c.getFloat('creeps:attacker:melee:health'),
									path: enemyTower.pathToBase,
									pos: author$project$Game$vec2FromTilePos(enemyTower.pos),
									seed: seed,
									timeSinceLastHop: 0
								},
								creeps));
					} else {
						return _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_update(
									enemyTower,
									{timeSinceLastSpawn: enemyTower.timeSinceLastSpawn + delta}),
								enemyTowers),
							creeps);
					}
				}),
			_Utils_Tuple2(_List_Nil, _List_Nil),
			model.enemyTowers);
		var newEnemyTowers = _n0.a;
		var newCreeps = _n0.b;
		return _Utils_update(
			model,
			{
				creeps: A2(elm$core$List$append, newCreeps, model.creeps),
				enemyTowers: newEnemyTowers
			});
	});
var author$project$Game$update = F3(
	function (msg, session, model) {
		switch (msg.$) {
			case 'Tick':
				var d = msg.a;
				var delta = A2(elm$core$Basics$min, d / 1000, 0.25);
				return function (updatedModel) {
					return _Utils_Tuple2(
						_Utils_update(
							updatedModel,
							{fx: _List_Nil}),
						_Utils_ap(
							_List_fromArray(
								[
									author$project$Game$DrawSprites(
									A2(author$project$Game$getSprites, session, updatedModel)),
									author$project$Game$DrawHero(
									A2(author$project$Game$drawHero, session, updatedModel)),
									author$project$Game$MoveCamera(updatedModel.hero.pos)
								]),
							updatedModel.fx));
				}(
					A3(
						author$project$Game$checkGameOver,
						session,
						delta,
						A3(
							author$project$Game$checkIfInStore,
							session,
							delta,
							A3(
								author$project$Game$collideBulletsWithEnemyTowers,
								session,
								delta,
								A3(
									author$project$Game$collideBulletsWithCreeps,
									session,
									delta,
									A3(
										author$project$Game$applyCreepDamageToHero,
										session,
										delta,
										A3(
											author$project$Game$applyCreepDamageToBase,
											session,
											delta,
											A3(
												author$project$Game$moveCreeps,
												session,
												delta,
												A3(
													author$project$Game$spawnCreeps,
													session,
													delta,
													A3(
														author$project$Game$moveBullets,
														session,
														delta,
														A3(
															author$project$Game$makePlayerBullets,
															session,
															delta,
															A3(
																author$project$Game$makeTurretBullets,
																session,
																delta,
																A3(
																	author$project$Game$refillWater,
																	session,
																	delta,
																	A3(
																		author$project$Game$moveHero,
																		session,
																		delta,
																		A3(
																			author$project$Game$cropsAbsorbWater,
																			session,
																			delta,
																			A3(
																				author$project$Game$soilAbsorbWaterFromBullets,
																				session,
																				delta,
																				A3(author$project$Game$ageAll, session, delta, model)))))))))))))))));
			case 'KeyUp':
				var str = msg.a;
				return _Utils_Tuple2(
					A2(author$project$Game$applyKeyDown, str, model),
					_List_Nil);
			case 'KeyDown':
				var str = msg.a;
				return _Utils_Tuple2(
					A2(author$project$Game$applyKeyDown, str, model),
					_List_Nil);
			case 'MouseMove':
				var _n1 = msg.a;
				var x = _n1.a;
				var y = _n1.b;
				var mousePos = author$project$Game$tupleToVec2(
					_Utils_Tuple2(x, y));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{mousePos: mousePos}),
					_List_Nil);
			case 'MouseDown':
				return _Utils_Tuple2(
					function (m) {
						var _n2 = _Utils_Tuple3(
							m.equipped,
							A2(author$project$Game$canPlace, session, model),
							A2(author$project$Game$hoveringTilePos, session, m));
						_n2$3:
						while (true) {
							switch (_n2.a.$) {
								case 'MoolahCropSeed':
									if ((_n2.b.$ === 'Can') && (_n2.c.$ === 'Just')) {
										var _n3 = _n2.a;
										var _n4 = _n2.b;
										var tilePos = _n2.c.a;
										return _Utils_update(
											m,
											{
												crops: A2(
													elm$core$List$cons,
													{
														healthAmt: 1,
														healthMax: 1,
														kind: author$project$Game$MoneyCrop,
														pos: tilePos,
														state: author$project$Game$Seedling(
															{
																waterCapacity: session.c.getFloat('crops:soilWaterCapacity'),
																waterConsumed: 0,
																waterInSoil: 0,
																waterNeededToMature: session.c.getFloat('crops:moolah:waterNeededToMature')
															})
													},
													m.crops),
												moolahSeedAmt: model.moolahSeedAmt - 1
											});
									} else {
										break _n2$3;
									}
								case 'TurretSeed':
									if ((_n2.b.$ === 'Can') && (_n2.c.$ === 'Just')) {
										var _n5 = _n2.a;
										var _n6 = _n2.b;
										var tilePos = _n2.c.a;
										return _Utils_update(
											m,
											{
												crops: A2(
													elm$core$List$cons,
													{
														healthAmt: session.c.getFloat('crops:turret:healthMax'),
														healthMax: session.c.getFloat('crops:turret:healthMax'),
														kind: author$project$Game$Turret(
															{timeSinceLastFire: 0}),
														pos: tilePos,
														state: author$project$Game$Seedling(
															{
																waterCapacity: session.c.getFloat('crops:soilWaterCapacity'),
																waterConsumed: 0,
																waterInSoil: 0,
																waterNeededToMature: session.c.getFloat('crops:turret:waterNeededToMature')
															})
													},
													m.crops),
												turretSeedAmt: model.turretSeedAmt - 1
											});
									} else {
										break _n2$3;
									}
								case 'Scythe':
									var _n7 = _n2.a;
									var _n8 = A2(author$project$Game$slashCrops, session, model);
									var crops = _n8.a;
									var fxs = _n8.b;
									return _Utils_update(
										model,
										{
											creeps: A2(author$project$Game$slashCreeps, session, model),
											crops: crops,
											fx: _Utils_ap(fxs, model.fx),
											money: model.money + (elm$core$List$length(fxs) * elm$core$Basics$round(
												session.c.getFloat('crops:moolah:cashValue'))),
											slashEffects: A2(
												elm$core$List$cons,
												_Utils_Tuple2(
													0,
													A2(author$project$Game$makeSlashEffect, session, model)),
												model.slashEffects),
											timeSinceLastSlash: 0
										});
								default:
									break _n2$3;
							}
						}
						return m;
					}(
						_Utils_update(
							model,
							{isMouseDown: true})),
					_List_Nil);
			case 'MouseUp':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isMouseDown: false}),
					_List_Nil);
			case 'TogglePause':
				var shouldPause = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isPaused: shouldPause}),
					_List_Nil);
			case 'Buy':
				var seed = msg.a;
				var cost = msg.b;
				if (_Utils_cmp(model.money, cost) > -1) {
					switch (seed.$) {
						case 'MoolahCropSeed':
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{money: model.money - cost, moolahSeedAmt: model.moolahSeedAmt + 1}),
								_List_Nil);
						case 'TurretSeed':
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{money: model.money - cost, turretSeedAmt: model.turretSeedAmt + 1}),
								_List_Nil);
						default:
							return _Utils_Tuple2(model, _List_Nil);
					}
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 'LeaveMarket':
				var hero = model.hero;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							gameState: author$project$Game$Playing,
							hero: _Utils_update(
								hero,
								{
									healthAmt: hero.healthMax,
									pos: A2(
										elm_explorations$linear_algebra$Math$Vector2$add,
										A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 1),
										hero.pos)
								})
						}),
					_List_Nil);
			case 'ToggleHelp':
				var shouldShow = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isPaused: shouldShow, shouldShowHelp: shouldShow}),
					_List_Nil);
			case 'ClickPlay':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gameState: author$project$Game$Playing, isPaused: true, shouldShowHelp: true}),
					_List_fromArray(
						[
							author$project$Game$DrawSprites(
							A2(author$project$Game$getSprites, session, model)),
							author$project$Game$DrawHero(
							A2(author$project$Game$drawHero, session, model)),
							author$project$Game$MoveCamera(model.hero.pos)
						]));
			default:
				var upgrade = msg.a;
				return _Utils_Tuple2(
					function (m) {
						switch (upgrade.$) {
							case 'Range':
								return _Utils_update(
									m,
									{rangeLevel: m.rangeLevel + 1});
							case 'Capacity':
								return _Utils_update(
									m,
									{capacityLevel: m.capacityLevel + 1});
							default:
								return _Utils_update(
									m,
									{fireRateLevel: m.fireRateLevel + 1});
						}
					}(
						_Utils_update(
							model,
							{
								money: model.money - A3(author$project$Game$costForUpgrade, session, model, upgrade)
							})),
					_List_Nil);
		}
	});
var author$project$Main$MapEditor = function (a) {
	return {$: 'MapEditor', a: a};
};
var author$project$Main$encodeConfigFloat = function (configFloat) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'val',
				elm$json$Json$Encode$float(configFloat.val)),
				_Utils_Tuple2(
				'min',
				elm$json$Json$Encode$float(configFloat.min)),
				_Utils_Tuple2(
				'max',
				elm$json$Json$Encode$float(configFloat.max))
			]));
};
var author$project$Main$encodeTile = function (tile) {
	return elm$json$Json$Encode$string(
		function () {
			switch (tile.$) {
				case 'Grass':
					return 'grass';
				case 'Water':
					return 'water';
				default:
					return 'poop';
			}
		}());
};
var author$project$Main$stringifyTilePos = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return elm$core$String$fromInt(x) + (',' + elm$core$String$fromInt(y));
};
var elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(_Utils_Tuple0),
				dictionary));
	});
var author$project$Main$encodeMap = function (map) {
	return A3(
		elm$json$Json$Encode$dict,
		elm$core$Basics$identity,
		elm$core$Basics$identity,
		elm$core$Dict$fromList(
			A2(
				elm$core$List$map,
				function (_n0) {
					var tilePos = _n0.a;
					var tile = _n0.b;
					return _Utils_Tuple2(
						author$project$Main$stringifyTilePos(tilePos),
						author$project$Main$encodeTile(tile));
				},
				elm$core$Dict$toList(map))));
};
var author$project$Main$encodeTilePos = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$int(x)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$int(y))
			]));
};
var author$project$Main$encodeSavedMap = function (savedMap) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(savedMap.name)),
				_Utils_Tuple2(
				'map',
				author$project$Main$encodeMap(savedMap.map)),
				_Utils_Tuple2(
				'hero',
				author$project$Main$encodeTilePos(savedMap.hero)),
				_Utils_Tuple2(
				'enemyTowers',
				A2(
					elm$json$Json$Encode$list,
					author$project$Main$encodeTilePos,
					elm$core$Set$toList(savedMap.enemyTowers))),
				_Utils_Tuple2(
				'base',
				author$project$Main$encodeTilePos(savedMap.base)),
				_Utils_Tuple2(
				'size',
				author$project$Main$encodeTilePos(savedMap.size))
			]));
};
var author$project$Main$encodePersistence = function (persistence) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'isConfigOpen',
				elm$json$Json$Encode$bool(persistence.isConfigOpen)),
				_Utils_Tuple2(
				'configFloats',
				A3(elm$json$Json$Encode$dict, elm$core$Basics$identity, author$project$Main$encodeConfigFloat, persistence.configFloats)),
				_Utils_Tuple2(
				'savedMaps',
				A2(elm$json$Json$Encode$list, author$project$Main$encodeSavedMap, persistence.savedMaps)),
				_Utils_Tuple2(
				'openConfigAccordions',
				A2(
					elm$json$Json$Encode$list,
					elm$json$Json$Encode$string,
					elm$core$Set$toList(persistence.openConfigAccordions)))
			]));
};
var author$project$Main$modelToPersistence = function (model) {
	return {configFloats: model.session.configFloats, isConfigOpen: model.session.isConfigOpen, openConfigAccordions: model.session.openConfigAccordions, savedMaps: model.session.savedMaps};
};
var author$project$Main$performMapEffects = F3(
	function (session, effects, model) {
		return A2(
			elm$core$Tuple$mapSecond,
			elm$core$Platform$Cmd$batch,
			A3(
				elm$core$List$foldl,
				F2(
					function (effect, _n0) {
						var updatingModel = _n0.a;
						var updatingCmds = _n0.b;
						switch (effect.$) {
							case 'SaveMapEffect':
								var editingMap = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('SAVE')),
															_Utils_Tuple2(
															'persistence',
															author$project$Main$encodePersistence(
																author$project$Main$modelToPersistence(updatingModel)))
														]))
												])),
										updatingCmds));
							case 'PlayMapEffect':
								var editingMap = effect.a;
								return _Utils_Tuple2(updatingModel, updatingCmds);
							case 'ZoomEffect':
								var zoomLevel = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('ZOOM')),
															_Utils_Tuple2(
															'zoomLevel',
															elm$json$Json$Encode$float(zoomLevel))
														]))
												])),
										updatingCmds));
							case 'MoveCamera':
								var pos = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('MOVE_CAMERA')),
															_Utils_Tuple2(
															'x',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getX(pos) * 32)),
															_Utils_Tuple2(
															'y',
															elm$json$Json$Encode$float(
																elm_explorations$linear_algebra$Math$Vector2$getY(pos) * 32))
														]))
												])),
										updatingCmds));
							default:
								var layers = effect.a;
								return _Utils_Tuple2(
									updatingModel,
									A2(
										elm$core$List$cons,
										author$project$Main$performEffects(
											_List_fromArray(
												[
													elm$json$Json$Encode$object(
													_List_fromArray(
														[
															_Utils_Tuple2(
															'id',
															elm$json$Json$Encode$string('DRAW')),
															_Utils_Tuple2(
															'layers',
															A2(elm$json$Json$Encode$list, author$project$Main$encodeSpriteLayer, layers))
														]))
												])),
										updatingCmds));
						}
					}),
				_Utils_Tuple2(model, _List_Nil),
				effects));
	});
var author$project$MapEditor$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var author$project$MapEditor$PencilTool = {$: 'PencilTool'};
var wernerdegroot$listzipper$List$Zipper$Zipper = F3(
	function (a, b, c) {
		return {$: 'Zipper', a: a, b: b, c: c};
	});
var wernerdegroot$listzipper$List$Zipper$next = function (_n0) {
	var ls = _n0.a;
	var x = _n0.b;
	var rs = _n0.c;
	if (!rs.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var y = rs.a;
		var ys = rs.b;
		return elm$core$Maybe$Just(
			A3(
				wernerdegroot$listzipper$List$Zipper$Zipper,
				A2(elm$core$List$cons, x, ls),
				y,
				ys));
	}
};
var wernerdegroot$listzipper$List$Zipper$find = F2(
	function (predicate, zipper) {
		find:
		while (true) {
			var ls = zipper.a;
			var x = zipper.b;
			var rs = zipper.c;
			if (predicate(x)) {
				return elm$core$Maybe$Just(zipper);
			} else {
				var _n0 = wernerdegroot$listzipper$List$Zipper$next(zipper);
				if (_n0.$ === 'Just') {
					var nextZipper = _n0.a;
					var $temp$predicate = predicate,
						$temp$zipper = nextZipper;
					predicate = $temp$predicate;
					zipper = $temp$zipper;
					continue find;
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var wernerdegroot$listzipper$List$Zipper$first = function (zipper) {
	var ls = zipper.a;
	var x = zipper.b;
	var rs = zipper.c;
	var _n0 = elm$core$List$reverse(ls);
	if (!_n0.b) {
		return zipper;
	} else {
		var y = _n0.a;
		var ys = _n0.b;
		return A3(
			wernerdegroot$listzipper$List$Zipper$Zipper,
			_List_Nil,
			y,
			_Utils_ap(
				ys,
				_Utils_ap(
					_List_fromArray(
						[x]),
					rs)));
	}
};
var wernerdegroot$listzipper$List$Zipper$findFirst = function (predicate) {
	return A2(
		elm$core$Basics$composeL,
		wernerdegroot$listzipper$List$Zipper$find(predicate),
		wernerdegroot$listzipper$List$Zipper$first);
};
var wernerdegroot$listzipper$List$Zipper$fromList = function (xs) {
	if (!xs.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var y = xs.a;
		var ys = xs.b;
		return elm$core$Maybe$Just(
			A3(wernerdegroot$listzipper$List$Zipper$Zipper, _List_Nil, y, ys));
	}
};
var wernerdegroot$listzipper$List$Zipper$singleton = function (x) {
	return A3(wernerdegroot$listzipper$List$Zipper$Zipper, _List_Nil, x, _List_Nil);
};
var wernerdegroot$listzipper$List$Zipper$withDefault = function (x) {
	return elm$core$Maybe$withDefault(
		wernerdegroot$listzipper$List$Zipper$singleton(x));
};
var author$project$MapEditor$defaultZoomLevels = A2(
	wernerdegroot$listzipper$List$Zipper$withDefault,
	99,
	A2(
		wernerdegroot$listzipper$List$Zipper$findFirst,
		function (lvl) {
			return lvl === 1;
		},
		A2(
			wernerdegroot$listzipper$List$Zipper$withDefault,
			99,
			wernerdegroot$listzipper$List$Zipper$fromList(
				_List_fromArray(
					[1 / 4, 1 / 2, 1, 2, 4, 8])))));
var author$project$MapEditor$initMap = {
	base: _Utils_Tuple2(2, 2),
	enemyTowers: elm$core$Set$empty,
	hero: _Utils_Tuple2(1, 1),
	map: author$project$Common$mapFromAscii('\n1111\n1101\n1001\n1111\n'),
	name: 'New Map',
	size: _Utils_Tuple2(4, 4)
};
var author$project$MapEditor$init = function (session) {
	return {
		center: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0),
		currentTile: elm$core$Maybe$Just(author$project$Common$Grass),
		currentTool: author$project$MapEditor$PencilTool,
		editingMap: A2(
			elm$core$Maybe$withDefault,
			author$project$MapEditor$initMap,
			elm$core$List$head(session.savedMaps)),
		hoveringTile: elm$core$Maybe$Nothing,
		isMouseDown: false,
		maybeRectOrigin: elm$core$Maybe$Nothing,
		tileSize: 32,
		zoomLevels: author$project$MapEditor$defaultZoomLevels
	};
};
var author$project$Common$tupleToVec2 = function (_n0) {
	var x = _n0.a;
	var y = _n0.b;
	return elm_explorations$linear_algebra$Math$Vector2$fromRecord(
		{x: x, y: y});
};
var author$project$Common$vec2ToTuple = function (vec2) {
	return function (_n0) {
		var x = _n0.x;
		var y = _n0.y;
		return _Utils_Tuple2(x, y);
	}(
		elm_explorations$linear_algebra$Math$Vector2$toRecord(vec2));
};
var author$project$MapEditor$DrawSprites = function (a) {
	return {$: 'DrawSprites', a: a};
};
var author$project$MapEditor$MoveCamera = function (a) {
	return {$: 'MoveCamera', a: a};
};
var author$project$MapEditor$PlayMapEffect = function (a) {
	return {$: 'PlayMapEffect', a: a};
};
var author$project$MapEditor$SaveMapEffect = function (a) {
	return {$: 'SaveMapEffect', a: a};
};
var author$project$MapEditor$ZoomEffect = function (a) {
	return {$: 'ZoomEffect', a: a};
};
var author$project$MapEditor$applyPencil = F2(
	function (session, model) {
		var _n0 = model.hoveringTile;
		if (_n0.$ === 'Just') {
			var tilePos = _n0.a;
			var editingMap = model.editingMap;
			return _Utils_update(
				model,
				{
					editingMap: _Utils_update(
						editingMap,
						{
							map: function () {
								var _n1 = model.currentTile;
								if (_n1.$ === 'Just') {
									var tile = _n1.a;
									return A3(elm$core$Dict$insert, tilePos, tile, model.editingMap.map);
								} else {
									return A2(elm$core$Dict$remove, tilePos, model.editingMap.map);
								}
							}()
						})
				});
		} else {
			return model;
		}
	});
var elm_community$dict_extra$Dict$Extra$removeMany = F2(
	function (set, dict) {
		return A3(elm$core$Set$foldl, elm$core$Dict$remove, dict, set);
	});
var author$project$MapEditor$applyRect = F2(
	function (session, model) {
		var _n0 = _Utils_Tuple2(model.maybeRectOrigin, model.hoveringTile);
		if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
			var _n1 = _n0.a.a;
			var x1 = _n1.a;
			var y1 = _n1.b;
			var _n2 = _n0.b.a;
			var x2 = _n2.a;
			var y2 = _n2.b;
			var _n3 = model.currentTile;
			if (_n3.$ === 'Just') {
				var tile = _n3.a;
				return function (newTileDict) {
					var editingMap = model.editingMap;
					return _Utils_update(
						model,
						{
							editingMap: _Utils_update(
								editingMap,
								{
									map: A2(elm$core$Dict$union, newTileDict, model.editingMap.map)
								})
						});
				}(
					elm$core$Dict$fromList(
						elm$core$List$concat(
							A2(
								elm$core$List$map,
								function (x) {
									return A2(
										elm$core$List$map,
										function (y) {
											return _Utils_Tuple2(
												_Utils_Tuple2(x, y),
												tile);
										},
										A2(
											elm$core$List$range,
											A2(elm$core$Basics$min, y1, y2),
											A2(elm$core$Basics$max, y1, y2)));
								},
								A2(
									elm$core$List$range,
									A2(elm$core$Basics$min, x1, x2),
									A2(elm$core$Basics$max, x1, x2))))));
			} else {
				return function (tilesToRemove) {
					var editingMap = model.editingMap;
					return _Utils_update(
						model,
						{
							editingMap: _Utils_update(
								editingMap,
								{
									map: A2(elm_community$dict_extra$Dict$Extra$removeMany, tilesToRemove, editingMap.map)
								})
						});
				}(
					elm$core$Set$fromList(
						elm$core$List$concat(
							A2(
								elm$core$List$map,
								function (x) {
									return A2(
										elm$core$List$map,
										function (y) {
											return _Utils_Tuple2(x, y);
										},
										A2(
											elm$core$List$range,
											A2(elm$core$Basics$min, y1, y2),
											A2(elm$core$Basics$max, y1, y2)));
								},
								A2(
									elm$core$List$range,
									A2(elm$core$Basics$min, x1, x2),
									A2(elm$core$Basics$max, x1, x2))))));
			}
		} else {
			return model;
		}
	});
var author$project$MapEditor$rectSprites = function (model) {
	var _n0 = _Utils_Tuple2(model.maybeRectOrigin, model.hoveringTile);
	if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
		var _n1 = _n0.a.a;
		var x1 = _n1.a;
		var y1 = _n1.b;
		var _n2 = _n0.b.a;
		var x2 = _n2.a;
		var y2 = _n2.b;
		return elm$core$List$concat(
			A2(
				elm$core$List$map,
				function (x) {
					return A2(
						elm$core$List$map,
						function (y) {
							return {
								texture: function () {
									var _n3 = model.currentTile;
									if (_n3.$ === 'Just') {
										var tile = _n3.a;
										return author$project$Common$tileToStr(tile);
									} else {
										return 'x';
									}
								}(),
								x: x,
								y: y
							};
						},
						A2(
							elm$core$List$range,
							A2(elm$core$Basics$min, y1, y2),
							A2(elm$core$Basics$max, y1, y2)));
				},
				A2(
					elm$core$List$range,
					A2(elm$core$Basics$min, x1, x2),
					A2(elm$core$Basics$max, x1, x2))));
	} else {
		return _List_Nil;
	}
};
var author$project$MapEditor$getSprites = F2(
	function (session, model) {
		var rectLayer = {
			graphics: _List_Nil,
			name: 'rect',
			sprites: author$project$MapEditor$rectSprites(model)
		};
		var mapLayer = {
			graphics: _List_Nil,
			name: 'map',
			sprites: A2(
				elm$core$List$map,
				function (_n7) {
					var _n8 = _n7.a;
					var x = _n8.a;
					var y = _n8.b;
					var tile = _n7.b;
					return {
						texture: author$project$Common$tileToStr(tile),
						x: x,
						y: y
					};
				},
				elm$core$Dict$toList(model.editingMap.map))
		};
		var heroLayer = {
			graphics: function () {
				var width = 1.2;
				var outlineRatio = 5.0e-2;
				var offset = outlineRatio * width;
				var height = 0.2;
				var _n4 = function () {
					var _n5 = model.editingMap.hero;
					var x = _n5.a;
					var y = _n5.b;
					return _Utils_Tuple2((x + 0.5) - (width / 2), y + 1.2);
				}();
				var healthX = _n4.a;
				var healthY = _n4.b;
				return _List_fromArray(
					[
						{alpha: 1, bgColor: '#000000', height: height + (offset * 2), lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width + (offset * 2), x: healthX - offset, y: healthY - offset},
						{alpha: 1, bgColor: '#00ff00', height: height, lineStyleAlpha: 1, lineStyleColor: '#000000', lineStyleWidth: 0, shape: author$project$Common$Rect, width: width, x: healthX, y: healthY}
					]);
			}(),
			name: 'hero',
			sprites: function () {
				var _n6 = model.editingMap.hero;
				var x = _n6.a;
				var y = _n6.b;
				return _List_fromArray(
					[
						{texture: 'hero', x: x, y: y}
					]);
			}()
		};
		var cursorLayer = {
			graphics: _List_Nil,
			name: 'cursor',
			sprites: function () {
				var _n2 = model.hoveringTile;
				if (_n2.$ === 'Just') {
					var _n3 = _n2.a;
					var x = _n3.a;
					var y = _n3.b;
					return _List_fromArray(
						[
							{texture: 'selectedTile', x: x, y: y}
						]);
				} else {
					return _List_Nil;
				}
			}()
		};
		var buildingsLayer = {
			graphics: _List_Nil,
			name: 'buildings',
			sprites: elm$core$List$concat(
				_List_fromArray(
					[
						function () {
						var _n0 = model.editingMap.base;
						var x = _n0.a;
						var y = _n0.b;
						return _List_fromArray(
							[
								{texture: 'tower', x: x, y: y}
							]);
					}(),
						A2(
						elm$core$List$map,
						function (_n1) {
							var etX = _n1.a;
							var etY = _n1.b;
							return {texture: 'enemyTower', x: etX, y: etY};
						},
						elm$core$Set$toList(model.editingMap.enemyTowers))
					]))
		};
		return A2(
			elm$core$List$indexedMap,
			F2(
				function (i, layer) {
					return {graphics: layer.graphics, name: layer.name, sprites: layer.sprites, zOrder: i};
				}),
			_List_fromArray(
				[mapLayer, rectLayer, buildingsLayer, heroLayer, cursorLayer]));
	});
var author$project$MapEditor$heroDirInput = function (keysPressed) {
	return elm_explorations$linear_algebra$Math$Vector2$fromRecord(
		{
			x: (A2(elm$core$Set$member, 'ArrowLeft', keysPressed) || A2(elm$core$Set$member, 'a', keysPressed)) ? (-1) : ((A2(elm$core$Set$member, 'ArrowRight', keysPressed) || A2(elm$core$Set$member, 'd', keysPressed)) ? 1 : 0),
			y: (A2(elm$core$Set$member, 'ArrowUp', keysPressed) || A2(elm$core$Set$member, 'w', keysPressed)) ? (-1) : ((A2(elm$core$Set$member, 'ArrowDown', keysPressed) || A2(elm$core$Set$member, 's', keysPressed)) ? 1 : 0)
		});
};
var wernerdegroot$listzipper$List$Zipper$current = function (_n0) {
	var x = _n0.b;
	return x;
};
var author$project$MapEditor$zoomedTileSize = function (model) {
	return model.tileSize * (1 / wernerdegroot$listzipper$List$Zipper$current(model.zoomLevels));
};
var elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var wernerdegroot$listzipper$List$Zipper$previous = function (_n0) {
	var ls = _n0.a;
	var x = _n0.b;
	var rs = _n0.c;
	if (!ls.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var y = ls.a;
		var ys = ls.b;
		return elm$core$Maybe$Just(
			A3(
				wernerdegroot$listzipper$List$Zipper$Zipper,
				ys,
				y,
				A2(elm$core$List$cons, x, rs)));
	}
};
var author$project$MapEditor$update = F3(
	function (msg, session, model) {
		switch (msg.$) {
			case 'Tick':
				var ms = msg.a;
				var delta = ms / 1000;
				var newCenter = A2(
					elm_explorations$linear_algebra$Math$Vector2$add,
					model.center,
					A2(
						elm_explorations$linear_algebra$Math$Vector2$scale,
						delta * 20,
						author$project$MapEditor$heroDirInput(session.keysPressed)));
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{center: newCenter}),
					session,
					_List_fromArray(
						[
							author$project$MapEditor$MoveCamera(newCenter),
							author$project$MapEditor$DrawSprites(
							A2(author$project$MapEditor$getSprites, session, model))
						]));
			case 'MouseMove':
				var _n1 = msg.a;
				var x = _n1.a;
				var y = _n1.b;
				var hoveringTile = elm$core$Maybe$Just(
					A3(
						elm$core$Tuple$mapBoth,
						elm$core$Basics$floor,
						elm$core$Basics$floor,
						author$project$Common$vec2ToTuple(
							A2(
								elm_explorations$linear_algebra$Math$Vector2$scale,
								1 / author$project$MapEditor$zoomedTileSize(model),
								A2(
									elm_explorations$linear_algebra$Math$Vector2$add,
									A2(
										elm_explorations$linear_algebra$Math$Vector2$add,
										A2(elm_explorations$linear_algebra$Math$Vector2$vec2, session.windowWidth * (-0.5), session.windowHeight * (-0.5)),
										A2(
											elm_explorations$linear_algebra$Math$Vector2$scale,
											author$project$MapEditor$zoomedTileSize(model),
											model.center)),
									author$project$Common$tupleToVec2(
										_Utils_Tuple2(x, y)))))));
				var editingMap = function () {
					var _n2 = _Utils_Tuple2(model.isMouseDown, model.hoveringTile);
					if (_n2.a && (_n2.b.$ === 'Just')) {
						var tilePos = _n2.b.a;
						var em = model.editingMap;
						var _n3 = model.currentTool;
						switch (_n3.$) {
							case 'PencilTool':
								return _Utils_update(
									em,
									{
										map: function () {
											var _n4 = model.currentTile;
											if (_n4.$ === 'Just') {
												var tile = _n4.a;
												return A3(elm$core$Dict$insert, tilePos, tile, model.editingMap.map);
											} else {
												return A2(elm$core$Dict$remove, tilePos, model.editingMap.map);
											}
										}()
									});
							case 'ClearTool':
								return _Utils_update(
									em,
									{
										enemyTowers: A2(elm$core$Set$remove, tilePos, model.editingMap.enemyTowers)
									});
							default:
								return model.editingMap;
						}
					} else {
						return model.editingMap;
					}
				}();
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{editingMap: editingMap, hoveringTile: hoveringTile}),
					session,
					_List_Nil);
			case 'MouseDown':
				return _Utils_Tuple3(
					A2(
						author$project$MapEditor$applyPencil,
						session,
						_Utils_update(
							model,
							{
								editingMap: function () {
									var _n5 = model.hoveringTile;
									if (_n5.$ === 'Just') {
										var tilePos = _n5.a;
										var em = model.editingMap;
										var _n6 = model.currentTool;
										if (_n6.$ === 'ClearTool') {
											return _Utils_update(
												em,
												{
													enemyTowers: A2(elm$core$Set$remove, tilePos, model.editingMap.enemyTowers)
												});
										} else {
											return model.editingMap;
										}
									} else {
										return model.editingMap;
									}
								}(),
								isMouseDown: true,
								maybeRectOrigin: function () {
									var _n7 = model.currentTool;
									switch (_n7.$) {
										case 'PencilTool':
											return elm$core$Maybe$Nothing;
										case 'RectTool':
											return model.hoveringTile;
										default:
											return elm$core$Maybe$Nothing;
									}
								}()
							})),
					session,
					_List_Nil);
			case 'MouseUp':
				return _Utils_Tuple3(
					function (m) {
						var editingMap = m.editingMap;
						return _Utils_update(
							m,
							{
								editingMap: _Utils_update(
									editingMap,
									{
										base: function () {
											var _n8 = _Utils_Tuple2(m.currentTool, m.hoveringTile);
											if ((_n8.a.$ === 'BaseTool') && (_n8.b.$ === 'Just')) {
												var _n9 = _n8.a;
												var tilePos = _n8.b.a;
												return tilePos;
											} else {
												return m.editingMap.base;
											}
										}(),
										enemyTowers: function () {
											var _n10 = _Utils_Tuple2(m.currentTool, m.hoveringTile);
											if ((_n10.a.$ === 'EnemyTowerTool') && (_n10.b.$ === 'Just')) {
												var _n11 = _n10.a;
												var tilePos = _n10.b.a;
												return A2(elm$core$Set$insert, tilePos, m.editingMap.enemyTowers);
											} else {
												return m.editingMap.enemyTowers;
											}
										}(),
										hero: function () {
											var _n12 = _Utils_Tuple2(m.currentTool, m.hoveringTile);
											if ((_n12.a.$ === 'HeroTool') && (_n12.b.$ === 'Just')) {
												var _n13 = _n12.a;
												var tilePos = _n12.b.a;
												return tilePos;
											} else {
												return m.editingMap.hero;
											}
										}()
									}),
								isMouseDown: false,
								maybeRectOrigin: elm$core$Maybe$Nothing
							});
					}(
						A2(author$project$MapEditor$applyRect, session, model)),
					session,
					_List_Nil);
			case 'ChooseTool':
				var tool = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{currentTool: tool}),
					session,
					_List_Nil);
			case 'ChooseTile':
				var tile = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{currentTile: tile}),
					session,
					_List_Nil);
			case 'Zoom':
				var wheelEvent = msg.a;
				var zoomLevels = (wheelEvent.deltaY > 0) ? A2(
					elm$core$Maybe$withDefault,
					model.zoomLevels,
					wernerdegroot$listzipper$List$Zipper$next(model.zoomLevels)) : ((wheelEvent.deltaY < 0) ? A2(
					elm$core$Maybe$withDefault,
					model.zoomLevels,
					wernerdegroot$listzipper$List$Zipper$previous(model.zoomLevels)) : model.zoomLevels);
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{zoomLevels: zoomLevels}),
					session,
					_List_fromArray(
						[
							author$project$MapEditor$ZoomEffect(
							wernerdegroot$listzipper$List$Zipper$current(zoomLevels))
						]));
			case 'LoadMap':
				var mapName = msg.a;
				return _Utils_Tuple3(
					function () {
						var _n14 = A2(
							elm_community$list_extra$List$Extra$find,
							function (map) {
								return _Utils_eq(map.name, mapName);
							},
							session.savedMaps);
						if (_n14.$ === 'Just') {
							var savedMap = _n14.a;
							return _Utils_update(
								model,
								{editingMap: savedMap});
						} else {
							return model;
						}
					}(),
					session,
					_List_Nil);
			case 'SaveMap':
				return _Utils_Tuple3(
					model,
					_Utils_update(
						session,
						{
							savedMaps: A2(
								elm$core$List$map,
								function (savedMap) {
									return _Utils_eq(savedMap.name, model.editingMap.name) ? model.editingMap : savedMap;
								},
								session.savedMaps)
						}),
					_List_fromArray(
						[
							author$project$MapEditor$SaveMapEffect(model.editingMap)
						]));
			default:
				return _Utils_Tuple3(
					model,
					session,
					_List_fromArray(
						[
							author$project$MapEditor$PlayMapEffect(model.editingMap)
						]));
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var elm$core$String$toFloat = _String_toFloat;
var author$project$Main$update = F2(
	function (msg, model) {
		var session = model.session;
		switch (msg.$) {
			case 'GoToMapEditor':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							state: author$project$Main$MapEditor(
								author$project$MapEditor$init(session))
						}),
					elm$core$Platform$Cmd$none);
			case 'KeyUp':
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							session: _Utils_update(
								session,
								{
									keysPressed: A2(elm$core$Set$remove, str, session.keysPressed)
								})
						}),
					elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							session: _Utils_update(
								session,
								{
									keysPressed: A2(elm$core$Set$insert, str, session.keysPressed)
								}),
							state: function () {
								var _n1 = model.state;
								if (_n1.$ === 'Game') {
									var gameModel = _n1.a;
									return function (_n2) {
										var m = _n2.a;
										var es = _n2.b;
										return author$project$Main$Game(m);
									}(
										A3(
											author$project$Game$update,
											author$project$Game$KeyDown(str),
											session,
											gameModel));
								} else {
									return model.state;
								}
							}()
						}),
					elm$core$Platform$Cmd$none);
			case 'ChangeConfigVal':
				var name = msg.a;
				var inputStr = msg.b;
				var newConfigFloats = function (configFloats) {
					var _n3 = elm$core$String$toFloat(inputStr);
					if (_n3.$ === 'Just') {
						var val = _n3.a;
						return A3(
							elm$core$Dict$update,
							name,
							elm$core$Maybe$map(
								function (cv) {
									return _Utils_update(
										cv,
										{val: val});
								}),
							configFloats);
					} else {
						return configFloats;
					}
				}(session.configFloats);
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{
								c: author$project$Main$makeC(newConfigFloats),
								configFloats: newConfigFloats
							})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'ChangeConfigMin':
				var name = msg.a;
				var inputStr = msg.b;
				var newConfigFloats = function (configFloats) {
					var _n4 = elm$core$String$toFloat(inputStr);
					if (_n4.$ === 'Just') {
						var min = _n4.a;
						return A3(
							elm$core$Dict$update,
							name,
							elm$core$Maybe$map(
								function (cv) {
									return _Utils_update(
										cv,
										{min: min});
								}),
							configFloats);
					} else {
						return configFloats;
					}
				}(session.configFloats);
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{
								c: author$project$Main$makeC(newConfigFloats),
								configFloats: newConfigFloats
							})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'ChangeConfigMax':
				var name = msg.a;
				var inputStr = msg.b;
				var newConfigFloats = function (configFloats) {
					var _n5 = elm$core$String$toFloat(inputStr);
					if (_n5.$ === 'Just') {
						var max = _n5.a;
						return A3(
							elm$core$Dict$update,
							name,
							elm$core$Maybe$map(
								function (cv) {
									return _Utils_update(
										cv,
										{max: max});
								}),
							configFloats);
					} else {
						return configFloats;
					}
				}(session.configFloats);
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{
								c: author$project$Main$makeC(newConfigFloats),
								configFloats: newConfigFloats
							})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'ToggleConfig':
				var shouldOpen = msg.a;
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{isConfigOpen: shouldOpen})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'ToggleConfigAccordion':
				var shouldOpen = msg.a;
				var name = msg.b;
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{
								openConfigAccordions: shouldOpen ? A2(elm$core$Set$insert, name, model.session.openConfigAccordions) : A2(elm$core$Set$remove, name, model.session.openConfigAccordions)
							})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'ResetConfig':
				var newModel = _Utils_update(
					model,
					{
						session: _Utils_update(
							session,
							{
								c: author$project$Main$makeC(author$project$Main$defaultPersistence.configFloats),
								configFloats: author$project$Main$defaultPersistence.configFloats
							})
					});
				return _Utils_Tuple2(
					newModel,
					author$project$Main$performEffects(
						_List_fromArray(
							[
								elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$string('SAVE')),
										_Utils_Tuple2(
										'persistence',
										author$project$Main$encodePersistence(
											author$project$Main$modelToPersistence(newModel)))
									]))
							])));
			case 'Tick':
				var delta = msg.a;
				var _n6 = model.state;
				if (_n6.$ === 'MapEditor') {
					var mapEditorModel = _n6.a;
					var _n7 = A3(
						author$project$MapEditor$update,
						author$project$MapEditor$Tick(delta),
						session,
						mapEditorModel);
					var newModel = _n7.a;
					var newSession = _n7.b;
					var effects = _n7.c;
					return A3(
						author$project$Main$performMapEffects,
						newSession,
						effects,
						_Utils_update(
							model,
							{
								session: newSession,
								state: author$project$Main$MapEditor(newModel)
							}));
				} else {
					var gameModel = _n6.a;
					var _n8 = A3(
						author$project$Game$update,
						author$project$Game$Tick(delta),
						session,
						gameModel);
					var newModel = _n8.a;
					var effects = _n8.b;
					return A3(
						author$project$Main$performGameEffects,
						session,
						effects,
						_Utils_update(
							model,
							{
								state: author$project$Main$Game(newModel)
							}));
				}
			case 'MapEditorMsg':
				var mapEditorMsg = msg.a;
				var _n9 = model.state;
				if (_n9.$ === 'MapEditor') {
					var mapEditorModel = _n9.a;
					var _n10 = A3(author$project$MapEditor$update, mapEditorMsg, session, mapEditorModel);
					var newModel = _n10.a;
					var newSession = _n10.b;
					var effects = _n10.c;
					return A3(
						author$project$Main$performMapEffects,
						newSession,
						effects,
						_Utils_update(
							model,
							{
								session: newSession,
								state: author$project$Main$MapEditor(newModel)
							}));
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			default:
				var gameMsg = msg.a;
				var _n11 = model.state;
				if (_n11.$ === 'Game') {
					var gameModel = _n11.a;
					var _n12 = A3(author$project$Game$update, gameMsg, session, gameModel);
					var newModel = _n12.a;
					var effects = _n12.b;
					return A3(
						author$project$Main$performGameEffects,
						session,
						effects,
						_Utils_update(
							model,
							{
								state: author$project$Main$Game(newModel)
							}));
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
		}
	});
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$img = _VirtualDom_node('img');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Game$drawEquippables = F2(
	function (session, model) {
		var size = '50px';
		var equippables = _List_fromArray(
			[
				{equippable: author$project$Game$Gun, imgSrc: 'images/icon-watergun.png', keyStr: '1', maybeAmt: elm$core$Maybe$Nothing},
				{equippable: author$project$Game$Scythe, imgSrc: 'images/scythe.png', keyStr: '2', maybeAmt: elm$core$Maybe$Nothing},
				{
				equippable: author$project$Game$MoolahCropSeed,
				imgSrc: 'images/mature-money.png',
				keyStr: '3',
				maybeAmt: elm$core$Maybe$Just(model.moolahSeedAmt)
			},
				{
				equippable: author$project$Game$TurretSeed,
				imgSrc: 'images/turret.png',
				keyStr: '4',
				maybeAmt: elm$core$Maybe$Just(model.turretSeedAmt)
			}
			]);
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2(elm$html$Html$Attributes$style, 'bottom', '5px'),
					A2(elm$html$Html$Attributes$style, 'width', '100%')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'display', 'flex'),
							A2(elm$html$Html$Attributes$style, 'justify-content', 'center')
						]),
					A2(
						elm$core$List$map,
						function (_n0) {
							var equippable = _n0.equippable;
							var imgSrc = _n0.imgSrc;
							var maybeAmt = _n0.maybeAmt;
							var keyStr = _n0.keyStr;
							return A2(
								elm$html$Html$div,
								_Utils_ap(
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'border', '7px ridge white'),
											A2(elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2(elm$html$Html$Attributes$style, 'background', 'rgba(255, 255, 255, 0.4)'),
											A2(elm$html$Html$Attributes$style, 'margin', '0 5px'),
											A2(elm$html$Html$Attributes$style, 'position', 'relative'),
											A2(elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											elm$html$Html$Events$onClick(
											author$project$Game$KeyDown(keyStr))
										]),
									_Utils_eq(model.equipped, equippable) ? _List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'background', 'rgba(90, 255, 90, 0.6)'),
											A2(elm$html$Html$Attributes$style, 'border', '7px ridge rgb(90, 255, 90)')
										]) : _List_Nil),
								_List_fromArray(
									[
										A2(
										elm$html$Html$img,
										_List_fromArray(
											[
												elm$html$Html$Attributes$src(imgSrc),
												A2(elm$html$Html$Attributes$style, 'width', size),
												A2(elm$html$Html$Attributes$style, 'height', size),
												A2(elm$html$Html$Attributes$style, 'margin', '3px')
											]),
										_List_Nil),
										function () {
										if (maybeAmt.$ === 'Just') {
											var amt = maybeAmt.a;
											return A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'font-size', '12px'),
														A2(elm$html$Html$Attributes$style, 'color', 'white'),
														A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
														A2(elm$html$Html$Attributes$style, 'bottom', '1px'),
														A2(elm$html$Html$Attributes$style, 'right', '3px'),
														A2(elm$html$Html$Attributes$style, 'text-shadow', '1px 1px 1px black')
													]),
												_List_fromArray(
													[
														elm$html$Html$text(
														elm$core$String$fromInt(amt))
													]));
										} else {
											return elm$html$Html$text('');
										}
									}()
									]));
						},
						equippables))
				]));
	});
var author$project$Game$MouseDown = {$: 'MouseDown'};
var author$project$Game$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var author$project$Game$MouseUp = {$: 'MouseUp'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	elm$json$Json$Decode$map,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2(elm$json$Json$Decode$field, 'button', elm$json$Json$Decode$int));
var mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'clientX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'clientY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	elm$json$Json$Decode$map3,
	mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2(elm$json$Json$Decode$field, 'altKey', elm$json$Json$Decode$bool),
	A2(elm$json$Json$Decode$field, 'ctrlKey', elm$json$Json$Decode$bool),
	A2(elm$json$Json$Decode$field, 'shiftKey', elm$json$Json$Decode$bool));
var mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'offsetX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'offsetY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'pageX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'pageY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2(elm$json$Json$Decode$field, 'screenX', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'screenY', elm$json$Json$Decode$float));
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7(elm$json$Json$Decode$map6, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, mpizenberg$elm_pointer_events$Internal$Decode$keys, mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, mpizenberg$elm_pointer_events$Internal$Decode$clientPos, mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, mpizenberg$elm_pointer_events$Internal$Decode$pagePos, mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			elm$html$Html$Events$custom,
			event,
			A2(
				elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp = A2(mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseup', mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var author$project$Game$drawGlass = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2(elm$html$Html$Attributes$style, 'position', 'relative'),
					A2(elm$html$Html$Attributes$style, 'margin', '0'),
					A2(elm$html$Html$Attributes$style, 'font-size', '0'),
					A2(elm$html$Html$Attributes$style, 'width', '100%'),
					A2(elm$html$Html$Attributes$style, 'height', '100%'),
					A2(elm$html$Html$Attributes$style, 'cursor', 'default'),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
					function (_n0) {
						return author$project$Game$MouseDown;
					}),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp(
					function (_n1) {
						return author$project$Game$MouseUp;
					}),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
					function (event) {
						return author$project$Game$MouseMove(event.offsetPos);
					})
				]),
			_List_Nil);
	});
var author$project$Game$ToggleHelp = function (a) {
	return {$: 'ToggleHelp', a: a};
};
var elm$html$Html$br = _VirtualDom_node('br');
var elm$html$Html$button = _VirtualDom_node('button');
var elm$html$Html$strong = _VirtualDom_node('strong');
var author$project$Game$drawHelp = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2(elm$html$Html$Attributes$style, 'left', '10px'),
							A2(elm$html$Html$Attributes$style, 'bottom', '10px'),
							A2(elm$html$Html$Attributes$style, 'background', '#ffb020'),
							A2(elm$html$Html$Attributes$style, 'border-color', '#eb2'),
							A2(elm$html$Html$Attributes$style, 'width', '40px'),
							A2(elm$html$Html$Attributes$style, 'height', '40px'),
							A2(elm$html$Html$Attributes$style, 'font-size', '24px'),
							A2(elm$html$Html$Attributes$style, 'border-radius', '4px'),
							elm$html$Html$Events$onClick(
							author$project$Game$ToggleHelp(true))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('?')
						])),
					model.shouldShowHelp ? A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2(elm$html$Html$Attributes$style, 'top', '50%'),
							A2(elm$html$Html$Attributes$style, 'left', '50%'),
							A2(elm$html$Html$Attributes$style, 'transform', 'translate(-50%, -50%)'),
							A2(elm$html$Html$Attributes$style, 'background', '#eef'),
							A2(elm$html$Html$Attributes$style, 'width', '700px'),
							A2(elm$html$Html$Attributes$style, 'font-size', '20px'),
							A2(elm$html$Html$Attributes$style, 'padding', '20px')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('You\'ve landed on an alien planet and must terraform to survive! '),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							elm$html$Html$text('Plant, water, and harvest '),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Moolah')
								])),
							elm$html$Html$text(' crops to make money. Plant '),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Turret')
								])),
							elm$html$Html$text(' seeds to defend against enemy creeps. Buy more seeds, heal up, and upgrade your water gun in your base.'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Goal: ')
								])),
							elm$html$Html$text('Destroy the enemy base before the spawned creeps overrun your farm!'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('WASD: ')
								])),
							elm$html$Html$text('Move'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('1: ')
								])),
							elm$html$Html$text('Water Gun'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('2: ')
								])),
							elm$html$Html$text('Scythe'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('3: ')
								])),
							elm$html$Html$text('Moolah Seeds'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('4: ')
								])),
							elm$html$Html$text('Turret Seeds'),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$button,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2(elm$html$Html$Attributes$style, 'margin', 'auto'),
									A2(elm$html$Html$Attributes$style, 'display', 'block'),
									A2(elm$html$Html$Attributes$style, 'padding', '10px 20px'),
									A2(elm$html$Html$Attributes$style, 'border-radius', '3px'),
									elm$html$Html$Events$onClick(
									author$project$Game$ToggleHelp(false))
								]),
							_List_fromArray(
								[
									elm$html$Html$text('OK')
								]))
						])) : elm$html$Html$text('')
				]));
	});
var elm$core$String$fromFloat = _String_fromNumber;
var author$project$Common$pct = function (length) {
	return elm$core$String$fromFloat(length) + '%';
};
var author$project$Common$px = function (length) {
	return elm$core$String$fromFloat(length) + 'px';
};
var author$project$Game$viewMeter = F3(
	function (amt, max, meterWidth) {
		var ratio = amt / max;
		var padding = meterWidth * 5.0e-3;
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2(elm$html$Html$Attributes$style, 'background', '#111'),
					A2(
					elm$html$Html$Attributes$style,
					'padding',
					elm$core$String$fromFloat(4 * padding) + 'px'),
					A2(elm$html$Html$Attributes$style, 'font-size', '0')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
							A2(
							elm$html$Html$Attributes$style,
							'width',
							author$project$Common$px(meterWidth)),
							A2(elm$html$Html$Attributes$style, 'background', '#eee'),
							A2(
							elm$html$Html$Attributes$style,
							'height',
							author$project$Common$px(0.1 * meterWidth)),
							A2(
							elm$html$Html$Attributes$style,
							'border',
							author$project$Common$px(2 * padding) + ' solid #eee'),
							A2(
							elm$html$Html$Attributes$style,
							'border-radius',
							author$project$Common$px(4 * padding))
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							elm$core$List$concat(
								_List_fromArray(
									[
										_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'background', '#5fcde4'),
											A2(elm$html$Html$Attributes$style, 'border', '#5fcde4'),
											A2(
											elm$html$Html$Attributes$style,
											'width',
											author$project$Common$pct(100 * ratio)),
											A2(elm$html$Html$Attributes$style, 'height', '100%'),
											A2(
											elm$html$Html$Attributes$style,
											'border-radius',
											author$project$Common$px(4 * padding))
										]),
										(_Utils_cmp(amt, 0.98 * max) > -1) ? _List_fromArray(
										[
											A2(
											elm$html$Html$Attributes$style,
											'border-radius',
											author$project$Common$px(4 * padding))
										]) : _List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'border-radius-right', '0')
										])
									])),
							_List_Nil)
						]))
				]));
	});
var author$project$Game$drawHud = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2(elm$html$Html$Attributes$style, 'top', '20px'),
					A2(elm$html$Html$Attributes$style, 'left', '20px'),
					A2(elm$html$Html$Attributes$style, 'display', 'flex'),
					A2(elm$html$Html$Attributes$style, 'font-size', '24px'),
					A2(elm$html$Html$Attributes$style, 'color', '#cfc')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'width', '200px')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							'Money: $' + elm$core$String$fromInt(model.money))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'width', '200px')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							'Water: ' + (elm$core$String$fromInt(
								elm$core$Basics$round(model.waterAmt)) + (' / ' + elm$core$String$fromInt(
								A2(author$project$Game$heroWaterMax, session, model)))))
						])),
					A3(
					author$project$Game$viewMeter,
					model.waterAmt,
					A2(author$project$Game$heroWaterMax, session, model),
					session.c.getFloat('ui:meterWidth'))
				]));
	});
var author$project$Game$Buy = F2(
	function (a, b) {
		return {$: 'Buy', a: a, b: b};
	});
var author$project$Game$BuyUpgrade = function (a) {
	return {$: 'BuyUpgrade', a: a};
};
var author$project$Game$Capacity = {$: 'Capacity'};
var author$project$Game$ClickPlay = {$: 'ClickPlay'};
var author$project$Game$FireRate = {$: 'FireRate'};
var author$project$Game$LeaveMarket = {$: 'LeaveMarket'};
var author$project$Game$Range = {$: 'Range'};
var author$project$Game$currentLevelForUpgrade = F3(
	function (session, model, upgrade) {
		switch (upgrade.$) {
			case 'Range':
				return model.rangeLevel;
			case 'Capacity':
				return model.capacityLevel;
			default:
				return model.fireRateLevel;
		}
	});
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$em = _VirtualDom_node('em');
var elm$html$Html$h1 = _VirtualDom_node('h1');
var elm$html$Html$hr = _VirtualDom_node('hr');
var elm$html$Html$span = _VirtualDom_node('span');
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$html$Html$Attributes$target = elm$html$Html$Attributes$stringProperty('target');
var author$project$Game$viewScreens = F2(
	function (session, model) {
		var _n0 = model.gameState;
		switch (_n0.$) {
			case 'MainMenu':
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(elm$html$Html$Attributes$style, 'top', '0'),
							A2(elm$html$Html$Attributes$style, 'left', '0'),
							A2(elm$html$Html$Attributes$style, 'width', '100%'),
							A2(elm$html$Html$Attributes$style, 'height', '100%'),
							A2(elm$html$Html$Attributes$style, 'z-index', '99'),
							A2(elm$html$Html$Attributes$style, 'background-image', 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'color', 'white'),
									A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2(elm$html$Html$Attributes$style, 'top', '10%'),
									A2(elm$html$Html$Attributes$style, 'width', '100%'),
									A2(elm$html$Html$Attributes$style, 'height', '100%'),
									A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
									A2(elm$html$Html$Attributes$style, 'line-height', '48px')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'font-size', '48px'),
											A2(elm$html$Html$Attributes$style, 'font-family', '\'Rock Salt\', cursive'),
											A2(elm$html$Html$Attributes$style, 'line-height', '69px')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Workin\''),
											A2(elm$html$Html$br, _List_Nil, _List_Nil),
											elm$html$Html$text('Progress')
										])),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'font-size', '24px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$span,
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'color', '#fff'),
													A2(elm$html$Html$Attributes$style, 'font-family', '\'Open Sans\', sans-serif')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('version 0.0001')
												]))
										])),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'font-size', '16px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$href('https://github.com/jamesgary/game_off_2018'),
													elm$html$Html$Attributes$target('_blank'),
													A2(elm$html$Html$Attributes$style, 'color', '#aff'),
													A2(elm$html$Html$Attributes$style, 'font-family', '\'Open Sans\', sans-serif')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('source code')
												]))
										])),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'font-size', '14px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$span,
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'color', '#fff'),
													A2(elm$html$Html$Attributes$style, 'font-family', '\'Open Sans\', sans-serif')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('A hybrid mash-up of farming simulator and tower defense!')
												]))
										])),
									A2(
									elm$html$Html$button,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'font-size', '24px'),
											A2(elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2(elm$html$Html$Attributes$style, 'padding', '8px 16px'),
											elm$html$Html$Events$onClick(author$project$Game$ClickPlay)
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Play')
										]))
								]))
						]));
			case 'GameOver':
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(elm$html$Html$Attributes$style, 'top', '0'),
							A2(elm$html$Html$Attributes$style, 'left', '0'),
							A2(elm$html$Html$Attributes$style, 'width', '100%'),
							A2(elm$html$Html$Attributes$style, 'height', '100%'),
							A2(elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'font-size', '48px'),
									A2(elm$html$Html$Attributes$style, 'color', 'white'),
									A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2(elm$html$Html$Attributes$style, 'top', '40%'),
									A2(elm$html$Html$Attributes$style, 'width', '100%'),
									A2(elm$html$Html$Attributes$style, 'height', '100%'),
									A2(elm$html$Html$Attributes$style, 'position', 'absolute')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('GAME OVER')
								]))
						]));
			case 'Win':
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(elm$html$Html$Attributes$style, 'top', '0'),
							A2(elm$html$Html$Attributes$style, 'left', '0'),
							A2(elm$html$Html$Attributes$style, 'width', '100%'),
							A2(elm$html$Html$Attributes$style, 'height', '100%'),
							A2(elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'font-size', '48px'),
									A2(elm$html$Html$Attributes$style, 'color', 'white'),
									A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2(elm$html$Html$Attributes$style, 'top', '40%'),
									A2(elm$html$Html$Attributes$style, 'width', '100%'),
									A2(elm$html$Html$Attributes$style, 'height', '100%'),
									A2(elm$html$Html$Attributes$style, 'position', 'absolute')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('A WINNER IS YOU')
								]))
						]));
			case 'Playing':
				return elm$html$Html$text('');
			default:
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'width', '100%'),
							A2(elm$html$Html$Attributes$style, 'height', '100%'),
							A2(elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
							A2(elm$html$Html$Attributes$style, 'left', '0'),
							A2(elm$html$Html$Attributes$style, 'top', '0'),
							A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(elm$html$Html$Attributes$style, 'font-size', '36px'),
							A2(elm$html$Html$Attributes$style, 'z-index', '99'),
							A2(elm$html$Html$Attributes$style, 'display', 'flex'),
							A2(elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2(elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2(elm$html$Html$Attributes$style, 'align-content', 'center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'background', '#003d00'),
									A2(elm$html$Html$Attributes$style, 'color', 'white'),
									A2(elm$html$Html$Attributes$style, 'border', '10px double #2ab02a'),
									A2(elm$html$Html$Attributes$style, 'padding', '20px')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$h1,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'margin', '0'),
											A2(elm$html$Html$Attributes$style, 'font-size', '36px'),
											A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
											A2(elm$html$Html$Attributes$style, 'font-family', '\'Rock Salt\', cursive'),
											A2(elm$html$Html$Attributes$style, 'letter-spacing', '3px')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Terraformer\'s Market')
										])),
									A2(
									elm$html$Html$hr,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'border-color', '#2ab02a')
										]),
									_List_Nil),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'display', 'flex'),
											A2(elm$html$Html$Attributes$style, 'justify-content', 'center')
										]),
									_Utils_ap(
										A2(
											elm$core$List$map,
											function (_n1) {
												var title = _n1.title;
												var icon = _n1.icon;
												var desc = _n1.desc;
												var cost = _n1.cost;
												var msg = _n1.msg;
												var currentAmt = _n1.currentAmt;
												return A2(
													elm$html$Html$div,
													_List_fromArray(
														[
															A2(elm$html$Html$Attributes$style, 'display', 'flex'),
															A2(elm$html$Html$Attributes$style, 'flex-direction', 'column'),
															A2(elm$html$Html$Attributes$style, 'align-items', 'center'),
															A2(elm$html$Html$Attributes$style, 'margin', '0 20px')
														]),
													_List_fromArray(
														[
															A2(
															elm$html$Html$span,
															_List_fromArray(
																[
																	A2(elm$html$Html$Attributes$style, 'font-size', '24px')
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(title)
																])),
															A2(
															elm$html$Html$div,
															_List_fromArray(
																[
																	A2(elm$html$Html$Attributes$style, 'border', '7px ridge white'),
																	A2(elm$html$Html$Attributes$style, 'border-radius', '4px'),
																	A2(elm$html$Html$Attributes$style, 'background', 'rgba(255, 255, 255, 0.4)'),
																	A2(elm$html$Html$Attributes$style, 'margin', '0 5px'),
																	A2(elm$html$Html$Attributes$style, 'width', 'auto'),
																	A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
																	A2(elm$html$Html$Attributes$style, 'font-size', '0'),
																	A2(elm$html$Html$Attributes$style, 'margin', '12px 0')
																]),
															_List_fromArray(
																[
																	A2(
																	elm$html$Html$img,
																	_List_fromArray(
																		[
																			elm$html$Html$Attributes$src(icon),
																			A2(elm$html$Html$Attributes$style, 'width', '50px'),
																			A2(elm$html$Html$Attributes$style, 'height', '50px'),
																			A2(elm$html$Html$Attributes$style, 'margin', '3px')
																		]),
																	_List_Nil)
																])),
															A2(
															elm$html$Html$em,
															_List_fromArray(
																[
																	A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																	A2(elm$html$Html$Attributes$style, 'line-height', '20px'),
																	A2(elm$html$Html$Attributes$style, 'text-align', 'center'),
																	A2(elm$html$Html$Attributes$style, 'width', '200px'),
																	A2(elm$html$Html$Attributes$style, 'height', '110px')
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(desc)
																])),
															A2(
															elm$html$Html$span,
															_List_fromArray(
																[
																	A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																	A2(elm$html$Html$Attributes$style, 'text-align', 'center')
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(
																	'Cost: $' + elm$core$String$fromInt(cost))
																])),
															A2(
															elm$html$Html$button,
															_Utils_ap(
																_List_fromArray(
																	[
																		A2(elm$html$Html$Attributes$style, 'margin', '10px'),
																		A2(elm$html$Html$Attributes$style, 'color', '#000'),
																		A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																		A2(elm$html$Html$Attributes$style, 'border-radius', '3px'),
																		A2(elm$html$Html$Attributes$style, 'padding', '5px'),
																		elm$html$Html$Events$onClick(
																		msg(cost))
																	]),
																(_Utils_cmp(model.money, cost) > -1) ? _List_fromArray(
																	[
																		A2(elm$html$Html$Attributes$style, 'background', '#0d3'),
																		A2(elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																		A2(elm$html$Html$Attributes$style, 'border-color', '#2f8')
																	]) : _List_fromArray(
																	[
																		A2(elm$html$Html$Attributes$style, 'background', '#aaa'),
																		elm$html$Html$Attributes$disabled(true)
																	])),
															_List_fromArray(
																[
																	elm$html$Html$text('Buy ' + title)
																])),
															A2(
															elm$html$Html$span,
															_List_fromArray(
																[
																	A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																	A2(elm$html$Html$Attributes$style, 'text-align', 'center')
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(
																	'Current amount: ' + elm$core$String$fromInt(currentAmt))
																]))
														]));
											},
											_List_fromArray(
												[
													{
													cost: 10,
													currentAmt: model.moolahSeedAmt,
													desc: 'Harvesting mature Moolah with your scythe will yield money. Use money to buy more crops.',
													icon: 'images/mature-money.png',
													msg: author$project$Game$Buy(author$project$Game$MoolahCropSeed),
													title: 'Moolah Seed'
												},
													{
													cost: 50,
													currentAmt: model.turretSeedAmt,
													desc: 'Mature Turrets will automatically attack incoming creeps. Make sure to grow these before the harder waves!',
													icon: 'images/turret.png',
													msg: author$project$Game$Buy(author$project$Game$TurretSeed),
													title: 'Turret Seed'
												}
												])),
										_List_fromArray(
											[
												A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'display', 'flex'),
														A2(elm$html$Html$Attributes$style, 'flex-direction', 'column'),
														A2(elm$html$Html$Attributes$style, 'align-items', 'center'),
														A2(elm$html$Html$Attributes$style, 'margin', '0 20px')
													]),
												_List_fromArray(
													[
														A2(
														elm$html$Html$span,
														_List_fromArray(
															[
																A2(elm$html$Html$Attributes$style, 'font-size', '24px')
															]),
														_List_fromArray(
															[
																elm$html$Html$text('Water Gun Upgrades')
															])),
														A2(
														elm$html$Html$div,
														_List_Nil,
														A2(
															elm$core$List$map,
															function (_n2) {
																var kind = _n2.a;
																var str = _n2.b;
																var lvl = A3(author$project$Game$currentLevelForUpgrade, session, model, kind);
																var cost = A3(author$project$Game$costForUpgrade, session, model, kind);
																return A2(
																	elm$html$Html$div,
																	_List_Nil,
																	_List_fromArray(
																		[
																			A2(
																			elm$html$Html$span,
																			_List_fromArray(
																				[
																					A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																					A2(elm$html$Html$Attributes$style, 'text-align', 'center')
																				]),
																			_List_fromArray(
																				[
																					elm$html$Html$text(
																					'Cost: $' + elm$core$String$fromInt(cost))
																				])),
																			A2(
																			elm$html$Html$button,
																			_Utils_ap(
																				_List_fromArray(
																					[
																						A2(elm$html$Html$Attributes$style, 'margin', '10px'),
																						A2(elm$html$Html$Attributes$style, 'color', '#000'),
																						A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
																						A2(elm$html$Html$Attributes$style, 'border-radius', '3px'),
																						A2(elm$html$Html$Attributes$style, 'padding', '5px'),
																						elm$html$Html$Events$onClick(
																						author$project$Game$BuyUpgrade(kind))
																					]),
																				(_Utils_cmp(model.money, cost) > -1) ? _List_fromArray(
																					[
																						A2(elm$html$Html$Attributes$style, 'background', '#0d3'),
																						A2(elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																						A2(elm$html$Html$Attributes$style, 'border-color', '#2f8')
																					]) : _List_fromArray(
																					[
																						A2(elm$html$Html$Attributes$style, 'background', '#aaa'),
																						elm$html$Html$Attributes$disabled(true)
																					])),
																			_List_fromArray(
																				[
																					elm$html$Html$text(
																					'Upgrade ' + (str + (' (' + (elm$core$String$fromInt(lvl) + ('->' + (elm$core$String$fromInt(1 + lvl) + ')'))))))
																				]))
																		]));
															},
															_List_fromArray(
																[
																	_Utils_Tuple2(author$project$Game$Range, 'Range'),
																	_Utils_Tuple2(author$project$Game$Capacity, 'Capacity'),
																	_Utils_Tuple2(author$project$Game$FireRate, 'Fire Rate')
																])))
													]))
											]))),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'width', '100%'),
											A2(elm$html$Html$Attributes$style, 'display', 'flex'),
											A2(elm$html$Html$Attributes$style, 'justify-content', 'center'),
											A2(elm$html$Html$Attributes$style, 'margin-top', '15px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$button,
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'font-size', '18px'),
													A2(elm$html$Html$Attributes$style, 'border-radius', '3px'),
													elm$html$Html$Events$onClick(author$project$Game$LeaveMarket)
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Exit')
												]))
										]))
								]))
						]));
		}
	});
var author$project$Game$view = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'height', '100%'),
					A2(elm$html$Html$Attributes$style, 'width', '100%'),
					A2(elm$html$Html$Attributes$style, 'font-family', '\'Open Sans\', sans-serif')
				]),
			_List_fromArray(
				[
					A2(author$project$Game$drawGlass, session, model),
					A2(author$project$Game$viewScreens, session, model),
					A2(author$project$Game$drawHud, session, model),
					A2(author$project$Game$drawEquippables, session, model),
					A2(author$project$Game$drawHelp, session, model)
				]));
	});
var author$project$Main$GameMsg = function (a) {
	return {$: 'GameMsg', a: a};
};
var author$project$Main$MapEditorMsg = function (a) {
	return {$: 'MapEditorMsg', a: a};
};
var author$project$Main$GoToMapEditor = {$: 'GoToMapEditor'};
var author$project$Main$ResetConfig = {$: 'ResetConfig'};
var author$project$Main$ToggleConfig = function (a) {
	return {$: 'ToggleConfig', a: a};
};
var author$project$Main$Group = F2(
	function (a, b) {
		return {$: 'Group', a: a, b: b};
	});
var author$project$Main$Leaf = F2(
	function (a, b) {
		return {$: 'Leaf', a: a, b: b};
	});
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _n0) {
				var trues = _n0.a;
				var falses = _n0.b;
				return pred(x) ? _Utils_Tuple2(
					A2(elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2(elm$core$List$cons, x, falses));
			});
		return A3(
			elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var elm_community$list_extra$List$Extra$gatherWith = F2(
	function (testFn, list) {
		var helper = F2(
			function (scattered, gathered) {
				if (!scattered.b) {
					return elm$core$List$reverse(gathered);
				} else {
					var toGather = scattered.a;
					var population = scattered.b;
					var _n1 = A2(
						elm$core$List$partition,
						testFn(toGather),
						population);
					var gathering = _n1.a;
					var remaining = _n1.b;
					return A2(
						helper,
						remaining,
						A2(
							elm$core$List$cons,
							_Utils_Tuple2(toGather, gathering),
							gathered));
				}
			});
		return A2(helper, list, _List_Nil);
	});
var elm_community$list_extra$List$Extra$gatherEqualsBy = F2(
	function (extract, list) {
		return A2(
			elm_community$list_extra$List$Extra$gatherWith,
			F2(
				function (a, b) {
					return _Utils_eq(
						extract(a),
						extract(b));
				}),
			list);
	});
var author$project$Main$configValsToConfigAccordion = function (configFloats) {
	return A2(
		elm$core$List$map,
		function (_n1) {
			var _n2 = _n1.a;
			var firstName = _n2.a;
			var firstConfigFloat = _n2.b;
			var rest = _n1.b;
			var all = elm$core$List$isEmpty(rest) ? _List_fromArray(
				[
					_Utils_Tuple2(firstName, firstConfigFloat)
				]) : A2(
				elm$core$List$cons,
				_Utils_Tuple2(firstName, firstConfigFloat),
				rest);
			var _n3 = A2(
				elm$core$List$filter,
				A2(elm$core$Basics$composeR, elm$core$String$isEmpty, elm$core$Basics$not),
				A2(elm$core$String$split, ':', firstName));
			if (_n3.b) {
				var prefix = _n3.a;
				return (elm$core$List$isEmpty(rest) && (!A2(elm$core$String$contains, ':', firstName))) ? A2(author$project$Main$Leaf, firstName, firstConfigFloat) : A2(
					author$project$Main$Group,
					prefix,
					author$project$Main$configValsToConfigAccordion(
						A2(
							elm$core$List$map,
							function (_n4) {
								var name = _n4.a;
								var configFloat = _n4.b;
								return _Utils_Tuple2(
									A2(
										elm$core$String$dropLeft,
										elm$core$String$length(prefix) + 1,
										name),
									configFloat);
							},
							all)));
			} else {
				var leafyName = _n3;
				return A2(author$project$Main$Leaf, firstName, firstConfigFloat);
			}
		},
		A2(
			elm_community$list_extra$List$Extra$gatherEqualsBy,
			function (_n0) {
				var name = _n0.a;
				var configFloat = _n0.b;
				return A2(
					elm$core$Maybe$withDefault,
					name,
					elm$core$List$head(
						A2(elm$core$String$split, ':', name)));
			},
			configFloats));
};
var author$project$Main$ChangeConfigMax = F2(
	function (a, b) {
		return {$: 'ChangeConfigMax', a: a, b: b};
	});
var author$project$Main$ChangeConfigMin = F2(
	function (a, b) {
		return {$: 'ChangeConfigMin', a: a, b: b};
	});
var author$project$Main$ChangeConfigVal = F2(
	function (a, b) {
		return {$: 'ChangeConfigVal', a: a, b: b};
	});
var author$project$Main$ToggleConfigAccordion = F2(
	function (a, b) {
		return {$: 'ToggleConfigAccordion', a: a, b: b};
	});
var elm$core$Basics$isInfinite = _Basics_isInfinite;
var elm$core$Basics$isNaN = _Basics_isNaN;
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				elm$core$String$repeat,
				n - elm$core$String$length(string),
				elm$core$String$fromChar(_char)));
	});
var elm$core$String$reverse = _String_reverse;
var elm$core$Basics$neq = _Utils_notEqual;
var myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var elm$core$Char$fromCode = _Char_fromCode;
var myrho$elm_round$Round$increaseNum = function (_n0) {
	var head = _n0.a;
	var tail = _n0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _n1 = elm$core$String$uncons(tail);
		if (_n1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _n1.a;
			return A2(
				elm$core$String$cons,
				_Utils_chr('0'),
				myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			elm$core$String$cons,
			elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var myrho$elm_round$Round$splitComma = function (str) {
	var _n0 = A2(elm$core$String$split, '.', str);
	if (_n0.b) {
		if (_n0.b.b) {
			var before = _n0.a;
			var _n1 = _n0.b;
			var after = _n1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _n0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var myrho$elm_round$Round$toDecimal = function (fl) {
	var _n0 = A2(
		elm$core$String$split,
		'e',
		elm$core$String$fromFloat(
			elm$core$Basics$abs(fl)));
	if (_n0.b) {
		if (_n0.b.b) {
			var num = _n0.a;
			var _n1 = _n0.b;
			var exp = _n1.a;
			var e = A2(
				elm$core$Maybe$withDefault,
				0,
				elm$core$String$toInt(
					A2(elm$core$String$startsWith, '+', exp) ? A2(elm$core$String$dropLeft, 1, exp) : exp));
			var _n2 = myrho$elm_round$Round$splitComma(num);
			var before = _n2.a;
			var after = _n2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				elm$core$Maybe$withDefault,
				'0',
				A2(
					elm$core$Maybe$map,
					function (_n3) {
						var a = _n3.a;
						var b = _n3.b;
						return a + ('.' + b);
					},
					A2(
						elm$core$Maybe$map,
						elm$core$Tuple$mapFirst(elm$core$String$fromChar),
						elm$core$String$uncons(
							_Utils_ap(
								A2(
									elm$core$String$repeat,
									elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _n0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if (elm$core$Basics$isInfinite(fl) || elm$core$Basics$isNaN(fl)) {
			return elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _n0 = myrho$elm_round$Round$splitComma(
				myrho$elm_round$Round$toDecimal(
					elm$core$Basics$abs(fl)));
			var before = _n0.a;
			var after = _n0.b;
			var r = elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2(elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = elm$core$String$length(normalized);
			var roundDigitIndex = A2(elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3(elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3(elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? elm$core$String$reverse(
				A2(
					elm$core$Maybe$withDefault,
					'1',
					A2(
						elm$core$Maybe$map,
						myrho$elm_round$Round$increaseNum,
						elm$core$String$uncons(
							elm$core$String$reverse(remains))))) : remains;
			var numLen = elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					elm$core$String$repeat,
					elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				elm$core$String$length(after)) < 0) ? (A3(elm$core$String$slice, 0, numLen - s, num) + ('.' + A3(elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2(myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var myrho$elm_round$Round$round = myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _n0 = elm$core$String$uncons(str);
			if (_n0.$ === 'Nothing') {
				return false;
			} else {
				if ('5' === _n0.a.a.valueOf()) {
					if (_n0.a.b === '') {
						var _n1 = _n0.a;
						return !signed;
					} else {
						var _n2 = _n0.a;
						return true;
					}
				} else {
					var _n3 = _n0.a;
					var _int = _n3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						elm$core$Char$toCode(_int));
				}
			}
		}));
var author$project$Main$formatConfigFloat = function (val) {
	return A2(myrho$elm_round$Round$round, 2, val);
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$Attributes$max = elm$html$Html$Attributes$stringProperty('max');
var elm$html$Html$Attributes$min = elm$html$Html$Attributes$stringProperty('min');
var elm$html$Html$Attributes$step = function (n) {
	return A2(elm$html$Html$Attributes$stringProperty, 'step', n);
};
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var author$project$Main$viewConfigAccordion = F3(
	function (openConfigAccordions, prefixes, configAccordions) {
		return elm$core$List$concat(
			A2(
				elm$core$List$map,
				function (configAccordion) {
					if (configAccordion.$ === 'Leaf') {
						var name = configAccordion.a;
						var val = configAccordion.b.val;
						var min = configAccordion.b.min;
						var max = configAccordion.b.max;
						return _List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										A2(elm$html$Html$Attributes$style, 'display', 'flex'),
										A2(elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
										A2(elm$html$Html$Attributes$style, 'align-items', 'center'),
										A2(elm$html$Html$Attributes$style, 'margin', '0px 0px')
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(name)
											])),
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												elm$html$Html$span,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'margin', '0 10px')
													]),
												_List_fromArray(
													[
														elm$html$Html$text(
														author$project$Main$formatConfigFloat(val))
													])),
												A2(
												elm$html$Html$input,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'width', '40px'),
														elm$html$Html$Attributes$value(
														author$project$Main$formatConfigFloat(min)),
														elm$html$Html$Events$onInput(
														author$project$Main$ChangeConfigMin(
															A2(
																elm$core$String$join,
																':',
																_Utils_ap(
																	prefixes,
																	_List_fromArray(
																		[name])))))
													]),
												_List_Nil),
												A2(
												elm$html$Html$input,
												_List_fromArray(
													[
														elm$html$Html$Attributes$type_('range'),
														elm$html$Html$Attributes$value(
														author$project$Main$formatConfigFloat(val)),
														elm$html$Html$Attributes$min(
														author$project$Main$formatConfigFloat(min)),
														elm$html$Html$Attributes$max(
														author$project$Main$formatConfigFloat(max)),
														elm$html$Html$Attributes$step('any'),
														elm$html$Html$Events$onInput(
														author$project$Main$ChangeConfigVal(
															A2(
																elm$core$String$join,
																':',
																_Utils_ap(
																	prefixes,
																	_List_fromArray(
																		[name])))))
													]),
												_List_Nil),
												A2(
												elm$html$Html$input,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'width', '40px'),
														elm$html$Html$Attributes$value(
														author$project$Main$formatConfigFloat(max)),
														elm$html$Html$Events$onInput(
														author$project$Main$ChangeConfigMax(
															A2(
																elm$core$String$join,
																':',
																_Utils_ap(
																	prefixes,
																	_List_fromArray(
																		[name])))))
													]),
												_List_Nil)
											]))
									]))
							]);
					} else {
						var name = configAccordion.a;
						var accordions = configAccordion.b;
						return _List_fromArray(
							[
								A2(
								elm$core$Set$member,
								A2(
									elm$core$String$join,
									':',
									_Utils_ap(
										prefixes,
										_List_fromArray(
											[name]))),
								openConfigAccordions) ? A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'font-weight', 'bold')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$button,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'height', '20px'),
														A2(elm$html$Html$Attributes$style, 'border-radius', '5px'),
														A2(elm$html$Html$Attributes$style, 'margin', '2px 0'),
														elm$html$Html$Events$onClick(
														A2(
															author$project$Main$ToggleConfigAccordion,
															false,
															A2(
																elm$core$String$join,
																':',
																_Utils_ap(
																	prefixes,
																	_List_fromArray(
																		[name])))))
													]),
												_List_fromArray(
													[
														elm$html$Html$text('-')
													])),
												elm$html$Html$text(' ' + name)
											])),
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'border-left', '1px solid #ccc'),
												A2(elm$html$Html$Attributes$style, 'margin-left', '12px'),
												A2(elm$html$Html$Attributes$style, 'padding-left', '5px')
											]),
										A3(
											author$project$Main$viewConfigAccordion,
											openConfigAccordions,
											_Utils_ap(
												prefixes,
												_List_fromArray(
													[name])),
											accordions))
									])) : A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'font-weight', 'bold')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$button,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'height', '20px'),
														A2(elm$html$Html$Attributes$style, 'border-radius', '5px'),
														A2(elm$html$Html$Attributes$style, 'margin', '2px 0'),
														elm$html$Html$Events$onClick(
														A2(
															author$project$Main$ToggleConfigAccordion,
															true,
															A2(
																elm$core$String$join,
																':',
																_Utils_ap(
																	prefixes,
																	_List_fromArray(
																		[name])))))
													]),
												_List_fromArray(
													[
														elm$html$Html$text('+')
													])),
												elm$html$Html$text(' ' + name)
											]))
									]))
							]);
					}
				},
				configAccordions));
	});
var author$project$Main$groupConfigFloats = F2(
	function (openConfigAccordions, configFloats) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'font-size', '12px')
				]),
			A3(
				author$project$Main$viewConfigAccordion,
				openConfigAccordions,
				_List_Nil,
				author$project$Main$configValsToConfigAccordion(configFloats)));
	});
var author$project$Main$viewConfig = function (model) {
	return A2(
		elm$html$Html$div,
		_Utils_ap(
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(elm$html$Html$Attributes$style, 'top', '10px'),
					A2(elm$html$Html$Attributes$style, 'right', '10px'),
					A2(elm$html$Html$Attributes$style, 'background', '#eee'),
					A2(elm$html$Html$Attributes$style, 'border', '1px solid #333'),
					A2(elm$html$Html$Attributes$style, 'font-family', 'sans-serif'),
					A2(elm$html$Html$Attributes$style, 'font-size', '18px'),
					A2(elm$html$Html$Attributes$style, 'padding', '8px'),
					A2(elm$html$Html$Attributes$style, 'z-index', '99')
				]),
			model.session.isConfigOpen ? _List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'height', '90%'),
					A2(elm$html$Html$Attributes$style, 'overflow-y', 'scroll')
				]) : _List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, '', '')
				])),
		model.session.isConfigOpen ? A2(
			elm$core$List$cons,
			A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'float', 'left'),
						A2(elm$html$Html$Attributes$style, 'background', 'red'),
						A2(elm$html$Html$Attributes$style, 'color', 'white'),
						A2(elm$html$Html$Attributes$style, 'margin-right', '5px'),
						elm$html$Html$Events$onClick(author$project$Main$ResetConfig)
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Reset Configs')
					])),
			A2(
				elm$core$List$cons,
				A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'float', 'left'),
							elm$html$Html$Events$onClick(author$project$Main$GoToMapEditor)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Go to Map Editor')
						])),
				A2(
					elm$core$List$cons,
					A2(
						elm$html$Html$a,
						_List_fromArray(
							[
								elm$html$Html$Events$onClick(
								author$project$Main$ToggleConfig(false)),
								A2(elm$html$Html$Attributes$style, 'float', 'right'),
								A2(elm$html$Html$Attributes$style, 'display', 'inline-block')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('Collapse Config')
							])),
					A2(
						elm$core$List$cons,
						A2(elm$html$Html$br, _List_Nil, _List_Nil),
						_List_fromArray(
							[
								A2(
								author$project$Main$groupConfigFloats,
								model.session.openConfigAccordions,
								elm$core$Dict$toList(model.session.configFloats))
							]))))) : _List_fromArray(
			[
				A2(
				elm$html$Html$a,
				_List_fromArray(
					[
						elm$html$Html$Events$onClick(
						author$project$Main$ToggleConfig(true))
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Expand Config')
					]))
			]));
};
var author$project$MapEditor$MouseDown = {$: 'MouseDown'};
var author$project$MapEditor$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var author$project$MapEditor$MouseUp = {$: 'MouseUp'};
var author$project$MapEditor$Zoom = function (a) {
	return {$: 'Zoom', a: a};
};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$defaultOptions = {preventDefault: true, stopPropagation: false};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$Event = F3(
	function (mouseEvent, deltaY, deltaMode) {
		return {deltaMode: deltaMode, deltaY: deltaY, mouseEvent: mouseEvent};
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaLine = {$: 'DeltaLine'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPage = {$: 'DeltaPage'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPixel = {$: 'DeltaPixel'};
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$deltaModeDecoder = function () {
	var intToMode = function (_int) {
		switch (_int) {
			case 1:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaLine;
			case 2:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPage;
			default:
				return mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$DeltaPixel;
		}
	};
	return A2(elm$json$Json$Decode$map, intToMode, elm$json$Json$Decode$int);
}();
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$eventDecoder = A4(
	elm$json$Json$Decode$map3,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$Event,
	mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder,
	A2(elm$json$Json$Decode$field, 'deltaY', elm$json$Json$Decode$float),
	A2(elm$json$Json$Decode$field, 'deltaMode', mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$deltaModeDecoder));
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWithOptions = F2(
	function (options, tag) {
		return A2(
			elm$html$Html$Events$custom,
			'wheel',
			A2(
				elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$eventDecoder));
	});
var mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWheel = mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWithOptions(mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$defaultOptions);
var author$project$MapEditor$drawGlass = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2(elm$html$Html$Attributes$style, 'position', 'relative'),
					A2(elm$html$Html$Attributes$style, 'margin', '0'),
					A2(elm$html$Html$Attributes$style, 'font-size', '0'),
					A2(elm$html$Html$Attributes$style, 'width', '100%'),
					A2(elm$html$Html$Attributes$style, 'height', '100%'),
					A2(elm$html$Html$Attributes$style, 'cursor', 'default'),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
					function (_n0) {
						return author$project$MapEditor$MouseDown;
					}),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp(
					function (_n1) {
						return author$project$MapEditor$MouseUp;
					}),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
					function (event) {
						return author$project$MapEditor$MouseMove(event.offsetPos);
					}),
					mpizenberg$elm_pointer_events$Html$Events$Extra$Wheel$onWheel(author$project$MapEditor$Zoom)
				]),
			_List_Nil);
	});
var author$project$MapEditor$LoadMap = function (a) {
	return {$: 'LoadMap', a: a};
};
var author$project$MapEditor$PlayMap = {$: 'PlayMap'};
var author$project$MapEditor$SaveMap = {$: 'SaveMap'};
var author$project$MapEditor$drawSavedMaps = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
					A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2(elm$html$Html$Attributes$style, 'left', '0'),
					A2(elm$html$Html$Attributes$style, 'top', '0'),
					A2(elm$html$Html$Attributes$style, 'padding', '10px'),
					A2(elm$html$Html$Attributes$style, 'margin', '5px'),
					A2(elm$html$Html$Attributes$style, 'background', '#eee'),
					A2(elm$html$Html$Attributes$style, 'border', '2px outset white'),
					A2(elm$html$Html$Attributes$style, 'font-family', 'sans-serif')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'display', 'flex'),
							A2(elm$html$Html$Attributes$style, 'flex-direction', 'column'),
							A2(elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2(elm$html$Html$Attributes$style, 'align-items', 'stretch')
						]),
					A2(
						elm$core$List$map,
						function (savedMap) {
							var isActive = _Utils_eq(model.editingMap.name, savedMap.name);
							return A2(
								elm$html$Html$div,
								A2(
									elm$core$List$append,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'display', 'flex'),
											A2(elm$html$Html$Attributes$style, 'border', '2px solid #ccc'),
											A2(elm$html$Html$Attributes$style, 'margin', '2px'),
											A2(elm$html$Html$Attributes$style, 'padding', '8px 15px'),
											A2(elm$html$Html$Attributes$style, 'align-items', 'stretch'),
											A2(elm$html$Html$Attributes$style, 'justify-content', 'space-between')
										]),
									isActive ? _List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'background', '#07f'),
											A2(elm$html$Html$Attributes$style, 'color', 'white')
										]) : _List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'background', '#ddd')
										])),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'margin-right', '10px')
											]),
										_List_fromArray(
											[
												elm$html$Html$text(savedMap.name)
											])),
										A2(
										elm$html$Html$div,
										_List_Nil,
										isActive ? _List_fromArray(
											[
												A2(
												elm$html$Html$button,
												_List_fromArray(
													[
														elm$html$Html$Events$onClick(author$project$MapEditor$SaveMap),
														A2(elm$html$Html$Attributes$style, 'background', '#afa'),
														A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
														A2(elm$html$Html$Attributes$style, 'cursor', 'pointer')
													]),
												_List_fromArray(
													[
														elm$html$Html$text('Save')
													])),
												elm$html$Html$text(' '),
												A2(
												elm$html$Html$button,
												_List_fromArray(
													[
														elm$html$Html$Events$onClick(author$project$MapEditor$PlayMap),
														A2(elm$html$Html$Attributes$style, 'background', 'orange'),
														A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
														A2(elm$html$Html$Attributes$style, 'cursor', 'pointer')
													]),
												_List_fromArray(
													[
														elm$html$Html$text('Play')
													]))
											]) : _List_fromArray(
											[
												A2(
												elm$html$Html$button,
												_List_fromArray(
													[
														elm$html$Html$Events$onClick(
														author$project$MapEditor$LoadMap(savedMap.name)),
														A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
														A2(elm$html$Html$Attributes$style, 'cursor', 'pointer')
													]),
												_List_fromArray(
													[
														elm$html$Html$text('Load')
													]))
											]))
									]));
						},
						session.savedMaps))
				]));
	});
var author$project$MapEditor$BaseTool = {$: 'BaseTool'};
var author$project$MapEditor$ClearTool = {$: 'ClearTool'};
var author$project$MapEditor$EnemyTowerTool = {$: 'EnemyTowerTool'};
var author$project$MapEditor$HeroTool = {$: 'HeroTool'};
var author$project$MapEditor$RectTool = {$: 'RectTool'};
var author$project$MapEditor$ChooseTile = function (a) {
	return {$: 'ChooseTile', a: a};
};
var author$project$MapEditor$tileBtn = F3(
	function (currentTile, maybeTile, label) {
		return A2(
			elm$html$Html$button,
			_List_fromArray(
				[
					elm$html$Html$Events$onClick(
					author$project$MapEditor$ChooseTile(maybeTile)),
					A2(elm$html$Html$Attributes$style, 'outline', 'none'),
					_Utils_eq(currentTile, maybeTile) ? A2(elm$html$Html$Attributes$style, 'background', '#ccc') : A2(elm$html$Html$Attributes$style, 'background', '#fff')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(label)
				]));
	});
var author$project$MapEditor$ChooseTool = function (a) {
	return {$: 'ChooseTool', a: a};
};
var author$project$MapEditor$toolBtn = F3(
	function (currentTool, tool, label) {
		return A2(
			elm$html$Html$button,
			_List_fromArray(
				[
					elm$html$Html$Events$onClick(
					author$project$MapEditor$ChooseTool(tool)),
					A2(elm$html$Html$Attributes$style, 'outline', 'none'),
					_Utils_eq(currentTool, tool) ? A2(elm$html$Html$Attributes$style, 'background', '#ccc') : A2(elm$html$Html$Attributes$style, 'background', '#fff')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(label)
				]));
	});
var author$project$MapEditor$drawToolbox = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
					A2(elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2(elm$html$Html$Attributes$style, 'right', '0'),
					A2(elm$html$Html$Attributes$style, 'top', '50px'),
					A2(elm$html$Html$Attributes$style, 'padding', '20px'),
					A2(elm$html$Html$Attributes$style, 'margin', '5px'),
					A2(elm$html$Html$Attributes$style, 'background', '#eee'),
					A2(elm$html$Html$Attributes$style, 'border', '2px outset white')
				]),
			_List_fromArray(
				[
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$PencilTool, 'Pencil'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$RectTool, 'Rect'),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A3(
					author$project$MapEditor$tileBtn,
					model.currentTile,
					elm$core$Maybe$Just(author$project$Common$Water),
					'Water'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(
					author$project$MapEditor$tileBtn,
					model.currentTile,
					elm$core$Maybe$Just(author$project$Common$Grass),
					'Grass'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$tileBtn, model.currentTile, elm$core$Maybe$Nothing, 'Erase Tile'),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$HeroTool, 'Hero'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$BaseTool, 'Base'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$EnemyTowerTool, 'Enemy Tower'),
					A2(elm$html$Html$br, _List_Nil, _List_Nil),
					A3(author$project$MapEditor$toolBtn, model.currentTool, author$project$MapEditor$ClearTool, '(clear)')
				]));
	});
var author$project$MapEditor$view = F2(
	function (session, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'width', '100%'),
					A2(elm$html$Html$Attributes$style, 'height', '100%')
				]),
			_List_fromArray(
				[
					A2(author$project$MapEditor$drawGlass, session, model),
					A2(author$project$MapEditor$drawSavedMaps, session, model),
					A2(author$project$MapEditor$drawToolbox, session, model)
				]));
	});
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var author$project$Main$view = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2(elm$html$Html$Attributes$style, 'width', '100%'),
				A2(elm$html$Html$Attributes$style, 'height', '100%')
			]),
		_List_fromArray(
			[
				function () {
				var _n0 = model.state;
				if (_n0.$ === 'Game') {
					var gameModel = _n0.a;
					return A2(
						elm$html$Html$map,
						author$project$Main$GameMsg,
						A2(author$project$Game$view, model.session, gameModel));
				} else {
					var mapModel = _n0.a;
					return A2(
						elm$html$Html$map,
						author$project$Main$MapEditorMsg,
						A2(author$project$MapEditor$view, model.session, mapModel));
				}
			}(),
				author$project$Main$viewConfig(model)
			]));
};
var elm$browser$Browser$element = _Browser_element;
var elm$json$Json$Decode$value = _Json_decodeValue;
var author$project$Main$main = elm$browser$Browser$element(
	{init: author$project$Main$init, subscriptions: author$project$Main$subscriptions, update: author$project$Main$update, view: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(elm$json$Json$Decode$value)(0)}});}(this));
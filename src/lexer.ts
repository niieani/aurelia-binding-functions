import {Scanner, Token} from 'aurelia-binding'

export function patchLexer() {
  const scanToken = Scanner.prototype.scanToken
  
  Scanner.prototype.scanToken = function() {
    if (isIdentifierStart(this.peek)) {
      return this.scanIdentifier();
    }
    return scanToken.apply(this, arguments)
  }
  
  /**
   * from: https://github.com/aurelia/binding/blob/master/src/lexer.js
   */
  Scanner.prototype.scanIdentifier = function() {
    assert(isIdentifierStart(this.peek));
    let start = this.index;

    this.advance();

    while (isIdentifierPart(this.peek)) {
      this.advance();
    }

    let text = this.input.substring(start, this.index);
    let result = new Token(start, text);

    // TODO(kasperl): Deal with null, undefined, true, and false in
    // a cleaner and faster way.
    if (OPERATORS.indexOf(text) !== -1) {
      result.withOp(text);
    } else {
      result.withGetterSetter(text);
    }

    return result;
  }
  
  const $$ = 36;
  const $a = 97;
  const $z = 122;
  const $_ = 95;
    
  const $0 = 48;
  const $9 = 57;

  const $A = 65;
  const $Z = 90;
  
  const $AT = 64;  // our addition
  
  const OPERATORS = [
    'undefined',
    'null',
    'true',
    'false',
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '=',
    '==',
    '===',
    '!=',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '&&',
    '||',
    '&',
    '|',
    '!',
    '?',
  ];

  function isIdentifierStart(code) {
    return ($a <= code && code <= $z)
        || ($A <= code && code <= $Z)
        || (code === $_)
        || (code === $$)
        || (code === $AT); // our addition
  }

  function isIdentifierPart(code) {
    return ($a <= code && code <= $z)
        || ($A <= code && code <= $Z)
        || ($0 <= code && code <= $9)
        || (code === $_)
        || (code === $$);
  }
  
  function assert(condition, message?) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
}

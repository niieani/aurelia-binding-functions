import {ParserImplementation, AccessThis, AccessScope, CallScope, Expression, Token} from 'aurelia-binding'
import {BindingFunctionScope} from './binding-function-scope'

export function patchParserImplementation() {
  ParserImplementation.prototype.scopeFunctions = {};
  ParserImplementation.prototype.registerScopeFunction = function(name: string, expressionClass: new(name, args, ancestor) => Expression): void {
    this.scopeFunctions[name] = expressionClass;
  }
  
  const EOF = new Token(-1, null);
  
  ParserImplementation.prototype.parseAccessOrCallScope = function() {
    let name: string = this.peek.key;

    this.advance();

    if (name === '$this') {
      return new AccessThis(0);
    }

    let ancestor = 0;
    while (name === '$parent') {
      ancestor++;
      if (this.optional('.')) {
        name = this.peek.key;
        this.advance();
      } else if (this.peek === EOF || this.peek.text === '(' || this.peek.text === '[' || this.peek.text === '}') {
        return new AccessThis(ancestor);
      } else {
        this.error(`Unexpected token ${this.peek.text}`);
      }
    }

    if (this.optional('(')) {
      let args = this.parseExpressionList(')');
      this.expect(')');
      // START CHANGES
      let ctor = this.scopeFunctions[name] || name.charAt(0) === '@' ? BindingFunctionScope : CallScope;
      return new ctor(name, args, ancestor);
      // END CHANGES
    }

    return new AccessScope(name, ancestor);
  }
}

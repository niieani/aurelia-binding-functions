import {FrameworkConfiguration} from 'aurelia-framework'
import {CallScope, Scope, Binding, Expression} from 'aurelia-binding'
import {BindingFunctionScope} from './binding-function-scope'
import {patchModuleAnalyzer} from './module-analyzer'
import {patchViewResources} from './view-resources'
import {patchLexer} from './lexer'
import {patchAccessExpressions} from './access-expression'
import {patchParserImplementation} from './parser-implementation'
export {bindingFunction, BindingFunctionResource} from './binding-function-resource'
export {BindingFunctionScope} from './binding-function-scope'

export function configure(frameworkConfig: FrameworkConfiguration) {
  const viewResources = frameworkConfig.aurelia.resources
  
  // monkey patch ViewResources to understand BindingFunctions
  patchViewResources(viewResources)
  
  // monkey patch ModuleAnalyzer to understand BindingFunctions
  patchModuleAnalyzer()
  
  // monkey patch AccessKeyed and AccessMember to bind/unbind its objects if needed
  patchAccessExpressions()
  
  // monkey patch ParserImplementation to support ScopeFunctions with fallback to BindingFunctionScope
  patchParserImplementation()
  
  // monkey patch Lexer to allow '@' as a start for an identificator
  patchLexer()
}

export interface BindingFunction {
  /**
   * invoked by Aurelia to either: 
   *  - retrieve the current value of the binding
   *  - trigger a call (e.g. by click.delegate)
   */
  evaluate(bindingFunctionScope: BindingFunctionScope, scope: Scope, lookupFunctions, mustEvaluate: boolean): any
  
  /**
   * invoked if the binding is used as a source of values
   * (as opposed to being used to trigger changes, like in click.delegate)
   * this is invoked by Aurelia after bind() and every time the binding is recomputed
   */
  connect?(bindingFunctionScope: BindingFunctionScope, binding: Binding, scope: Scope): void
  
  /**
   * when the binding is two-way, invoked every time new values are fed into the binding by Aurelia
   */
  assign?(bindingFunctionScope: BindingFunctionScope, scope: Scope, value: any, lookupFunctions: any): void
  
  /**
   * invoked when the binding is bound
   */
  bind?(bindingFunctionScope: BindingFunctionScope, binding: Binding, scope: Scope, lookupFunctions: any): void
  
  /**
   * invoked when the binding is unbound
   */
  unbind?(bindingFunctionScope: BindingFunctionScope, binding: Binding, scope: Scope): void
}

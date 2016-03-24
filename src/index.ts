import {FrameworkConfiguration} from 'aurelia-framework'
import {CallScope, Scope, Binding, Expression} from 'aurelia-binding'
import {patchModuleAnalyzer} from './module-analyzer'
import {patchCallScope} from './call-scope'
import {patchViewResources} from './view-resources'
import {patchLexer} from './lexer'
export {bindingFunction, BindingFunctionResource} from './binding-function-resource'

export function configure(frameworkConfig: FrameworkConfiguration) {
  const viewResources = frameworkConfig.aurelia.resources
  
  // monkey patch ViewResources to understand BindingFunctions
  patchViewResources(viewResources)
  
  // monkey patch ModuleAnalyzer to understand BindingFunctions
  patchModuleAnalyzer()
  
  // monkey patch CallScope
  patchCallScope()
  
  // monkey patch Lexer to allow '@' as a start for an identificator
  patchLexer()
}

export interface BindingFunction {
  /**
   * invoked by Aurelia to either: 
   *  - retrieve the current value of the binding
   *  - trigger a call (e.g. by click.delegate)
   */
  evaluate(callScope: CallScope, scope: Scope, lookupFunctions, mustEvaluate: boolean): any
  
  /**
   * invoked if the binding is used as a source of values
   * (as opposed to being used to trigger changes, like in click.delegate)
   * this is invoked by Aurelia after bind()
   */
  connect?(callScope: CallScope, binding: Binding, scope: Scope): void
  
  /**
   * when the binding is two-way, invoked every time new values are fed into the binding by Aurelia
   */
  assign?(callScope: CallScope, scope: Scope, value: any, lookupFunctions: any): void
  
  /**
   * invoked when the binding is bound
   */
  bind?(callScope: CallScope, binding: Binding, scope: Scope, lookupFunctions: any): void
  
  /**
   * invoked when the binding is unbound
   */
  unbind?(callScope: CallScope, binding: Binding, scope: Scope): void
}

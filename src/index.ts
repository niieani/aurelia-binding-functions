import {FrameworkConfiguration} from 'aurelia-framework'
import {CallScope, Scope, Binding, Expression} from 'aurelia-binding'
import {patchModuleAnalyzer} from './module-analyzer'
import {patchCallScope} from './call-scope'
import {patchViewResources} from './view-resources'
export {bindingFunction, BindingFunctionResource} from './binding-function-resource'

export function configure(frameworkConfig: FrameworkConfiguration) {
  const viewResources = frameworkConfig.aurelia.resources
  
  // monkey patch ViewResources to understand BindingFunctions
  patchViewResources(viewResources)
  
  // monkey patch ModuleAnalyzer to understand BindingFunctions
  patchModuleAnalyzer()
  
  // monkey patch CallScope
  patchCallScope()
}

export interface BindingFunction {
  connect?(callScope: CallScope, binding: Binding, scope: Scope): void
  assign?(callScope: CallScope, scope: Scope, value: any, lookupFunctions: any): void
  evaluate(callScope: CallScope, scope: Scope, lookupFunctions, mustEvaluate: boolean): any
  bind?(callScope: CallScope, binding: Binding, scope: Scope, lookupFunctions: any): void
  unbind?(callScope: CallScope, binding: Binding, scope: Scope): void
}

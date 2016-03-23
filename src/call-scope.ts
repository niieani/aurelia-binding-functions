import {CallScope, Scope, Binding, Expression} from 'aurelia-binding'
import {BindingFunction} from './index'

export function patchCallScope() {
  const callScopeConnect: Function = CallScope.prototype.connect
  
  CallScope.prototype.connect = function connect(binding: Binding, scope: Scope) {
    callScopeConnect.apply(this, arguments)
    
    const bindingFunction = binding.lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.connect === 'function') {
      bindingFunction.connect(this, binding, scope)
    }
  }
  
  CallScope.prototype.assign = function assign(scope: Scope, value: any, lookupFunctions: any): any {
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.assign === 'function') {
      return bindingFunction.assign(this, scope, value, lookupFunctions)
    }
    return Expression.prototype.assign.apply(this, arguments)
  }
  
  const callScopeEvaluate: Function = CallScope.prototype.evaluate
  
  CallScope.prototype.evaluate = function evaluate(scope: Scope, lookupFunctions, mustEvaluate: boolean) {    
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction) {
      if (typeof bindingFunction.evaluate === 'function')
        return bindingFunction.evaluate(this, scope, lookupFunctions, mustEvaluate)
      else
        throw new Error('BindingFunction needs to implement evaluate()')
    }
    return callScopeEvaluate.apply(this, arguments)
  }
  
  CallScope.prototype.bind = function bind(binding: Binding, scope: Scope, lookupFunctions) {
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.bind === 'function') {
      return bindingFunction.bind(this, binding, scope, lookupFunctions)
    }
  }
  
  CallScope.prototype.unbind = function unbind(binding: Binding, scope: Scope) {
    const bindingFunction = binding.lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.unbind === 'function') {
      bindingFunction.unbind(this, binding, scope)
    }
  }
}

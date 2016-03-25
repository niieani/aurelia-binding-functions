import {Expression, Binding, Scope} from 'aurelia-binding'
import {BindingFunction} from './index'

export class BindingFunctionScope extends Expression {
  name;
  args;
  ancestor;
  
  constructor(name, args, ancestor) {
    super();

    this.name = name;
    this.args = args;
    this.ancestor = ancestor;
  }
  
  connect(binding: Binding, scope: Scope) {
    const lookupFunctions = binding.lookupFunctions || scope.resources.lookupFunctions
            
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.connect === 'function') {
      bindingFunction.connect(this, binding, scope)
    }
  }
  
  assign(scope: Scope, value: any, lookupFunctions: any): any {
    lookupFunctions = lookupFunctions || scope.resources.lookupFunctions
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.assign === 'function') {
      return bindingFunction.assign(this, scope, value, lookupFunctions)
    }
    throw new Error(`The BindingFunction '${this.name}' is not assignable`)
  }
  
  evaluate(scope: Scope, lookupFunctions?, mustEvaluate?: boolean) {    
    lookupFunctions = lookupFunctions || scope.resources.lookupFunctions    
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction) {
      if (typeof bindingFunction.evaluate === 'function')
        return bindingFunction.evaluate(this, scope, lookupFunctions, mustEvaluate)
      else
        throw new Error('The BindingFunction needs to implement evaluate()')
    }
    throw new Error(`No BindingFunction under the name '${this.name}' is registered`)    
  }
  
  bind(binding: Binding, scope: Scope, lookupFunctions) {
    lookupFunctions = lookupFunctions || binding.lookupFunctions || scope.resources.lookupFunctions    
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.bind === 'function') {
      return bindingFunction.bind(this, binding, scope, lookupFunctions)
    }
  }
  
  unbind(binding: Binding, scope: Scope) {
    const lookupFunctions = binding.lookupFunctions || scope.resources.lookupFunctions    
    const bindingFunction = lookupFunctions.bindingFunctions(this.name) as BindingFunction
    if (bindingFunction && typeof bindingFunction.unbind === 'function') {
      bindingFunction.unbind(this, binding, scope)
    }
  }
}

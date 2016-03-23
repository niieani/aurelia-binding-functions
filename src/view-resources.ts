import {ViewResources} from 'aurelia-templating'

export function patchViewResources(viewResources: ViewResources) {
  /**
  * Registers a binding behavior.
  * @param name The name of the binding function.
  * @param bindingBehavior The binding function instance.
  */
  ViewResources.prototype.registerBindingFunction = function(name: string, bindingFunction: Object): void {
    // TODO: this should be done in a monkey-patched constructor
    if (!this.lookupFunctions.bindingFunctions) Object.assign(this.lookupFunctions, { bindingFunctions: this.getBindingFunction.bind(this) })
    if (!this.bindingFunctions) this.bindingFunctions = {}
    
    register(this.bindingFunctions, name, bindingFunction, 'a BindingFunction')
  }
  
  /**
  * Gets a binding behavior.
  * @param name The name of the binding function.
  * @return The binding function instance.
  */
  ViewResources.prototype.getBindingFunction = function(name: string): Object {
    // TODO: this should be done in a monkey-patched constructor
    if (!this.lookupFunctions.bindingFunctions) Object.assign(this.lookupFunctions, { bindingFunctions: this.getBindingFunction.bind(this) })
    if (!this.bindingFunctions) this.bindingFunctions = {}
    
    return this.bindingFunctions[name] || (this.hasParent ? this.parent.getBindingFunction(name) : null)
  }
  
  // 2. patch global instance of ViewResources
  viewResources.bindingFunctions = {}
  Object.assign(viewResources.lookupFunctions, { bindingFunctions: viewResources.getBindingFunction.bind(viewResources) })
}

/**
 * from https://github.com/aurelia/templating/blob/master/src/view-resources.js
 */
function register(lookup, name, resource, type) {
  if (!name) {
    return;
  }

  let existing = lookup[name];
  if (existing) {
    if (existing !== resource) {
      throw new Error(`Attempted to register ${type} when one with the same name already exists. Name: ${name}.`);
    }

    return;
  }

  lookup[name] = resource;
}

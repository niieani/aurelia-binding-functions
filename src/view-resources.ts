import {ViewResources, ViewEngine, ViewCompileInstruction} from 'aurelia-templating'
import * as LogManager from 'aurelia-logging'

export function patchViewResources(viewResources: ViewResources) {
  const logger = LogManager.getLogger('templating');
  /**
   * from: https://github.com/aurelia/templating/blob/master/src/view-engine.js
   */
  ViewEngine.prototype.loadTemplateResources = function loadTemplateResources(registryEntry, compileInstruction, loadContext) {
    var resources = new ViewResources(this.appResources, registryEntry.address);
    
    // START PATCH
    // TODO: this should be done in a monkey-patched constructor of ViewResources
    if (!resources.lookupFunctions.bindingFunctions) Object.assign(resources.lookupFunctions, { bindingFunctions: resources.getBindingFunction.bind(resources) })
    if (!resources.bindingFunctions) resources.bindingFunctions = {}
    // END PATCH
  
    var dependencies = registryEntry.dependencies;
    var importIds = void 0;
    var names = void 0;

    compileInstruction = compileInstruction || ViewCompileInstruction.normal;

    if (dependencies.length === 0 && !compileInstruction.associatedModuleId) {
      return Promise.resolve(resources);
    }

    importIds = dependencies.map(function (x) {
      return x.src;
    });
    names = dependencies.map(function (x) {
      return x.name;
    });
    logger.debug('importing resources for ' + registryEntry.address, importIds);

    return this.importViewResources(importIds, names, resources, compileInstruction, loadContext);
  };
  
  /**
  * Registers a binding behavior.
  * @param name The name of the binding function.
  * @param bindingBehavior The binding function instance.
  */
  ViewResources.prototype.registerBindingFunction = function(name: string, bindingFunction: Object): void {
    register(this.bindingFunctions, name, bindingFunction, 'a BindingFunction')
  }
  
  /**
  * Gets a binding behavior.
  * @param name The name of the binding function.
  * @return The binding function instance.
  */
  ViewResources.prototype.getBindingFunction = function(name: string): Object {
    return this.bindingFunctions[name] || (this.hasParent ? this.parent.getBindingFunction(name) : null)
  }
  
  // patch global instance of ViewResources
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

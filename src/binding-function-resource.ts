import {camelCase} from 'aurelia-binding'
import {metadata} from 'aurelia-metadata'
import {BindingFunction} from './index'

export class BindingFunctionResource {
  instance: BindingFunction;
  constructor(public name: string) {}

  static convention(name) {
    if (name.endsWith('BindingFunction')) {
      return new BindingFunctionResource(camelCase(name.substring(0, name.length - 15)));
    }
  }

  initialize(container, target) {
    this.instance = container.get(target);
  }

  register(registry, name) {
    registry.registerBindingFunction(name || this.name, this.instance);
  }

  load(container, target) {}
}

export function bindingFunction(nameOrTarget){
  if(nameOrTarget === undefined || typeof nameOrTarget === 'string'){
    return function(target) {
      metadata.define(metadata.resource, new BindingFunctionResource(nameOrTarget), target);
    }
  }

  metadata.define(metadata.resource, new BindingFunctionResource(), nameOrTarget);
}
import {CallScope, Scope, Binding, Expression, AccessMember, AccessKeyed} from 'aurelia-binding'
import {BindingFunction} from './index'

export function patchAccessExpressions() {
  AccessMember.prototype.bind = function bind(binding: Binding, scope: Scope, lookupFunctions) {
    // if (this.object instanceof CallScope || this.object instanceof AccessMember || this.object instanceof AccessKeyed) {
    if (this.object && typeof this.object.bind === 'function') {
      this.object.bind(binding, scope, lookupFunctions)
    }
  }
  
  AccessMember.prototype.unbind = function unbind(binding: Binding, scope: Scope) {
    // if (this.object instanceof CallScope || this.object instanceof AccessMember || this.object instanceof AccessKeyed) {
    if (this.object && typeof this.object.unbind === 'function') {
      this.object.unbind(binding, scope)
    }
  }
  
  AccessKeyed.prototype.bind = function bind(binding: Binding, scope: Scope, lookupFunctions) {
    // if (this.object instanceof CallScope || this.object instanceof AccessMember || this.object instanceof AccessKeyed) {
    if (this.object && typeof this.object.bind === 'function') {
      this.object.bind(binding, scope, lookupFunctions)
    }
  }
  
  AccessKeyed.prototype.unbind = function unbind(binding: Binding, scope: Scope) {
    // if (this.object instanceof CallScope || this.object instanceof AccessMember || this.object instanceof AccessKeyed) {
    if (this.object && typeof this.object.unbind === 'function') {
      this.object.unbind(binding, scope)
    }
  }
}

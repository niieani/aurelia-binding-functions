import {ModuleAnalyzer, ResourceModule, ResourceDescription, HtmlBehaviorResource, viewStrategy, TemplateRegistryViewStrategy, ViewResources, ResourceLoadContext, _hyphenate} from 'aurelia-templating'
import {metadata} from 'aurelia-metadata'
import {TemplateRegistryEntry} from 'aurelia-loader';
import {ValueConverterResource} from 'aurelia-binding';
import {BindingBehaviorResource} from 'aurelia-binding';
import {BindingFunctionResource} from './binding-function-resource'

/**
 * patch ModuleAnalyzer to understand BindingFunctions
 * ModuleAnalyzer from https://github.com/aurelia/templating/blob/master/src/module-analyzer.js
 */
export function patchModuleAnalyzer() {
  /**
  * Analyzes a module.
  * @param moduleId The id of the module to analyze.
  * @param moduleInstance The module instance to analyze.
  * @param mainResourceKey The name of the main resource.
  * @return The ResouceModule representing the analysis.
  */
  ModuleAnalyzer.prototype.analyze = function analyze(moduleId: string, moduleInstance: any, mainResourceKey?: string): ResourceModule {
    let mainResource;
    let fallbackValue;
    let fallbackKey;
    let resourceTypeMeta;
    let key;
    let exportedValue;
    let resources = [];
    let conventional;
    let vs;
    let resourceModule;

    resourceModule = this.cache[moduleId];
    if (resourceModule) {
      return resourceModule;
    }

    resourceModule = new ResourceModule(moduleId);
    this.cache[moduleId] = resourceModule;

    if (typeof moduleInstance === 'function') {
      moduleInstance = {'default': moduleInstance};
    }

    if (mainResourceKey) {
      mainResource = new ResourceDescription(mainResourceKey, moduleInstance[mainResourceKey]);
    }

    for (key in moduleInstance) {
      exportedValue = moduleInstance[key];

      if (key === mainResourceKey || typeof exportedValue !== 'function') {
        continue;
      }

      resourceTypeMeta = metadata.get(metadata.resource, exportedValue);

      if (resourceTypeMeta) {
        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          //no customeElement or customAttribute but behavior added by other metadata
          HtmlBehaviorResource.convention(key, resourceTypeMeta);
        }

        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          //no convention and no customeElement or customAttribute but behavior added by other metadata
          resourceTypeMeta.elementName = _hyphenate(key);
        }

        if (!mainResource && resourceTypeMeta instanceof HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
          mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
        } else {
          resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
        }
      } else if (viewStrategy.decorates(exportedValue)) {
        vs = exportedValue;
      } else if (exportedValue instanceof TemplateRegistryEntry) {
        vs = new TemplateRegistryViewStrategy(moduleId, exportedValue);
      } else {
        if (conventional = HtmlBehaviorResource.convention(key)) {
          if (conventional.elementName !== null && !mainResource) {
            mainResource = new ResourceDescription(key, exportedValue, conventional);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
          }

          metadata.define(metadata.resource, conventional, exportedValue);
        } else if (conventional = ValueConverterResource.convention(key)) {
          resources.push(new ResourceDescription(key, exportedValue, conventional));
          metadata.define(metadata.resource, conventional, exportedValue);
        } else if (conventional = BindingBehaviorResource.convention(key)) {
          resources.push(new ResourceDescription(key, exportedValue, conventional));
          metadata.define(metadata.resource, conventional, exportedValue);
        } else if (conventional = BindingFunctionResource.convention(key)) {
          resources.push(new ResourceDescription(key, exportedValue, conventional));
          metadata.define(metadata.resource, conventional, exportedValue);
        } else if (!fallbackValue) {
          fallbackValue = exportedValue;
          fallbackKey = key;
        }
      }
    }

    if (!mainResource && fallbackValue) {
      mainResource = new ResourceDescription(fallbackKey, fallbackValue);
    }

    resourceModule.moduleInstance = moduleInstance;
    resourceModule.mainResource = mainResource;
    resourceModule.resources = resources;
    resourceModule.viewStrategy = vs;

    return resourceModule;
  }
}

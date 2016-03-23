# aurelia-binding-functions

An Aurelia plugin that allows you to create bi-directional BindingFunctions in a similar way to (ValueConverters)[http://aurelia.io/docs.html#/aurelia/binding/latest/doc/article/binding-value-converters] or BindingBehaviors.

## How to install this plugin?

1. In your project install the plugin via `jspm` with following command

  ```shell
  jspm install npm:aurelia-binding-functions
  ```
2. Make Aurelia load the plugin by adding the following line to the `configure` function in the `main.js` file of your `src` folder

  ```diff
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging();

  +   aurelia.use.plugin('aurelia-binding-functions');

      aurelia.start().then(a => a.setRoot());
    }
  ```
3. If you use TypeScript or use Visual Studio Code the type declarations for `aurelia-binding-functions` should be visible automatically. 

## Using the plugin

You may create a BindingFunction the same way as you would BindingBehaviors or ValueConverters.

The simplest implementation for a one-way binding might look as follows:

```ts
// async-binding-function.ts //

export class AsyncBindingFunction implements BindingFunction {
  connect(callScope: CallScope, binding: Binding, scope: Scope) {
    const promise = callScope.args[0].evaluate(scope, binding.lookupFunctions, true) as Promise<any> & {promiseResult:any}
    
    binding.observeProperty(promise, 'promiseResult')
    
    if (promise.promiseResult === undefined && typeof promise.then === 'function') {
      promise.then(value => {
        promise.promiseResult = value
      })
    }
  }
  
  evaluate(callScope: CallScope, scope: Scope, lookupFunctions, mustEvaluate: boolean) {
    const promise = callScope.args[0].evaluate(scope, lookupFunctions, true) as Promise<any> & {promiseResult:any}
    return promise ? promise.promiseResult : undefined
  }
}
```

Now the BindingFunction can be used inside bindings:

```html
<require from="./async-binding-function"></require>

<h2>${async(somePromise)}</h2>
```

A BindingFunction can implement the following methods:

```ts
export interface BindingFunction {
  // invoked by Aurelia to either: 
  //  - retrieve the current value of the binding
  //  - trigger a call (e.g. by click.delegate)
  evaluate(callScope: CallScope, scope: Scope, lookupFunctions, mustEvaluate: boolean): any
  
  // invoked if the binding is used as a source of values 
  // (as opposed to being used to trigger changes, like in click.delegate)
  // this is invoked by Aurelia after bind()
  connect?(callScope: CallScope, binding: Binding, scope: Scope): void
  
  // when the binding is two-way, invoked every time new values are fed into the binding by Aurelia  
  assign?(callScope: CallScope, scope: Scope, value: any, lookupFunctions: any): void
  
  // invoked when the binding is bound
  bind?(callScope: CallScope, binding: Binding, scope: Scope, lookupFunctions: any): void
  
  // invoked when the binding is unbound
  unbind?(callScope: CallScope, binding: Binding, scope: Scope): void
}
```

For a one-way binding you only need to implement the `evaluate()` method, the rest is optional.
A two-way binding requires you to also implement `assign()`.

## Dependencies

* [aurelia-templating](https://github.com/aurelia/templating)
* [aurelia-binding](https://github.com/aurelia/binding)
* [aurelia-loader](https://github.com/aurelia/loader)
* [aurelia-metadata](https://github.com/aurelia/metadata)

## Used By

This library isn't used by Aurelia. It is an optional plugin.

## Platform Support

This library can be used in the **browser** as well as on the **server**.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```

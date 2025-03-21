This package is part of quickjs-emscripten, a Javascript interface for QuickJS compiled to WebAssembly via Emscripten.

This package (quickjs-emscripten-core) contains only Javascript code - no WebAssembly. To use this package, you'll need to install one or more variants of the QuickJS WebAssembly build, see available variants below.

// 1. Import a QuickJS module constructor function from quickjs-emscripten-core
import { newQuickJSWASMModuleFromVariant } from "quickjs-emscripten-core"

// 2. Import a variant suitable for your use case. For example, if you only care to
//    target with the fastest execution speed, import the release build variant
import releaseVariant from "@jitl/quickjs-singlefile-cjs-release-sync"

// 3. Create the "QuickJS" module that presents the quickjs-emscripten API.
//    Export and use in other files, or consume directly.
const QuickJS = await newQuickJSWASMModuleFromVariant(releaseVariant)
What's a variant?
A variant describes how to load a QuickJS WebAssembly build and how to call the low-level C API functions used by the higher-level abstractions in quickjs-emscripten-core. A variant is an object with the following properties:

const variant = {
  // This should be `async` if the variant is built with ASYNCIFY
  // so that the WebAssembly module execution can be suspended.
  //
  // Otherwise, this should be `sync`.
  type: "sync",
  // This should be a function that resolves to a QuickJSFFI class.
  importFFI: () => import("something/ffi.ts").then((mod) => mod.QuickJSFFI),
  // This should be a function that resolves to a Emscripten-shaped WASM module factory.
  importModuleLoader: () => import("something/emscripten-module.ts"),
}
You can provide your own variant to control exactly how the large WebAssembly object is loaded. quickjs-emscripten-core will call your variant's importXYZ methods during newQuickJSWASMModuleFromVariant or newQuickJSAsyncWASMModuleFromVariant.

Environment-specific variants
You can use subpath imports in package.json to select the appropriate variant for a runtime. This is how the main quickjs-emscripten package picks between browser, Node ESM and Node CommonJS variants.

// in your package.json
{
  "imports": {
    "#my-quickjs-variant": {
      "types": "@jitl/quickjs-wasmfile-release-sync",
      // In the browser, use the singlefile variant that doesn't need an external file
      "browser": "@jitl/quickjs-singlefile-browser-release-sync",
      // Otherwise, use the wasmfile variant, compatible with all environments
      "default": "@jitl/quickjs-wasmfile-release-sync"
    }
  }
}
// In your code
import { newQuickJSWASMModuleFromVariant } from "quickjs-emscripten-core"
import variant from "#my-quickjs-variant"
const QuickJS = await newQuickJSWASMModuleFromVariant(variant)
Available variants
@jitl/quickjs-wasmfile-debug-sync
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-wasmfile-debug-asyncify
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-wasmfile-release-sync
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-wasmfile-release-asyncify
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-ng-wasmfile-debug-sync
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs-ng	quickjs-ng is a fork of quickjs that tends to add features more quickly. Version git+7ded62c5 vendored to quickjs-emscripten on 2024-02-12.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-ng-wasmfile-debug-asyncify
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs-ng	quickjs-ng is a fork of quickjs that tends to add features more quickly. Version git+7ded62c5 vendored to quickjs-emscripten on 2024-02-12.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-ng-wasmfile-release-sync
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs-ng	quickjs-ng is a fork of quickjs that tends to add features more quickly. Version git+7ded62c5 vendored to quickjs-emscripten on 2024-02-12.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-ng-wasmfile-release-asyncify
Docs | Variant with separate .WASM file. Supports browser ESM, NodeJS ESM, and NodeJS CommonJS.

Variable	Setting	Description
library	quickjs-ng	quickjs-ng is a fork of quickjs that tends to add features more quickly. Version git+7ded62c5 vendored to quickjs-emscripten on 2024-02-12.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	wasm	Has a separate .wasm file. May offer better caching in your browser, and reduces the size of your JS bundle. If you have issues, try a 'singlefile' variant.
exports	require import browser workerd	Has these package.json export conditions
@jitl/quickjs-singlefile-cjs-debug-sync
Docs | Variant with the WASM data embedded into a universal (Node and Browser compatible) CommonJS module.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	require	Has these package.json export conditions
@jitl/quickjs-singlefile-cjs-debug-asyncify
Docs | Variant with the WASM data embedded into a universal (Node and Browser compatible) CommonJS module.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	require	Has these package.json export conditions
@jitl/quickjs-singlefile-cjs-release-sync
Docs | Variant with the WASM data embedded into a universal (Node and Browser compatible) CommonJS module.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	require	Has these package.json export conditions
@jitl/quickjs-singlefile-cjs-release-asyncify
Docs | Variant with the WASM data embedded into a universal (Node and Browser compatible) CommonJS module.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	require	Has these package.json export conditions
@jitl/quickjs-singlefile-mjs-debug-sync
Docs | Variant with the WASM data embedded into a NodeJS ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	import	Has these package.json export conditions
@jitl/quickjs-singlefile-mjs-debug-asyncify
Docs | Variant with the WASM data embedded into a NodeJS ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	import	Has these package.json export conditions
@jitl/quickjs-singlefile-mjs-release-sync
Docs | Variant with the WASM data embedded into a NodeJS ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	import	Has these package.json export conditions
@jitl/quickjs-singlefile-mjs-release-asyncify
Docs | Variant with the WASM data embedded into a NodeJS ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	import	Has these package.json export conditions
@jitl/quickjs-singlefile-browser-debug-sync
Docs | Variant with the WASM data embedded into a browser ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	browser	Has these package.json export conditions
@jitl/quickjs-singlefile-browser-debug-asyncify
Docs | Variant with the WASM data embedded into a browser ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	debug	Enables assertions and memory sanitizers. Try to run your tests against debug variants, in addition to your preferred production variant, to catch more bugs.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	browser	Has these package.json export conditions
@jitl/quickjs-singlefile-browser-release-sync
Docs | Variant with the WASM data embedded into a browser ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	browser	Has these package.json export conditions
@jitl/quickjs-singlefile-browser-release-asyncify
Docs | Variant with the WASM data embedded into a browser ESModule.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	asyncify	Build run through the ASYNCIFY WebAssembly transform. This imposes substantial size (2x the size of sync) and speed penalties (40% the speed of sync). In return, allows synchronous calls from the QuickJS WASM runtime to async functions on the host. The extra magic makes this variant slower than sync variants. Note that both variants support regular async functions. Only adopt ASYNCIFY if you need to! The QuickJSAsyncRuntime and QuickJSAsyncContext classes expose the ASYNCIFY-specific APIs.
emscriptenInclusion	singlefile	The WASM runtime is included directly in the JS file. Use if you run into issues with missing .wasm files when building or deploying your app.
exports	browser	Has these package.json export conditions
@jitl/quickjs-asmjs-mjs-release-sync
Docs | Compiled to pure Javascript, no WebAssembly required.

Variable	Setting	Description
library	quickjs	The original bellard/quickjs library. Version 2024-02-14+36911f0d vendored to quickjs-emscripten on 2024-06-15.
releaseMode	release	Optimized for performance; use when building/deploying your application.
syncMode	sync	The default, normal build. Note that both variants support regular async functions.
emscriptenInclusion	asmjs	The C library code is compiled to Javascript, no WebAssembly used. Sometimes called "asmjs". This is the slowest possible option, and is intended for constrained environments that do not support WebAssembly, like quickjs-for-quickjs.
exports	import	Has these package.json export conditions
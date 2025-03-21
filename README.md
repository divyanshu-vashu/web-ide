### WEB IDE without any external server using webassembly 

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/f66702ef-ad6d-4539-9394-bcfe4e09672f" />

# Web IDE - A Native V8 Engine-Powered Web IDE

## Overview
This project is a Web IDE that runs code directly on the native V8 engine within the browser, without relying on a backend server. Unlike traditional web-based IDEs that execute code on a remote server, this IDE leverages in-browser execution for supported languages, providing a seamless and low-latency coding experience.

## Features
- **Native Execution:** Runs JavaScript directly on the browser's V8 engine.
- **Multi-Language Support:**
  - **JavaScript** (Executed natively in the V8 engine)
  - **Python** (Uses Pyodide to execute Python code in the browser via WebAssembly)
  - **Go** (Transpiles Go code to JavaScript using GopherJS)
  - **C++ and Java** (Planned feature: Will require pre-compilation to WebAssembly for execution in the browser)
- **No Server Dependency:** Everything runs locally within the user's browser, reducing latency and improving privacy.
- **WebAssembly Support:** C++ and Java code can be compiled to WebAssembly (WASM) and loaded into JavaScript for execution (not yet implemented).

## Concepts Used

### 1. **Native V8 Execution**
The IDE leverages the browser's built-in V8 JavaScript engine to execute JavaScript code natively without any server-side processing.

### 2. **Python Execution via Pyodide**
Pyodide is used to run Python in the browser by converting the CPython runtime into WebAssembly, allowing users to execute Python scripts seamlessly.

### 3. **Go Transpilation using GopherJS**
For Go support, GopherJS transpiles Go code into JavaScript, enabling execution within the browser environment.

### 4. **Planned: C++ and Java via WebAssembly (WASM)**
Since C++ and Java require compilation before execution, users must first compile their code into WASM binaries, which can then be loaded and executed within the browser using JavaScript. However, real-time execution is not possible as these languages need to be compiled before running. This feature is planned but has not yet been implemented.

## How It Works
- **JavaScript Execution:** Directly runs inside the browser using the V8 engine.
- **Python Execution:** Pyodide loads the Python runtime in WASM, allowing Python code execution.
- **Go Execution:** The Go code is transpiled using GopherJS and executed in the browser.
- **C++/Java Execution:** (Planned) The user compiles the source code to WASM, which is then loaded and executed in JavaScript. However, real-time execution is not possible due to the compilation requirement.

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/web-ide.git
   cd web-ide
   ```
2. Open `index.html` in a browser to start using the IDE.
3. Write and execute JavaScript, Python, or Go code directly.
4. To run C++/Java (once implemented), compile the source code to WASM and load it into the IDE.

## Future Enhancements
- Implement C++ and Java execution via WebAssembly.
- Support for more languages.
- Enhanced debugging and error handling.
- Improved UI/UX for code editing and execution.

## Contributing
Feel free to contribute by submitting issues, feature requests, or pull requests.

## License
This project is licensed under the MIT License.

---
Enjoy coding with a fast, lightweight, and server-independent Web IDE!


if(typeof importScripts == 'function') {
  self.languagePluginUrl = 'http://localhost:8000/'
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')

  var onmessage = function(e) { // eslint-disable-line no-unused-vars
    languagePluginLoader.then(() => {
      self.pyodide.loadPackage(['numpy', 'pytz']).then(() => {
        const data = e.data;
        const keys = Object.keys(data);
        for (let key of keys) {
          if (key !== 'python') {
            // Keys other than python must be arguments for the python script.
            // Set them on self, so that `from js import key` works.
            self[key] = data[key];
          }
        }
        self.pyodide.runPythonAsync(data.python, () => {})
            .then((results) => { self.postMessage({results}); })
            .catch((err) => {
              // if you prefer messages with the error
              self.postMessage({error : err.message});
              // if you prefer onerror events
              // setTimeout(() => { throw err; });
            });
      });
    });
  }
}
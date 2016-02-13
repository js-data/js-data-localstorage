beforeEach(function () {
  localStorage.clear();
});

window.assert = TestRunner.assert;

TestRunner.init({
  features: [],
  JSData: JSData,
  Adapter: LocalStorageAdapter,
  adapterConfig: {
    debug: false
  }
});

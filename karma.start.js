beforeEach(function () {
  localStorage.clear();
});

window.assert = TestRunner.assert;

TestRunner.init({
  features: [],
  DS: JSData.DS,
  Adapter: DSLocalStorageAdapter
});
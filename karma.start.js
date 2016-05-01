/* global JSDataLocalStorage */
beforeEach(function () {
  localStorage.clear()
})

window.assert = JSDataAdapterTests.assert

JSDataAdapterTests.init({
  debug: false,
  JSData: JSData,
  Adapter: JSDataLocalStorage.LocalStorageAdapter,
  adapterConfig: {
    debug: false
  },
  // js-data-localstorage does NOT support these features
  xfeatures: [
    'findAllOpNotFound',
    'filterOnRelations'
  ]
})

describe('exports', function () {
  it('should have correct exports', function () {
    assert(JSDataLocalStorage)
    assert(JSDataLocalStorage.LocalStorageAdapter)
    assert(JSDataLocalStorage.version)
  })
})

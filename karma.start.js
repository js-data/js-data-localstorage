beforeEach(function () {
  localStorage.clear()
})

window.assert = JSDataAdapterTests.assert

JSDataAdapterTests.init({
  debug: false,
  JSData: JSData,
  Adapter: LocalStorageAdapter,
  adapterConfig: {
    debug: false
  },
  // js-data-localstorage does NOT support these features
  xfeatures: [
    'findAllOpNotFound',
    'filterOnRelations'
  ]
})

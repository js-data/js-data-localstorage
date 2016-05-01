import {Adapter} from 'js-data-adapter'

interface IDict {
  [key: string]: any;
}
interface IBaseAdapter extends IDict {
  debug?: boolean,
  raw?: boolean
}
interface IBaseLocalStorageAdapter extends IBaseAdapter {
  basePath?: string
}
export class LocalStorageAdapter extends Adapter {
  static extend(instanceProps?: IDict, classProps?: IDict): typeof LocalStorageAdapter
  constructor(opts?: IBaseLocalStorageAdapter)
}
export interface version {
  full: string
  minor: string
  major: string
  patch: string
  alpha: string | boolean
  beta: string | boolean
}
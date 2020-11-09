export enum ResponseStatus {
  Ok = "ok",
  Error = "error",
}

export interface Response {
  status: ResponseStatus
}

export enum EventName {
  Disconnected = "disconnected",
}

export enum Endpoint {
  Invalid = 0,
  DeviceInfo = 1,
  Update = 2,
  FilesystemUpload = 3,
  Backup = 4,
  Restore = 5,
  Factory = 6,
  Contacts = 7,
  Messages = 8,
  Callog = 9,
}

export enum Method {
  Get = 1,
  Post = 2,
  Put = 3,
  Delete = 4,
}

export interface RequestConfig {
  endpoint: Endpoint
  method: Method
  body?: any
}

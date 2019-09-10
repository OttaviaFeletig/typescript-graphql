interface StringTMap<T> {
  [key: string]: T;
}
export interface StringStringMap extends StringTMap<string> {}

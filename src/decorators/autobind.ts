// method decorator
export function AutoBind(
  _t: any,
  _k: string | Symbol,
  descriptor: PropertyDescriptor
): any {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

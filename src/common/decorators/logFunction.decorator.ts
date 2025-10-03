import kleur = require("kleur");

export function logger(startMessage: string, endMessage: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const date = new Date();
      console.log(
        kleur.green(`[${process.env.INSCRIPTION}] -`),
        kleur.yellow(
          `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        ),
        kleur.green(`- [${propertyKey.toUpperCase()}]`),
        `${startMessage.toLowerCase()}`
      );
      const result = originalMethod.apply(this, args);
      console.log(
        kleur.green(`[${process.env.INSCRIPTION}] -`),
        kleur.yellow(
          `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        ),
        kleur.green(`- [${propertyKey.toUpperCase()}]`),
        `${endMessage.toLowerCase()}`
      );
      return result;
    };

    return descriptor;
  };
}

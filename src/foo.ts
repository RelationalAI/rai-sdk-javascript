export class Foo {
  foo: number;

  constructor() {
    this.foo = 321;
  }

  test() {
    console.log("fooo", this.foo);
  }
}

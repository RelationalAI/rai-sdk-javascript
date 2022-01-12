export class Foo {
  foo: number;

  constructor() {
    this.foo = 321;
  }

  test(b: string) {
    console.log('fooo', this.foo, b);
  }
}

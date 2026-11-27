declare module "rabbit-node" {
  interface RabbitConverter {
    zg2uni(text: string): string;
    uni2zg(text: string): string;
  }
  const Rabbit: RabbitConverter;
  export = Rabbit;
}

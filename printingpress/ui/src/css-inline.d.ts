// A stylesheet imported as text, for Lit to adopt.
declare module "*.css?inline" {
  const css: string;
  export default css;
}

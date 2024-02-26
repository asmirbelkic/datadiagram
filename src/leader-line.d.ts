// leader-line.d.ts
declare module 'leader-line-new' {
  export default class LeaderLine {
    constructor(startElement: HTMLElement, endElement: HTMLElement, options?: object);
    position(): void;
    remove(): void;
    setOptions(options: object): void;
  }
}
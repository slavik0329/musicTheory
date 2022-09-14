type Options = {
  channels?: number;
  sampleRate?: number;
  bitDepth?: number;
};

declare module "waveheader" {
  function main(length: number, options: Options): Buffer;
  export = main;
}

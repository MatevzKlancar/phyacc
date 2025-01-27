declare namespace Deno {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

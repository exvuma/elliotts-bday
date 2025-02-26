/// <reference types="astro/client" />

type ENV = {
  db: unknown
}

type Runtime = import('@astrojs/cloudflare').DirectoryRuntime<ENV>
declare namespace App {
  interface Locals extends Runtime {}
}

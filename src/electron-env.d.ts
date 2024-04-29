declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }

  // 增加electron全局变量的参数
  interface EventEmitter {
    isQuitting: boolean;
  }
}

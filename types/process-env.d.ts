namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string
    SERVER_PORT: string
    SERVER_PREFIX: string

    MYSQL_HOST: string
    MYSQL_PORT: string
    MYSQL_USERNAME: string
    MYSQL_PASSWORD: string
    MYSQL_DATABASE: string
    MYSQL_SYNCHRONIZE: string
  }
}

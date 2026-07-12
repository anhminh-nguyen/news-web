
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model RawNews
 * 
 */
export type RawNews = $Result.DefaultSelection<Prisma.$RawNewsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more RawNews
 * const rawNews = await prisma.rawNews.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more RawNews
   * const rawNews = await prisma.rawNews.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.rawNews`: Exposes CRUD operations for the **RawNews** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RawNews
    * const rawNews = await prisma.rawNews.findMany()
    * ```
    */
  get rawNews(): Prisma.RawNewsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    RawNews: 'RawNews'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "rawNews"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      RawNews: {
        payload: Prisma.$RawNewsPayload<ExtArgs>
        fields: Prisma.RawNewsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RawNewsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RawNewsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          findFirst: {
            args: Prisma.RawNewsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RawNewsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          findMany: {
            args: Prisma.RawNewsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>[]
          }
          create: {
            args: Prisma.RawNewsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          createMany: {
            args: Prisma.RawNewsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RawNewsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>[]
          }
          delete: {
            args: Prisma.RawNewsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          update: {
            args: Prisma.RawNewsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          deleteMany: {
            args: Prisma.RawNewsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RawNewsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RawNewsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>[]
          }
          upsert: {
            args: Prisma.RawNewsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RawNewsPayload>
          }
          aggregate: {
            args: Prisma.RawNewsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRawNews>
          }
          groupBy: {
            args: Prisma.RawNewsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RawNewsGroupByOutputType>[]
          }
          count: {
            args: Prisma.RawNewsCountArgs<ExtArgs>
            result: $Utils.Optional<RawNewsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    rawNews?: RawNewsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model RawNews
   */

  export type AggregateRawNews = {
    _count: RawNewsCountAggregateOutputType | null
    _min: RawNewsMinAggregateOutputType | null
    _max: RawNewsMaxAggregateOutputType | null
  }

  export type RawNewsMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    platform: string | null
    subreddit: string | null
    originalTitle: string | null
    originalContent: string | null
    mediaUrl: string | null
    permalink: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RawNewsMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    platform: string | null
    subreddit: string | null
    originalTitle: string | null
    originalContent: string | null
    mediaUrl: string | null
    permalink: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RawNewsCountAggregateOutputType = {
    id: number
    sourceId: number
    platform: number
    subreddit: number
    originalTitle: number
    originalContent: number
    mediaUrl: number
    permalink: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RawNewsMinAggregateInputType = {
    id?: true
    sourceId?: true
    platform?: true
    subreddit?: true
    originalTitle?: true
    originalContent?: true
    mediaUrl?: true
    permalink?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RawNewsMaxAggregateInputType = {
    id?: true
    sourceId?: true
    platform?: true
    subreddit?: true
    originalTitle?: true
    originalContent?: true
    mediaUrl?: true
    permalink?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RawNewsCountAggregateInputType = {
    id?: true
    sourceId?: true
    platform?: true
    subreddit?: true
    originalTitle?: true
    originalContent?: true
    mediaUrl?: true
    permalink?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RawNewsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RawNews to aggregate.
     */
    where?: RawNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawNews to fetch.
     */
    orderBy?: RawNewsOrderByWithRelationInput | RawNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RawNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RawNews
    **/
    _count?: true | RawNewsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RawNewsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RawNewsMaxAggregateInputType
  }

  export type GetRawNewsAggregateType<T extends RawNewsAggregateArgs> = {
        [P in keyof T & keyof AggregateRawNews]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRawNews[P]>
      : GetScalarType<T[P], AggregateRawNews[P]>
  }




  export type RawNewsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RawNewsWhereInput
    orderBy?: RawNewsOrderByWithAggregationInput | RawNewsOrderByWithAggregationInput[]
    by: RawNewsScalarFieldEnum[] | RawNewsScalarFieldEnum
    having?: RawNewsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RawNewsCountAggregateInputType | true
    _min?: RawNewsMinAggregateInputType
    _max?: RawNewsMaxAggregateInputType
  }

  export type RawNewsGroupByOutputType = {
    id: string
    sourceId: string
    platform: string
    subreddit: string | null
    originalTitle: string
    originalContent: string
    mediaUrl: string
    permalink: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: RawNewsCountAggregateOutputType | null
    _min: RawNewsMinAggregateOutputType | null
    _max: RawNewsMaxAggregateOutputType | null
  }

  type GetRawNewsGroupByPayload<T extends RawNewsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RawNewsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RawNewsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RawNewsGroupByOutputType[P]>
            : GetScalarType<T[P], RawNewsGroupByOutputType[P]>
        }
      >
    >


  export type RawNewsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    platform?: boolean
    subreddit?: boolean
    originalTitle?: boolean
    originalContent?: boolean
    mediaUrl?: boolean
    permalink?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rawNews"]>

  export type RawNewsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    platform?: boolean
    subreddit?: boolean
    originalTitle?: boolean
    originalContent?: boolean
    mediaUrl?: boolean
    permalink?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rawNews"]>

  export type RawNewsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    platform?: boolean
    subreddit?: boolean
    originalTitle?: boolean
    originalContent?: boolean
    mediaUrl?: boolean
    permalink?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rawNews"]>

  export type RawNewsSelectScalar = {
    id?: boolean
    sourceId?: boolean
    platform?: boolean
    subreddit?: boolean
    originalTitle?: boolean
    originalContent?: boolean
    mediaUrl?: boolean
    permalink?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RawNewsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "platform" | "subreddit" | "originalTitle" | "originalContent" | "mediaUrl" | "permalink" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["rawNews"]>

  export type $RawNewsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RawNews"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      platform: string
      subreddit: string | null
      originalTitle: string
      originalContent: string
      mediaUrl: string
      permalink: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rawNews"]>
    composites: {}
  }

  type RawNewsGetPayload<S extends boolean | null | undefined | RawNewsDefaultArgs> = $Result.GetResult<Prisma.$RawNewsPayload, S>

  type RawNewsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RawNewsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RawNewsCountAggregateInputType | true
    }

  export interface RawNewsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RawNews'], meta: { name: 'RawNews' } }
    /**
     * Find zero or one RawNews that matches the filter.
     * @param {RawNewsFindUniqueArgs} args - Arguments to find a RawNews
     * @example
     * // Get one RawNews
     * const rawNews = await prisma.rawNews.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RawNewsFindUniqueArgs>(args: SelectSubset<T, RawNewsFindUniqueArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RawNews that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RawNewsFindUniqueOrThrowArgs} args - Arguments to find a RawNews
     * @example
     * // Get one RawNews
     * const rawNews = await prisma.rawNews.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RawNewsFindUniqueOrThrowArgs>(args: SelectSubset<T, RawNewsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RawNews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsFindFirstArgs} args - Arguments to find a RawNews
     * @example
     * // Get one RawNews
     * const rawNews = await prisma.rawNews.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RawNewsFindFirstArgs>(args?: SelectSubset<T, RawNewsFindFirstArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RawNews that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsFindFirstOrThrowArgs} args - Arguments to find a RawNews
     * @example
     * // Get one RawNews
     * const rawNews = await prisma.rawNews.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RawNewsFindFirstOrThrowArgs>(args?: SelectSubset<T, RawNewsFindFirstOrThrowArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RawNews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RawNews
     * const rawNews = await prisma.rawNews.findMany()
     * 
     * // Get first 10 RawNews
     * const rawNews = await prisma.rawNews.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rawNewsWithIdOnly = await prisma.rawNews.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RawNewsFindManyArgs>(args?: SelectSubset<T, RawNewsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RawNews.
     * @param {RawNewsCreateArgs} args - Arguments to create a RawNews.
     * @example
     * // Create one RawNews
     * const RawNews = await prisma.rawNews.create({
     *   data: {
     *     // ... data to create a RawNews
     *   }
     * })
     * 
     */
    create<T extends RawNewsCreateArgs>(args: SelectSubset<T, RawNewsCreateArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RawNews.
     * @param {RawNewsCreateManyArgs} args - Arguments to create many RawNews.
     * @example
     * // Create many RawNews
     * const rawNews = await prisma.rawNews.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RawNewsCreateManyArgs>(args?: SelectSubset<T, RawNewsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RawNews and returns the data saved in the database.
     * @param {RawNewsCreateManyAndReturnArgs} args - Arguments to create many RawNews.
     * @example
     * // Create many RawNews
     * const rawNews = await prisma.rawNews.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RawNews and only return the `id`
     * const rawNewsWithIdOnly = await prisma.rawNews.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RawNewsCreateManyAndReturnArgs>(args?: SelectSubset<T, RawNewsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RawNews.
     * @param {RawNewsDeleteArgs} args - Arguments to delete one RawNews.
     * @example
     * // Delete one RawNews
     * const RawNews = await prisma.rawNews.delete({
     *   where: {
     *     // ... filter to delete one RawNews
     *   }
     * })
     * 
     */
    delete<T extends RawNewsDeleteArgs>(args: SelectSubset<T, RawNewsDeleteArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RawNews.
     * @param {RawNewsUpdateArgs} args - Arguments to update one RawNews.
     * @example
     * // Update one RawNews
     * const rawNews = await prisma.rawNews.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RawNewsUpdateArgs>(args: SelectSubset<T, RawNewsUpdateArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RawNews.
     * @param {RawNewsDeleteManyArgs} args - Arguments to filter RawNews to delete.
     * @example
     * // Delete a few RawNews
     * const { count } = await prisma.rawNews.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RawNewsDeleteManyArgs>(args?: SelectSubset<T, RawNewsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RawNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RawNews
     * const rawNews = await prisma.rawNews.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RawNewsUpdateManyArgs>(args: SelectSubset<T, RawNewsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RawNews and returns the data updated in the database.
     * @param {RawNewsUpdateManyAndReturnArgs} args - Arguments to update many RawNews.
     * @example
     * // Update many RawNews
     * const rawNews = await prisma.rawNews.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RawNews and only return the `id`
     * const rawNewsWithIdOnly = await prisma.rawNews.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RawNewsUpdateManyAndReturnArgs>(args: SelectSubset<T, RawNewsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RawNews.
     * @param {RawNewsUpsertArgs} args - Arguments to update or create a RawNews.
     * @example
     * // Update or create a RawNews
     * const rawNews = await prisma.rawNews.upsert({
     *   create: {
     *     // ... data to create a RawNews
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RawNews we want to update
     *   }
     * })
     */
    upsert<T extends RawNewsUpsertArgs>(args: SelectSubset<T, RawNewsUpsertArgs<ExtArgs>>): Prisma__RawNewsClient<$Result.GetResult<Prisma.$RawNewsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RawNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsCountArgs} args - Arguments to filter RawNews to count.
     * @example
     * // Count the number of RawNews
     * const count = await prisma.rawNews.count({
     *   where: {
     *     // ... the filter for the RawNews we want to count
     *   }
     * })
    **/
    count<T extends RawNewsCountArgs>(
      args?: Subset<T, RawNewsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RawNewsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RawNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RawNewsAggregateArgs>(args: Subset<T, RawNewsAggregateArgs>): Prisma.PrismaPromise<GetRawNewsAggregateType<T>>

    /**
     * Group by RawNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RawNewsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RawNewsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RawNewsGroupByArgs['orderBy'] }
        : { orderBy?: RawNewsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RawNewsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRawNewsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RawNews model
   */
  readonly fields: RawNewsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RawNews.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RawNewsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RawNews model
   */
  interface RawNewsFieldRefs {
    readonly id: FieldRef<"RawNews", 'String'>
    readonly sourceId: FieldRef<"RawNews", 'String'>
    readonly platform: FieldRef<"RawNews", 'String'>
    readonly subreddit: FieldRef<"RawNews", 'String'>
    readonly originalTitle: FieldRef<"RawNews", 'String'>
    readonly originalContent: FieldRef<"RawNews", 'String'>
    readonly mediaUrl: FieldRef<"RawNews", 'String'>
    readonly permalink: FieldRef<"RawNews", 'String'>
    readonly status: FieldRef<"RawNews", 'String'>
    readonly createdAt: FieldRef<"RawNews", 'DateTime'>
    readonly updatedAt: FieldRef<"RawNews", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RawNews findUnique
   */
  export type RawNewsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter, which RawNews to fetch.
     */
    where: RawNewsWhereUniqueInput
  }

  /**
   * RawNews findUniqueOrThrow
   */
  export type RawNewsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter, which RawNews to fetch.
     */
    where: RawNewsWhereUniqueInput
  }

  /**
   * RawNews findFirst
   */
  export type RawNewsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter, which RawNews to fetch.
     */
    where?: RawNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawNews to fetch.
     */
    orderBy?: RawNewsOrderByWithRelationInput | RawNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RawNews.
     */
    cursor?: RawNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RawNews.
     */
    distinct?: RawNewsScalarFieldEnum | RawNewsScalarFieldEnum[]
  }

  /**
   * RawNews findFirstOrThrow
   */
  export type RawNewsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter, which RawNews to fetch.
     */
    where?: RawNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawNews to fetch.
     */
    orderBy?: RawNewsOrderByWithRelationInput | RawNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RawNews.
     */
    cursor?: RawNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RawNews.
     */
    distinct?: RawNewsScalarFieldEnum | RawNewsScalarFieldEnum[]
  }

  /**
   * RawNews findMany
   */
  export type RawNewsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter, which RawNews to fetch.
     */
    where?: RawNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RawNews to fetch.
     */
    orderBy?: RawNewsOrderByWithRelationInput | RawNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RawNews.
     */
    cursor?: RawNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RawNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RawNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RawNews.
     */
    distinct?: RawNewsScalarFieldEnum | RawNewsScalarFieldEnum[]
  }

  /**
   * RawNews create
   */
  export type RawNewsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * The data needed to create a RawNews.
     */
    data: XOR<RawNewsCreateInput, RawNewsUncheckedCreateInput>
  }

  /**
   * RawNews createMany
   */
  export type RawNewsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RawNews.
     */
    data: RawNewsCreateManyInput | RawNewsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RawNews createManyAndReturn
   */
  export type RawNewsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * The data used to create many RawNews.
     */
    data: RawNewsCreateManyInput | RawNewsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RawNews update
   */
  export type RawNewsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * The data needed to update a RawNews.
     */
    data: XOR<RawNewsUpdateInput, RawNewsUncheckedUpdateInput>
    /**
     * Choose, which RawNews to update.
     */
    where: RawNewsWhereUniqueInput
  }

  /**
   * RawNews updateMany
   */
  export type RawNewsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RawNews.
     */
    data: XOR<RawNewsUpdateManyMutationInput, RawNewsUncheckedUpdateManyInput>
    /**
     * Filter which RawNews to update
     */
    where?: RawNewsWhereInput
    /**
     * Limit how many RawNews to update.
     */
    limit?: number
  }

  /**
   * RawNews updateManyAndReturn
   */
  export type RawNewsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * The data used to update RawNews.
     */
    data: XOR<RawNewsUpdateManyMutationInput, RawNewsUncheckedUpdateManyInput>
    /**
     * Filter which RawNews to update
     */
    where?: RawNewsWhereInput
    /**
     * Limit how many RawNews to update.
     */
    limit?: number
  }

  /**
   * RawNews upsert
   */
  export type RawNewsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * The filter to search for the RawNews to update in case it exists.
     */
    where: RawNewsWhereUniqueInput
    /**
     * In case the RawNews found by the `where` argument doesn't exist, create a new RawNews with this data.
     */
    create: XOR<RawNewsCreateInput, RawNewsUncheckedCreateInput>
    /**
     * In case the RawNews was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RawNewsUpdateInput, RawNewsUncheckedUpdateInput>
  }

  /**
   * RawNews delete
   */
  export type RawNewsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
    /**
     * Filter which RawNews to delete.
     */
    where: RawNewsWhereUniqueInput
  }

  /**
   * RawNews deleteMany
   */
  export type RawNewsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RawNews to delete
     */
    where?: RawNewsWhereInput
    /**
     * Limit how many RawNews to delete.
     */
    limit?: number
  }

  /**
   * RawNews without action
   */
  export type RawNewsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RawNews
     */
    select?: RawNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RawNews
     */
    omit?: RawNewsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RawNewsScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    platform: 'platform',
    subreddit: 'subreddit',
    originalTitle: 'originalTitle',
    originalContent: 'originalContent',
    mediaUrl: 'mediaUrl',
    permalink: 'permalink',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RawNewsScalarFieldEnum = (typeof RawNewsScalarFieldEnum)[keyof typeof RawNewsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type RawNewsWhereInput = {
    AND?: RawNewsWhereInput | RawNewsWhereInput[]
    OR?: RawNewsWhereInput[]
    NOT?: RawNewsWhereInput | RawNewsWhereInput[]
    id?: StringFilter<"RawNews"> | string
    sourceId?: StringFilter<"RawNews"> | string
    platform?: StringFilter<"RawNews"> | string
    subreddit?: StringNullableFilter<"RawNews"> | string | null
    originalTitle?: StringFilter<"RawNews"> | string
    originalContent?: StringFilter<"RawNews"> | string
    mediaUrl?: StringFilter<"RawNews"> | string
    permalink?: StringFilter<"RawNews"> | string
    status?: StringFilter<"RawNews"> | string
    createdAt?: DateTimeFilter<"RawNews"> | Date | string
    updatedAt?: DateTimeFilter<"RawNews"> | Date | string
  }

  export type RawNewsOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    platform?: SortOrder
    subreddit?: SortOrderInput | SortOrder
    originalTitle?: SortOrder
    originalContent?: SortOrder
    mediaUrl?: SortOrder
    permalink?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RawNewsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceId?: string
    AND?: RawNewsWhereInput | RawNewsWhereInput[]
    OR?: RawNewsWhereInput[]
    NOT?: RawNewsWhereInput | RawNewsWhereInput[]
    platform?: StringFilter<"RawNews"> | string
    subreddit?: StringNullableFilter<"RawNews"> | string | null
    originalTitle?: StringFilter<"RawNews"> | string
    originalContent?: StringFilter<"RawNews"> | string
    mediaUrl?: StringFilter<"RawNews"> | string
    permalink?: StringFilter<"RawNews"> | string
    status?: StringFilter<"RawNews"> | string
    createdAt?: DateTimeFilter<"RawNews"> | Date | string
    updatedAt?: DateTimeFilter<"RawNews"> | Date | string
  }, "id" | "sourceId">

  export type RawNewsOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    platform?: SortOrder
    subreddit?: SortOrderInput | SortOrder
    originalTitle?: SortOrder
    originalContent?: SortOrder
    mediaUrl?: SortOrder
    permalink?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RawNewsCountOrderByAggregateInput
    _max?: RawNewsMaxOrderByAggregateInput
    _min?: RawNewsMinOrderByAggregateInput
  }

  export type RawNewsScalarWhereWithAggregatesInput = {
    AND?: RawNewsScalarWhereWithAggregatesInput | RawNewsScalarWhereWithAggregatesInput[]
    OR?: RawNewsScalarWhereWithAggregatesInput[]
    NOT?: RawNewsScalarWhereWithAggregatesInput | RawNewsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RawNews"> | string
    sourceId?: StringWithAggregatesFilter<"RawNews"> | string
    platform?: StringWithAggregatesFilter<"RawNews"> | string
    subreddit?: StringNullableWithAggregatesFilter<"RawNews"> | string | null
    originalTitle?: StringWithAggregatesFilter<"RawNews"> | string
    originalContent?: StringWithAggregatesFilter<"RawNews"> | string
    mediaUrl?: StringWithAggregatesFilter<"RawNews"> | string
    permalink?: StringWithAggregatesFilter<"RawNews"> | string
    status?: StringWithAggregatesFilter<"RawNews"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RawNews"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RawNews"> | Date | string
  }

  export type RawNewsCreateInput = {
    id?: string
    sourceId: string
    platform: string
    subreddit?: string | null
    originalTitle: string
    originalContent: string
    mediaUrl: string
    permalink: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RawNewsUncheckedCreateInput = {
    id?: string
    sourceId: string
    platform: string
    subreddit?: string | null
    originalTitle: string
    originalContent: string
    mediaUrl: string
    permalink: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RawNewsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    subreddit?: NullableStringFieldUpdateOperationsInput | string | null
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalContent?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    permalink?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RawNewsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    subreddit?: NullableStringFieldUpdateOperationsInput | string | null
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalContent?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    permalink?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RawNewsCreateManyInput = {
    id?: string
    sourceId: string
    platform: string
    subreddit?: string | null
    originalTitle: string
    originalContent: string
    mediaUrl: string
    permalink: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RawNewsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    subreddit?: NullableStringFieldUpdateOperationsInput | string | null
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalContent?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    permalink?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RawNewsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    subreddit?: NullableStringFieldUpdateOperationsInput | string | null
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalContent?: StringFieldUpdateOperationsInput | string
    mediaUrl?: StringFieldUpdateOperationsInput | string
    permalink?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RawNewsCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    platform?: SortOrder
    subreddit?: SortOrder
    originalTitle?: SortOrder
    originalContent?: SortOrder
    mediaUrl?: SortOrder
    permalink?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RawNewsMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    platform?: SortOrder
    subreddit?: SortOrder
    originalTitle?: SortOrder
    originalContent?: SortOrder
    mediaUrl?: SortOrder
    permalink?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RawNewsMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    platform?: SortOrder
    subreddit?: SortOrder
    originalTitle?: SortOrder
    originalContent?: SortOrder
    mediaUrl?: SortOrder
    permalink?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
import {Provider} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/rest';
import morgan from 'morgan';
import {logRequest} from '../logger/logger';

export class RequestLoggerMiddleware implements Provider<Middleware> {
   value(): Middleware {
      return async (context: MiddlewareContext, next: Function) => {
         const start = Date.now();

         const morganMiddleware = morgan('combined', {
            stream: {
               write: (message: string) => {
                  logRequest(message.trim());
               },
            },
         });

         morganMiddleware(context.request, context.response, () => {});

         const result = await next();

         const duration = Date.now() - start;
         logRequest(`Response time: ${duration}ms`);

         return result;
      };
   }
}

import * as Boom from '@hapi/boom';
import { Server, Request, RouteOptions } from 'hapi';
import {
  GraphQLOptions,
  runHttpQuery,
  convertNodeHttpToRequest,
} from 'apollo-server-core';
import { ValueOrPromise } from 'apollo-server-types';

export type IRegister = (server: Server, options: any, next?: () => void) => void;

export interface IPlugin {
  name: string;
  version?: string;
  register: IRegister;
}

export type IHapiOptionsFunction = (request?: Request) => ValueOrPromise<GraphQLOptions>;

export interface IHapiPluginOptions {
  path: string;
  vhost?: string;
  route?: RouteOptions;
  graphqlOptions: GraphQLOptions | IHapiOptionsFunction;
}

exports.plugin = {
  name: 'graphql',
  register: async (server: Server, options: IHapiPluginOptions, next?: () => void) => {
    if (!options?.graphqlOptions) {
      throw new Error('Apollo Server requires options.');
    }
    server.route({
      method: ['GET', 'POST'],
      path: options.path || '/graphql',
      vhost: options.vhost || undefined,
      options: options.route || {},
      handler: async (request, h) => {
        try {
          const { graphqlResponse, responseInit } = await runHttpQuery(
            [request, h],
            {
              method: request.method.toUpperCase(),
              options: options.graphqlOptions,
              query:
                request.method === 'post'
                  ? // TODO type payload as string or Record
                  (request.payload as any)
                  : request.query,
              request: convertNodeHttpToRequest(request.raw.req),
            },
          );

          const response = h.response(graphqlResponse);
          if (responseInit?.headers) {
            const apolloHeader = responseInit.headers;
            Object.keys(apolloHeader).forEach(key =>
              response.header(key, apolloHeader[key]),
            );
          }
          return response;
        } catch (error) {
          if ('HttpQueryError' !== error.name) {
            throw Boom.boomify(error);
          }

          if (error.isGraphQLError) {
            const response = h.response(error.message);
            response.code(error.statusCode);
            response.type('application/json');
            return response;
          }

          const err = new Boom(error.message, { statusCode: error.statusCode });
          if (error.headers) {
            Object.keys(error.headers).forEach(header => {
              err.output.headers[header] = error.headers[header];
            });
          }
          // Boom hides the error when status code is 500
          err.output.payload.message = error.message;
          throw err;
        }
      },
    });

    if (next) {
      next();
    }
  },
};

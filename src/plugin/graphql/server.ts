import * as Hapi from '@hapi/hapi';
import { parseAll } from '@hapi/accept';
import {
  renderPlaygroundPage,
  RenderPageOptions as PlaygroundRenderPageOptions,
} from '@apollographql/graphql-playground-html';

export { GraphQLOptions, GraphQLExtension } from 'apollo-server-core';
import {
  ApolloServerBase,
  GraphQLOptions,
  FileUploadOptions,
  processFileUploads,
} from 'apollo-server-core';

function handleFileUploads(uploadsConfig: FileUploadOptions) {
  return async (request: Hapi.Request, _h?: Hapi.ResponseToolkit) => {
    if (
      typeof processFileUploads === 'function' &&
      request.mime === 'multipart/form-data'
    ) {
      Object.defineProperty(request, 'payload', {
        value: await processFileUploads(
          request.raw.req,
          request.raw.res,
          uploadsConfig,
        ),
        writable: false,
      });
    }
  };
}

export class GraphQlServer extends ApolloServerBase {
  // This translates the arguments from the middleware into graphQL options It
  // provides typings for the integration specific behavior, ideally this would
  // be propagated with a generic to the super class

  public async createGraphQLServerOptions(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ request, h });
  }

  protected supportsSubscriptions(): boolean {
    return true;
  }

  protected supportsUploads(): boolean {
    return true;
  }

  public async bootstrap({
                                 server,
                                 cors,
                                 path,
                                 route,
                                 disableHealthCheck,
                                 onHealthCheck,
                               }: IServerRegistration) {
    await this.willStart();

    path =  path || '/graphql';

    await server.ext({
      type: 'onRequest',
      method: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        if (request.path !== path) {
          return h.continue;
        }

        if (this.uploadsConfig  && typeof processFileUploads === 'function') {
          await handleFileUploads(this.uploadsConfig)(request);
        }

        if (this.playgroundOptions && request.method === 'get') {
          // perform more expensive content-type check only if necessary
          const accept = parseAll(request.headers);
          const types = accept.mediaTypes as string[];
          const prefersHTML =
            types.find(
              (x: string) => x === 'text/html' || x === 'application/json',
            ) === 'text/html';

          if (prefersHTML) {
            const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
              endpoint: path,
              subscriptionEndpoint: this.subscriptionsPath,
              version: this.playgroundOptions?.version,
              ...this.playgroundOptions,
            };

            return h
              .response(renderPlaygroundPage(playgroundRenderPageOptions))
              .type('text/html')
              .takeover();
          }
        }
        return h.continue;
      },
    });

    if (!disableHealthCheck) {
      await server.route({
        method: '*',
        path: '/.well-known/apollo/server-health',
        options: {
          cors: cors !== undefined ? cors : true,
        },
        handler: async (request, h) => {
          if (onHealthCheck) {
            try {
              await onHealthCheck(request);
            } catch {
              const res = h.response({ status: 'fail' });
              res.code(503);
              res.type('application/health+json');
              return res;
            }
          }
          const response = h.response({ status: 'pass' });
          response.type('application/health+json');
          return response;
        },
      });
    }

    await server.register({
      plugin: require('./index'),
      options: {
        auth: 'basic',
        path,
        graphqlOptions: this.createGraphQLServerOptions.bind(this),
        route:
          route ? route
            : {
              cors: cors !== undefined ? cors : true,
            },
      },
    });

    this.graphqlPath = path;
  }
}

export interface IServerRegistration {
  server: Hapi.Server;
  path?: string;
  cors?: boolean | Hapi.RouteOptionsCors;
  route?: Hapi.RouteOptions;
  onHealthCheck?: (request: Hapi.Request) => Promise<any>;
  disableHealthCheck?: boolean;
  uploads?: boolean | Record<string, any>;
}

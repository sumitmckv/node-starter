import Config from '../config';
import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';
import {GraphQlServer} from './graphql/server';
import typeDefs from '../graphql/typeDefs';
import resolvers from '../graphql/resolvers';

export default class Plugins {
  public static async status(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info('Plugins - Registering status-monitor');

      await Plugins.register(server, {
        options: Config.status.options,
        plugin: require('hapijs-status-monitor'),
      });
    } catch (error) {
      Logger.error(
        `Plugins - Something went wrong when registering status plugin: ${error}`
      );
    }
  }

  public static async swagger(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info('Plugins - Registering swagger-ui');

      await Plugins.register(server, [
        require('@hapi/vision'),
        require('@hapi/inert'),
        {
          options: Config.swagger.options,
          plugin: require('hapi-swagger'),
        },
      ]);
    } catch (error) {
      Logger.error(
        `Plugins - Something went wrong when registering swagger-ui plugin: ${error}`
      );
    }
  }

  public static async graphQl(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info('Plugins - Registering graphql');
      const graphQlServer = new GraphQlServer({typeDefs, resolvers});

      await graphQlServer.bootstrap({
        server,
      });

      await graphQlServer.installSubscriptionHandlers(server.listener);
    } catch (error) {
      Logger.error(
        `Plugins - Something went wrong when registering graphql plugin: ${error}`
      );
    }
  }

  public static async registerAll(server: Hapi.Server): Promise<Error | any> {
    if (process.env.NODE_ENV === 'development') {
      await Plugins.status(server);
      await Plugins.swagger(server);
      await Plugins.graphQl(server);
    }
  }

  private static async register(
    server: Hapi.Server,
    plugin: any
  ): Promise<void> {
    Logger.debug('registering: ' + JSON.stringify(plugin));

    return new Promise((resolve) => {
      server.register(plugin);
      resolve();
    });
  }
}

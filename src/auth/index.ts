import Config from '../config';
import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';

export default class Auth {
  public static async basic(server: Hapi.Server): Promise<Error | any> {
    try {
      await Auth.register(server, {
        plugin: require('@hapi/basic'),
      });

      await Auth.strategy(server, {
          name: Config.auth.basic.name,
          strategy: 'basic',
          options: Config.auth.basic.options
        }
      );
    } catch (error) {
      Logger.error(
        `Auth - something went wrong when configuring basic auth: ${error}`
      );
    }
  }

  public static async jwt(server: Hapi.Server): Promise<Error | any> {
      try {
          await Auth.register(server, {
              plugin: require('hapi-auth-jwt2')
          });

          await Auth.strategy(server, {
              name: Config.auth.jwt.name,
              strategy: 'jwt',
              options: Config.auth.jwt.options
          });
      } catch (error) {
          Logger.error(
            `Auth - something went wrong when configuring jwt auth: ${error}` 
          );
      }
  }

  public static async registerAll(server: Hapi.Server): Promise<Error | any> {
      await Auth.basic(server);
      await Auth.jwt(server);
  }

  private static async register(
    server: Hapi.Server,
    plugin: any
  ): Promise<void> {
    Logger.debug('Plugins - registering: ' + JSON.stringify(plugin));

    return new Promise((resolve) => {
      server.register(plugin);
      resolve();
    });
  }

  private static async strategy(
      server: Hapi.Server,
      auth: any
  ): Promise<void> {
    Logger.info(`Auth - setting ${auth.strategy} strategy`);
    
    return new Promise((resolve) => {
        server.auth.strategy(auth.name, auth.strategy, auth.options);
        resolve();
    });
  }
}

import * as Hapi from '@hapi/hapi';
import UserController from '../../api/users/controller';
import validate from '../../api/users/validate';
import Logger from '../../helper/logger';
import IRoute from '../../helper/route';

export default class UserRoutes implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise(resolve => {
      Logger.info('UserRoutes - Start adding user routes');

      const controller = new UserController();
      const basePath = '/api/v1/users';

      server.route([
        {
          method: 'POST',
          path: basePath,
          handler: controller.create,
          options: {
            validate: validate.create,
            description: 'Method that creates a new user.',
            tags: ['api', 'users'],
            auth: 'jwt',
          },
        },
        {
          method: 'PUT',
          path: `${basePath}/{${controller.id}}`,
          handler: controller.updateById,
          options: {
            validate: validate.updateById,
            description: 'Method that updates a user by its id.',
            tags: ['api', 'users'],
            auth: 'jwt',
          },
        },
        {
          method: 'GET',
          path: `${basePath}/{${controller.id}}`,
          handler: controller.getById,
          options: {
            validate: validate.getById,
            description: 'Method that get a user by its id.',
            tags: ['api', 'users'],
            auth: 'jwt',
          },
        },
        {
          method: 'GET',
          path: basePath,
          handler: controller.getAll,
          options: {
            description: 'Method that gets all users.',
            tags: ['api', 'users'],
            auth: 'jwt',
          },
        },
        {
          method: 'DELETE',
          path: `${basePath}/{${controller.id}}`,
          handler: controller.deleteById,
          options: {
            validate: validate.deleteById,
            description: 'Method that deletes a user by its id.',
            tags: ['api', 'users'],
            auth: 'jwt',
          },
        },
        {
          method: 'GET',
          path: `${basePath}/auth/token`,
          handler: controller.getToken,
          options: {
            description: 'Method that generates jwt token',
            tags: ['api', 'users'],
            auth: 'basic',
          },
        },
      ]);

      Logger.info('UserRoutes - Finish adding user routes');

      resolve();
    });
  }
}

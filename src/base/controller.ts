import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Resolver from './resolver';
import Logger from '../helper/logger';
import newResponse from '../helper/response';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

export default class Controller<T> {
  constructor(
    public id: string = 'id',
    private resolver: Resolver<T>
  ) {}

  public create = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      Logger.info(`POST - ${request.url.href}`);

      const data: InsertResult = await this.resolver.save(request.payload as any);

      if (!data?.raw) {
        return toolkit.response(
          newResponse(request, {
            boom: Boom.badRequest()
          })
        );
      }

      return toolkit.response(
        newResponse(request, {
          value: data.raw,
        })
      );
    } catch (error) {
      Logger.error('POST - Error occurred during insert: ', error);
      return toolkit.response(
        newResponse(request, {
          boom: Boom.badImplementation(error),
        })
      );
    }
  };

  public updateById = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      Logger.info(`PUT - ${request.url.href}`);

      const id = encodeURIComponent(request.params[this.id]);

      const updatedEntity: UpdateResult = await this.resolver.updateOneById(
        id,
        request.payload
      );

      if (!updatedEntity?.affected) {
        return toolkit.response(
          newResponse(request, {
            boom: Boom.notFound(`Entity with id ${id} not found`),
          })
        );
      }

      return toolkit.response(
        newResponse(request, {
          value: {id},
        })
      );
    } catch (error) {
      Logger.error('PUT - Error occurred during update: ', error);
      return toolkit.response(
        newResponse(request, {
          boom: Boom.badImplementation(error),
        })
      );
    }
  };

  public getById = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      Logger.info(`GET - ${request.url.href}`);

      const id = encodeURIComponent(request.params[this.id]);

      const entity: T | undefined = await this.resolver.getOneById(id);

      if (!entity) {
        return toolkit.response(
          newResponse(request, {
            boom: Boom.notFound(`Entity with id ${id} not found`),
          })
        );
      }

      return toolkit.response(
        newResponse(request, {
          value: entity,
        })
      );
    } catch (error) {
      Logger.error('GET - Error occurred during find: ', error);
      return toolkit.response(
        newResponse(request, {
          boom: Boom.badImplementation(error),
        })
      );
    }
  };

  public getAll = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      Logger.info(`GET - ${request.url.href}`);

      const entities: T[] = await this.resolver.getAll();

      return toolkit.response(
        newResponse(request, {
          value: entities,
        })
      );
    } catch (error) {
      Logger.error('GET - Error occurred during find: ', error);
      return toolkit.response(
        newResponse(request, {
          boom: Boom.badImplementation(error),
        })
      );
    }
  };

  public deleteById = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      Logger.info(`DELETE - ${request.url.href}`);

      const id = encodeURIComponent(request.params[this.id]);

      const entity: DeleteResult = await this.resolver.deleteOneById(id);
      if (!entity?.affected) {
        return toolkit.response(
          newResponse(request, {
            boom: Boom.notFound(`Entity with id ${id} not found`)
          })
        );
      }

      return toolkit.response(
        newResponse(request, {
          value: {id},
        })
      );
    } catch (error) {
      Logger.error('DELETE - Error occurred during delete: ', error);
      return toolkit.response(
        newResponse(request, {
          boom: Boom.badImplementation(error),
        })
      );
    }
  };
}

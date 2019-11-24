import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

export default class Resolver<T> {
  constructor(protected repository: Repository<T>) {}

  public async save(data: T): Promise<InsertResult> {
    return this.repository.insert(data);
  }

  public async getOneById(id: string): Promise<T | undefined> {
    return this.repository.findOne(id);
  }

  public async updateOneById(id: string, update: any): Promise<UpdateResult> {
    return this.repository.update(id, update);
  }

  public async deleteOneById(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  public async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  public async bulkUpdate(
    ids: string[],
    field: string,
    value: string
  ): Promise<UpdateResult[]> {
    return Promise.all(
      ids.map(async id => await this.updateOneById(id, { [field]: value }))
    );
  }

  public async bulkDelete(ids: string[]): Promise<DeleteResult[]> {
    return Promise.all(ids.map(async id => await this.deleteOneById(id)));
  }
}

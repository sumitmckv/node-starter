import UserResolver from '../../api/users/resolver';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

export default {
  Query: {
    users: async () => {
      const userResolver = new UserResolver();
      return await userResolver.getAll();
    },
    user: async (root: any, req: {id: string}) => {
      const userResolver = new UserResolver();
      return await userResolver.getOneById(req.id);
    }
  },
  Mutation: {
    createUser: async (root: any, req: any) => {
      const userResolver = new UserResolver();
      const data: InsertResult = await userResolver.save(req);
      return data?.raw?.[0];
    },
    updateUser: async (root: any, req: any) => {
      const userResolver = new UserResolver();
      const id: string = req.id;
      delete req.id;
      const data: UpdateResult = await userResolver.updateOneById(id, req);
      return 0 !== data?.affected;
    },
    deleteUser: async (root: any, req: {id: string}) => {
      const userResolver = new UserResolver();
      const data: DeleteResult = await userResolver.deleteOneById(req.id);
      return 0 !== data?.affected;
    }
  }
};

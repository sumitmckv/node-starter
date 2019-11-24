import Resolver from '../../base/resolver';
import User from '../../entity/user';
import { getRepository } from 'typeorm';

export default class UserResolver extends Resolver<User> {
  constructor() {
    super(getRepository(User));
  }
}

import UserResolver from '../../api/users/resolver';
import Controller from '../../base/controller';
import User from '../../entity/user';
import * as jwt from 'jsonwebtoken';
import Config from '../../config';

export default class UserController extends Controller<User> {
  private static token: any = {
    valid: true,
    name: Config.auth.jwt.name,
    exp: new Date().getTime() + 30 * 60 * 1000
  };

  constructor(id?: string) {
    super(id, new UserResolver());
  }

  public getToken = (): any => {
    return jwt.sign(UserController.token, Config.auth.jwt.options.key);
  }
}

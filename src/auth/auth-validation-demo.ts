import * as Hapi from '@hapi/hapi';
import IValidation from './auth-validation';
import Logger from '../helper/logger';
import Config from '../config';

export default class AuthValidationDemo implements IValidation {
    public basic(request: Hapi.Request, username: string, password: string): any {
        Logger.info(`Auth - validating basic auth credential for user: ${username}`); 
        const configCredential = Config.auth.basic;
        const isValid = configCredential.username === username 
            && configCredential.password === password;
        const credentials = isValid ? {name: username} : null;
        return {isValid, credentials};
    }

    public jwt(decoded: any, request: Hapi.Request): any {
        Logger.info('Auth - validating jwt auth'); 
        if (!decoded || !decoded.valid || Config.auth.jwt.name !== decoded.name) {
            return { isValid: false };
          } else {
            return { isValid: true };
          }
    }
}

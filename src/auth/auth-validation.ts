import * as Hapi from '@hapi/hapi';

export default interface IValidation {
    basic(request: Hapi.Request, username: string, password: string): any;
    jwt(decoded: any, request: Hapi.Request): any;
}

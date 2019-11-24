import AuthValidationDemo from './auth/auth-validation-demo';

export default {
  swagger: {
    options: {
      info: {
        title: 'API Documentation',
        version: 'v1.0.0',
        contact: {
          name: 'Sumit Ghosh',
          email: 'sumitmckv14@gmail.com',
        },
      },
      pathPrefixSize: 4,
      documentationPath: '/doc',
      expanded: 'none',
      sortEndpoints: 'method',
      auth: 'basic'
    },
  },
  status: {
    options: {
      path: '/',
      title: 'Server Health Monitor',
      routeConfig: {
        auth: 'basic',
      },
    },
  },
  auth: {
    basic: {
      name: 'basic',
      username: 'node',
      password: 'node',
      options: {
        validate: new AuthValidationDemo().basic
      }
    },
    jwt: {
      name: 'jwt',
      options: {
        key: 'JWT-SECRET-KEY',
        verifyOptions: {algorithms: ['HS256']},
        validate: new AuthValidationDemo().jwt
      }
    }
  }
};

import angular from 'angular';

import loginController from './login.ctrl';
import loginApi from './login.service'

export default angular.module('app.modules.login', [])
    .controller('loginController', loginController)
    .service('loginApi', loginApi);

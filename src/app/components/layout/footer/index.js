
import angular from 'angular';

import footerCtrl from './ctrl';
import footerHtml from './footer.html';
// import common from '../_common';

require('./footer.less')

const footer = angular.module('app.components.footer', [])
    .controller('footerCtrl', footerCtrl);

export { footer, footerHtml, footerCtrl };

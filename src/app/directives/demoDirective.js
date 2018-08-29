function copyRight() {
    return {
        restrict: 'EA',
        replace: true,
        template: `<p class="pull-right">&copy; ${new Date().getFullYear()} </p>`
    }
}

copyRight.$inject = [];
export default copyRight;


class homeService {
    constructor($http) {
        Object.assign(this, { $http });
        let self = this;

    }

}

homeService.$inject = ['$http'];

export default homeService;

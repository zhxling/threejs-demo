function loginApi($resource) {
    return $resource('login');
}

loginApi.$inject = ['$resource'];

export default loginApi

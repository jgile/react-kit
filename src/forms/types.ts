export var Method: any;
(function(Method) {
    Method['GET'] = 'get';
    Method['POST'] = 'post';
    Method['PUT'] = 'put';
    Method['PATCH'] = 'patch';
    Method['DELETE'] = 'delete';
})(Method || (Method = {}));
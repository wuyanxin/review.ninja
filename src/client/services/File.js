// *****************************************************
// Pull Factory
// *****************************************************

module.factory('File', ['$HUB', '$stateParams', function($HUB, $stateParams) {

    var imagefiles = ['jpg', 'jpeg', 'png', 'bmp', 'psd', 'tiff', 'ico'];

    return {
        extensions: function(tree) {
            tree.tree.forEach(function(node) {
                if(node.type === 'blob') {
                    var extension = node.path.split('.').pop().toLowerCase();
                    if(imagefiles.indexOf(extension) !== -1) {
                        node.type = 'image';
                    }
                }
            });
            
            return tree;
        }
    };
}]);

angular.module('core.fileViewer')
.component('fileViewer', {
	templateUrl: 'view/core/fileViewer/fileViewer.template.html',
	controller: [
		'$scope',
		'$timeout',
		'Auth',
		'Upload',
		'UploadFile',
		function fileViewerCtrl($scope, $timeout, Auth, Upload, UploadFile) {
			var vm = this;
			vm.params = {
				name : ''
			};
			$scope.$watch('files', function (files) {
				if(files && files.length) {
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						if (!file.$error) {
							UploadFile.uploadToS3(file);
						}
					}
				}
			});
			//logic to create a folder object by using the authentication service 
			vm.onSubmit = function () {
				var folder = {
					"name" : vm.params.folderName,
					"parent" : ''

				};
				Auth.createFolder(folder, '/');

				
			}
		}],

	controllerAs: 'vm'
});

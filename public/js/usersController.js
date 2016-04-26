angular.module('jukebox')
	.controller('UsersController', UsersController)

UsersController.$inject = ['$state', 'authFactory', '$rootScope', '$window', 'editFactory', '$http', '$log']

function UsersController($state, authFactory, $rootScope, $window, $editFactory, $http, $log) {
	var vm = this
	vm.user = {}
	vm.api = editFactory
	vm.loggedIn = authFactory.isLoggedIn();
	vm.signup = signup
	vm.login = login
	vm.logout = logout
	vm.getUser = getUser
	vm.userid = {}
	vm.error = null
	vm.getArtist = getArtist;
	vm.artist = {}
	vm.songs = []
	vm.addtoPL = addtoPL

	function addtoPL(song) {
		console.log("song from function addtoPL",song);
	}

	function getArtist(artist){
		vm.songs=[]
		console.log("req from form", artist);
    $http({
      method: 'GET',
      url : 'https://api.soundcloud.com/tracks?client_id=030341538cff3ba796885fa35911cb51&q='+artist.name
    })
    .then(function(response){ //promise
			for (var i = 0; i < response.data.length; i++) {
				vm.songs.push(response.data[i])
			}
			console.log("vm.songs",vm.songs);
			//console.log("response",response);
    })
  }

	$rootScope.$on('$stateChangeStart', function() {
		vm.loggedIn = authFactory.isLoggedIn();
		vm.getUser()
		vm.error = null
	});

	function logout(){
		$state.go('loggedOut')
		authFactory.logout();
		$window.location.reload();
	}

	function getUser(){
		authFactory.getUser()
		.then(function(response){
			// console.log("response.data is " +JSON.stringify(response.data))
			vm.user = response.data
			// console.log("vm.user is " + JSON.stringify(vm.user.userid))
			vm.userid = vm.user.userid
			console.log("vm.userid is " + vm.userid)
		})
	}

	function signup(){
		authFactory.signup(vm.user.id, vm.user.username, vm.user.permalink, vm.user.uri, vm.user.permalink_url, vm.user.avatar_url)
		.then(function(response){
			if(response.data.success){
				vm.login()
			} else {
				vm.error = response.data.message
			}
		})
	}

	function login(){
		authFactory.login(vm.user.id, vm.user.username, vm.user.permalink, vm.user.uri, vm.user.permalink_url, vm.user.avatar_url)
		.then(function(response){
			if(response.data.success){
				$state.go("home")
			} else {
				vm.error = response.data.message
			}
		})
	}
}

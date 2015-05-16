var gameApp = angular.module('gameApp');

gameApp.controller('gameController', ['$rootScope', '$scope', '$timeout', 'gameHubService', function ($rootScope, $scope, $timeout, gameHubService) {
 
	$scope.lastUpdated = new Date();
	
	$scope.numberOfPersonsThrownOverboardToday = 0;
	$scope.survivors = [];
	$scope.votes = [];
	$scope.log = [];
	$scope.rations = 13 * 6;
	$scope.daysRemaining = 8;
	$scope.currentPeriod = 0;
	
	$scope.htmlEncode = function(value) {
		var encodedValue = $('<div />').text(value).html();
		return encodedValue;
	};

	$rootScope.$on('receiveChat', function (event, name, message) {
	    $scope.$apply(function () {
	        var line = $scope.htmlEncode(name) + ': ' + $scope.htmlEncode(message);
	        $scope.appendLog(line);
	    });
	});

	$scope.getTimePeriod = function() {
		var isDay = $scope.isDay();
		var day = Math.floor($scope.currentPeriod / 2) + 1;
		return (isDay ? "Day " : "Night ") + day;
	}
	
	$scope.daysOfRationsRemaining = function() {
		return Math.floor($scope.rations / $scope.survivors.length);
	}
	
	$scope.numberOfKillingsRequiredForEveryoneElseToSurvive = function() {
	
		var rationsNeeded = $scope.survivors.length * $scope.daysRemaining;
		var rationDeficit = rationsNeeded - $scope.rations;
		if (rationDeficit <= 0) {
			return 0;
		}
		else {
			return Math.ceil(rationDeficit / $scope.daysRemaining);
		}
	}
	
	$scope.getFlattenedLog = function() {
		var flat = '';
		for (var i = 0; i < $scope.log.length; i++) {
			flat += $scope.log[i] + '\n';
		}
		return flat;
	}
	
	$scope.appendLog = function(line) {		
		$scope.log.push(line);
		
		var textarea = document.getElementById('log');
		textarea.scrollTop = textarea.scrollHeight;
	}
	
	$scope.clearLog = function() {
	    $scope.log = [];
	}
	
	$scope.canVoteKill = function() {
		return $scope.numberOfPersonsThrownOverboardToday == 0 && $scope.isDay();
	}
	
	$scope.voteKill = function(name) {
		$scope.votes.push(name);
		$scope.appendLog('Player has voted to kill ' + name + '.');
		
		if ($scope.countVotes(name) >= $scope.votesRequiredToThrowSomeoneOverboard()) {		
			$scope.appendLog(name + ' has been thrown overboard.');
			$scope.votes = [];
			$scope.killSurvivor(name);
			$scope.numberOfPersonsThrownOverboardToday++;
		}		
	}
	
	$scope.killSurvivor = function(name) {
		for (var i = 0; i < $scope.survivors.length; i++) {
			if ($scope.survivors[i].name == name) {			
				$scope.survivors.splice(i, 1);
				$scope.appendLog(name + ' is dead.');
				
				if ($scope.survivors.length == 0) {
					$scope.appendLog('Everyone is dead.  You all lose.\nGAME OVER');
				}
				
				return;
			}
		}
	}
	
	$scope.votesRequiredToThrowSomeoneOverboard = function() {
		var votes = Math.ceil($scope.survivors.length / 2);
		if ($scope.survivors.length % 2 == 0) {
			votes++;
		}
		return votes;
	}
	
	$scope.loadSurvivors = function() {
		$scope.survivors.push({name: 'Aaron Jones'});
		$scope.survivors.push({name: 'Beth Smith'});
		$scope.survivors.push({name: 'Charles Smith'});
		$scope.survivors.push({name: 'Deborah Johnson'});
		$scope.survivors.push({name: 'Ethan Johnson'});
		$scope.survivors.push({name: 'Fiona Johnson'});
		$scope.survivors.push({name: 'George Williams'});
		$scope.survivors.push({name: 'Henrietta Williams'});
		$scope.survivors.push({name: 'Ian Brown'});
		$scope.survivors.push({name: 'Janice Brown'});
		$scope.survivors.push({name: 'Kevin Gray'});
		$scope.survivors.push({name: 'Laura Green'});
		$scope.survivors.push({name: 'Mark Wright'});
	}
	
	$scope.isDay = function() {
		return $scope.currentPeriod % 2 == 0;
	}
	
	$scope.endDay = function() {	
		var drinkingOrder = $scope.shuffle($scope.survivors);
		for (var i = 0; i < drinkingOrder.length; i++) {
			if ($scope.rations > 0) {
				$scope.rations--;
				$scope.appendLog(drinkingOrder[i].name + ' used 1 day of rations.');
			}
			else {
				$scope.appendLog(drinkingOrder[i].name + ' died of starvation.');
				$scope.killSurvivor(drinkingOrder[i]);
			}
			
			var survivor = $scope.survivors[i];
			if (!survivor.stayAwake) {
				survivor.isSleeping = true;
			}
		}
	}
	
	$scope.stayAwake = function() {
		$scope.survivors[0].stayAwake = true;
		$scope.appendLog($scope.survivors[0].name + ' has decided to stay awake tonight.');
	}
	
	$scope.endNight = function() {
	
		for (var i = 0; i < $scope.survivors.length; i++) {		
			var survivor = $scope.survivors[i];
			survivor.canStayAwake = true;
			if (survivor.stayAwake) {
				$scope.appendLog($scope.survivors[i].name + ' is exhausted from staying up for 24 hours, and is going to sleep today.');
				$scope.survivors[i].isSleeping = true;
				$scope.survivors[i].stayAwake = false;
			}
			else {
				$scope.survivors[i].isSleeping = false;
			}
		}
	
		$scope.daysRemaining--;
		if ($scope.daysRemaining == 0) {
			$scope.appendLog('Those of you who still survive have been rescued!\nGAME OVER');
		}
	}
	
	$scope.advanceTime = function() {
	
		if ($scope.isDay()) {
			$scope.endDay();
		}
		else {
			$scope.endNight();
		}
		$scope.currentPeriod++;
		
		$scope.numberOfPersonsThrownOverboardToday = 0;
	}
	
	$scope.shuffle = function(array) {
		var clone = array.slice(0);
		return clone.sort(function() {
			return .5 - Math.random();
		});
	}
	
	$scope.countVotes = function(survivor) {
		var count = 0;
		for (var i = 0; i < $scope.votes.length; i++) {
			if ($scope.votes[i] == survivor) {
				count++;
			}
		}
		return count;
	}
	
	$scope.update = function() {
		var framesPerSecond = 2;
		
		var now = new Date();
		var timeSinceLastUpdate = now.getTime() - $scope.lastUpdated.getTime();

		$scope.lastUpdated = now;		
		$timeout($scope.update, 1000 / framesPerSecond);
	}
	
	$scope.init = function() {
	    $scope.loadSurvivors();
	    gameHubService.initialize();
	}
	
	$scope.init();	
	
}]);
(function () {
  var EstimationController = function ($scope) {
    var socket = null

    function init () {
      $scope.users = []
      $scope.points = []
      $scope.decks = getDecks()
      $scope.selectedDeck = 'Fibonnacci'
      $scope.cards = []
      $scope.joined = false
      $scope.currentEstimation = ''
      $scope.roomId = decodeURI($.getRoom())
      socket = io.connect(window.location.origin)
      socket.emit('start', $scope.roomId)
      bindEvents()
    }

    function join () {
      var userToJoin = {
        name: $scope.name,
        estimation: '',
        flipped: false
      }
      $scope.cards = getCardsByDeck($scope.selectedDeck)
      $scope.joined = true
      $scope.users.push(userToJoin)
      socket.emit('joined', $scope.roomId, userToJoin)
    }

    function estimate (points) {
      socket.emit('estimate', $scope.roomId, points)
      $scope.currentEstimation = points
    }

    function flipCards () {
      socket.emit('flipCards', $scope.roomId)
    }

    function allAreEstimated () {
      return $scope.users.every(function (user) {
        return user.estimation !== '' && user.estimation !== '?'
      })
    }

    function cleanEstimations () {
      $scope.currentEstimation = ''
      socket.emit('cleanEstimations', $scope.roomId)
    }

    function changeDeck () {
      $scope.cards = getCardsByDeck($scope.selectedDeck)
      socket.emit('setDeckInRoom', $scope.roomId, $scope.selectedDeck)
      cleanEstimations()
    }

    function onJoinUser (data, cleanEstimation) {
      const room = $.parseJSON(data)
      const users = room.users

      if (room.deck) {
        onRemoveDeck(room.deck)
      }

      $scope.$apply(function () {
        const result = []
        let est = ''
        for (var user in users) {
          if (users[user]) {
            if (!users[user].flipped && users[user].estimation !== '') {
              est = '?'
            } else {
              est = users[user].estimation
            }
            result.push({
              name: users[user].name,
              estimation: est,
              flipped: users[user].flipped
            })
          }
        }
        $scope.users = result
        var estimations = $scope.users.map(u => {
          return u.estimation
        })
        if (estimations && estimations.length > 0) {
          var counts = {}
          for (var i = 0; i < estimations.length; i++) {
            var key = estimations[i]
            if (counts[key]) {
              counts[key]++
            } else {
              counts[key] = 1
            }
          }
          $scope.points = Object.keys(counts).map(key => {
            return {
              points: key,
              count: counts[key]
            }
          }).sort((a, b) => b.count - a.count)
        }
        if (cleanEstimation === true) {
          $scope.currentEstimation = ''
        }
      })
    }

    function onRemoveDeck (deck) {
      if (deck) {
        $scope.selectedDeck = deck
        $scope.cards = getCardsByDeck(deck)
      }
    }

    function onReconnect (attempt) {
      console.log('Reconnecting...', attempt)
      socket.emit('syncConnection', $scope.roomId, $scope.name)
    }

    function bindEvents () {
      $scope.join = join
      $scope.estimate = estimate
      $scope.flipCards = flipCards
      $scope.cleanEstimations = cleanEstimations
      $scope.changeDeck = changeDeck
      $scope.allAreEstimated = allAreEstimated
      $scope.getDescriptionByDeck = getDescriptionByDeck

      socket.on('update', onJoinUser)
      socket.on('onStart', onJoinUser)
      socket.on('removeDeckSelection', onRemoveDeck)
      socket.on('reconnect', onReconnect)
    }

    function getDecks () {
      const decksArray = []
      for (const deck in $.App.Deck) {
        decksArray.push(deck)
      }
      return decksArray
    }

    function getCardsByDeck (deck) {
      return $.App.Deck[deck].Cards
    }

    function getDescriptionByDeck(deck) {
      return $.App.Deck[deck].Description
    }

    init()
  }

  $.App.ScrumPoker.controller('EstimationController', EstimationController)
}())

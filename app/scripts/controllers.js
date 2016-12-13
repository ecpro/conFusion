'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading...";
           
            menuFactory.getDishes().query(
                function (response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
            },
                function (response) {
                    $scope.message = "Error: " + response.status + response.statusText;
                }
            );

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Telephone"}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope','feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {

                    feedbackFactory.sendFeedback().save($scope.feedback);

                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message = "Loading...";
            
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
                .$promise.then(
                    function (response) {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function (response) {
                        $scope.message = "Error " + response.status + response.statusText;
                    }
                );
            
            
        }])

        .controller('DishCommentController', ['$scope','menuFactory', function($scope,menuFactory) {
            
            $scope.myComment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.myComment.date = new Date().toISOString();
                console.log($scope.myComment);
                
                $scope.dish.comments.push($scope.myComment);

                console.log($scope.dish.comments);
                menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);

                $scope.commentForm.$setPristine();
                
                $scope.myComment = {rating:5, comment:"", author:"", date:""};


            };
        }])

    .controller('IndexController', ['menuFactory', '$scope','corporateFactory', function (menuFactory, $scope,corporateFactory) {
        $scope.featuredDish = {};
        $scope.message = "Loading..";
        $scope.showDish = false;
        
        $scope.featuredDish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                function (response) {
                    $scope.featuredDish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error : " + response.status + response.statusText;
                }
            );

        $scope.showPromotion = false;
        $scope.promotion = menuFactory.getPromotion().get({id:0})
            .$promise.then(
                function (response) {
                    $scope.promotion = response;
                    $scope.showPromotion = true;
                },
                function(response) {
                    $scope.message = "Error : " + response.status + response.statusText;
                }
            );

        $scope.showLeader = false;
        $scope.execChef = corporateFactory.getLeaders().get({id:0})
            .$promise.then(
                function (response) {
                    $scope.execChef = response;
                    $scope.showLeader = true;
                },
                function (response) {
                    $scope.exeChef = "Error : " + response.status + response.statusText;
                }
            );
    }])
    
    .controller('AboutController', ['corporateFactory', '$scope', function (corporateFactory, $scope) {
        $scope.showLeader = false;
        $scope.message = "Loading...";
        $scope.leaders = corporateFactory.getLeaders().query(
            function (response) {
                $scope.leaders = response;
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error : " + response.status + response.statusText;
            }
        );
    }])

;

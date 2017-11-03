// https://material.angularjs.org/1.1.5/demo/autocomplete
app = angular.module('signInApp',['ngMaterial'])
    .config(($mdThemingProvider) => {
        $mdThemingProvider.theme('default')
        $mdThemingProvider.theme('default')
            .dark()
            .primaryPalette('red')
            .accentPalette('light-blue');
    })
    .controller('signInCtrl', signInCtrl);

app.factory('SimpleStore', function(){
    return function () {
        var allNames = 'Josh M, Noah R, Paul B, Kathrine H, Stacey G, Aaron D, Bob A, Jane D, Alex M';
        var nameList = allNames.split(/, +/g).map( name => {
            return {
            value: name.toLowerCase(),
            display: name
            };
        });
        nameList.sort((a, b) =>{ 
            if(a.value < b.value) return -1;
            if(a.value > b.value) return 1;
            return 0;
        })
        return nameList;
    }
});

function signInCtrl (SimpleStore) {
    var _this = this;
    _this.members = SimpleStore();
    _this.filterMembers = filterMembers;

    function filterMembers (query) {
        // Attempting to reacreate an intermittent bug - wondering if this will catch it. 
        if(query != _this.searchText){
            console.log("ERROR: " + query + " | " + _this.searchText);
        }
        var filteredNames = [];
        for(var i = 0; i < _this.members.length; i++){
            var member = _this.members[i];
            if (member.value.indexOf(query) == 0){
                filteredNames.push(member);
            }
        }
        return filteredNames;
    }

};
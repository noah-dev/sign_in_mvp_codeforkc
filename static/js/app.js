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

app.factory('Config', function(){
    return function () {
        this.signInSuccessMessage = "Signed In - Thank You! 😊";
        this.signInSuccessTheme = "success";
        this.signInSuccessDelay = 1000;

        this.signInErrorMessage =  "Sorry, I could not find that name. Please try again 😵";
        this.signInErrorTheme = "error";
        this.signInErrorDelay = 4000;
    }
});

function signInCtrl ( $mdToast, SimpleStore, Config) {
    var _this = this;
    _this.members = SimpleStore();
    _this.CONFIG = new Config();

    _this.filterMembers = filterMembers;
    _this.confirmSignIn = confirmSignIn

    function filterMembers (query) {
        var filteredNames = [];
        
        // If the user types something, but then deletes all characters, 
        // reutn the entire list
        if (query === undefined){
            filteredNames = _this.members;
        } else {
            for(var i = 0; i < _this.members.length; i++){
                var member = _this.members[i];
                if (member.value.indexOf(query.toLowerCase()) == 0){
                    filteredNames.push(member);
                }
            }
        }
        return filteredNames;
    }

    function confirmSignIn(member){
        var message = "";
        var theme = "";
        var timeDelay = 0;
        if(member){
            message = _this.CONFIG.signInSuccessMessage;
            theme = _this.CONFIG.signInSuccessTheme;
            timeDelay = _this.CONFIG.signInSuccessDelay;
            // Long story short, if the user presses enter the cursor stays on the autcomplete input.
            // But we clear the input out after every sign in, so the filter reruns and shows the list
            // of avalible names. Not only does it overlap the toast message, it is confusing. 
            // So originally, I just wanted to defocus off of the autocomplete input. But angular did not make 
            // this easy, and jQuery's blur method failed on the autcomplete element.
            // Therefore, we select the the body, empty the autcomplete input, and deselect the body. 

            // What was that? You said this is a disgusting terrible work around?
            // Believe me, I agree with you. But every other approach I found seemed to be way uglier. 
            // (My previous approach was even worse - using an invisible input instead of the body)
            // I am seriously open to suggestions - because this is downright stupid. 
            var focusWorkAround = angular.element(document.querySelector('#signInBtn'));
            focusWorkAround.focus();
            _this.selectedItem = null;
            focusWorkAround.blur();
        } else {
            message = _this.CONFIG.signInErrorMessage;
            theme = _this.CONFIG.signInErrorTheme;
            timeDelay = _this.CONFIG.signInErrorDelay;
        }

        writeToDB();
        
        $mdToast.show(
            $mdToast.simple()
            .textContent(message)
            .theme(theme)
            .parent(document.querySelectorAll('#MainCard'))
            .position("bottom right")
            .hideDelay(timeDelay)
        );
        return [message, theme, timeDelay];
    }
    function writeToDB(){
        return "";
    }

};
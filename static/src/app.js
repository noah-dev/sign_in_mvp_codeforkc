// https://material.angularjs.org/1.1.5/demo/autocomplete
app = angular.module('signInApp',['ngMaterial'])
.config(($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
    $mdThemingProvider.theme('default')
        .dark()
        .primaryPalette('red')
        .accentPalette('light-blue');
    $mdThemingProvider.theme("toast-success")
    $mdThemingProvider.theme("toast-error")
})
.controller('signInCtrl', signInCtrl);

app.factory('Config', function(){
    return function () {
        var _this = this;
        _this.signInSuccessMessage = (name)=>{return "Welcome PLACEHOLDER 😊".replace("PLACEHOLDER", name);}
        _this.signInSuccessTheme = "toast-success";
        _this.signInSuccessDelay = 1000;

        _this.signInErrorMessage = (name)=>{return "Could not sign in PLACEHOLDER. Sorry 😵".replace("PLACEHOLDER", name);}
        _this.signInErrorTheme = "toast-error";
        _this.signInErrorDelay = 2000;

        _this.dbURL = "http://localhost:1000/signin"
    }
});

function signInCtrl ($q,  $http, $timeout, $mdToast, Config) {
    var _this = this;
    _this.CONFIG = new Config();

    _this.members;
    _this.filterMembers = filterMembers;
    _this.signIn = signIn;
    _this.confirmSignIn = confirmSignIn;
    _this.updateUI = updateUI;
    _this.deFocus = deFocus;
    _this.getMembersDB = getMembersDB;
    _this.newRecordDB = newRecordDB;
    _this.init = init;
    
    _this.init();
    function init(){
        _this.mainInputDisabled = true;
        _this.getMembersDB().then(res=>{
            _this.members = res.data;
            _this.mainInputDisabled = false;
        })
    }

    function filterMembers (query) {
        var filteredNames = [];
        // If the user types something, but then deletes all characters, return the entire list
        if (query === undefined){
            filteredNames = _this.members;
        } else {
            for(var i = 0; i < _this.members.length; i++){
                var member = _this.members[i];
                if (member.name.toLowerCase().indexOf(query.toLowerCase()) == 0){
                    filteredNames.push(member);
                }
            }
        }
        return filteredNames;
    }

    function signIn(member, searchText){
        var res, name;
        res = _this.confirmSignIn(member, searchText);
        name = res.member ? res.member.name : searchText;
        if (res.status) {
            _this.newRecordDB(res.member).then(resDB=>{
                if (resDB.status){
                    _this.updateUI(res.status, name);
                    _this.getMembersDB().then(readDB=>{
                        _this.members = readDB.data;
                    })
                }
            });
        } else {
            _this.updateUI(res.status, name);
        }
    }

    function confirmSignIn(member, searchText){
        var status, res = {}; 
        // If the user does not select an item but presses enter, the member object will be null
        // But if the user got the spelling right, then populate the member object
        if (member == null){
            member = filterMembers(searchText).length == 1 ? filterMembers(searchText)[0] : null;
        } 

        // If this is a valid member, set status to true. Otherwise false.
        status = member ? true : false;
    
        res.status = status;
        res.member = member; 
        return res; 
    }
    function getMembersDB(){
        return $http({
            method: 'GET',
            url: _this.CONFIG.dbURL,
        })
    }
    function newRecordDB(member){
        return $http({
            method: 'GET',
            url: _this.CONFIG.dbURL+"?id="+member.id
        }).then(res=>{
            return res.data;
        })
    }

    function updateUI(status, name){
        var message = "";
        var theme = "";
        var timeDelay = 0;
        if (status){
            message = _this.CONFIG.signInSuccessMessage(name);
            theme = _this.CONFIG.signInSuccessTheme;
            timeDelay = _this.CONFIG.signInSuccessDelay;

            _this.deFocus();
            
            _this.selectedItem = null;
            _this.searchText = undefined;
    
            _this.mainInputDisabled = true;
            $timeout(()=>{_this.mainInputDisabled = false}, 2 * timeDelay)
        } else {
            message = _this.CONFIG.signInErrorMessage(name);
            theme = _this.CONFIG.signInErrorTheme;
            timeDelay = _this.CONFIG.signInErrorDelay;
        }
        $mdToast.show(
            $mdToast.simple()
            .textContent(message)
            .theme(theme)
            .parent(document.querySelectorAll('#MainCard'))
            .position("bottom right")
            .hideDelay(timeDelay)
        );
    }
    function deFocus(){
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
        focusWorkAround.blur();
    }

};
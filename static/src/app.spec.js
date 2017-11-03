function TestStore() {
    return function () {
        var allNames = 'Noah R, Alex M, Alice J';
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
};

describe('Sign in App', ()=> {
    beforeEach(module('signInApp'));
    var $controller;
    var $scope = {};
    var Store = {};
    var TestConfig;
    var CONFIG;
    beforeEach(inject(Config => {
        TestConfig = Config;
        CONFIG = new Config;
    }));
    beforeEach(inject(_$controller_=>{
        $controller = _$controller_;
        $scope = $controller('signInCtrl as sic', {$scope: $scope, SimpleStore: TestStore(), Config: TestConfig});
    }));

    describe('Filter members function', ()=>{
        it('Does it return the entire list?', ()=>{
            var result = $scope.filterMembers("");
            var expected = TestStore()();
            expect(result).toEqual(expected);
        });

        it('Does it return the an empty list?', ()=>{
            var result = $scope.filterMembers(" ");
            var expected = [];
            expect(result).toEqual(expected);
        });
    
        it('Does basic filter work?', ()=>{
            var result = $scope.filterMembers("n");
            var expected = [{"value": "noah r", "display": "Noah R"}];
            expect(result).toEqual(expected);
        });
    });

    describe('Confirm sign in', ()=>{
        it('If the user did not select a name and the search text matches nothing, does it return error?', ()=>{
            var searchText = ""
            var result = $scope.confirmSignIn(null, searchText);
            var expected = [CONFIG.signInErrorMessage(searchText), CONFIG.signInErrorTheme, CONFIG.signInErrorDelay];
            expect(result).toEqual(expected);
        });
        describe('If the user did not select a name and but the search text matches up, does it return error?', ()=>{
            var searchText = "";
            var dispalyText = "";
            beforeEach(()=>{
                searchText = "Noah";
                displayText = "Noah R";
            })
            it('lower case search', ()=>{
                var result = $scope.confirmSignIn(null, searchText.toLowerCase());
                var expected = [CONFIG.signInSuccessMessage(displayText), CONFIG.signInSuccessTheme, CONFIG.signInSuccessDelay];
                expect(result).toEqual(expected);
            });
            it('upper case search', ()=>{
                var result = $scope.confirmSignIn(null, searchText.toUpperCase());
                var expected = [CONFIG.signInSuccessMessage(displayText), CONFIG.signInSuccessTheme, CONFIG.signInSuccessDelay];
                expect(result).toEqual(expected);
            });
            it('mixed case search', ()=>{
                searchText = "NoAh R"
                var result = $scope.confirmSignIn(null, searchText);
                var expected = [CONFIG.signInSuccessMessage(displayText), CONFIG.signInSuccessTheme, CONFIG.signInSuccessDelay];
                expect(result).toEqual(expected);
            });
        });
        it('If the argment is valid, does it return success?', ()=>{
            var testMember = $scope.members[0];
            var result = $scope.confirmSignIn(testMember, testMember.display)
            var expected = [CONFIG.signInSuccessMessage(testMember.display), CONFIG.signInSuccessTheme, CONFIG.signInSuccessDelay];
            expect(result).toEqual(expected);
        });
    });
});
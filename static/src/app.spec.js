function TestStore() {
    return function () {
        var allNames = 'Noah R, Noel J, Alex M, Alice J';
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
            var result = $scope.filterMembers("noah");
            var expected = [{"value": "noah r", "display": "Noah R"}];
            expect(result).toEqual(expected);
        });
    });

    describe('Confirm sign in', ()=>{
        var testMember;
        beforeEach(()=>{
            // Noah R
            testMember = $scope.members[2];
        })
        it('If the user did not select a name and the search text matches nothing, does it fail?', ()=>{
            var searchText = " ";
            var result = $scope.confirmSignIn(null, searchText);
            var expected = {};
            expected.status = false;
            expected.member = null;
            expect(result).toEqual(expected);
        });
        it('If the user searched and selected a name, does it confirm?', ()=>{
            var result = $scope.confirmSignIn(testMember, testMember.display)
            var expected = {};
            expected.status = true;
            expected.member = testMember;
            expect(result).toEqual(expected);
        });
        describe('The user did not select a name and but the search text matches up', ()=>{
            it('If the autocomplete picks up multiple names, does it fail?', ()=>{
                var searchText = "n";
                var result = $scope.confirmSignIn(null, searchText);
                var expected = {};
                expected.status = false;
                expected.member = null;
                expect(result).toEqual(expected);
            });
            it('If enough is typed into to reduce to 1 name, does it work?', ()=>{
                var searchText = "Noah";
                var result = $scope.confirmSignIn(null, searchText);
                var expected = {};
                expected.status = true;
                expected.member = testMember;
                expect(result).toEqual(expected);
            });
        });
    });
});
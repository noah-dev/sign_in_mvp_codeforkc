describe('Sign in App', ()=> {
    beforeEach(module('signInApp'));
    var $controller;
    var $scope = {};
    var $http = {};
    var CONFIG;
    var testMembers = [{"id":0,"name":"Josh M"},{"id":1,"name":"Noah R"},{"id":2,"name":"Paul B"},{"id":3,"name":"Kathrine H"},{"id":4,"name":"Stacey G"},{"id":5,"name":"Aaron D"},{"id":6,"name":"Bob A, Jane D"},{"id":7,"name":"Alex M"}];
    beforeEach(inject(Config => {
        TestConfig = Config;
        CONFIG = new Config;
    }));
    beforeEach(inject(function($injector){
        $http = $injector.get('$http');
        $httpBackend = $injector.get('$httpBackend');
    }));
    beforeEach(inject(_$controller_=>{
        $controller = _$controller_;
        
        // For init function
        $httpBackend.expectGET(CONFIG.dbURL).respond(200, testMembers);
        $scope = $controller('signInCtrl as sic', {$scope: $scope, Config: TestConfig});

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));
    
    fdescribe('Do database operations work correctly', ()=>{
        beforeEach(()=>{
            $httpBackend.expectGET(CONFIG.dbURL).respond(200, testMembers);
        })
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        it('Does it get the data?', ()=>{
            var result = [];
            $scope.getMembersDB().then(res=>{
                result = res.data;
            })
            $httpBackend.flush();
            expect(result).toEqual(testMembers);
        });
        it('Did the init function work?', ()=>{
            $scope.init();
            $httpBackend.flush();
            expect($scope.members).toEqual(testMembers);
        });
    });

    describe('Filter members function', ()=>{
        it('Does it return the entire list?', ()=>{
            $scope.getMembersDB().then(res=>{
                $scope.members = res.data;
            })
            $httpBackend.flush();
            console.log($scope.members);
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
    // Major rewrite here
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
describe('Sign in App', ()=> {
    beforeEach(module('signInApp'));
    var $controller;
    var $scope = {};
    var $http = {};
    var CONFIG;
    var testMembers = [ { "id": 1, "name": "Yehudit" }, { "id": 2, "name": "Noby" }, 
                        { "id": 3, "name": "Lyman" }, { "id": 4, "name": "Sidonia" }, 
                        { "id": 5, "name": "Eileen" }, { "id": 6, "name": "Hirsch" }, 
                        { "id": 7, "name": "Jedidiah" }, { "id": 8, "name": "Vivie" }, 
                        { "id": 9, "name": "Eunice" }, { "id": 10, "name": "Jennilee" }];
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
    
    describe('Do database operations work correctly', ()=>{
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        it('Does it get the data?', ()=>{
            $httpBackend.expectGET(CONFIG.dbURL).respond(200, testMembers);

            var result = [];
            $scope.getMembersDB().then(res=>{
                result = res.data;
            })
            $httpBackend.flush();
            expect(result).toEqual(testMembers);
        });
        it('Did the init function work?', ()=>{
            $httpBackend.expectGET(CONFIG.dbURL).respond(200, testMembers);

            $scope.init();
            $httpBackend.flush();
            expect($scope.members).toEqual(testMembers);
        });
        it('Does a valid write to db succeed?', ()=>{
            var id = 1;
            var expected = {status: true};
            var result;

            $httpBackend.expectGET(CONFIG.dbURL+"?id="+String(id)).respond(200, expected);
            result = $scope.newRecordDB(testMembers[id-1])
            $httpBackend.flush();
            result.then(resDB=>{
                expect(resDB).toEqual(expected)
            })
        });
    });

    describe('Filter members function', ()=>{
        it('Does it return the entire list?', ()=>{
            var result = $scope.filterMembers(undefined);
            var expected = $scope.members;
            expect(result).toEqual(expected);
        });

        it('Does it return the an empty list?', ()=>{
            var result = $scope.filterMembers(" ");
            var expected = [];
            expect(result).toEqual(expected);
        });
    
        it('Does basic filter work?', ()=>{
            var result = $scope.filterMembers("j");
            var expected = [{ "id": 7, "name": "Jedidiah" }, { "id": 10, "name": "Jennilee" }];
            expect(result).toEqual(expected);
        });
    });
    // Major rewrite here
    describe('Confirm sign in', ()=>{
        var testMember;
        beforeEach(()=>{
            testMember = testMembers[6]
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
                var searchText = "je";
                var result = $scope.confirmSignIn(null, searchText);
                var expected = {};
                expected.status = false;
                expected.member = null;
                expect(result).toEqual(expected);
            });
            it('If enough is typed into to reduce to 1 name, does it work?', ()=>{
                var searchText = "jed";
                var result = $scope.confirmSignIn(null, searchText);
                var expected = {};
                expected.status = true;
                expected.member = testMember;
                expect(result).toEqual(expected);
            });
        });
    });
});
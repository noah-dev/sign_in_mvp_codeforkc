describe('Sign in App', ()=> {
    beforeEach(module('signInApp'));
    var $controller;
    var $scope = {};
    var $http = {};
    var CONFIG;
    var testData = [{"id":0,"name":"Josh M"},{"id":1,"name":"Noah R"},{"id":2,"name":"Paul B"},{"id":3,"name":"Kathrine H"},{"id":4,"name":"Stacey G"},{"id":5,"name":"Aaron D"},{"id":6,"name":"Bob A, Jane D"},{"id":7,"name":"Alex M"}];
    beforeEach(inject(Config => {
        TestConfig = Config;
        CONFIG = new Config;
    }));
    beforeEach(inject(function($injector){
        $http = $injector.get('$http');
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.expectGET(CONFIG.dbURL).respond(testData);
        //$httpBackend.expectGET('/myUrl/myData').respond(200,{data:'expected response'});
    }));
    beforeEach(inject(_$controller_=>{
        $controller = _$controller_;
        $scope = $controller('signInCtrl as sic', {$scope: $scope, Config: TestConfig});
    }));
    afterEach(function() {
        //$httpBackend.verifyNoOutstandingExpectation();
        //$httpBackend.verifyNoOutstandingRequest();
      });

    describe('Filter members function', ()=>{
        it('should set response variable', function(){
            $scope.getResponse();
            $httpBackend.flush();
            expect($scope.response).toEqual('expected response');
        });
        fit("Test", ()=>{
            $scope.getMembersDB();
            $httpBackend.flush();
            console.log($scope.members)
            //$httpBackend.flush();
        });
        it('Does it return the entire list?', ()=>{
            console.log($scope.members);
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
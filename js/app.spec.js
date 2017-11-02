function TestStore() {
    return function () {
        var allNames = 'Noah R, Alex M';
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
    beforeEach(inject(SimpleStore => {
        Store = SimpleStore;
    }));
    beforeEach(inject(_$controller_=>{
        $controller = _$controller_;
        $scope = $controller('signInCtrl as sic', {$scope: $scope, SimpleStore: TestStore()});
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
});
import expect from 'expect'
import testList from './testList.js'

describe('testList', function() {
	it('should be an array', function() {
		expect(testList).toBeA('array')
	});
	it('should have a length of 6', function() {
		expect(testList.length).toEqual(6);
	});
});
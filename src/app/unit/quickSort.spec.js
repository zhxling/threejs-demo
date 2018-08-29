import QuickSort from './quickSort'

let quickSort = new QuickSort();

describe('quickSort test', function () {
    it('quickSort1 test', function () {
        expect(quickSort.quickSort1([3, 4, 2, 1])).to.be.deep.equal([1, 2, 3, 4]);
    })

    it('quickSort2 test', function () {
        expect(quickSort.quickSort2([3, 3, 4, 2, 1, 6])).to.be.deep.equal([1, 2, 3, 3, 4, 6]);
    })
})

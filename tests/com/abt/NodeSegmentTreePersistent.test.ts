import { NodeSegmentTreePersistent, Node, Nill } from '../../../src/com/abt/NodeSegmentTreePersistent'
 

describe('Node Persistent Segment Tree Tests', () => {

    test('NodeSegmentTreePersistent #1', () => {

        var input = [1, 3, 5];
        let sum = (a: number, b: number) => { return a + b; }

        let tree =  NodeSegmentTreePersistent.build(input, 5, sum, 0);

        // pushing deltas to version 1
        tree.update({index:1, newValue:1});//[1, 1, 5]

        // pushing deltas to version 2
        tree.update({index:2, newValue:10});//[1, 1, 10]

        // pushing deltas to version 3
        tree.update({index:0, newValue:5});//[5, 1, 10]

        let received1 = tree.aggregate({from:0, to:2}, tree.version[1]);
        let expected1 = 7;
         expect(received1).toEqual(expected1);

        let received2 = tree.aggregate({from:0, to:2}, tree.version[2]);
        let expected2 = 12;
         expect(received2).toEqual(expected2);

        let received3 = tree.aggregate({from:0, to:2}, tree.version[3]);
        let expected3 = 16;
         expect(received3).toEqual(expected3);

        let received0 = tree.aggregate({from:0, to:2} /**, tree.version[0] */);
        let expected0 = 9;
         expect(received0).toEqual(expected0);


 
    });      

    test('NodeSegmentTreePersistent #2', () => {

        var input = [1, 2, 3, 4, 5];
        let sum = (a: number, b: number) => { return a + b; }

        let tree =  NodeSegmentTreePersistent.build(input, 100, sum, 0);
    
        // pushing deltas to version 1
        tree.update({index:4, newValue:1}); //[1, 2, 3, 4, 1] 

        // pushing deltas to version 2
        tree.update({index:2, newValue:10});//[1, 2, 10, 4, 1]

        // pushing deltas to version 3
        tree.update({index:3, newValue:1});//[1, 2, 10, 1, 1]

        let received1 = tree.aggregate({ from: 0, to: 4 }, tree.version[1]);
        let expected1 = 11;
        expect(received1).toEqual(expected1);

        let received2 = tree.aggregate({ from: 0, to: 4 }, tree.version[2]);
        let expected2 = 18;
        expect(received2).toEqual(expected2);

        let received3 = tree.aggregate({ from: 0, to: 4 }, tree.version[3]);
        let expected3 = 15;
        expect(received3).toEqual(expected3);

        let received0 = tree.aggregate({ from: 0, to: 4 }, tree.version[0]);
        let expected0 = 15;
        expect(received0).toEqual(expected0);


        expect(0).toEqual(0);

    });      

   
 


});



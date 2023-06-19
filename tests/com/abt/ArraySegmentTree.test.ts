import {ArraySegmentTree} from '../../../src/com/abt/ArraySegmentTree'
 


describe('Array Segment Tree Tests', () => {

  test('ArraySemgentTree #1', () => {
    
    let input =  [1,3,9,5] ;
    let sum = (left: number,right: number)=> left+right;

    let tree = ArraySegmentTree.build(input, sum, 0);
    expect(tree.treeData).toMatchObject([18,4,14,1,3,9,5]);
    
    let aggregated = tree.aggregate({from:1, to:3});
    expect(aggregated).toBe(17);
    
    tree.update({position:2, newValue:2});
    expect(tree.treeData).toMatchObject([11,4,7,1,3,2,5]);

  });
    

  test('Test #x', () => {
    const t = () => {
      throw new Error("Error")
    };
    expect(t).toThrow("Error");
  });
  
  
});



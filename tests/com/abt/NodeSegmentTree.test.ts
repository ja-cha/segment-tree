// @filename: NodeSegmentTree.ts
import {NodeSegmentTree} from '../../../src/com/abt/NodeSegmentTree'


describe('Node Segment Tree Tests', () => {

  test('NodeSegmentTree #1', () => {
    
    let sum = (l: number,r: number)=> l+r;

    let tree = NodeSegmentTree.build( [1,3,5], sum, 0);
    
    let aggregated = tree.aggregate({from:0, to:2});
   
    expect(aggregated).toBe(9);

    tree.update({index:1, newValue:6});

    let newSum = tree.aggregate({from:0, to:2});
    
    expect(newSum).toBe(12);

  });

  test('NodeSegmentTree #1a', () => {

    let max = (l: number,r: number)=> Math.max(l,r);
    let tree = NodeSegmentTree.build( [1,3,5], max, Number.MIN_SAFE_INTEGER);
    
    let aggregated = tree.aggregate({from:0, to:2});
    expect(aggregated).toBe(5);

    tree.update({index:1, newValue:6});
    let newMax = tree.aggregate({from:0, to:2});

    expect(newMax).toBe(6);
   
  });
    
  test('NodeSegmentTree #1b', () => {

    let max = (l: number,r: number)=> Math.min(l,r);
    let tree = NodeSegmentTree.build( [4,8,5], max, Number.MAX_SAFE_INTEGER);
    
    let aggregated = tree.aggregate({from:0, to:2});
    expect(aggregated).toBe(4);

    tree.update({index:1, newValue:-3});
    let newMin = tree.aggregate({from:0, to:2});

    expect(newMin).toBe(-3);
   
  });
    
   
  test('NodeSegmentTree #1c', () => {
    
    let sum = (l: number,r: number)=> l+r;

    let nillTree = NodeSegmentTree.build( [], sum, 0);
    
    let aggregated = nillTree.aggregate({from:0, to:2});
   
    expect(aggregated).toBe(0);


  });   
  test('NodeSegmentTree #2', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
     
    let aggregated = tree.aggregate({from:0, to:0});
    expect(aggregated).toBe(1);
    
    });

  test('NodeSegmentTree #2a', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
     
    let aggregated = tree.aggregate({from:1, to:1});
    expect(aggregated).toBe(3);
    
    
  });


  test('NodeSegmentTree #3', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
    //expect(tree.treeData).toMatchObject([9,4,5,1,3]);
    
    let aggregated = tree.aggregate({from:2, to:2});
    expect(aggregated).toBe(5);
    
    });


  test('NodeSegmentTree #4', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
    //expect(tree.treeData).toMatchObject([9,4,5,1,3]);
    
    let aggregated = tree.aggregate({from:0, to:1});
    expect(aggregated).toBe(4);
     
  });

  test('NodeSegmentTree #5', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
     
    let aggregated = tree.aggregate({from:1, to:2});
    expect(aggregated).toBe(8);
     

  });

  test('NodeSegmentTree #6', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
    
    const t = () => {
      tree.aggregate({from:0, to:-1});
    };
    expect(t).toThrow(Error);

  });

  test('NodeSegmentTree #7', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
    
    const t = () => {
      tree.aggregate({from:3, to:5});
    };
    expect(t).toThrow(Error);

  });


  test('NodeSegmentTree #8', () => {
    
    let tree = NodeSegmentTree.build( [1,3,5], (l,r)=> l+r, 0);
    
    let aggregated = tree.aggregate({from:1, to:2});
    expect(aggregated).toBe(8);
    
    tree.update({index:1, newValue:6});
    let newSum = tree.aggregate({from:0, to:2});

    expect(newSum).toBe(12);
  });

  test('Test #x', () => {
    const t = () => {
      throw new Error("Error")
    };
    expect(t).toThrow("Error");
  });
  
  
});



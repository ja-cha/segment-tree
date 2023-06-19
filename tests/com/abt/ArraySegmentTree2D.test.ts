 import {ArraySegmentTree2D} from '../../../src/com/abt/ArraySegmentTree2D'
 

 test('ArraySegmentTree2D #0', () => {

  let matrix = 
  [
    [3, 2],  
    [3, 4],  
  ];
   
  let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

   expect(tree).toBe(tree);

 

});




describe('Array 2D Segment Tree Tests', () => {
    
  test('ArraySegmentTree2D #1', () => {

    const buffer = (l:number, data:number[][]): number[][]=>{
      let buffer = Array.from(Array(l * 4), () => Array(l * 4).fill(0));
      data.map((e,i,_) => buffer[i].splice(0,e.length, ...e));
      return buffer;
    }

    let matrix = 
    [
      [1, 2, 3, 4], 
      [5, 6, 7, 8], 
      [1, 7, 5, 9], 
      [3, 0, 6, 2]  
    ];
    let expectedDataTree = 
    [
      [69, 25, 44, 10, 15, 21, 23],
      [36, 14, 22, 6, 8, 10, 12],
      [33, 11, 22, 4, 7, 11, 11],
      [10, 3, 7, 1, 2, 3, 4] ,
      [26, 11, 15, 5, 6, 7, 8],
      [22, 8, 14, 1, 7, 5, 9] ,
      [11, 3, 8, 3, 0, 6, 2]
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(tree.treeData)
    .toMatchObject(
      buffer(matrix.length, expectedDataTree)
    );

    expect(
      tree.aggregate({x: 1, y: 1}, {x: 2, y: 2 })
    ).toEqual(
      25
    );

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 3, y: 3 })
    ).toEqual(
      69
    );
    
    tree.update({x:3, y:3, newValue:1 });

    let expectedUpdateDataTree = [
      [68, 25, 43, 10, 15, 21, 22],
      [36, 14, 22, 6, 8, 10, 12],
      [32, 11, 21, 4, 7, 11, 10],
      [10, 3, 7, 1, 2, 3, 4] ,
      [26, 11, 15, 5, 6, 7, 8],
      [22, 8, 14, 1, 7, 5, 9] ,
      [10, 3, 7, 3, 0, 6, 1]
    ];
    expect(
      tree.treeData
    )
    .toMatchObject(
      buffer(matrix.length, expectedUpdateDataTree)
    );
   
    expect(
      tree.aggregate({x: 2, y: 2}, {x: 3, y: 3 })
    ).toEqual(
      21
    );

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 2, y: 2 })
    ).toEqual(
      37
    );

  
  });

  test('ArraySegmentTree2D #2', () => {
    let matrix = 
    [
      [1, 2, 3, 0], 
      [5, 6, 7, 1], 
      [3, 0, 6, 0] 
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(
      tree.aggregate({x: 1, y: 1}, {x: 2, y: 2 })
    ).toEqual(
      19
    );

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 2, y: 2 })
    ).toEqual(
      33
    );
    
    tree.update({x:2, y:2, newValue:1 });
   
    expect(
      tree.aggregate({x: 2, y: 2}, {x: 2, y: 2 })
    ).toEqual(
      1
    );

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 3, y: 2 })
    ).toEqual(
      29
    );

  
  });
  
  test('ArraySegmentTree2D #3', () => {
    let matrix = 
    [
      [1], 
      [5], 
      [3]  
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 0, y: 2 })
    ).toEqual(
      9
    );

  });

  test('ArraySegmentTree2D #4', () => {
    let matrix = 
    [
      [1, 2, 2], 
      [4, 5, 6],
      [7, 8, 9]
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 0, y:  2})
    ).toEqual(
      12
    );

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 2, y: 0 })
    ).toEqual(
      5
    );

  });

  test('ArraySegmentTree2D #5', () => {
    let matrix = 
    [
      [1,2], 
      [3,4], 
      [5,6],
      [7,8]  
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(
      tree.aggregate({x: 0, y: 0}, {x: 1, y: 3 })
    ).toEqual(
      36
    );

    expect(
      tree.aggregate({x: 1, y: 1}, {x: 1, y: 3 })
    ).toEqual(
      18
    );

  });

  test('ArraySegmentTree2D #6', () => {
    let matrix = 
    [
      [1, 5, 3]  
    ];

    let tree = ArraySegmentTree2D.build(matrix, (left:number, right:number)=>{return left + right;}, 0);

    expect(
      tree.aggregate({x: 1, y: 0}, {x: 2, y: 0 })
    ).toEqual(
      8
    );

  });

  test('Test #x', () => {
    const t = () => {
      throw new Error("Error")
    };
    expect(t).toThrow("Error");
  });
  
  
});



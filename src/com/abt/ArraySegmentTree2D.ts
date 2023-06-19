class ArraySegmentTree2D<A> {

  input: A[][]; //data matrix
  treeData: A[][];  // computed values of the range tree nodes
  aggregationBehavior: (l: A, r: A) => A
  nillValue: A;

  private constructor(input: A[][], treeData: A[][], aggregationBehavior: (l: A, r: A) => A, nillValue: A) {
    this.input = input;
    this.treeData = treeData;
    this.aggregationBehavior = aggregationBehavior;
    this.nillValue = nillValue;
  }

  /**
   *  pads array slots of subarrays with nill values or adds entire nil valued sub arrays.
   *  The goal is to have a perfect square of data for further processing.
   * 
   *  [[1,2],[3]] => [[1,2],[3,0]]
   *  
   *  [[1,2,3],[4,5,6]] => [[1,2,3],[4,5,6],[0,0,0]] 
   */
  static pad = <A>(data: A[][], nillValue: A): A[][] => {
    let largest = data.length;
    data.forEach((e, i, a) => {
      if (e.length > largest) {
        largest = e.length;
      }
    });
    let balanced = Array.from(Array(largest), () => Array(largest).fill(nillValue));
    data.map((e, i, _) =>
      balanced[i].splice(0, e.length, ...e));
    return balanced;
  }

  static build = <A>(unbalancedMatrix: A[][], aggregationBehavior: (l: A, r: A) => A, nillValue: A) => {

    let matrix_ = ArraySegmentTree2D.pad(unbalancedMatrix, nillValue);

    let treeData_: A[][] = Array.from(Array(matrix_.length * 4), () => Array(matrix_.length * 4).fill(nillValue));

    const vertexLeftChild = (v: number): number => v * 2 + 1;
    const vertexRightChild = (v: number): number => v * 2 + 1 + 1;

    const build_y = (vx: number, lx: number, rx: number, vy: number, ly: number, ry: number) => {
      if (ly == ry) {
        if (lx == rx)
          treeData_[vx][vy] = matrix_[lx][ly];
        else
          treeData_[vx][vy] = aggregationBehavior(treeData_[vertexLeftChild(vx)][vy], treeData_[vertexRightChild(vx)][vy]);
      } else {
        var my = Math.floor((ly + ry) / 2);

        build_y(vx, lx, rx, vertexLeftChild(vy), ly, my);
        build_y(vx, lx, rx, vertexRightChild(vy), my + 1, ry);
        treeData_[vx][vy] = aggregationBehavior(treeData_[vx][vertexLeftChild(vy)], treeData_[vx][vertexRightChild(vy)]);
      }
    }

    const build_x = (vx: number, lx: number, rx: number) => {
      if (lx != rx) {
        var mx = Math.floor((lx + rx) / 2);

       build_x(vertexLeftChild(vx), lx, mx);
       build_x(vertexRightChild(vx), mx + 1, rx);
      }
      build_y(vx, lx, rx, 0, 0, matrix_.length - 1);
    }

    if (matrix_ && matrix_.length) {
      build_x(0, 0, matrix_.length - 1);
    }

    var tree = new ArraySegmentTree2D(matrix_, treeData_, aggregationBehavior, nillValue);

    return tree;
  }

  aggregate = (p1: { x: number, y: number }, p2: { x: number, y: number },
    segment: { vx: number, tlx: number, trx: number } = { vx: 0, tlx: 0, trx: this.input.length - 1 }
  ): A => {

    const vertexLeftChild = (v: number): number => v * 2 + 1;
    const vertexRightChild = (v: number): number => v * 2 + 1 + 1;

    const aggregateY = (vx: number, vy: number, tly: number, try_: number, ly: number, ry: number): A => {
      if (ly > ry)
        return this.nillValue;
      if (ly == tly && try_ == ry)
        return this.treeData[vx][vy];
      let tmy = Math.floor((tly + try_) / 2);
      return this.aggregationBehavior(
        aggregateY(vx, vertexLeftChild(vy), tly, tmy, ly, Math.min(ry, tmy)),
        aggregateY(vx, vertexRightChild(vy), tmy + 1, try_, Math.max(ly, tmy + 1), ry)
      );
    }

    const aggregateX = (vx: number, tlx: number, trx: number, lx: number, rx: number, ly: number, ry: number): A => {
      if (lx > rx)
        return this.nillValue;
      if (lx == tlx && trx == rx)
        return aggregateY(vx, 0, 0, this.input.length - 1, ly, ry);
      let tmx = Math.floor((tlx + trx) / 2);
      return this.aggregationBehavior(
        aggregateX(vertexLeftChild(vx), tlx, tmx, lx, Math.min(rx, tmx), ly, ry),
        aggregateX(vertexRightChild(vx), tmx + 1, trx, Math.max(lx, tmx + 1), rx, ly, ry)
      );
    }

    //let max = Math.max(p1.x + p2.x, p1.y + p2.y);
    //let matrix_ =  ArraySegmentTree2D.pad(this., nillValue);

    return aggregateX(segment.vx, segment.tlx, segment.trx, p1.y, p2.y, p1.x, p2.x);
  }

  update = (query: { x: number, y: number, newValue: A },
    segment: { vx: number, tlx: number, trx: number } = { vx: 0, tlx: 0, trx: this.input.length - 1 }
  ): void => {

    const vertexLeftChild = (v: number): number => v * 2 + 1;
    const vertexRightChild = (v: number): number => v * 2 + 1 + 1;

    const updateY = (vx: number, lx: number, rx: number, vy: number, ly: number, ry: number, x: number, y: number, new_val: A): void => {
      if (ly == ry) {
        if (lx == rx)
          this.treeData[vx][vy] = new_val;
        else
          this.treeData[vx][vy] = this.aggregationBehavior(this.treeData[vertexLeftChild(vx)][vy], this.treeData[vertexRightChild(vx)][vy]);
      } else {
        let my = Math.floor((ly + ry) / 2);
        if (y <= my)
          updateY(vx, lx, rx, vertexLeftChild(vy), ly, my, x, y, new_val);
        else
          updateY(vx, lx, rx, vertexRightChild(vy), my + 1, ry, x, y, new_val);
        this.treeData[vx][vy] = this.aggregationBehavior(this.treeData[vx][vertexLeftChild(vy)], this.treeData[vx][vertexRightChild(vy)]);
      }
    }

    const updateX = (vx: number, lx: number, rx: number, x: number, y: number, new_val: A): void => {
      if (lx != rx) {
        let mx = Math.floor((lx + rx) / 2);
        if (x <= mx)
          updateX(vertexLeftChild(vx), lx, mx, x, y, new_val);
        else
          updateX(vertexRightChild(vx), mx + 1, rx, x, y, new_val);
      }
      updateY(vx, lx, rx, 0, 0, this.input.length - 1, x, y, new_val);
    }

    updateX(segment.vx, segment.tlx, segment.trx, query.x, query.y, query.newValue);

  }

}

export { ArraySegmentTree2D }
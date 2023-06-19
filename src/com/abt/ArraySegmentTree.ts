
 /**
  * A Segment tree that backs its tree input into an array
  */
 class ArraySegmentTree<A> {
    input: A[]; //input data
    treeData: A[];// computed values of the range tree nodes
    aggregationBehavior: (l: A, r: A) => A
    nillValue: A;

    private constructor(input: A[], treeData: A[], aggregationBehavior: (l: A, r: A) => A, nillValue: A) {
        this.input = input;
        this.treeData = treeData;
        this.aggregationBehavior = aggregationBehavior;
        this.nillValue = nillValue;
    }

    static build = <A>(input: A[], aggregationBehavior: (l: A, r: A) => A, nillValue: A) => {

        let treeData: A[] = [];

        const segmentize = (input: A[], index: number, segment: { from: number, to: number }): void => {
            if (segment.from === segment.to) {
                treeData[index] = input[segment.from];
            }
            else {
                var mid = Math.floor((segment.from + segment.to) / 2 ) ;
                var leftChildIndex =  index*2+1;
                var rightChildIndex =  index*2+2;
                segmentize(input, leftChildIndex, { from: segment.from, to: mid });
                segmentize(input, rightChildIndex, { from: mid + 1, to: segment.to });
                treeData[index] = aggregationBehavior(treeData[leftChildIndex], treeData[rightChildIndex]);
            }
        };

        if (input && input.length) {
            segmentize(input, 0, { from: 0, to: input.length-1 });         
        }
        
        return new ArraySegmentTree(input, treeData, aggregationBehavior, nillValue);

    }

    aggregate = ( query: { from: number, to: number },
                segment: { index: number, from: number, to: number } = {index:0, from:0, to:this.input.length-1}
             ): A => {
       
        if ( query.from > query.to) {
            return this.nillValue;
        }
        if (query.from == segment.from &&
            query.to == segment.to) {
            return this.treeData[segment.index];
        }
       
        var mid = Math.floor((segment.from + segment.to) / 2 ) ;
        var leftChildIndex =  segment.index*2+1;
        var rightChildIndex = segment.index*2+2;
       
        let leftChild = this.aggregate(                        
            { from: query.from, to: Math.min(query.to, mid)},
            { index: leftChildIndex, from: segment.from, to: mid }
        );

        let rightChild = this.aggregate(                        
            { from: Math.max(query.from, mid + 1), to: query.to },
            { index: rightChildIndex, from: mid + 1, to: segment.to }
         );

        return this.aggregationBehavior(leftChild, rightChild);
    };

    update = (query: {position: number, newValue: A }, 
            segment: {index: number, from: number, to: number} = {index:0, from:0, to:this.input.length-1}
            ): void => {
        if (segment.from == segment.to) {
            this.treeData[segment.index] = query.newValue;
        } else {
            var mid = Math.floor((segment.from + segment.to) / 2 ) ;
            var leftChildIndex =  segment.index*2+1;
            var rightChildIndex =  segment.index*2+2;
       
            if (query.position <= mid){
                this.update({position: query.position, newValue: query.newValue}, {index:leftChildIndex, from:segment.from, to:mid});
            }
            else{
                this.update({position: query.position, newValue: query.newValue}, {index:rightChildIndex, from:mid+1, to:segment.to});
            }
            this.treeData[segment.index] = this.aggregationBehavior(this.treeData[leftChildIndex], this.treeData[rightChildIndex]);
        }
    }

}

export {ArraySegmentTree}

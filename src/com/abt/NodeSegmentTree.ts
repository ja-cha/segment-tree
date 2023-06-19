  class Node<A>{
    index:number;
    from:number;
    to:number;
    left:Node<A>|Nill<A> ;
    right: Node<A>|Nill<A>;
    value: A;
    constructor(index:number, from:number, to: number, l: Node<A>|Nill<A>, r: Node<A>|Nill<A>,  value: A) {
        this.index = index;
        this.from = from;
        this.to = to;
        this.left = l;
        this.right = r;
        this. value = value;
    }
}
class Nill<A>{
    index:number=-1;
    from:number=-1;
    to:number=-1;
    left: Nill<A> ;
    right: Nill<A>;
    value: A;
    constructor(value: A) {
        this. value = value;
        this.left = this;
        this.right = this;
    }
}

 /**
  *  Very similar to {@link ArraySegmentTree} 
  *  The main difference is that {@link NodeSegmentTree.treeData} is Node<A>, not Array<A>
  * 
  */
 class NodeSegmentTree<A> {
    input: A[]; //input input
    treeData: Node<A>;  // computed values of the range tree nodes
    aggregationBehavior: (l: A, r: A) => A
    nillValue: A;

    private constructor(input: A[], treeData: Node<A>, aggregationBehavior: (l: A, r: A) => A, nillValue: A) {
        this.input = input;          
        this.treeData = treeData;
        this.aggregationBehavior = aggregationBehavior;
        this.nillValue = nillValue;
    }

    static build = <A>(input: A[], aggregationBehavior: (l: A, r: A) => A, nillValue: A) => {

        const segmentize = (input: A[], index: number, segment: { from: number, to: number }): Node<A> => {
            if (segment.from === segment.to) {
                return new Node(index, segment.from, segment.to, new Nill(nillValue), new Nill(nillValue), input[segment.from])
            }
            else {
                var mid = Math.floor((segment.from + segment.to) / 2 ) ;
                var leftChildIndex =  index*2+1;
                var rightChildIndex =  index*2+2;
                let leftChild = segmentize(input, leftChildIndex, { from: segment.from, to: mid });
                let rightChild = segmentize(input, rightChildIndex, { from: mid + 1, to: segment.to });
                return new Node(index, segment.from, segment.to, leftChild, rightChild,  aggregationBehavior(leftChild.value, rightChild.value));
            }
        };

        if (input && input.length) {
            let treeData =  segmentize(input, 0, { from: 0, to: input.length-1 });        
            return  new NodeSegmentTree(input, treeData, aggregationBehavior, nillValue); 
        }else{
            let nillTreeData =  new Nill(nillValue)
            return new NodeSegmentTree(input, nillTreeData, aggregationBehavior, nillValue);
        }  

    }

    /**
     * apply the aggregation function on a given range
     * @param query 
     * @param version 
     * @returns 
     */
    aggregate =( query: { from: number, to: number }): A => {
        return this.innerAggregate(this.treeData, query);
    }

    private innerAggregate = ( node:Node<A>|Nill<A>, query: { from: number, to: number }): A => {
       
        if ( query.from > query.to) {
            throw Error(`invalid range: ${query}`)
        }
        
        if ((node instanceof Nill ) || 
            query.from == node.from &&
            query.to == node.to) {
            return node.value;
        }
       
        var mid = Math.floor(((node.from) + (node.to)) / 2 ) ;

        if(query.to<(node.left.from) ||
            query.from>(node.right.to)){
            throw Error(`invalid range: ${query}`)
        }
        
        let leftChild = this.nillValue;
        if(node.left && (
            (query.from>=(node.left.from))&&
            (query.from <= (node.left.to)))
            ){
           leftChild = this.innerAggregate(node.left, { from: query.from, to: Math.min(query.to, mid)});
        }

        let rightChild = this.nillValue;
        if(node.right && (
            (query.to>=(node.right.from))&&
              (query.to <= (node.right.to)))
        ){
            rightChild =  this.innerAggregate( node.right, { from: Math.max(query.from, mid + 1), to: query.to });
        }

        return this.aggregationBehavior(leftChild, rightChild);
    };

    /*  
     * update, recalculate
     **/
    update =(query: {index: number, newValue: A }): void => {
         this.innerUpdate(this.treeData, query);
    }

    private innerUpdate = (node:Node<A>|Nill<A>, query: {index: number, newValue: A },
               segment: {index: number, from: number, to: number} = {index:0, from:0, to:this.input.length-1}
        ): void => {
        if (segment.from == segment.to) {
            node.value = query.newValue;
        } else {
            var mid = Math.floor((segment.from + segment.to) / 2 ) ;
            var leftChildIndex =  segment.index*2+1;
            var rightChildIndex =  segment.index*2+2;
       
         if (node.left && query.index <= mid){

                this.innerUpdate(node.left, {index: query.index, newValue: query.newValue}, {index:leftChildIndex, from:segment.from, to:mid});
            }
            else if (node.right){
                this.innerUpdate(node.right, {index: query.index, newValue: query.newValue}, {index:rightChildIndex, from:mid+1, to:segment.to});
            }
            node.value = this.aggregationBehavior(node.left?.value??this.nillValue, node.right?.value??this.nillValue);
        }
    }

}

export {NodeSegmentTree}

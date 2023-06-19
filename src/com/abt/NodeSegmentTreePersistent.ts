 class Node<A> {
    index:number;
    from:number;
    to:number;
    left: Node<A>|Nill<A>;
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

class Nill<A> {
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
class NodeSegmentTreePersistent<A>{

    input: A[]; //input data
    treeData: Node<A>;  // computed values of the range tree nodes
    maxHistory: number;
    version: Node<A>[];// deltas of updates
    aggregationBehavior: (l: A, r: A) => A 
    nillValue: A;

    constructor(input: A[], treeData: Node<A>, maxHistory: number, aggregationBehavior: (l: A, r: A) => A, nillValue: A) {
        this.input = input;
        this.treeData = treeData;
        this.maxHistory = maxHistory;        
        this.aggregationBehavior = aggregationBehavior;
        this.nillValue = nillValue;
        this.version = [];        
    }

    static build = <A>(input: A[], maxHistory: number, aggregationBehavior: (l: A, r: A) => A, nillValue: A) => {

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
            let treeData = segmentize(input, 0, { from: 0, to: input.length-1 });        
            let tree  =    new NodeSegmentTreePersistent(input, treeData, maxHistory, aggregationBehavior, nillValue); 
            tree.version[0]= treeData;
            return tree;
        }else{
            let treeData =  new Nill(nillValue)
            let tree  =  new NodeSegmentTreePersistent(input, treeData, maxHistory, aggregationBehavior, nillValue);
            tree.version[0]= treeData;
            return tree;
        }  
        
    }

    /**
     * apply the aggregation function on a given range and version, defaults to whatever was build initially
     * @param query 
     * @param version 
     * @returns 
     */
    aggregate =(query: { from: number, to: number }, version:Node<A>=this.treeData): A => {
        return this.innerAggregate(version, query );
    }

    private innerAggregate = (node: Node<A> | Nill<A>,
        query: { from: number, to: number }): A => {

        var mid = Math.floor(((node.from) + (node.to)) / 2);

        if ((node instanceof Nill) ||
            query.from == node.from &&
            query.to == node.to) {
            return node.value;
        }

        if (query.from > query.to) {
            throw Error(`invalid range: ${query}`)
        }

        if ((node instanceof Nill) ||
            query.from == node.from &&
            query.to == node.to) {
            return node.value;
        }

        var mid = Math.floor(((node.from) + (node.to)) / 2);

        if (query.to < (node.left.from) ||
            query.from > (node.right.to)) {
            throw Error(`invalid range: ${query}`)
        }
        let leftChild = this.nillValue;
        if (node.left && (
            (query.from >= (node.left.from)) &&
            (query.from <= (node.left.to)))
        ) {
            leftChild = this.innerAggregate(node.left, { from: query.from, to: Math.min(query.to, mid) });
        }

        let rightChild = this.nillValue;
        if (node.right && (
            (query.to >= (node.right.from)) &&
            (query.to <= (node.right.to)))
        ) {
            rightChild = this.innerAggregate(node.right, { from: Math.max(query.from, mid + 1), to: query.to });
        }

        return this.aggregationBehavior(leftChild, rightChild);

    }

    /* 
    * update, recalculate and create new Version
    **/
    update = (query: {index: number, newValue: A }): void => {
        
        let pevious  = this.version.pop()??this.treeData ;
        let current = new Nill(this.nillValue);
        
        this.innerUpdate(pevious, current, 0, this.input.length -1, query.index, query.newValue);
        
        this.version.push(pevious);
        this.version.push(current);
        
    }
    
    private innerUpdate = (prev: Node<A> |Nill<A>, cur: Node<A>, low: number, high: number, idx: number, value: A) => {
         if (idx > high || idx < low || low > high)
            return;

        if (low == high) {
            // update new version
            cur.value = value;
            return;
        }

        var mid = Math.floor((low + high) / 2);

        if (idx <= mid) {

            // link to right child of previous version
            cur.right = prev.right;

            // create new node in current version
            cur.left = new Nill(this.nillValue);
            this.innerUpdate(prev.left, cur.left, low, mid, idx, value);
        }
        else {

            // link to left child of previous version
            cur.left = prev.left;

            // create new node for current version
            cur.right = new Nill(this.nillValue);
            this.innerUpdate(prev.right, cur.right, mid + 1, high, idx, value);
        }

        let l = cur.left ;
        let r = cur.right ;
        cur.value = this.aggregationBehavior(l.value, r.value);
    }
   
}

export {NodeSegmentTreePersistent, Node, Nill}

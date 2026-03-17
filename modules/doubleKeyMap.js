export default class DoubleKeyMap {
  constructor() {
    this.k1ToK2 = new Map();
    this.k2ToK1 = new Map()
    this.k2ToValue = new Map();
  }

  setEntry(k1, k2, value) {
    if(this.k1ToK2.has(k1)) {
    	this.k1ToK2.get(k1).push(k2);
    }else {
    	this.k1ToK2.set(k1, [k2]);
    }
    
    this.k2ToK1.set(k2, k1)
    this.k2ToValue.set(k2, value)
  }

  getFromK1(k1) {
    let result = [];
    if(this.k1ToK2.has(k1)) {
      for (let k2 of this.k1ToK2.get(k1)) {
        result.push(this.k2ToValue.get(k2));
      }
    }
    return result;
  }

  getFromK2(k2) {
    let result = undefined;
    if(this.k2ToValue.has(k2)) {
	result = this.k2ToValue.get(k2)
    }
    return result;
  }
}

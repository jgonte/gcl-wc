export default function areEqual(o1: any, o2: any): boolean {

    const type1 = typeof o1;

    const type2 = typeof o2;

    if (type1 !== type2) {

        return false;
    }

    if (type1 == 'object') {

        if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length) {

            return false;
        }
    
        for (var prop in o1) {
    
            if (o1.hasOwnProperty(prop)) {
    
                if (o2.hasOwnProperty(prop)) {
    
                    if (typeof o1[prop] === 'object') {
    
                        if (!areEqual(o1[prop], o2[prop])) {
    
                            return false;
                        }
                    }
                    else {
    
                        if (o1[prop] !== o2[prop]) {
    
                            return false;
                        }
                    }
                }
                else {
    
                    return false;
                }
            }
        }
    
        return true;

    }
    else {

        return o1 === o2;
    }
    
}
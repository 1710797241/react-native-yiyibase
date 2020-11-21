
/**
 * 是否空对象或者空字符串
 * @param {*} obj 
 */
export const isNullObj = (obj) => {
    return obj === undefined || obj === null || obj === '';
}

/**
 * 数组内对象是否是空或者空字符串
 * @param  {...any} args 
 */
export const isNullObjs = (...args) => {
    if(args === undefined || args === null || args.length === 0) return true;
    for (let index = 0; index < args.length; index++) {
        const e = args[index];
        if(isNullObj(e)) return true;
    }
    return false;
}
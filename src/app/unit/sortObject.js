/**
 * 排序数组或者对象
 * by Jinko
 * date --
 * @param object 数组或对象
 * @param subkey 需要排序的子键, 该参数可以是字符串, 也可以是一个数组
 * @param desc 排序方式, true:降序, false|undefined:升序
 * @returns {*} 返回排序后的数组或者对象
 *
 * 注意: 对于对象的排序, 如果使用console.log打印对象的显示可能和排序结果不一致,
 *  其键会被浏览器以字母顺序排序显示,但在for循环中则为正确的排序顺序
 */
function sortObject(arr, subkey, desc) {
    let _arr = JSON.parse(JSON.stringify(arr));
    let vali,
        valj,
        tmp;
    for (let i = 0; i < _arr.length + 1; i++) {
        for (let j = 0; j < _arr.length - i - 1; j++) {
            vali = _arr[j];
            valj = _arr[j + 1];
            for (let k = 0; k < subkey.length; k++) {
                vali = vali[subkey[k]];
                valj = valj[subkey[k]];
                if (k === (subkey.length - 1) && Object.prototype.toString.call(vali) === '[object Array]') {
                    vali = vali.length;
                    valj = valj.length;
                }
            }

            if (desc) {
                if (valj < vali) {
                    tmp = _arr[j + 1];
                    _arr[j + 1] = _arr[j];
                    _arr[j] = tmp;
                }
            } else if (vali > valj && valj === 0) {

                tmp = _arr[j];
                _arr[j] = _arr[j + 1];
                _arr[j + 1] = tmp;
            }
        }
    }

    return _arr;

}

export default sortObject

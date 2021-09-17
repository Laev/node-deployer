/**
 * 判断数据类型
 *
 * @export
 * @param {any} val
 * @return {string}
 */
export function _typeof(val: any): string {
  var type = Object.prototype.toString.call(val);
  return (type.match(/\[object (.*?)\]/)?.[1] || '').toLowerCase();
}

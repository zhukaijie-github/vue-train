/**
 * @function
 * @description Promise, 限制请求并发数
 * @argument {Function} fetch - 一个返回promise的请求函数
 * @argument {Array} arr - 所有的请求参数列表 [{id: xxx}]
 * @argument {Number} max - 最大并发请求数
 * @argument {Function} callback - 所有请求成功后的回调函数
 * @returns {Promise}
 */
export const limitRequest = function(fetch, arr, max, callback) {
  let fetchArr = [], // 储存max并发的promise数组
    i = 0; // 记录当前执行的请求位置（arr 下标）

  function toFetch() {
    if (i === arr.length) {
      // arr请求列表所有的都处理完了， 返回一个resolve, 成功状态的promise
      return Promise.resolve();
    }
    let one = fetch(arr[i++]); // 取出第i个请求参数并执行请求，并将返回的promise赋值给one, 变量i自增
    // 将执行请求返回的promise实例添加到并发数组中
    fetchArr.push(one);
    one.then(() => {
      // 成功回调后从储存在promise数组中删除
      fetchArr.splice(fetchArr.indexOf(one), 1);
    });

    // 创建一个只有成功状态的promise
    let p = Promise.resolve();
    if (fetchArr.length >= max) {
      /*
        当并行数量达到最大后， 用race比较 第一个完成的， 然后再调用一下函数自身。
        Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
        当第一个请求成功后会直接走p.then(), 继续执行toFetch(), 这样就递归执行arr请求列表
      */
      p = Promise.race(fetchArr);
    }

    return p.then(() => toFetch());
  }

  toFetch()
    .then(() => {
      // arr请求列表所有的都处理完了，这个时候fetchArr剩下最后一个max的promise实例，等到这个成功返回就执行callback
      return Promise.all(fetchArr);
    })
    .then(() => {
      callback && callback();
    });
};

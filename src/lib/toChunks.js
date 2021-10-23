/* eslint-disable no-param-reassign */
export default (arr, chunkSize) =>
  arr.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);

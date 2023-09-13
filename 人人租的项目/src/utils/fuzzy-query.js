/**
 * 城市名，城市首字母，模糊查询
 */

import city from './city.js';
const cityList = [],
  adCodeList = [],
  spellList = [];

city.cities.forEach((item, index) => {
  cityList.push({
    value: item.city,
    index: index,
  });
  adCodeList.push({
    value: item.adCode,
    index: index,
  });
  spellList.push({
    value: item.spell,
    index: index,
  });
});

function fuzzyQuery(list, keyWord, type) {
  const arr = [];

  for (var i = 0; i < list.length; i++) {
    if (type === 'adCode') {
      const matchRes = list[i].value.match(keyWord);
      if (matchRes !== null && matchRes.index === 0) {
        arr.push(list[i]);
      }
    } else {
      if (list[i].value.split(keyWord).length > 1) {
        arr.push(list[i]);
      }
    }
  }
  return arr;
}

console.time('test');
console.log(fuzzyQuery(cityList, '广'));
console.log(fuzzyQuery(cityList, '州'));
console.log(fuzzyQuery(adCodeList, 'gz', 'adCode'));
console.log(fuzzyQuery(adCodeList, 'z', 'adCode'));
console.log(fuzzyQuery(spellList, 'guang'));
console.log(fuzzyQuery(spellList, 'zho'));
console.timeEnd('test');

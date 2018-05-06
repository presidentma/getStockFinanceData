let getStockfinanceData = require('./getStockData')
// 正常上市公司股票代码 246个
let stock_array_normal = []
// 深证所上市股票
/* [2, 6, 8, 9, 11, 12, 16, 18, 21, 22, 25, 27, 28, 29, 30, 31, 34, 35, 36, 39, 40, 42, 43, 46, 49, 50, 58, 59, 59, 60, 61, 62, 63, 65, 66, 68, 69, 70, 78, 88, 89, 90,
  96, 99, 100, 150, 156, 157, 158, 166, 333, 338, 400, 401, 402, 407, 413, 415, 417, 418, 423, 425, 426, 429, 488, 498, 501, 503,
  506, 507, 513, 514, 516, 517, 525, 528, 533, 536, 538, 539, 540, 541, 543, 547, 550, 552, 553, 555, 558, 559, 560, 561, 563, 564, 568, 571,
  572, 576, 581, 582, 584, 587, 591, 592, 596, 598, 600, 601, 603, 605, 607, 612, 615, 616, 620, 623, 625, 627, 630, 631, 636, 650, 651,
  652, 656, 657, 661, 662, 665, 666, 667, 669, 671, 673, 676, 680, 681, 683, 685, 686, 687, 688, 690, 703, 709, 710, 712, 717, 718, 719, 723, 725, 726,
  727, 728, 729, 732, 733, 735, 738, 739, 750, 751, 756, 758, 761, 762, 766, 767, 768, 778, 786, 792, 793, 795, 796, 797, 799, 800, 801, 802, 806, 807,
  810, 811, 815, 818, 821, 822, 823, 825, 826, 828, 829, 830, 836, 838, 839, 848, 851, 856, 858, 860, 861, 863, 869, 875, 876, 877, 878, 881, 882, 883,
  887, 888, 889, 895, 903, 905, 908, 910, 915, 917, 921, 925, 926, 928, 930, 933, 936, 938, 939, 951, 957, 958, 959,
  961, 963, 965, 968, 969, 970]
   */
let stock_nomarl_shenzhen = []
// 上证所上市股票
let stock_nomarl_shanghai = []
// ST上市公司股票代码60个 
let stock_array_st = []
// 深证所上市ST股票
/* 
[403, 422, 511, 526, 585, 595, 629, 655, 693, 707, 720, 737, 755, 780, 803, 809, 816, 893, 912, 922, 950, 953, 972, 982, 995, 2018, 2070,
  2122, 2188, 2194, 2207, 2260, 2263, 2306, 2312, 2427, 2473, 2504, 2552, 2570, 2604]
*/
let stock_st_shenzhen = []
// 上证所上市ST股票
let stock_st_shanghai = [600074, 600091, 600145, 600145, 600145, 600193, 600198, 600202, 600209, 600228, 600234, 600238, 600247, 600265, 600275, 600289, 600301, 600321, 600397, 600401, 600397]
stock_st_shenzhen = stock_st_shenzhen.map((val) => {
  return val + '2'
})
stock_st_shanghai = stock_st_shanghai.map((val) => {
  return val + '1'
})
stock_nomarl_shenzhen = stock_nomarl_shenzhen.map((val) => {
  return val + '2'
})
stock_nomarl_shanghai = stock_nomarl_shanghai.map((val) => {
  return val + '1'
})
stock_array_normal = stock_array_normal.concat(stock_nomarl_shenzhen, stock_nomarl_shanghai)
stock_array_st = stock_array_st.concat(stock_st_shenzhen, stock_st_shanghai)


function beginEntrance() {
  let needGetStock = [].concat(stock_array_normal, stock_array_st)
  needGetStock = Array.from(new Set(needGetStock))
  let StockTimer = setInterval(() => {
    let nextGetStock = needGetStock.shift()
    if (nextGetStock) {
      nextGetStock = ('0'.repeat(7) + nextGetStock).trim().substr(-7)
      let position = nextGetStock.substr(-1)
      nextGetStock = nextGetStock.substr(0, nextGetStock.length - 1)
      if (needGetStock.length > stock_array_st.length) {
        getStockfinanceData.begin(nextGetStock, 1, position)
      } else {
        getStockfinanceData.begin(nextGetStock, 2, position)
      }
    } else {
      console.log('》》》》》数据获取完毕《《《《《《')
      clearInterval(StockTimer)
    }
  }, 6000)
}
// 入口函数
beginEntrance()


if (put_current_index == 0) {
  put_sql = `INSERT INTO z_score_year (stock_type,${fields_list[put_current_index]}) VALUES (?,?);`
  put_param = [resoults[i].stock_type, z_score]
} else {
  connection.query("SELECT * FROM z_score_year ORDER BY id DESC LIMIT 1", function (error, res, fields) {
    if (error) throw error;
    console.log(res)
    put_sql = `UPDATE z_score_year SET ${fields_list[put_current_index]}=? WHERE id = ?;`
    put_param = [res.id, z_score]
  })
}
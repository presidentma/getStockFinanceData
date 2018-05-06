/**
 *@@ Author MaLiang
 */
const fs = require('fs')
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1053654456',
  database: 'test',
  charset: 'utf8'
})

connection.connect()
/* 
tbzzcsyl 净资产收益率%
jyhdcsdxjllje 经营活动产生的现金流量净额(元)
capital_stock 总股本单位个
gdzc 固定资产总额元
yysr 营业收入
jlr 税后净利润元
fpzfdxj 分配股利、利润或偿付利息支付亿
fhje 如果分红分红金额元
fzhj 负债合计元
gdqyhj 股东权益合计元
stock_price 当期股价
zeta_score z分值
*/

connection.query('SELECT * FROM `finance_data_calculate`;', function (error, resoults, fields) {
  let put_data = []
  for (let i = 0; i < resoults.length; i++) {
    let id = resoults[i].id
    let stock_name = resoults[i].stock_name
    let date = resoults[i].date.toLocaleDateString()
    let fhje = resoults[i].fhje // 分红金额
    let tbzzcsyl = resoults[i].tbzzcsyl // 净资产利润率
    let jyhdcsdxjllje = resoults[i].jyhdcsdxjllje // 经营活动产生的现金流
    let capital_stock = resoults[i].capital_stock // 总股本个数
    let gdzc = resoults[i].gdzc // 固定资产
    let jlr = resoults[i].jlr // 净利润
    let fzhj = resoults[i].fzhj // 负债合计
    let gdqyhj = resoults[i].gdqyhj // 股东权益
    let yysr_current = resoults[i].yysr // 当期营业收入
    let stock_price = resoults[i].stock_price // 股价
    if (tbzzcsyl && jyhdcsdxjllje && capital_stock && gdzc && jlr && fzhj && gdqyhj && yysr_current && resoults[i + 1].yysr && stock_price) {
      fhje = parseFloat(fhje) // 分红金额
      tbzzcsyl = parseFloat(tbzzcsyl) // 净资产利润率
      jyhdcsdxjllje = parseFloat(jyhdcsdxjllje) // 经营活动产生的现金流
      capital_stock = parseFloat(capital_stock) // 总股本个数
      gdzc = parseFloat(gdzc) // 固定资产
      jlr = parseFloat(jlr) // 净利润
      fzhj = parseFloat(fzhj) // 负债合计
      gdqyhj = parseFloat(gdqyhj) // 股东权益
      yysr_current = parseFloat(yysr_current) // 当期营业收入
      yysr_before = parseFloat(resoults[i + 1].yysr) // 上期营业收入
      stock_price = parseInt(stock_price) // 股价
      let z_score = -0.8751 + 6.3 * tbzzcsyl / 100 + 0.761 * jyhdcsdxjllje / capital_stock
        + 1.295 * Math.log(gdzc) / Math.LN10 + 0.412 * (yysr_current / yysr_before) + 0.015 * ((jlr - fhje) / jlr) + 0.105 * (fzhj / (capital_stock * stock_price))
        - 21.164 * (gdqyhj / capital_stock / stock_price)
        let current_index = 0
      if (z_score) {
        let fields_list = ['first_year','second_year','third_year','four_year','fifth_year','sixth_year','seventh_year','eighth_year','ninth_year','ten_year']
        let put_sql = `INSERT INTO z_score_year (stock_type,${fields_list[current_index]}) VALUES (?,?);`
        put_param = [resoults[i].stock_type, z_score]
        if (stock_name == resoults[i + 1].stock_name) {
          connection.query(put_sql, put_param, function (error, resoults, fields) {
            if (error) throw error;
            console.log(`>>> 插入${stock_name}第${current_index}年Z值成功${z_score}  <<<`)
          })
          current_index+=1
        } else {
          connection.query(put_sql, put_param, function (error, resoults, fields) {
            if (error) throw error;
            console.log(`>>> 插入${stock_name}第${current_index}年Z值成功${z_score}  <<<`)
          })
          current_index = 0
        }
        let sql = "UPDATE `finance_data_calculate` SET zeta_score=? WHERE id = ?;"
        let param = [z_score, id]
        connection.query(sql, param, function (error, resoults, fields) {
          if (error) throw error;
          console.log(`>>>  计算${stock_name}${date}时的Z值成功${z_score}  <<<`)
        })
      } else {
        console.log('本条Z值计算错误')
      }
    }
  }
  console.log(`计算完毕，共计算${resoults.length}条数据的Z值`)
})

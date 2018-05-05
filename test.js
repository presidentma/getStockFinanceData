const http = require('http')
const queryString = require('querystring')
const fs = require('fs')
const mysql = require('mysql')
const { deepParseJson } = require('deep-parse-json')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1053654456',
  database: 'test',
  charset: 'utf8'
})
let currentRequestStock = {name:'京东方A',code:'sz000725'}
connection.connect()
connection.query('SELECT COUNT(*) FROM `t_vpn_ip`;', function (error, results, fields) {
  if (error) throw error;
  //console.log('The solution is: ', results[0]);
})

let data = {
  zyzb: {
    code: currentRequestStock.code,
    type: 1
  },
  bbmx: {
    code: currentRequestStock.code,
    ctype: 0,
    type: 1
  },
  gbqk: {
    code: currentRequestStock.code
  },
  lrb: {
    code: currentRequestStock.code,
    ctype: 0,
    type: 1
  },
  fh: {
    code: currentRequestStock.code
  }
}

let contents = {}
let options_key = Object.keys(data)
options_key.map((val) => {
  let content = queryString.stringify(data[val])
  contents[val] = content
})
//console.log(contents)
let options = {
  zyzb: {
    hostname: 'emweb.securities.eastmoney.com',
    path: `/PC_HSF10/FinanceAnalysis/MainTargetAjax?${contents.zyzb}`,
    method: 'GET'
  },
  bbmx: {
    hostname: 'emweb.securities.eastmoney.com',
    path: `/PC_HSF10/FinanceAnalysis/ReportDetailAjax?${contents.bbmx}`,
    method: 'GET'
  },
  gbqk: {
    hostname: 'emweb.securities.eastmoney.com',
    path: `/PC_HSF10/CapitalStockStructure/CapitalStockStructureAjax?${contents.gbqk}`,
    method: 'GET'
  },
  lrb: {
    hostname: 'emweb.securities.eastmoney.com',
    path: `/PC_HSF10/FinanceAnalysis/PercentAjax?${contents.lrb}`,
    method: 'GET'
  },
  fh: {
    hostname: 'emweb.securities.eastmoney.com',
    path: `/PC_HSF10/BonusFinancing/BonusFinancingAjax?${contents.fh}`,
    method: 'GET'
  }
}
let financeData = []
function reqZyzb(option) {
  return new Promise(function (resolve, reject) {
    let req_zyzb = http.request(option, function (res) {
      let zyzb_data = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        zyzb_data += chunk
      })
      res.on('end', function () {
        let obj = JSON.parse(zyzb_data)
        let finance = obj.Result
        financeData = Array.from(finance)
        console.log('reqZyzb')
        resolve()
      })
    })
    req_zyzb.end()
  })
}
function reqBbmx(option) {
  return new Promise(function (resolve, reject) {
    let req_bbmx = http.request(option, function (res) {
      let bbmx_data = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        bbmx_data += chunk
      })
      res.on('end', function () {
        let obj = JSON.parse(bbmx_data)
        let zcfz = obj.Result.zcfz0
        let xjll = obj.Result.xjll0
        let lr = obj.Result.lr0
        dealBbmx(zcfz, 1)
        dealBbmx(xjll, 2)
        dealBbmx(lr, 3)
        console.log('reqBbmx')
        resolve()
      })
    })
    req_bbmx.end()
  })
}

function reqLrb(option) {
  return new Promise(function (resolve, reject) {
    let req_lrb = http.request(option, function (res) {
      let lrb_data = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        lrb_data += chunk
      })
      res.on('end', function () {
        let obj = JSON.parse(lrb_data)
        let jlr = obj.Result.lr0
        let xjll = obj.Result.xjll0
        dealLrb(jlr)
        console.log('reqLrb')
        resolve()
      })
    })
    req_lrb.end()
  })
}

function reqGbqk(option) {
  return new Promise(function (resolve, reject) {
    let req_gbqk = http.request(option, function (res) {
      let gbqk_data = ''
      let gbqk_arr = []
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        gbqk_data += chunk
      })
      res.on('end', function () {
        let obj = JSON.parse(gbqk_data)
        let gbqk = obj.Result.UnlistedShareChangeList
        for (let i = 0; i < gbqk.length; i++) {
          gbqk[i].changeList.map((item, index) => {
            item = item.replace(/,/g, '')
            let dotNum = 0
            let dot = item.indexOf(".")
            if (dot != -1) {
              item = item.replace(".", '')
              dotNum = item.length - (dot + 1)
            }
            if (item.indexOf("-") == -1) {
              item = item + '0'.repeat(3 - dotNum)
            }
            if (!gbqk_arr[index]) {
              let newArr = new Array(item)
              gbqk_arr.push(newArr)
            } else {
              gbqk_arr[index].push(item)
            }
          })
        }
        financeData.forEach((item, index) => {
          for (let i = 0; i < gbqk_arr.length; i++) {
            if (item.date > gbqk_arr[i][0]) {
              if (!financeData[index].capital_stock) {
                financeData[index].capital_stock = gbqk_arr[i][1]
              }
            }
            if (item.date <= gbqk_arr[gbqk_arr.length - 1][0]) {
              financeData[index].capital_stock = gbqk_arr[gbqk_arr.length - 1][1]
            }
          }
        })
        console.log('reqGbqk')
        resolve()
      })
    })
    req_gbqk.end()
  })
}

/*
@@分红情况
*/
function reqFh(option) {
  return new Promise(function (resolve, reject) {
    let req_fh = http.request(option, function (res) {
      let fh_data = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        fh_data += chunk
      })
      let shijian = []
      res.on('end', function () {
        let obj = JSON.parse(fh_data)
        let fh = obj.Result.lnfhrz
        fh.forEach((item, index) => {
          shijian.push(item.sj)
        })
        financeData.forEach((item, index) => {
          let year = item.date.substr(0, 4)
          let is_fh = shijian.indexOf(year)
          if (is_fh !== -1) {
            let has_num = fh[is_fh].fhze.match(/\d+/)
            if (has_num) {
              financeData[index].is_fenhong = 1
              let fhze = fh[is_fh].fhze
              fhze = fhze.replace(/,/g, '')
              let dotNum = 0
              let dot = fhze.indexOf(".")
              if (dot != -1) {
                fhze = fhze.replace(".", '')
                dotNum = fhze.length - (dot + 1)
              }
              fhze = fhze + '0'.repeat(3 - dotNum)
              financeData[index].fhje = fhze
            } else {
              financeData[index].is_fenhong = 0
              financeData[index].fhje = 0
            }
          } else {
            financeData[index].is_fenhong = 0
            financeData[index].fhje = 0
          }
        })
        console.log('reqFh')
        resolve()
      })
    })
    req_fh.end()
  })
}
/*
@@ 处理利润表
*/
function dealLrb(arr, type) {
  for (let i = 0; i < arr.length; i++) {
    let length = financeData.length
    if (i >= financeData.length) {
      return
    }
    let item = arr[i]
    delete item.date
    item.jlr = dealMoney(item.jlr)
    Object.assign(financeData[i], item)
  }

}

function dealBbmx(arr, type) {
  for (let i = 0; i < arr.length; i++) {
    let length = financeData.length
    if (i >= financeData.length) {
      return
    }
    let item = arr[i]
    delete item.date
    if (type == 1) {
      item.gdzc = dealMoney(item.gdzc)
      item.fzhj = dealMoney(item.fzhj)
      item.gdqyhj = dealMoney(item.gdqyhj)
    }
    if (type == 2) {
      item.fpzfdxj = dealMoney(item.fpzfdxj)
      item.jyhdcsdxjllje = dealMoney(item.jyhdcsdxjllje)
    }
    if (type == 3) {
      item.yysruse = dealMoney(item.yysr)
    }
    Object.assign(financeData[i], item)
  }
}
/* 
@@ 去除小数点和单位转换成一致
*/
function dealMoney(item) {
  let dotNum = 0
  let dot = item.indexOf(".")
  if (dot != -1) {
    item = item.replace(".", '')
    dotNum = item.length - (dot + 1)
  }
  let cny = item.substr(-1)
  if (cny == '万') {
    item = item.replace("万", '') + '0'.repeat(4 - dotNum)
  }
  if (cny == '亿') {
    item = item.replace("亿", '') + '0'.repeat(8 - dotNum)
  }
  return item
}


function dealChunk(financeData) {
  return new Promise(function (resolve, reject) {
    console.log('dealChunk')
    financeData.map((item, index) => {
      item.stock_name = currentRequestStock.name
      item.stock = currentRequestStock.code.substr(2)
      //console.log(item)
      insertData(item)
    })
  })
}

function insertData(item) {
  let sql = "INSERT INTO `finance_data` (`stock`,`stock_name`, `date`,`tbzzcsyl`,`jyhdcsdxjllje`,`gdzc`,`fzhj`,`yysr`,`gdqyhj`,`jlr`,`capital_stock`,`fpzfdxj`,`is_fenhong`,`fhje`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
  param = [item.stock,item.stock_name, item.date, item.tbzzcsyl, item.jyhdcsdxjllje, item.gdzc, item.fzhj, item.yysruse, item.gdqyhj, item.jlr, item.capital_stock, item.fpzfdxj,item.is_fenhong,item.fhje]
  connection.query(sql, param, function (error, results, fields) {
    if (error) throw error;
    //console.log('The solution is: ', results[0]);
    console.log('存储成功')
  })
}


reqZyzb(options.zyzb)
  .then(() => { return reqBbmx(options.bbmx) })
  .then(() => { return reqLrb(options.lrb) })
  .then(() => { return reqGbqk(options.gbqk) })
  .then(() => { return reqFh(options.fh) })
  .then(() => { return dealChunk(financeData) })

/*
@@数据转存json文件
*/
function writeJson(data) {
  let obj = new Object()
  data.map((val, index) => {
    obj[index] = val
  })
  let saveData = JSON.stringify(obj)
  fs.writeFile('res.json', saveData, { flag: 'a' }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('写入成功');
    }
  })
}
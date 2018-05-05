const http = require('http')
const queryString = require('querystring')
const fs = require('fs')
const mysql = require('mysql')
const {deepParseJson} = require('deep-parse-json')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1053654456',
  database: 'test',
  charset: 'utf8'
})
let currentRequestStock = 'sz000725'
connection.connect()
connection.query('SELECT COUNT(*) FROM `t_vpn_ip`;', function (error, results, fields) {
  if (error) throw error;
  //console.log('The solution is: ', results[0]);
})

let data = {
  zyzb: {
    code: currentRequestStock,
    type: 1
  },
  bbmx: {
    code: currentRequestStock,
    ctype: 0,
    type: 1
  },
  gbqk: {
    code: currentRequestStock
  },
  lrb: {
    code: currentRequestStock,
    ctype: 0,
    type: 1
  },
  fh: {
    code: currentRequestStock
  }
}

let contents = {}
let options_key = Object.keys(data)
options_key.map((val)=>{
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

let chunkData = ''
  let req_bbmx = http.request(options.bbmx, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      chunkData += chunk
      
      //let zcfz = obj.Result.zcfz0
      // let gdzc = obj.Result.gdzc0
      // let lr = obj.Result.lr0
      
      if (financeData.length==0) {
        //financeData = financeData.concat(finance)
      }
      //dealChunk(financeData)
    })
    res.on('end',function(){

      let obj = JSON.parse(chunkData)
      console.dir(obj)
  })
        
   
  })
  req_bbmx.end()



function dealChunk(financeData) {
  let arrayData = Array.from(financeData)
  arrayData.map((item, index) => {
    //console.log(item)
    item.stock = currentRequestStock.substr(2)
      //insertData(item)
  })
}

function insertData(item) {
  let sql = "INSERT INTO `finance_data` (`stock`, `date`,`tbzzcsyl`) VALUES (?,?,?);"
  param = [item.stock, item.date, item.tbzzcsyl]
  connection.query(sql, param, function (error, results, fields) {
    if (error) throw error;
    //console.log('The solution is: ', results[0]);
    console.log('存储成功')
  })
}
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
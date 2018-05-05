## JSON字段含义解释
###主要指标&杜邦分析
tbzzcsyl 总资产收益率%
###报表明细
http://emweb.securities.eastmoney.com/PC_HSF10/FinanceAnalysis/ReportDetailAjax?code=sz000725&ctype=0&type=1
jyhdcsdxjllje 经营活动产生的现金流量净额(元) xjll0现金流量表下
gdzc 固定资产总额亿 zcfz0（资产负债表）下
yysr 营业收入 lr0利润表下
fzhj 负债合计亿 zcfz0（资产负债表）下
gdqyhj 股东权益合计亿 zcfz0（资产负债表）下
###股本情况
http://emweb.securities.eastmoney.com/PC_HSF10/CapitalStockStructure/CapitalStockStructureAjax?code=sz000725
capital_stock 总股本单位个

###利润表
http://emweb.securities.eastmoney.com/PC_HSF10/FinanceAnalysis/PercentAjax?code=sz000725&ctype=0&type=1
jlr 净利润亿
fpzfdxj 分配股利、利润或偿付利息支付亿
###分红情况
http://emweb.securities.eastmoney.com/PC_HSF10/BonusFinancing/BonusFinancingAjax?code=sz000725
fhze 分红金额
千分位转数字直接 .replace(/,/gi,'')
###获取月股价
http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&cb=jQuery183013334804466231853_1525516719453&id=0007252&type=mk&authorityType=&_=1525516776518
`id=股票代码+'2'`

指标详解
资产净利率x1	资产净利润率=净利润/资产平均总额×100%	15.11%			
每股经营现金流x6	经营活动产生现金流量净额/年度末普通股总股本	0.295504428	97180000	328,861,400.00	
log固定资产总额x21	log(固定资产总额)	7.536937023	34430000		
主营业务收入增长率x23	当期/上年	31.83%	1.9	5.97	
留存利润率x24	利润存留率=（税后利润-应发股利）/税后利润x100%	100%			
流通市值负债比x31	负债/流通市值	0.065370388	2.44	11.35	328,861,400.00
股本账面值/股本市值x32	净资产(所有者权益)/股本 / 市值	0.006325389	0.2361	328,861,400.00	11.35
ZETA					
10.08115795					

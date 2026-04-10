// 八字排盘核心算法

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
// 天干五行
const TIAN_GAN_WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']
// 地支五行
const DI_ZHI_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']
// 天干阴阳
const TIAN_GAN_YINYANG = ['阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴']
// 地支阴阳
const DI_ZHI_YINYANG = ['阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴']
// 纳音五行（60甲子纳音）
const NA_YIN = [
  '海中金','海中金','炉中火','炉中火','大林木','大林木','路旁土','路旁土','剑锋金','剑锋金',
  '山头火','山头火','涧下水','涧下水','城头土','城头土','白蜡金','白蜡金','杨柳木','杨柳木',
  '泉中水','泉中水','屋上土','屋上土','霹雳火','霹雳火','松柏木','松柏木','长流水','长流水',
  '砂石金','砂石金','山下火','山下火','平地木','平地木','壁上土','壁上土','金箔金','金箔金',
  '覆灯火','覆灯火','天河水','天河水','大驿土','大驿土','钗钏金','钗钏金','桑柘木','桑柘木',
  '大溪水','大溪水','沙中土','沙中土','天上火','天上火','石榴木','石榴木','大海水','大海水'
]

// 十神关系
const SHI_SHEN_MAP = {
  '同我': { '阳': '比肩', '阴': '劫财' },
  '我生': { '阳': '食神', '阴': '伤官' },
  '我克': { '阳': '偏财', '阴': '正财' },
  '克我': { '阳': '七杀', '阴': '正官' },
  '我生母': { '阳': '偏印', '阴': '正印' },
}

// 五行生克关系
const WUXING_SHENG_KE = {
  '木': { '生': '火', '克': '土', '被生': '水', '被克': '金' },
  '火': { '生': '土', '克': '金', '被生': '木', '被克': '水' },
  '土': { '生': '金', '克': '水', '被生': '火', '被克': '木' },
  '金': { '生': '水', '克': '木', '被生': '土', '被克': '火' },
  '水': { '生': '木', '克': '火', '被生': '金', '被克': '土' },
}

// 获取天干地支的五行关系
function getRelation(dayGanWuxing, targetWuxing, targetYinyang) {
  const shengke = WUXING_SHENG_KE[dayGanWuxing]
  if (targetWuxing === dayGanWuxing) return SHI_SHEN_MAP['同我'][targetYinyang]
  if (targetWuxing === shengke['生']) return SHI_SHEN_MAP['我生'][targetYinyang]
  if (targetWuxing === shengke['克']) return SHI_SHEN_MAP['我克'][targetYinyang]
  if (targetWuxing === shengke['被生']) return SHI_SHEN_MAP['我生母'][targetYinyang]
  if (targetWuxing === shengke['被克']) return SHI_SHEN_MAP['克我'][targetYinyang]
  return ''
}

// 年柱计算
function getYearPillar(year) {
  // 以立春为界，简化处理
  const ganIdx = (year - 4) % 10
  const zhiIdx = (year - 4) % 12
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx, zhiIdx,
    wuxing: TIAN_GAN_WUXING[ganIdx] + DI_ZHI_WUXING[zhiIdx],
    nayin: NA_YIN[(ganIdx % 10) * 6 + (zhiIdx % 12) % 6 + Math.floor(ganIdx / 5) * 30] || '未知',
    shengxiao: SHENG_XIAO[zhiIdx],
    ganWuxing: TIAN_GAN_WUXING[ganIdx],
    zhiWuxing: DI_ZHI_WUXING[zhiIdx],
    ganYinyang: TIAN_GAN_YINYANG[ganIdx],
    zhiYinyang: DI_ZHI_YINYANG[zhiIdx],
  }
}

// 月柱计算
function getMonthPillar(yearGanIdx, month) {
  // 月支固定：正月寅，二月卯...
  const zhiIdx = (month + 1) % 12  // 1月=寅(2), 2月=卯(3)...
  // 月干根据年干推算：甲己之年丙作首
  const baseGan = (yearGanIdx % 5) * 2 + 2  // 甲己->丙, 乙庚->戊, 丙辛->庚, 丁壬->壬, 戊癸->甲
  const ganIdx = (baseGan + month - 1) % 10
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx, zhiIdx,
    ganWuxing: TIAN_GAN_WUXING[ganIdx],
    zhiWuxing: DI_ZHI_WUXING[zhiIdx],
    ganYinyang: TIAN_GAN_YINYANG[ganIdx],
    zhiYinyang: DI_ZHI_YINYANG[zhiIdx],
  }
}

// 日柱计算（基于公历日期的简化算法）
function getDayPillar(year, month, day) {
  // 使用基准日推算（2000年1月1日为甲子日近似）
  const baseDate = new Date(2000, 0, 7) // 2000年1月7日 = 庚子日
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  
  const ganIdx = ((diffDays % 10) + 10) % 10  // 庚=6
  const zhiIdx = ((diffDays % 12) + 12) % 12 // 子=0
  
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx, zhiIdx,
    ganWuxing: TIAN_GAN_WUXING[ganIdx],
    zhiWuxing: DI_ZHI_WUXING[zhiIdx],
    ganYinyang: TIAN_GAN_YINYANG[ganIdx],
    zhiYinyang: DI_ZHI_YINYANG[zhiIdx],
  }
}

// 时柱计算
function getHourPillar(dayGanIdx, hour) {
  // 时辰对应地支
  let zhiIdx
  if (hour === 23 || hour === 0) zhiIdx = 0
  else zhiIdx = Math.ceil(hour / 2)
  
  // 时干根据日干推算：甲己还加甲
  const baseGan = (dayGanIdx % 5) * 2
  const ganIdx = (baseGan + zhiIdx) % 10
  
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx, zhiIdx,
    ganWuxing: TIAN_GAN_WUXING[ganIdx],
    zhiWuxing: DI_ZHI_WUXING[zhiIdx],
    ganYinyang: TIAN_GAN_YINYANG[ganIdx],
    zhiYinyang: DI_ZHI_YINYANG[zhiIdx],
  }
}

// 计算十神
function calcShiShen(dayPillar, pillar) {
  return {
    gan: getRelation(dayPillar.ganWuxing, pillar.ganWuxing, pillar.ganYinyang),
    zhi: getRelation(dayPillar.ganWuxing, pillar.zhiWuxing, pillar.zhiYinyang),
  }
}

// 计算大运
function getDaYun(yearPillar, gender, birthYear) {
  // 大运从月柱起排
  // 阳年男顺排，阴年男逆排；阳年女逆排，阴年女顺排
  const isYangYear = yearPillar.ganYinyang === '阳'
  const isMale = gender === '男'
  const forward = (isYangYear && isMale) || (!isYangYear && !isMale)
  
  const startAge = 3 // 简化：3岁起运
  const daYun = []
  
  for (let i = 0; i < 8; i++) {
    const offset = forward ? (i + 1) : -(i + 1)
    let ganIdx = ((yearPillar.ganIdx + offset) % 10 + 10) % 10
    // 大运天干需要根据月柱来算
    ganIdx = ((yearPillar.ganIdx + 1 + offset) % 10 + 10) % 10 // 简化
    let zhiIdx = ((yearPillar.zhiIdx + offset) % 12 + 12) % 12
    
    daYun.push({
      startAge: startAge + i * 10,
      endAge: startAge + (i + 1) * 10 - 1,
      startYear: birthYear + startAge + i * 10,
      endYear: birthYear + startAge + (i + 1) * 10 - 1,
      gan: TIAN_GAN[ganIdx],
      zhi: DI_ZHI[zhiIdx],
      ganWuxing: TIAN_GAN_WUXING[ganIdx],
      zhiWuxing: DI_ZHI_WUXING[zhiIdx],
      wuxing: TIAN_GAN_WUXING[ganIdx] + DI_ZHI_WUXING[zhiIdx],
    })
  }
  
  return daYun
}

// 五行统计
function countWuxing(pillars) {
  const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  pillars.forEach(p => {
    count[p.ganWuxing]++
    count[p.zhiWuxing]++
  })
  return count
}

// 五行强弱分析
function analyzeWuxing(count) {
  const total = Object.values(count).reduce((a, b) => a + b, 0)
  const result = []
  
  for (const [wx, c] of Object.entries(count)) {
    const pct = Math.round((c / total) * 100)
    let strength
    if (pct >= 30) strength = '旺'
    else if (pct >= 20) strength = '相'
    else if (pct >= 10) strength = '平'
    else strength = '弱'
    
    result.push({ wuxing: wx, count: c, percent: pct, strength })
  }
  
  return result.sort((a, b) => b.count - a.count)
}

// 日主分析
function analyzeDayMaster(dayPillar, wuxingAnalysis) {
  const dayWx = dayPillar.ganWuxing
  const dayItem = wuxingAnalysis.find(w => w.wuxing === dayWx)
  const isStrong = dayItem && dayItem.count >= 3
  
  // 找喜用神
  const shengke = WUXING_SHENG_KE[dayWx]
  const xiShen = isStrong ? shengke['克'] : shengke['生'] // 身旺喜克，身弱喜生
  const yongShen = isStrong ? shengke['被克'] : shengke['被生']
  
  return {
    dayWx,
    isStrong,
    strength: isStrong ? '身旺' : '身弱',
    xiShen,
    yongShen,
    description: isStrong
      ? `日主${dayWx}旺，命局偏强。喜${xiShen}、${yongShen}来克制泄耗，忌${shengke['生']}、${shengke['被生']}再来生助。`
      : `日主${dayWx}弱，命局偏弱。喜${xiShen}、${yongShen}来生扶，忌${shengke['克']}、${shengke['被克']}再来克泄。`
  }
}

// 综合运势分析
function analyzeFortune(pillars, dayMaster, gender) {
  const yearWx = pillars.year.ganWuxing
  const monthWx = pillars.month.zhiWuxing
  
  const aspects = {
    career: analyzeCareer(pillars, dayMaster),
    wealth: analyzeWealth(pillars, dayMaster),
    relationship: analyzeRelationship(pillars, dayMaster, gender),
    health: analyzeHealth(pillars, dayMaster),
  }
  
  return aspects
}

function analyzeCareer(pillars, dm) {
  const guan = calcShiShen(pillars.day, pillars.year).gan
  const hasGuan = guan === '正官' || guan === '七杀'
  if (hasGuan) {
    return { score: 80, desc: '年柱见官杀，事业心强，有领导才能，适合管理岗位或自主创业。中年事业有成之象。' }
  }
  return { score: 65, desc: '命局官杀不显，事业运势平稳。适合技术类或专业领域发展，贵人在中年出现。' }
}

function analyzeWealth(pillars, dm) {
  const cai = calcShiShen(pillars.day, pillars.month).gan
  const hasCai = cai === '正财' || cai === '偏财'
  if (hasCai) {
    return { score: 75, desc: '月柱见财星，财运较好。善于理财，正财稳定，偏财有机会。中年后财运渐旺。' }
  }
  return { score: 60, desc: '财运平稳，需靠自身努力积累。不宜冒险投资，稳健理财为上。' }
}

function analyzeRelationship(pillars, dm, gender) {
  const isMale = gender === '男'
  const targetGan = isMale ? '正财' : '正官'
  const dayShiShen = calcShiShen(pillars.day, pillars.day)
  
  if (isMale) {
    const hasCai = dayShiShen.gan === '正财' || dayShiShen.gan === '偏财'
    if (hasCai) return { score: 75, desc: '日坐财星，异性缘佳，婚姻美满。配偶贤惠持家。' }
    return { score: 60, desc: '感情运势平稳，婚姻宜晚不宜早。25岁后桃花渐旺。' }
  } else {
    const hasGuan = dayShiShen.gan === '正官' || dayShiShen.gan === '七杀'
    if (hasGuan) return { score: 75, desc: '日坐官星，异性缘佳，丈夫有能力。婚姻幸福之象。' }
    return { score: 60, desc: '感情运势平稳，宜找同龄或稍长伴侣。婚姻中有小波折但终归美满。' }
  }
}

function analyzeHealth(pillars, dm) {
  const shengke = WUXING_SHENG_KE[dm.dayWx]
  const weakWx = dm.isStrong ? shengke['生'] : shengke['克']
  const organMap = {
    '金': '肺部、呼吸道、大肠',
    '木': '肝胆、眼睛、筋骨',
    '水': '肾脏、膀胱、耳朵',
    '火': '心脏、小肠、血液循环',
    '土': '脾胃、消化系统、肌肉',
  }
  return {
    score: 70,
    desc: `需注意${organMap[weakWx]}方面的保养。保持规律作息，适度运动。中年之后注意${organMap[shengke['被克']]}健康。`
  }
}

// 主函数：完整排盘
export function calculateBazi(year, month, day, hour, gender) {
  const yearPillar = getYearPillar(year)
  const monthPillar = getMonthPillar(yearPillar.ganIdx, month)
  const dayPillar = getDayPillar(year, month, day)
  const hourPillar = getHourPillar(dayPillar.ganIdx, hour)
  
  const pillars = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar }
  
  // 十神
  const shiShen = {
    year: calcShiShen(dayPillar, yearPillar),
    month: calcShiShen(dayPillar, monthPillar),
    hour: calcShiShen(dayPillar, hourPillar),
  }
  
  // 五行统计
  const wuxingCount = countWuxing([yearPillar, monthPillar, dayPillar, hourPillar])
  const wuxingAnalysis = analyzeWuxing(wuxingCount)
  
  // 日主分析
  const dayMaster = analyzeDayMaster(dayPillar, wuxingAnalysis)
  
  // 大运
  const daYun = getDaYun(yearPillar, gender, year)
  
  // 运势分析
  const fortune = analyzeFortune(pillars, dayMaster, gender)
  
  return {
    pillars,
    shiShen,
    wuxingCount,
    wuxingAnalysis,
    dayMaster,
    daYun,
    fortune,
    shengxiao: yearPillar.shengxiao,
    nayin: yearPillar.nayin,
  }
}

export { TIAN_GAN, DI_ZHI, SHENG_XIAO, TIAN_GAN_WUXING, DI_ZHI_WUXING }

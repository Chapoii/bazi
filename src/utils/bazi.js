// 八字排盘算法 - 基于 lunar-typescript 库
import { Solar, EightChar } from 'lunar-typescript'

// 天干五行
const TIAN_GAN_WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']
// 地支五行
const DI_ZHI_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']

// 解析干支字符串
function parseGanZhi(ganZhi) {
  const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const gan = ganZhi[0]
  const zhi = ganZhi[1]
  const ganIdx = TIAN_GAN.indexOf(gan)
  const zhiIdx = DI_ZHI.indexOf(zhi)
  return { gan, zhi, ganIdx, zhiIdx, ganWuxing: TIAN_GAN_WUXING[ganIdx], zhiWuxing: DI_ZHI_WUXING[zhiIdx] }
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

// 五行生克关系
const WUXING_SHENG_KE = {
  '木': { '生': '火', '克': '土', '被生': '水', '被克': '金' },
  '火': { '生': '土', '克': '金', '被生': '木', '被克': '水' },
  '土': { '生': '金', '克': '水', '被生': '火', '被克': '木' },
  '金': { '生': '水', '克': '木', '被生': '土', '被克': '火' },
  '水': { '生': '木', '克': '火', '被生': '金', '被克': '土' },
}

// 日主分析
function analyzeDayMaster(dayPillar, wuxingAnalysis) {
  const dayWx = dayPillar.ganWuxing
  const dayItem = wuxingAnalysis.find(w => w.wuxing === dayWx)
  const isStrong = dayItem && dayItem.count >= 3
  const shengke = WUXING_SHENG_KE[dayWx]
  const xiShen = isStrong ? shengke['克'] : shengke['生']
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

// 运势分析
function analyzeCareer(pillars, dm) {
  const yearGan = pillars.year.gan
  const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const dayGanIdx = TIAN_GAN.indexOf(pillars.day.gan)
  const yearGanIdx = TIAN_GAN.indexOf(yearGan)
  const diff = ((yearGanIdx - dayGanIdx) % 10 + 10) % 10
  // 正官: diff=1, 七杀: diff=7
  const hasGuan = diff === 1 || diff === 7
  if (hasGuan) {
    return { score: 80, desc: '年柱见官杀，事业心强，有领导才能，适合管理岗位或自主创业。中年事业有成之象。' }
  }
  return { score: 65, desc: '命局官杀不显，事业运势平稳。适合技术类或专业领域发展，贵人在中年出现。' }
}

function analyzeWealth(pillars, dm) {
  const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const dayGanIdx = TIAN_GAN.indexOf(pillars.day.gan)
  const monthGanIdx = TIAN_GAN.indexOf(pillars.month.gan)
  const diff = ((monthGanIdx - dayGanIdx) % 10 + 10) % 10
  // 正财: diff=3, 偏财: diff=9
  const hasCai = diff === 3 || diff === 9
  if (hasCai) {
    return { score: 75, desc: '月柱见财星，财运较好。善于理财，正财稳定，偏财有机会。中年后财运渐旺。' }
  }
  return { score: 60, desc: '财运平稳，需靠自身努力积累。不宜冒险投资，稳健理财为上。' }
}

function analyzeRelationship(pillars, dm, gender) {
  const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const dayGanIdx = TIAN_GAN.indexOf(pillars.day.gan)
  const dayZhiIdx = [0,1,2,3,4,5,6,7,8,9,10,11].indexOf(pillars.day.zhiIdx)
  const dayGanWx = pillars.day.ganWuxing
  const shengke = WUXING_SHENG_KE[dayGanWx]
  const caiWx = dm.isStrong ? shengke['克'] : shengke['被生']
  const guanWx = dm.isStrong ? shengke['被克'] : shengke['生']
  
  // 日支坐财/官
  const dayZhiWx = pillars.day.zhiWuxing
  const hasGood = dayZhiWx === caiWx || dayZhiWx === guanWx
  
  if (gender === '男') {
    if (hasGood) return { score: 75, desc: '日坐财星，异性缘佳，婚姻美满。配偶贤惠持家。' }
    return { score: 60, desc: '感情运势平稳，婚姻宜晚不宜早。25岁后桃花渐旺。' }
  } else {
    if (hasGood) return { score: 75, desc: '日坐官星，异性缘佳，丈夫有能力。婚姻幸福之象。' }
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

function analyzeFortune(pillars, dayMaster, gender) {
  return {
    career: analyzeCareer(pillars, dayMaster),
    wealth: analyzeWealth(pillars, dayMaster),
    relationship: analyzeRelationship(pillars, dayMaster, gender),
    health: analyzeHealth(pillars, dayMaster),
  }
}

// 时辰对应的小时（取中间值用于 Solar）
const SHICHEN_HOURS = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]

// 主函数：完整排盘
export function calculateBazi(year, month, day, hour, gender) {
  // hour: 0=子时, 1=丑时, ..., 11=亥时
  const h = SHICHEN_HOURS[hour]
  const solar = Solar.fromYmdHms(year, month, day, h, 0, 0)
  const lunar = solar.getLunar()
  const eightChar = lunar.getEightChar()

  // 四柱
  const yearPillar = parseGanZhi(eightChar.getYear())
  const monthPillar = parseGanZhi(eightChar.getMonth())
  const dayPillar = parseGanZhi(eightChar.getDay())

  // 时柱
  const hourGanZhi = eightChar.getTime()
  const hourPillar = parseGanZhi(hourGanZhi)

  const pillars = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar }

  // 十神（从库获取）
  const shiShen = {
    year: { gan: eightChar.getYearShiShenGan() || '—', zhi: '—' },
    month: { gan: eightChar.getMonthShiShenGan() || '—', zhi: '—' },
    hour: { gan: eightChar.getTimeShiShenGan() || '—', zhi: '—' },
  }

  // 五行统计
  const wuxingCount = countWuxing([yearPillar, monthPillar, dayPillar, hourPillar])
  const wuxingAnalysis = analyzeWuxing(wuxingCount)

  // 日主分析
  const dayMaster = analyzeDayMaster(dayPillar, wuxingAnalysis)

  // 大运（1=男, 0=女）
  const genderNum = gender === '男' ? 1 : 0
  const yun = eightChar.getYun(genderNum)
  const daYun = []

  if (yun) {
    const daYunList = yun.getDaYun()
    daYunList.forEach((dy) => {
      const gz = parseGanZhi(dy.getGanZhi())
      daYun.push({
        startAge: dy.getStartAge(),
        endAge: dy.getEndAge(),
        startYear: dy.getStartYear(),
        endYear: dy.getEndYear(),
        gan: gz.gan,
        zhi: gz.zhi,
        ganWuxing: gz.ganWuxing,
        zhiWuxing: gz.zhiWuxing,
        wuxing: gz.ganWuxing + gz.zhiWuxing,
      })
    })
  }

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
    shengxiao: lunar.getYearShengXiao(),
    nayin: eightChar.getYearNaYin(),
  }
}

export { TIAN_GAN_WUXING, DI_ZHI_WUXING }

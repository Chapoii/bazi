<template>
  <div class="app">
    <!-- 导航 -->
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <div class="nav-logo">☯ 八字排盘</div>
        <div class="nav-links">
          <a href="#intro">八字简介</a>
          <a href="#paipan" class="nav-cta">在线排盘</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="bagua-ring" v-for="n in 6" :key="n" :style="{ width: 200+n*120+'px', height: 200+n*120+'px' }"></div>
      </div>
      <div class="hero-content">
        <div class="hero-symbol">☯</div>
        <h1 class="hero-title">八字排盘</h1>
        <p class="hero-sub">四柱八字 · 大运流年 · 命理分析</p>
        <p class="hero-desc">
          八字，又称四柱命理，是中国传统命理学的重要组成部分。<br />
          以出生年月日时排成四柱，推算一生运势吉凶。
        </p>
        <a href="#paipan" class="hero-btn">🔮 立即排盘</a>
      </div>
    </section>

    <!-- 简介 -->
    <section id="intro" class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">📜 八字简介</span>
          <h2 class="section-title">什么是八字？</h2>
        </div>
        <div class="intro-grid">
          <div class="intro-card">
            <div class="intro-icon">📅</div>
            <h3>四柱八字</h3>
            <p>以出生的年、月、日、时，各配以天干地支，形成四柱（年柱、月柱、日柱、时柱），每柱一干一支，共八个字，故称「八字」。</p>
          </div>
          <div class="intro-card">
            <div class="intro-icon">🔄</div>
            <h3>五行生克</h3>
            <p>金木水火土五行之间相生相克。五行平衡则运势顺遂，偏旺偏弱则需调理。八字分析的核心在于判断五行的旺衰。</p>
          </div>
          <div class="intro-card">
            <div class="intro-icon">👤</div>
            <h3>十神体系</h3>
            <p>以日干（出生日的天干）为我，与其他七个字形成十种关系：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印。</p>
          </div>
          <div class="intro-card">
            <div class="intro-icon">🌊</div>
            <h3>大运流年</h3>
            <p>大运每十年一变，代表人生不同阶段的运势走向。流年则是每一年的具体运势。大运定格局，流年看吉凶。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 排盘 -->
    <section id="paipan" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">🔮 在线排盘</span>
          <h2 class="section-title">输入信息，排出你的八字</h2>
        </div>

        <div class="paipan-panel">
          <!-- 输入表单 -->
          <div class="input-form">
            <div class="form-row">
              <div class="form-group">
                <label>性别</label>
                <div class="gender-btns">
                  <button :class="['gender-btn', { active: gender === '男' }]" @click="gender='男'">♂ 男</button>
                  <button :class="['gender-btn', { active: gender === '女' }]" @click="gender='女'">♀ 女</button>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>出生年份</label>
                <input v-model.number="birthYear" type="number" min="1940" max="2030" placeholder="如 1990" />
              </div>
              <div class="form-group">
                <label>月份</label>
                <select v-model.number="birthMonth">
                  <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
                </select>
              </div>
              <div class="form-group">
                <label>日期</label>
                <select v-model.number="birthDay">
                  <option v-for="d in 31" :key="d" :value="d">{{ d }}日</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>出生时辰</label>
                <select v-model.number="birthHour">
                  <option v-for="(sc, i) in shichens" :key="i" :value="i">{{ sc.name }} ({{ sc.time }})</option>
                </select>
              </div>
            </div>
            <button class="submit-btn" @click="doPaipan">☯ 开始排盘</button>
          </div>

          <!-- 排盘结果 -->
          <transition name="fade">
            <div v-if="result" class="result-area">
              <!-- 基本信息 -->
              <div class="basic-info">
                <div class="info-item">
                  <span class="info-label">生肖</span>
                  <span class="info-value">{{ result.shengxiao }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">年命纳音</span>
                  <span class="info-value">{{ result.nayin }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">日主</span>
                  <span class="info-value day-master">{{ result.dayMaster.dayWx }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">日主强弱</span>
                  <span class="info-value" :class="result.dayMaster.isStrong ? 'strong' : 'weak'">{{ result.dayMaster.strength }}</span>
                </div>
              </div>

              <!-- 四柱 -->
              <div class="sizhu">
                <div class="sizhu-title">四柱八字</div>
                <div class="sizhu-table">
                  <div class="sizhu-header">
                    <span></span><span>年柱</span><span>月柱</span><span>日柱</span><span>时柱</span>
                  </div>
                  <div class="sizhu-row">
                    <span class="row-label">天干</span>
                    <span v-for="key in ['year','month','day','hour']" :key="key" class="sizhu-cell gan">
                      {{ result.pillars[key].gan }}
                      <span class="cell-sub">{{ result.pillars[key].ganWuxing }}</span>
                    </span>
                  </div>
                  <div class="sizhu-row">
                    <span class="row-label">地支</span>
                    <span v-for="key in ['year','month','day','hour']" :key="key" class="sizhu-cell zhi">
                      {{ result.pillars[key].zhi }}
                      <span class="cell-sub">{{ result.pillars[key].zhiWuxing }}</span>
                    </span>
                  </div>
                  <div class="sizhu-row shishen-row">
                    <span class="row-label">十神</span>
                    <span class="sizhu-cell">—</span>
                    <span v-for="key in ['year','month','hour']" :key="key" class="sizhu-cell ss">
                      {{ result.shiShen[key].gan }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 五行分析 -->
              <div class="wuxing-section">
                <div class="sizhu-title">五行分析</div>
                <div class="wuxing-bars">
                  <div v-for="wx in result.wuxingAnalysis" :key="wx.wuxing" class="wx-bar">
                    <span class="wx-label">{{ wx.wuxing }}</span>
                    <div class="wx-track">
                      <div class="wx-fill" :style="{ width: wx.percent + '%' }" :class="wx.wuxing"></div>
                    </div>
                    <span class="wx-count">{{ wx.count }}个</span>
                    <span class="wx-strength" :class="wx.strength">{{ wx.strength }}</span>
                  </div>
                </div>
                <div class="day-master-desc">
                  <strong>日主分析：</strong>{{ result.dayMaster.description }}
                </div>
              </div>

              <!-- 大运 -->
              <div class="dayun-section">
                <div class="sizhu-title">大运</div>
                <div class="dayun-grid">
                  <div v-for="(dy, i) in result.daYun" :key="i" class="dayun-card" :class="{ current: isCurrentDaYun(dy) }">
                    <div class="dy-age">{{ dy.startAge }}-{{ dy.endAge }}岁</div>
                    <div class="dy-gz">{{ dy.gan }}{{ dy.zhi }}</div>
                    <div class="dy-wx">{{ dy.wuxing }}</div>
                    <div class="dy-year">{{ dy.startYear }}-{{ dy.endYear }}</div>
                    <div v-if="isCurrentDaYun(dy)" class="dy-current-badge">当前</div>
                  </div>
                </div>
              </div>

              <!-- 运势分析 -->
              <div class="fortune-section">
                <div class="sizhu-title">运势分析</div>
                <div class="fortune-grid">
                  <div v-for="(f, key) in result.fortune" :key="key" class="fortune-card">
                    <div class="fortune-header">
                      <span class="fortune-icon">{{ fortuneIcons[key] }}</span>
                      <span class="fortune-name">{{ fortuneNames[key] }}</span>
                      <span class="fortune-score" :class="f.score >= 75 ? 'good' : f.score >= 65 ? 'mid' : 'low'">{{ f.score }}分</span>
                    </div>
                    <p class="fortune-desc">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>☯ 八字排盘 · 仅供娱乐参考，不作为任何决策依据</p>
      <p class="footer-sub">© 2026 bazi · MIT License</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { calculateBazi } from './utils/bazi.js'

const isScrolled = ref(false)
const gender = ref('男')
const birthYear = ref(1990)
const birthMonth = ref(1)
const birthDay = ref(1)
const birthHour = ref(0)
const result = ref(null)

const shichens = [
  { name: '子时', time: '23-01' }, { name: '丑时', time: '01-03' },
  { name: '寅时', time: '03-05' }, { name: '卯时', time: '05-07' },
  { name: '辰时', time: '07-09' }, { name: '巳时', time: '09-11' },
  { name: '午时', time: '11-13' }, { name: '未时', time: '13-15' },
  { name: '申时', time: '15-17' }, { name: '酉时', time: '17-19' },
  { name: '戌时', time: '19-21' }, { name: '亥时', time: '21-23' },
]

const fortuneIcons = { career: '💼', wealth: '💰', relationship: '❤️', health: '🏥' }
const fortuneNames = { career: '事业运', wealth: '财运', relationship: '感情运', health: '健康运' }

function isCurrentDaYun(dy) {
  const age = new Date().getFullYear() - birthYear.value
  return age >= dy.startAge && age <= dy.endAge
}

function doPaipan() {
  result.value = calculateBazi(birthYear.value, birthMonth.value, birthDay.value, birthHour.value, gender.value)
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;600&display=swap');

:root {
  --primary: #1a1a2e;
  --gold: #c9a84c;
  --gold-light: #e8d48b;
  --red: #b5453a;
  --green: #4a8c5c;
  --blue: #3a6b8c;
  --bg: #f7f5f0;
  --bg-alt: #eee9df;
  --text: #2c2c2c;
  --text-dim: #888;
  --border: #ddd8cc;
  --shadow: 0 4px 20px rgba(0,0,0,0.06);
  --radius: 14px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans SC', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
</style>

<style scoped>
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 14px 0; transition: all 0.3s; }
.navbar.scrolled { background: rgba(247,245,240,0.95); backdrop-filter: blur(12px); box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 10px 0; }
.nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
.nav-logo { font-family: 'Noto Serif SC', serif; font-weight: 700; font-size: 1.15rem; }
.nav-links { display: flex; gap: 28px; }
.nav-links a { font-size: 0.88rem; color: var(--text-dim); font-weight: 500; }
.navbar:not(.scrolled) .nav-logo { color: #fff; }
.navbar:not(.scrolled) .nav-links a { color: rgba(255,255,255,0.7); }
.navbar:not(.scrolled) .nav-links a:hover { color: #fff; }
.nav-cta { background: var(--primary) !important; color: #fff !important; padding: 8px 20px; border-radius: 25px; }

.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%); text-align: center; color: #fff; padding: 80px 24px; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.bagua-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 1px solid rgba(201,168,76,0.06); border-radius: 50%; }
.hero-content { position: relative; z-index: 1; }
.hero-symbol { font-size: 4rem; margin-bottom: 16px; opacity: 0.9; }
.hero-title { font-family: 'Noto Serif SC', serif; font-size: 4rem; font-weight: 900; letter-spacing: 8px; margin-bottom: 12px; background: linear-gradient(135deg, var(--gold-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { font-size: 1.1rem; color: rgba(201,168,76,0.8); margin-bottom: 20px; letter-spacing: 4px; font-weight: 300; }
.hero-desc { color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.8; margin-bottom: 36px; max-width: 500px; margin-left: auto; margin-right: auto; }
.hero-btn { display: inline-block; background: linear-gradient(135deg, var(--gold), var(--gold-light)); color: var(--primary); padding: 14px 40px; border-radius: 30px; font-weight: 700; font-size: 1.05rem; transition: all 0.3s; box-shadow: 0 4px 20px rgba(201,168,76,0.3); }
.hero-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(201,168,76,0.4); }

.section { padding: 80px 24px; }
.section-alt { background: var(--bg-alt); }
.container { max-width: 1100px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-tag { display: inline-block; background: rgba(201,168,76,0.1); color: var(--gold); padding: 5px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; margin-bottom: 12px; border: 1px solid rgba(201,168,76,0.15); }
.section-title { font-family: 'Noto Serif SC', serif; font-size: 2rem; font-weight: 700; color: var(--primary); letter-spacing: 2px; }

.intro-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.intro-card { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); transition: all 0.3s; }
.intro-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
.intro-icon { font-size: 2rem; margin-bottom: 14px; }
.intro-card h3 { font-family: 'Noto Serif SC', serif; font-size: 1.1rem; margin-bottom: 10px; }
.intro-card p { color: var(--text-dim); font-size: 0.88rem; line-height: 1.8; }

.paipan-panel { max-width: 900px; margin: 0 auto; }

.input-form { background: #fff; border-radius: var(--radius); padding: 32px; box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 32px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.form-group { flex: 1; min-width: 120px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-dim); }
.form-group input, .form-group select {
  width: 100%; padding: 10px 14px; border: 2px solid var(--border); border-radius: 10px;
  font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.3s; background: var(--bg);
}
.form-group input:focus, .form-group select:focus { border-color: var(--gold); }

.gender-btns { display: flex; gap: 10px; }
.gender-btn {
  flex: 1; padding: 10px; border-radius: 10px; border: 2px solid var(--border);
  background: var(--bg); cursor: pointer; font-size: 0.95rem; font-family: inherit;
  transition: all 0.3s; font-weight: 500;
}
.gender-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.submit-btn {
  width: 100%; padding: 16px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: var(--gold-light); font-size: 1.1rem; font-weight: 700;
  font-family: 'Noto Serif SC', serif; cursor: pointer;
  transition: all 0.3s; letter-spacing: 4px;
  box-shadow: 0 4px 20px rgba(26,26,46,0.2);
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(26,26,46,0.3); }

/* Result */
.result-area { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active { animation: fadeIn 0.5s ease; }

.basic-info {
  display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
}
.info-item {
  flex: 1; min-width: 120px; background: #fff; border-radius: 12px; padding: 16px;
  box-shadow: var(--shadow); border: 1px solid var(--border); text-align: center;
}
.info-label { display: block; font-size: 0.78rem; color: var(--text-dim); margin-bottom: 4px; }
.info-value { font-family: 'Noto Serif SC', serif; font-size: 1.2rem; font-weight: 700; }
.info-value.strong { color: var(--red); }
.info-value.weak { color: var(--blue); }
.day-master { color: var(--gold); }

.sizhu { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 24px; }
.sizhu-title { font-family: 'Noto Serif SC', serif; font-size: 1.15rem; font-weight: 700; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--gold); }

.sizhu-table { width: 100%; }
.sizhu-header { display: grid; grid-template-columns: 60px repeat(4, 1fr); text-align: center; margin-bottom: 8px; }
.sizhu-header span { font-size: 0.82rem; color: var(--text-dim); font-weight: 600; }
.sizhu-row { display: grid; grid-template-columns: 60px repeat(4, 1fr); text-align: center; margin-bottom: 4px; }
.row-label { font-size: 0.8rem; color: var(--text-dim); display: flex; align-items: center; justify-content: center; }
.sizhu-cell {
  padding: 12px 8px; border-radius: 10px; margin: 2px;
  font-family: 'Noto Serif SC', serif; font-size: 1.3rem; font-weight: 700;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.sizhu-cell.gan { background: rgba(201,168,76,0.08); }
.sizhu-cell.zhi { background: rgba(58,107,140,0.08); }
.sizhu-cell.ss { font-size: 0.85rem; font-weight: 500; background: rgba(181,69,58,0.06); }
.cell-sub { font-size: 0.7rem; font-weight: 400; color: var(--text-dim); }
.shishen-row .sizhu-cell:first-child { background: none; }

.wuxing-section { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 24px; }
.wx-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.wx-label { width: 28px; font-family: 'Noto Serif SC', serif; font-weight: 700; font-size: 1rem; text-align: center; }
.wx-track { flex: 1; height: 20px; background: var(--bg); border-radius: 10px; overflow: hidden; }
.wx-fill { height: 100%; border-radius: 10px; transition: width 0.5s ease; }
.wx-fill.金 { background: linear-gradient(90deg, #d4a853, #f0d68a); }
.wx-fill.木 { background: linear-gradient(90deg, #4a8c5c, #6abf7b); }
.wx-fill.水 { background: linear-gradient(90deg, #3a6b8c, #5a9bbc); }
.wx-fill.火 { background: linear-gradient(90deg, #b5453a, #d4655a); }
.wx-fill.土 { background: linear-gradient(90deg, #8b7355, #a8936f); }
.wx-count { font-size: 0.8rem; color: var(--text-dim); width: 36px; }
.wx-strength { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 8px; width: 32px; text-align: center; }
.wx-strength.旺 { background: rgba(181,69,58,0.1); color: var(--red); }
.wx-strength.相 { background: rgba(201,168,76,0.1); color: var(--gold); }
.wx-strength.平 { background: rgba(136,136,136,0.1); color: var(--text-dim); }
.wx-strength.弱 { background: rgba(58,107,140,0.1); color: var(--blue); }

.day-master-desc { margin-top: 16px; padding: 14px; background: var(--bg); border-radius: 10px; font-size: 0.9rem; line-height: 1.8; color: var(--text); }

.dayun-section { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 24px; }
.dayun-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.dayun-card {
  text-align: center; padding: 14px 8px; border-radius: 10px; border: 2px solid var(--border);
  transition: all 0.3s; position: relative;
}
.dayun-card:hover { border-color: var(--gold); }
.dayun-card.current { border-color: var(--gold); background: rgba(201,168,76,0.05); }
.dy-age { font-size: 0.72rem; color: var(--text-dim); margin-bottom: 4px; }
.dy-gz { font-family: 'Noto Serif SC', serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 2px; }
.dy-wx { font-size: 0.78rem; color: var(--text-dim); margin-bottom: 4px; }
.dy-year { font-size: 0.7rem; color: var(--text-dimmer); }
.dy-current-badge { position: absolute; top: -8px; right: -8px; background: var(--gold); color: #fff; font-size: 0.65rem; padding: 2px 8px; border-radius: 8px; font-weight: 600; }

.fortune-section { background: #fff; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); }
.fortune-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.fortune-card { padding: 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg); }
.fortune-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.fortune-icon { font-size: 1.3rem; }
.fortune-name { font-weight: 600; font-size: 0.95rem; flex: 1; }
.fortune-score { font-weight: 700; font-size: 0.9rem; padding: 2px 10px; border-radius: 8px; }
.fortune-score.good { background: rgba(74,140,92,0.1); color: var(--green); }
.fortune-score.mid { background: rgba(201,168,76,0.1); color: var(--gold); }
.fortune-score.low { background: rgba(181,69,58,0.1); color: var(--red); }
.fortune-desc { font-size: 0.88rem; color: var(--text-dim); line-height: 1.7; }

.footer { text-align: center; padding: 40px 24px; border-top: 1px solid var(--border); color: var(--text-dim); font-size: 0.85rem; }
.footer-sub { margin-top: 6px; font-size: 0.78rem; opacity: 0.6; }

@media (max-width: 768px) {
  .hero-title { font-size: 2.8rem; }
  .intro-grid { grid-template-columns: repeat(2, 1fr); }
  .dayun-grid { grid-template-columns: repeat(2, 1fr); }
  .fortune-grid { grid-template-columns: 1fr; }
  .sizhu-cell { font-size: 1rem; padding: 8px 4px; }
  .nav-links a:not(.nav-cta) { display: none; }
  .section-title { font-size: 1.6rem; }
}
</style>

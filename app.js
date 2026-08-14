const icon = (name, className = "") => `<svg class="icon ${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
const figmaAsset = name => `assets/figma/${name}`;

const pageIds = ["ai", "work", "skills", "api", "schedule"];
const initialPage = pageIds.includes(window.location.hash.slice(1))
  ? window.location.hash.slice(1)
  : "ai";
const composerProjectStorageKey = "robowork.lastComposerProjectId";
const defaultComposerProjectId = 1;

function readLastComposerProjectId() {
  try {
    const projectId = Number(window.localStorage.getItem(composerProjectStorageKey));
    return Number.isFinite(projectId) && projectId > 0 ? projectId : defaultComposerProjectId;
  } catch {
    return defaultComposerProjectId;
  }
}

function readChatGptLoginState() {
  try {
    return window.localStorage.getItem("robowork.chatgpt.loggedIn") === "true";
  } catch {
    return false;
  }
}

const appState = {
  page: initialPage,
  skillTab: "推荐",
  libraryTab: "系统内置",
  librarySearch: "",
  selectedEndpoint: "API目录与集合",
  scheduleFilter: "全部",
  scheduleSearch: "",
  scheduleModal: false,
  editingScheduleId: null,
  scheduleDraft: null,
  scheduleSkillPickerOpen: false,
  scheduleModelPickerOpen: false,
  projectDialogMode: null,
  editingProjectId: null,
  projectDraft: null,
  projectMenu: null,
  taskMenu: null,
  taskDialogMode: null,
  editingTask: null,
  taskDraftName: "",
  projectPickerOpen: false,
  composerProjectId: readLastComposerProjectId(),
  createProjectFromPicker: false,
  composerText: "",
  composerSkillPickerOpen: false,
  composerModelPickerOpen: false,
  selectedComposerSkills: [],
  selectedComposerModel: { category: "Claude", name: "Ultimate" },
  chatGptLoggedIn: readChatGptLoginState(),
  workConversationStage: "home",
  workConversationTitle: "",
  workQuestion: "",
  workThinkingExpanded: true,
  workThinkingStepsExpanded: [],
  workThinkingProgress: 0,
  workThinkingElapsed: 0,
  workAnswerProgress: 0,
  workPanel: null,
  selectedArtifact: 6,
  openedArtifactTabs: [],
  artifactEditDraft: null,
  knowledgeArtifacts: [],
  selectedReference: 0,
  openedReferenceTabs: [],
  workbenchTab: "综合",
  sidebarCollapsed: false,
  mobileSidebar: false,
  moduleQaOpen: false,
  moduleQaMessages: [],
  moduleQaSidebarWasCollapsed: null,
  moduleQaWidth: 420,
  conversationPanelWidth: null,
  conversationPanelListWidth: 380,
};

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
})[character]);

const aiHistory = [
  "比亚迪最新财报解读",
  "特朗普最新关税政策影响哪...",
  "哪些A股AI公司在24年Q4的...",
  "最新PMI是多少",
  "英伟达主题领涨股票有哪些",
  "动力电池装机量，各类型动...",
  "新能源汽车行业走势",
  "2025年预计会有几次降息,...",
  "资金矿业为什么上涨这么多",
  "美国4月失业率多少",
];

const workArtifacts = [
  { name: "会议纪要录制工具.html", type: "HTML", size: "184 KB", color: "#f05a42" },
  { name: "本周人工智能医疗数据.xlsx", type: "XLSX", size: "2.4 MB", color: "#20a464" },
  { name: "人工智能医疗大会.pptx", type: "PPTX", size: "12.8 MB", color: "#ed6b3b" },
  { name: "人工智能医疗会场照片.png", type: "PNG", size: "3.6 MB", color: "#f0ad24" },
  { name: "人工智能医疗机器人.png", type: "PNG", size: "2.9 MB", color: "#f0ad24" },
  { name: "人工智能医疗大会宣讲稿.word", type: "WORD", size: "1.1 MB", color: "#438be0" },
  { name: "2026年人工智能医疗市场规模分析.pdf", type: "PDF", size: "6.8 MB", color: "#ef5350" },
  { name: "人工智能医疗市场规模分析.md", type: "MD", size: "42 KB", color: "#4b83db" },
];

const workReferences = [
  { type: "资讯", title: "解析宁德时代年报，看看它为什么能够成为新能源的引领者？", source: "雪球", date: "05-28   14:35", color: "orange" },
  { type: "研报", title: "港股周观点：冲突升级，港股承压", source: "国泰君安期货", date: "今天", color: "blue", meta: "刘威  尤鑫   买入   30页   下载" },
  { type: "图表", title: "比亚迪：2025年度报告", source: "雪球", date: "05-28   14:35", color: "purple" },
  { type: "纪要", title: "300992重大变更，停牌！", source: "雪球", date: "05-28   14:35", color: "cyan" },
  { type: "纪要", title: "携程（TCOM）：中国监管机构开出创纪录反垄断罚单", source: "汇丰银行", date: "2026-07-27", color: "cyan" },
];

const thinkingSources = [
  ["2026年全球及中国人工智能市场规模预测分析(图)", "中商情报网 · 新闻 · 2026-03-14"],
  ["新年特稿 | 2026人工智能产业发展形势展望", "腾讯网 · 新闻 · 2026-01-03"],
  ["2026年人工智能赋能生物制造研究(附下载)", "report88 · 新闻 · 2026-04-27"],
  ["全球算力共振，AIDC大时代", "国盛证券 · 研报 · 2026-05-25"],
  ["2026“人工智能+”行业发展蓝皮书", "上海交通大学 · 研报 · 2026-04-24"],
  ["2026年A股年度策略报告：心有猛虎，细嗅蔷薇", "金圆统一证券 · 研报 · 2026-01-04"],
];

const thinkingReferenceStartIndex = workReferences.length;
workReferences.push(...thinkingSources.map(([title, meta]) => {
  const [source, sourceType, date] = meta.split(" · ");
  const type = sourceType === "新闻" ? "资讯" : sourceType;
  return { title, source, type, date, color: type === "研报" ? "blue" : "orange" };
}));

let workConversationTimers = [];

let projectGroups = [
  { id: 1, name: "会议纪要", description: "会议录音、纪要与观点归档", files: ["总结国金金属策略会主...", "长江金工量化策略会主..."], pinned: false, expanded: true },
  { id: 2, name: "海外研报", description: "海外机构研报与宏观材料", files: ["高盛对新能源汽车的观点...", "JPMorgan宏观研究报告"], pinned: false, expanded: true },
  { id: 3, name: "贵州茅台", description: "公司跟踪与估值研究", files: [], pinned: false, expanded: true },
  { id: 4, name: "深度研究", description: "行业与公司深度研究项目", files: [], pinned: false, expanded: true },
  { id: 5, name: "数据异动提醒", description: "市场与自选数据异动监控", files: [], pinned: false, expanded: true },
  { id: 6, name: "每日投资早报", description: "每日市场信息与早报交付", files: [], pinned: false, expanded: true },
];

const orderedProjects = () => [...projectGroups].sort((a, b) => Number(b.pinned) - Number(a.pinned));
const orderedProjectFiles = project => project.files
  .map((name, index) => ({ name, index, pinned: (project.pinnedFiles || []).includes(name) }))
  .sort((a, b) => Number(b.pinned) - Number(a.pinned));

function rememberComposerProject(id) {
  const fallbackId = projectGroups.find(project => project.id === defaultComposerProjectId)?.id
    ?? orderedProjects()[0]?.id
    ?? null;
  const nextId = projectGroups.some(project => project.id === Number(id)) ? Number(id) : fallbackId;
  appState.composerProjectId = nextId;
  try {
    if (nextId === null) window.localStorage.removeItem(composerProjectStorageKey);
    else window.localStorage.setItem(composerProjectStorageKey, String(nextId));
  } catch {
    // The in-memory selection still works when browser storage is unavailable.
  }
  return nextId;
}

rememberComposerProject(appState.composerProjectId);

const aiSkills = [
  { title: "DeepResearch", desc: "深度研报写作助手", asset: "skill-deep.svg", color: "#534dff", bg: "#eef2ff", badge: "Pro" },
  { title: "公司一页纸", desc: "快速掌握公司基本面", asset: "skill-company.svg", color: "#4477ee", bg: "#eff6ff", badge: "Hot", hot: true },
  { title: "行业一页纸", desc: "3分钟上手新行业", asset: "skill-industry.svg", color: "#e2a300", bg: "#fffbeb" },
  { title: "自选监控", desc: "实时追踪自选异动", asset: "skill-watch.svg", color: "#0ab483", bg: "#ecfdf5" },
  { title: "画图", desc: "AI图像生成", asset: "skill-image.svg", color: "#ff4fa0", bg: "#fdf2f8" },
  { title: "翻译助手", desc: "专业多语言翻译", asset: "skill-translate.svg", color: "#17a7e6", bg: "#f0f9ff" },
  { title: "会议助手", desc: "语音转文字与纪要", asset: "skill-meeting.svg", color: "#8f5aff", bg: "#f5f3ff" },
  { title: "PPT生成", desc: "一键生成路演演示文稿", asset: "skill-ppt.svg", color: "#ff741f", bg: "#fff7ed" },
  { title: "财务助手", desc: "智能财务分析专家", asset: "skill-finance.svg", color: "#08a99f", bg: "#f0fdfa" },
];

const workSkills = [
  { title: "Deep Research", desc: "深度研报写作助手", asset: "skill-deep.svg", color: "#534dff", bg: "#eef2ff" },
  { title: "估值模型", desc: "DCF/PE/PB 多维估值", asset: "skill-value.png", color: "#ff7626", bg: "#fff7ed" },
  { title: "产业链卡点", desc: "上下游关键环节识别", asset: "skill-chain.png", color: "#13a9f0", bg: "#f0f9ff" },
  { title: "公司一页纸", desc: "核心要素极简呈现", asset: "skill-company.svg", color: "#4177ef", bg: "#eff6ff" },
];

const workModelOptions = [
  {
    category: "Claude",
    models: ["Ultimate", "Deepseek v4 Pro", "Deepseek v4 Flash", "GLM-5.2", "Doubao Seed 2.1 Pro"],
  },
  {
    category: "RoboCore",
    models: ["Ultimate", "Deepseek v4 Pro", "Deepseek v4 Flash", "GLM-5.2", "Doubao Seed 2.1 Pro"],
  },
  {
    category: "Codex",
    models: ["均衡版", "ChatGPT订阅", "自定义配置"],
  },
];

const scheduleSkillOptions = [
  { name: "投资早报", icon: "book", color: "#4f57ee", bg: "#eef0ff" },
  { name: "深度报告", icon: "book", color: "#7a52e8", bg: "#f2edff" },
  { name: "自选监控", icon: "eye", color: "#0a9e79", bg: "#e9f9f3" },
  { name: "公司一页纸", icon: "chart", color: "#3971e3", bg: "#edf4ff" },
  { name: "数据核查", icon: "check", color: "#5a8b34", bg: "#edf6e5" },
  { name: "估值模型", icon: "chart", color: "#f07432", bg: "#fff1e8" },
];

let scheduleTasks = [
  { id: 1, name: "每日投资早报", description: "汇总隔夜市场、宏观事件与今日关注，生成机构版投资早报。", frequency: "工作日", time: "07:30", weekdays: ["一", "二", "三", "四", "五"], dayOfMonth: "1", date: "2026-08-12", cron: "0 30 7 * * 1-5", timezone: "Asia/Shanghai", project: "每日投资早报", skills: ["投资早报", "数据核查"], schedule: "工作日 07:30", nextRun: "明天 07:30", lastRun: "今天 07:32 · 成功", active: true, status: "正常" },
  { id: 2, name: "自选股异动监控", description: "扫描自选股价格、成交与公告异动，达到阈值时生成摘要。", frequency: "工作日", time: "09:30", weekdays: ["一", "二", "三", "四", "五"], dayOfMonth: "1", date: "2026-08-12", cron: "0 */30 9-15 * * 1-5", timezone: "Asia/Shanghai", project: "数据异动提醒", skills: ["自选监控"], schedule: "工作日 09:30–15:00 / 30分钟", nextRun: "今天 14:30", lastRun: "今天 14:00 · 成功", active: true, status: "正常" },
  { id: 3, name: "周度组合复盘", description: "复盘组合收益来源、风险暴露和本周重要交易，输出周报。", frequency: "每周", time: "17:00", weekdays: ["五"], dayOfMonth: "1", date: "2026-08-14", cron: "0 0 17 * * 5", timezone: "Asia/Shanghai", project: "深度研究", skills: ["深度报告", "估值模型"], schedule: "每周五 17:00", nextRun: "周五 17:00", lastRun: "上周五 17:08 · 成功", active: true, status: "正常" },
  { id: 4, name: "月度宏观数据跟踪", description: "更新主要宏观指标并解释变化，沉淀到海外研报项目。", frequency: "每月", time: "10:00", weekdays: ["一"], dayOfMonth: "9", date: "2026-09-09", cron: "0 0 10 9 * *", timezone: "Asia/Shanghai", project: "海外研报", skills: ["深度报告"], schedule: "每月 9 日 10:00", nextRun: "9月9日 10:00", lastRun: "7月9日 10:06 · 成功", active: false, status: "已暂停" },
  { id: 5, name: "重点公司财报跟踪", description: "抓取重点公司新披露财报，生成一页纸并核查核心指标。", frequency: "每天", time: "20:00", weekdays: ["一", "二", "三", "四", "五", "六", "日"], dayOfMonth: "1", date: "2026-08-12", cron: "0 0 20 * * *", timezone: "Asia/Shanghai", project: "深度研究", skills: ["公司一页纸", "数据核查"], schedule: "每天 20:00", nextRun: "等待重试", lastRun: "昨天 20:02 · 数据源异常", active: true, status: "异常" },
];

function createScheduleDraft() {
  return { name: "", description: "", frequency: "每周", time: "07:30", times: ["07:30"], weekdays: ["一", "二", "三", "四", "五"], workdaysOnly: false, dayOfMonth: "1", daysOfMonth: ["1"], date: "2026-08-12", cron: "0 30 7 * * 1-5", timezone: "Asia/Shanghai", project: "每日投资早报", skills: [], model: "Claude · Ultimate", attachments: [] };
}

const librarySkills = [
  { name: "深度报告", short: "深度", desc: "深度研究报告生成技能（投研级别，覆盖数据、观点与图表编排）。", views: 1684, calls: 237, color: "#a76666", bg: "#f2dddd" },
  { name: "业务拆解", short: "业务", desc: "为 A 股上市公司生成升级版业务拆解，输出结构化业务图谱。", views: 1126, calls: 126, color: "#a55f66", bg: "#f2dcdf" },
  { name: "产业链卡点", short: "产业", desc: "产业链卡点识别，让投资智能体快速定位关键供需环节。", views: 806, calls: 61, color: "#416aa8", bg: "#dfe9f7" },
  { name: "公司一页纸", short: "公司", desc: "生成 A股、港股和美股公司的买方视角公司一页纸报告。", views: 1398, calls: 130, color: "#5b8d38", bg: "#dfeecd", version: "v1.2.13" },
  { name: "行业一页纸", short: "行业", desc: "Create or refine an institutional-grade industry or theme one-pager.", views: 694, calls: 45, color: "#9f4c77", bg: "#efd8e6" },
  { name: "基金一页纸", short: "基金", desc: "Generate market-facing public mutual fund one-pagers and product cards.", views: 623, calls: 40, color: "#a15b5f", bg: "#f0dada" },
  { name: "业务变量预测", short: "业务", desc: "输入宏观、行业或产业链指标名称，建立可复用预测框架。", views: 178, calls: 9, color: "#9b4f73", bg: "#efd8e4" },
  { name: "股票技术分析", short: "股票", desc: "输入 A 股代码或名称，抓取行情并完成技术指标综合评分。", views: 742, calls: 54, color: "#416c9e", bg: "#dce8f3" },
  { name: "数据核查", short: "数据", desc: "上传报告、Excel 或文本，多源比对并生成可追溯核查表。", views: 518, calls: 36, color: "#638e39", bg: "#e0edcf" },
  { name: "萝卜PPT助手", short: "萝卜", desc: "研报级幻灯片生成器，将投研内容做成高质量演示文稿。", views: 1512, calls: 138, color: "#a05a61", bg: "#f0dadd" },
  { name: "估值模型", short: "估值", desc: "业务拆解、三表预测、DCF 与相对估值的一体化估值工作流。", views: 1207, calls: 111, color: "#9c5d61", bg: "#f0dcde" },
];

const maxSkillViews = Math.max(...librarySkills.map(skill => Math.max(0, Number(skill.views) || 0)), 1);
const maxSkillCalls = Math.max(...librarySkills.map(skill => Math.max(0, Number(skill.calls) || 0)), 1);
function skillActivityScore(skill) {
  const views = Math.max(0, Number(skill.views) || 0);
  const calls = Math.max(0, Number(skill.calls) || 0);
  if (!views && !calls) return 0;
  const viewSignal = Math.log1p(views) / Math.log1p(maxSkillViews);
  const callSignal = Math.log1p(calls) / Math.log1p(maxSkillCalls);
  return viewSignal * 0.35 + callSignal * 0.65;
}
const skillActivityScores = librarySkills.map(skillActivityScore).filter(score => score > 0);
const minSkillActivity = skillActivityScores.length ? Math.min(...skillActivityScores) : 0;
const maxSkillActivity = skillActivityScores.length ? Math.max(...skillActivityScores) : 1;
function skillHeatLevel(skill) {
  const score = skillActivityScore(skill);
  if (!score) return 0;
  const normalized = (score - minSkillActivity) / Math.max(maxSkillActivity - minSkillActivity, Number.EPSILON);
  return Math.max(1, Math.min(5, 1 + Math.round(normalized * 4)));
}

const apiCategories = [
  { name: "API集合", count: 3, endpoints: ["API目录与集合", "API信息", "API搜索"] },
  { name: "通用API", count: 9, endpoints: ["交易日历", "证券基础信息"] },
  { name: "AI搜索", count: 7, endpoints: ["语义搜索", "智能摘要"] },
  { name: "行情数据API", count: 16, endpoints: ["实时行情", "历史K线"] },
  { name: "A股个股API", count: 49, endpoints: ["公司资料", "财务指标"] },
  { name: "投研线索API", count: 42, endpoints: ["研报检索", "公告事件"] },
  { name: "宏观行业指标", count: 4, endpoints: ["宏观指标"] },
  { name: "指数数据", count: 3, endpoints: ["指数行情"] },
  { name: "港股数据", count: 4, endpoints: ["港股行情"] },
  { name: "量化因子", count: 56, endpoints: ["因子列表", "因子暴露"] },
  { name: "基金API", count: 46, endpoints: ["基金净值", "基金持仓"] },
  { name: "工具类API", count: 2, endpoints: ["代码转换"] },
];

function topbar() {
  const links = ["首页", "研报", "纪要", "资讯", "数据", "行业", "股票", "债券", "基金", "组合", "AI投研", "更多"];
  return `
    <header class="topbar">
      <div class="topbar-ui">
        <button class="mobile-menu" data-action="toggle-sidebar" aria-label="打开导航">${icon("menu")}</button>
        <div class="brand" aria-label="Datayes pro"><span class="brand-main">Data<span class="yes">yes!</span></span><span class="brand-pro">pro</span></div>
        <nav class="topnav" aria-label="主导航">
          ${links.map((link, i) => `<a class="${link === "AI投研" ? "active" : ""}" href="#" data-action="top-link">${link}${[2,8,9].includes(i) ? `<span class="nav-badge">${i === 2 ? "Beta" : "New"}</span>` : ""}</a>`).join("")}
        </nav>
        <div class="top-actions">
          <button class="legacy" data-action="toast" data-message="已保留旧版入口">返回旧版</button>
          <button class="round-action back" data-action="toast" data-message="已返回上一步" aria-label="返回">${icon("undo")}</button>
          <button class="round-action document" data-action="toast" data-message="暂无待处理消息" aria-label="消息">${icon("edit")}</button>
          <button class="avatar" data-action="toast" data-message="当前版本：投研版" aria-label="用户中心"><span class="avatar-core" aria-hidden="true"></span><span class="avatar-version">投研版</span></button>
        </div>
      </div>
    </header>`;
}

function sidebar() {
  const isAI = appState.page === "ai";
  const isWork = !isAI;
  return `
    <aside class="sidebar ${appState.mobileSidebar ? "open" : ""}">
      <div class="sidebar-brand"><img class="sidebar-brand-art" src="${figmaAsset("datayesir-brand.svg")}" alt="Datayesir" /><button class="collapse" data-action="toggle-sidebar" aria-label="${appState.sidebarCollapsed ? "展开侧栏" : "收起侧栏"}" title="${appState.sidebarCollapsed ? "展开侧栏" : "收起侧栏"}"><img src="${figmaAsset("sidebar-collapse.svg")}" alt="" /></button></div>
      <div class="mode-switch" role="tablist" aria-label="工作模式">
        <button class="mode-button ${isAI ? "active" : ""}" data-page="ai" role="tab" aria-selected="${isAI}">AI问答</button>
        <button class="mode-button ${isWork ? "active" : ""}" data-page="work" role="tab" aria-selected="${isWork}">RoboWork</button>
      </div>
      <button class="new-button ${isAI ? "" : "work"}" data-action="new-task"><img class="new-asset" src="${figmaAsset(isAI ? "new-ai.png" : "new-work.png")}" alt="" />${isAI ? "新会话" : "新任务"}</button>
      <div class="sidebar-scroll">${isAI ? aiSidebarContent() : workSidebarContent()}</div>
      <div class="sidebar-footer"><button class="side-item" data-action="toast" data-message="设置面板已准备"><img class="side-asset" src="${figmaAsset("sidebar-setting.png")}" alt="" /><span>设置</span></button><div class="sidebar-points"><span class="sidebar-points-balance" aria-label="积分 872">${icon("coins")}<span>积分 872</span></span><button class="sidebar-points-refresh" data-action="refresh-points" aria-label="刷新积分" title="刷新积分">${icon("refresh")}</button></div></div>
    </aside>`;
}

function aiSidebarContent() {
  return `
    <div class="side-menu"><button class="side-item" data-action="toast" data-message="知识库已打开"><img class="side-asset" src="${figmaAsset("menu-knowledge.svg")}" alt="" /><span>知识库</span></button></div>
    <section class="side-section">
      <div class="section-head"><span>历史会话</span><button class="text-button" data-action="toast" data-message="已显示全部历史">全部</button></div>
      <div class="history-list">${aiHistory.map((item, i) => `<div class="history-item ${i === 0 ? "active" : ""}" data-action="history">${item}</div>`).join("")}</div>
    </section>`;
}

function workSidebarContent() {
  const items = [
    ["api", "menu-api.svg", "API数据"],
    ["skills", "menu-skills.svg", "技能中心"],
    ["schedule", "menu-schedule.svg", "定时任务"],
    ["knowledge", "menu-knowledge.svg", "知识库"],
  ];
  return `
    <div class="side-menu">${items.map(([page, assetName, label]) => `<button class="side-item ${appState.page === page ? "active" : ""}" ${["api","skills","schedule"].includes(page) ? `data-page="${page}"` : `data-action="toast" data-message="${label}原型入口已准备"`}><img class="side-asset" src="${figmaAsset(assetName)}" alt="" /><span>${label}</span></button>`).join("")}</div>
    <section class="side-section project-section">
      <div class="section-head"><span>项目</span><button class="text-button" data-action="new-project" aria-label="新建项目"><img src="${figmaAsset("sidebar-folder-new.svg")}" alt="" /></button></div>
      <div class="project-list">${orderedProjects().map(group => `<div class="project-group ${group.pinned ? "pinned" : ""} ${group.expanded === false ? "collapsed" : ""}" data-project-id="${group.id}"><div class="project-row"><button class="project-title" data-action="project" data-id="${group.id}" title="${escapeHtml(group.description)}" aria-expanded="${group.expanded !== false}"${group.files.length ? ` aria-controls="project-files-${group.id}"` : ""}><img class="side-asset" src="${figmaAsset("sidebar-folder.svg")}" alt="" /><span>${escapeHtml(group.name)}</span>${group.pinned ? `<i class="project-pin" aria-label="已置顶">置顶</i>` : ""}</button><button class="project-more" data-action="toggle-project-menu" data-id="${group.id}" aria-label="${escapeHtml(group.name)}更多操作" aria-expanded="${appState.projectMenu?.id === group.id}">${icon("more")}</button></div>${group.files.length ? `<div class="project-files" id="project-files-${group.id}">${orderedProjectFiles(group).map(file => `<div class="project-file-row ${file.pinned ? "is-pinned" : ""}">${file.pinned ? `<span class="project-task-pin" aria-label="已置顶" title="已置顶">${icon("pin")}</span>` : ""}<button class="project-file" data-action="open-project-task" data-project-id="${group.id}" data-file-index="${file.index}" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</button><button class="project-file-more" data-action="toggle-task-menu" data-project-id="${group.id}" data-file-index="${file.index}" aria-label="${escapeHtml(file.name)}更多操作" aria-expanded="${appState.taskMenu?.projectId === group.id && appState.taskMenu?.fileIndex === file.index}">${icon("more")}</button></div>`).join("")}</div>` : ""}</div>`).join("")}</div>
    </section>`;
}

function quickCards(items) {
  return items.map(item => {
    const workSelectable = appState.page === "work";
    const selected = workSelectable && appState.selectedComposerSkills.includes(item.title);
    return `
    <button class="quick-card ${selected ? "selected" : ""}" data-action="select-skill" data-skill="${escapeHtml(item.title)}"${workSelectable ? ` aria-pressed="${selected}"` : ""}>
      <span class="quick-icon" style="--card-color:${item.color};--card-bg:${item.bg}"><img src="${figmaAsset(item.asset)}" alt="" /></span>
      <span class="quick-copy"><span class="quick-title">${escapeHtml(item.title)}${item.badge ? `<span class="card-badge ${item.hot ? "hot" : ""}">${escapeHtml(item.badge)}</span>` : ""}</span><span class="quick-desc">${escapeHtml(item.desc)}</span></span>
      ${selected ? `<span class="quick-selected-mark" aria-hidden="true">${icon("check")}</span>` : ""}
    </button>`;
  }).join("");
}

function validWorkModel(model) {
  const { category, name } = model || {};
  const modelCategory = workModelOptions.find(option => option.category === category);
  if (modelCategory?.models.includes(name)) return { category, name };
  return { category: "Claude", name: "Ultimate" };
}

function selectedWorkModel() {
  return validWorkModel(appState.selectedComposerModel);
}

function selectedScheduleModel() {
  const [category, name] = String(appState.scheduleDraft?.model || "").split(/\s*·\s*/);
  return validWorkModel({ category, name });
}

function selectedComposerSkillEntries() {
  return appState.selectedComposerSkills
    .map(name => {
      const librarySkill = librarySkills.find(skill => skill.name === name);
      if (librarySkill) return librarySkill;
      const quickSkill = [...workSkills, ...aiSkills].find(skill => skill.title === name);
      return quickSkill ? { ...quickSkill, name: quickSkill.title } : null;
    })
    .filter(Boolean);
}

function composerSkillChips() {
  const skills = selectedComposerSkillEntries();
  if (!skills.length) return "";
  return `<div class="composer-context-chips" aria-label="已选择技能">${skills.map(skill => `<span class="composer-context-chip"><span>@${escapeHtml(skill.name)}</span><button data-action="remove-composer-skill" data-composer-skill="${escapeHtml(skill.name)}" aria-label="移除${escapeHtml(skill.name)}">${icon("x")}</button></span>`).join("")}</div>`;
}

function workSkillPicker({ conversation = false, schedule = false } = {}) {
  const context = schedule ? "schedule" : "composer";
  const pickerOpen = schedule ? appState.scheduleSkillPickerOpen : appState.composerSkillPickerOpen;
  const selectedSkills = schedule ? (appState.scheduleDraft?.skills || []) : appState.selectedComposerSkills;
  const availableSkills = schedule ? scheduleSkillOptions : librarySkills;
  const triggerClass = conversation ? "conversation-tool-button" : "composer-control work-skill-control";
  const toggleAction = schedule ? "toggle-schedule-skill-picker" : "toggle-composer-skill-picker";
  const searchId = `${context}-skill-search`;
  const options = availableSkills.map(skill => {
    const selected = selectedSkills.includes(skill.name);
    const dataAttribute = schedule ? `data-schedule-skill="${escapeHtml(skill.name)}"` : `data-composer-skill="${escapeHtml(skill.name)}"`;
    return `<button class="composer-skill-option ${selected ? "selected" : ""}" ${dataAttribute} role="menuitemcheckbox" aria-checked="${selected}"><span class="composer-skill-icon" style="--skill-color:${skill.color};--skill-bg:${skill.bg}">${escapeHtml(skill.short || skill.name.slice(0, 2))}</span><span>${escapeHtml(skill.name)}</span><span class="composer-option-check">${selected ? icon("check") : ""}</span></button>`;
  }).join("");
  const menu = pickerOpen ? `
    <div class="composer-picker-menu composer-skill-menu" role="dialog" aria-label="选择技能">
      <label class="composer-skill-search" for="${searchId}">
        ${icon("search")}
        <input id="${searchId}" type="search" placeholder="搜索技能" autocomplete="off" aria-label="搜索技能" />
      </label>
      <div class="composer-skill-options" role="menu" aria-label="技能列表">
        ${options}
        <div class="composer-skill-empty" hidden>未找到相关技能</div>
      </div>
      <button class="composer-skill-create" data-action="create-skill" data-skill-context="${context}">${icon("plus")}<span>创建技能</span></button>
    </div>` : "";
  return `<div class="composer-picker composer-skill-picker ${schedule ? "schedule-skill-picker" : ""}"><button class="${triggerClass}" data-action="${toggleAction}" aria-haspopup="dialog" aria-expanded="${pickerOpen}"><span class="work-skill-label">@技能</span></button>${menu}</div>`;
}

function workModelPicker({ conversation = false, schedule = false } = {}) {
  const selectedModel = schedule ? selectedScheduleModel() : selectedWorkModel();
  const pickerOpen = schedule ? appState.scheduleModelPickerOpen : appState.composerModelPickerOpen;
  const triggerClass = conversation ? "conversation-model" : "composer-control model-control";
  const chevron = conversation ? icon("chevron") : `<img class="chevron" src="${figmaAsset("composer-chevron-work.svg")}" alt="" />`;
  const toggleAction = schedule ? "toggle-schedule-model-picker" : "toggle-composer-model-picker";
  const groups = workModelOptions.map(group => `
    <section class="composer-model-group" aria-label="${escapeHtml(group.category)}">
      <h3>${escapeHtml(group.category)}</h3>
      ${group.models.map(name => {
        const selected = selectedModel.category === group.category && selectedModel.name === name;
        const loginStatus = name === "ChatGPT订阅" ? (appState.chatGptLoggedIn ? "已登录" : "未登录") : "";
        return `<button class="composer-model-option ${selected ? "selected" : ""}" data-model-category="${escapeHtml(group.category)}" data-model-name="${escapeHtml(name)}" data-model-context="${schedule ? "schedule" : "composer"}" role="menuitemradio" aria-checked="${selected}"><span>${escapeHtml(name)}</span><span class="model-login-status ${loginStatus ? "visible" : ""}">${loginStatus}</span><span class="composer-option-check">${selected ? icon("check") : ""}</span></button>`;
      }).join("")}
    </section>`).join("");
  return `<div class="composer-picker composer-model-picker ${schedule ? "schedule-model-picker" : ""}"><button class="${triggerClass}" data-action="${toggleAction}" aria-haspopup="menu" aria-expanded="${pickerOpen}"><span class="composer-model-label">${escapeHtml(selectedModel.category)}<span class="muted-model">·${escapeHtml(selectedModel.name)}</span></span>${chevron}</button>${pickerOpen ? `<div class="composer-picker-menu composer-model-menu" role="menu" aria-label="选择模型">${groups}</div>` : ""}</div>`;
}

function composer(type) {
  const work = type === "work";
  const selectedProject = projectGroups.find(project => project.id === appState.composerProjectId);
  const projectPickerMenu = appState.projectPickerOpen ? `
    <div class="project-picker-menu" id="composer-project-menu" aria-label="项目文件夹">
      <label class="project-picker-search" for="composer-project-search">
        ${icon("search")}
        <input id="composer-project-search" type="search" placeholder="搜索项目" autocomplete="off" aria-label="按名称搜索项目" />
      </label>
      <div class="project-picker-list" id="composer-project-list" role="listbox" aria-label="可选的项目文件夹">
        ${orderedProjects().map(project => `<button class="project-picker-option ${project.id === appState.composerProjectId ? "active" : ""}" data-action="select-composer-project" data-id="${project.id}" role="option" aria-selected="${project.id === appState.composerProjectId}"><img src="${figmaAsset("sidebar-folder.svg")}" alt="" /><span>${escapeHtml(project.name)}</span>${project.id === appState.composerProjectId ? icon("check") : ""}</button>`).join("")}
        <div class="project-picker-empty" hidden>未找到相关项目</div>
      </div>
      <div class="project-picker-divider" aria-hidden="true"></div>
      <button class="project-picker-option create" data-action="new-project-from-picker">
        <img src="${figmaAsset("sidebar-folder-new.svg")}" alt="" />
        <span>新建项目</span>
      </button>
    </div>` : "";
  const sourceControl = work
    ? workSkillPicker()
    : `<button class="composer-control" data-action="toast" data-message="数据源选择器已打开"><img src="${figmaAsset("composer-source.svg")}" alt="" /><span>数据源</span><img class="chevron" src="${figmaAsset("composer-chevron.svg")}" alt="" /></button>`;
  const modelControl = work
    ? workModelPicker()
    : `<button class="composer-control" data-action="toast" data-message="模型选择器已打开"><img src="${figmaAsset("composer-auto.svg")}" alt="" /><span>Auto</span><img class="chevron" src="${figmaAsset("composer-chevron.svg")}" alt="" /></button><button class="composer-control" data-action="toast" data-message="大模型选择器已打开"><img class="model-mark" src="${figmaAsset("composer-model.svg")}" alt="" /><span>DeepSeek-V3</span><img class="chevron" src="${figmaAsset("composer-chevron.svg")}" alt="" /></button>`;
  const attachControl = `<button class="attach" data-action="toast" data-message="附件选择器已打开" aria-label="添加附件"><img src="${figmaAsset(work ? "composer-attach-work.svg" : "composer-attach.svg")}" alt="" /></button>`;
  const skillChips = work ? composerSkillChips() : "";
  return `
    <div class="composer">
      <img class="composer-surface" src="${figmaAsset(work ? "composer-work.svg" : "composer-ai.svg")}" alt="" aria-hidden="true" />
      <div class="composer-input-area ${skillChips ? "has-context" : ""}">${skillChips}<textarea id="composer-input" aria-label="${work ? "任务描述" : "问题"}" placeholder="${work ? "每一次思考都是价值发现的开始..." : "请输入问题..."}">${escapeHtml(appState.composerText)}</textarea></div>
      <div class="composer-bar">
        ${sourceControl}
        ${work ? attachControl : modelControl}
        <span class="composer-spacer"></span>
        ${work ? modelControl : attachControl}
        <button class="send" data-action="send" aria-label="发送"><img src="${figmaAsset(work ? "send-work.svg" : "send-ai.svg")}" alt="" /></button>
      </div>
    </div>
    ${work ? `<div class="project-access"><div class="project-picker"><button class="project-access-trigger" data-action="toggle-project-picker" aria-haspopup="listbox" aria-controls="composer-project-list" aria-expanded="${appState.projectPickerOpen}"><img src="${figmaAsset("access-project.svg")}" alt="" /><span>${escapeHtml(selectedProject?.name || "选择项目文件夹")}</span></button>${projectPickerMenu}</div><span class="project-access-mode"><img src="${figmaAsset("access-lock.svg")}" alt="" /><span>完全访问</span></span></div>` : ""}`;
}

const citation = number => `<button class="answer-citation" data-action="open-reference" data-reference-index="${Math.max(0, Math.min(workReferences.length - 1, number - 1))}" aria-label="查看引用 ${number}">${number}</button>`;

function workConversationComposer() {
  const skillChips = composerSkillChips();
  return `
    <div class="conversation-composer-wrap ${skillChips ? "has-context" : ""}">
      <div class="conversation-composer ${skillChips ? "has-context" : ""}">
        <div class="conversation-input-area">${skillChips}<textarea id="composer-input" aria-label="任务描述" placeholder="每一次思考都是价值发现的开始…">${escapeHtml(appState.composerText)}</textarea></div>
        <div class="conversation-composer-bar">
          ${workSkillPicker({ conversation: true })}
          <button class="conversation-icon-button" data-action="toast" data-message="附件选择器已打开" aria-label="添加附件">${icon("paperclip")}</button>
          <span></span>
          ${workModelPicker({ conversation: true })}
          <button class="send conversation-send" data-action="send" aria-label="发送"><img src="${figmaAsset("send-work.svg")}" alt="" /></button>
        </div>
      </div>
    </div>`;
}

function workThinkingView() {
  const progress = appState.workThinkingProgress;
  const status = [
    "正在分析问题…",
    "正在检索相关资料…",
    "已找到资料，正在阅读…",
    "正在调用数据工具…",
    "正在整理回答框架…",
  ][progress] || "正在分析问题…";
  const searchComplete = progress >= 2;
  const toolsVisible = progress >= 3;
  const toolsComplete = progress >= 4;
  const frameworkVisible = progress >= 4;
  return `
    <section class="thinking-process" aria-live="polite">
      <div class="thinking-status"><span class="thinking-spinner"></span><div><strong>${status}</strong><small>思考中 · 00:${String(appState.workThinkingElapsed).padStart(2, "0")}</small></div></div>
      <div class="thinking-step ${searchComplete ? "complete" : "active"}">${icon("search")}<span>搜索资料</span><strong>2026年全球人工智能市场规模</strong><em>${searchComplete ? "已完成" : "检索中"}</em></div>
      ${searchComplete ? `<div class="thinking-source-box"><strong>找到 ${thinkingSources.length} 条资料</strong><div>${thinkingSources.map(([title, meta], index) => `<button class="thinking-source-row" data-action="open-reference" data-reference-index="${thinkingReferenceStartIndex + index}" aria-label="在工作台打开${escapeHtml(title)}"><span>${index + 1}. ${escapeHtml(title)}</span><small>${escapeHtml(meta)}</small>${icon("chevron")}</button>`).join("")}</div></div>` : `<div class="thinking-loading-note">正在检索可信新闻与研究报告…</div>`}
      ${toolsVisible ? `<div class="thinking-step ${toolsComplete ? "complete" : "active"}">${icon("wand")}<span>调用数据工具</span><strong>统一市场规模统计口径</strong><em>${toolsComplete ? "已完成" : "处理中"}</em></div><div class="thinking-tool-output ${toolsComplete ? "" : "is-loading"}"><span>${icon("chart")}</span><div><strong>${toolsComplete ? "已完成 3 类市场口径与币种单位对齐" : "正在比对整体 AI、生成式 AI 与 AI 平台口径"}</strong><small>${toolsComplete ? "整体市场、生成式 AI、AI 平台" : "正在校验数据来源与预测年份…"}</small></div>${toolsComplete ? `<em>${icon("check")}</em>` : `<i class="thinking-inline-spinner"></i>`}</div>` : ""}
      ${frameworkVisible ? `<div class="thinking-step active">${icon("wand")}<span>生成回答框架</span><strong>汇总重点结论与引用</strong><em>整理中</em></div>` : ""}
    </section>`;
}

function completedThinkingSteps() {
  const steps = [
    {
      title: "搜索并阅读 6 条资料",
      meta: "已完成",
      detail: `<div class="thinking-step-sources">${thinkingSources.map(([title, meta], index) => `<button data-action="open-reference" data-reference-index="${thinkingReferenceStartIndex + index}" aria-label="在工作台打开${escapeHtml(title)}"><span>${index + 1}. ${escapeHtml(title)}</span><small>${escapeHtml(meta)}</small>${icon("chevron")}</button>`).join("")}</div>`,
    },
    {
      title: "调用 2 个工具",
      meta: "2 次调用",
      detail: `<div class="thinking-step-tools"><div>${icon("search")}<span><strong>搜索工具</strong><small>检索 2026 年全球人工智能市场规模及机构预测</small></span><em>成功</em></div><div>${icon("wand")}<span><strong>数据整理工具</strong><small>统一美元与人民币口径，标注整体市场和细分市场</small></span><em>成功</em></div></div>`,
    },
    {
      title: "完成市场规模口径对比",
      meta: "3 类口径",
      detail: `<div class="thinking-step-comparison"><div><strong>整体 AI 市场</strong><span>覆盖软硬件、服务与基础设施</span></div><div><strong>生成式 AI</strong><span>仅统计生成内容相关产品与服务</span></div><div><strong>AI 平台</strong><span>聚焦开发、训练和部署平台</span></div></div>`,
    },
  ];
  return `<div class="thinking-summary-detail" id="completed-thinking-steps">${steps.map((step, index) => {
    const expanded = appState.workThinkingStepsExpanded.includes(index);
    return `<div class="thinking-summary-step"><button data-action="toggle-thinking-step" data-thinking-step-index="${index}" aria-expanded="${expanded}" aria-controls="thinking-step-detail-${index}"><span class="thinking-step-status">${icon("check")}</span><span class="thinking-step-title">${step.title}</span><small>${step.meta}</small>${icon("chevron")}</button>${expanded ? `<div class="thinking-step-detail" id="thinking-step-detail-${index}">${step.detail}</div>` : ""}</div>`;
  }).join("")}</div>`;
}

function workAnswerView() {
  const progress = appState.workConversationStage === "complete" ? 21 : appState.workAnswerProgress;
  const marketRows = [
    ["Precedence Research", "全球AI整体市场", "~9,000亿美元", 2],
    ["中商产业研究院", "全球AI市场（人民币口径）", "76,878亿元", 1],
    ["Fortune Business Insights", "全球生成式AI市场", "1,610亿美元", 3],
    ["AI平台市场（1000IQ）", "AI平台细分", "~257亿美元（推算）", 4],
  ].slice(0, Math.max(0, Math.min(4, progress - 2)));
  const globalMarketItems = [
    `2024年全球AI市场规模约 6,382亿美元，2025年预计达 7,576亿美元（同比+18.7%） ${citation(4)} ${citation(2)}`,
    `2026年预计突破9,000亿美元，亚太地区仍为全球增速最快区域 ${citation(2)}`,
    `Grand View Research口径下，2025年全球AI市场约 3,909亿美元，预计以 30.6% CAGR 增长，2033年将接近 3.5万亿美元 ${citation(5)}`,
  ].slice(0, Math.max(0, Math.min(3, progress - 9)));
  const generativeItems = [
    `全球生成式AI市场2025年已达 1,035.8亿美元，2026年预计增至 1,610亿美元 ${citation(5)}`,
    `AI Agent细分市场CAGR高达 49.6%，2025年规模约76.3亿美元，预计2033年达 1,829.7亿美元 ${citation(1)}`,
  ].slice(0, Math.max(0, Math.min(2, progress - 13)));
  const chinaItems = [
    `2024年我国AI核心产业规模突破 9,000亿元（同比+24%），2025年预计突破 12,000亿元 ${citation(5)}`,
    `2026年中国AI核心产业规模预计突破1.7万亿元 ${citation(1)}`,
    `截至2025年底，我国AI企业数量超 6,000家 ${citation(3)}`,
    `北美仍为全球最大市场（2025年份额35.5%），但亚太地区增速最快 ${citation(3)}`,
  ].slice(0, Math.max(0, Math.min(4, progress - 16)));
  return `
    <section class="work-answer ${appState.workConversationStage === "streaming" ? "is-streaming" : ""}" aria-live="polite">
      <button class="thinking-summary" data-action="toggle-thinking-summary" aria-expanded="${appState.workThinkingExpanded}" aria-controls="completed-thinking-steps">
        <span>已完成&nbsp; 3m50s</span>${icon("chevron")}
      </button>
      ${appState.workThinkingExpanded ? completedThinkingSteps() : ""}
      ${progress >= 1 ? `<div class="answer-block">${progress >= 1 ? `<h2>2026年全球人工智能市场规模</h2>` : ""}${progress >= 2 ? `<h3>一、总量：多机构预测汇总</h3>` : ""}${marketRows.length ? `<div class="answer-table-wrap"><table><thead><tr><th>来源机构</th><th>口径</th><th>2026E规模</th><th>数据来源</th></tr></thead><tbody>${marketRows.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${citation(row[3])}</td></tr>`).join("")}</tbody></table></div>` : ""}${progress >= 7 ? `<blockquote>不同机构统计口径差异较大（全AI市场 vs 生成式AI vs AI平台），需注意对比时的可比性。</blockquote>` : ""}</div>` : ""}
      ${progress >= 8 ? `<div class="answer-block"><h3>二、核心数据与增长趋势</h3>${progress >= 9 ? `<h4>全球整体AI市场</h4>` : ""}${globalMarketItems.length ? `<ul>${globalMarketItems.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}${progress >= 13 ? `<h4>生成式AI细分高增</h4>` : ""}${generativeItems.length ? `<ul>${generativeItems.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}</div>` : ""}
      ${progress >= 16 ? `<div class="answer-block"><h3>三、中国市场：全球第一梯队</h3>${chinaItems.length ? `<ul>${chinaItems.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}</div>` : ""}
      ${progress >= 21 ? workAnswerArtifacts() : ""}
      ${appState.workConversationStage === "streaming" ? `<span class="stream-caret" aria-hidden="true"></span>` : ""}
    </section>`;
}

function workAnswerArtifacts() {
  return `
    <section class="answer-artifacts">
      <div class="answer-artifacts-head"><div><span class="answer-artifact-symbol">${icon("folder")}</span><strong>产物</strong><small>${workArtifacts.length}</small></div><button data-action="open-artifact-list">全部${icon("chevron")}</button></div>
      <div class="answer-artifact-grid">${workArtifacts.slice(0, 3).map((artifact, index) => `<button class="answer-artifact-item" data-action="open-artifact" data-artifact-index="${index}"><span class="artifact-type" style="--artifact-color:${artifact.color}">${artifact.type.slice(0, 1)}</span><span><strong>${escapeHtml(artifact.name)}</strong><small>${escapeHtml(artifact.size)} · 点击在当前页查看</small></span></button>`).join("")}</div>
    </section>`;
}

function workConversationHeader() {
  const active = appState.workPanel;
  const title = appState.workConversationTitle || "2026年人工智能医疗市场规模研究";
  return `
    <header class="conversation-header">
      <div class="conversation-header-title">
        ${appState.sidebarCollapsed ? `<button class="conversation-sidebar-expand" data-action="expand-sidebar" aria-label="展开侧栏" title="展开侧栏"><img src="${figmaAsset("sidebar-collapse.svg")}" alt="" /></button>` : ""}
        <strong>${escapeHtml(title)}</strong>
      </div>
      <div class="conversation-header-actions">
        <button class="${active?.startsWith("artifact") ? "active" : ""}" data-action="toggle-artifact-panel" aria-pressed="${active?.startsWith("artifact") || false}">${icon("folder")}产物</button>
        <button class="${active?.startsWith("workbench") || active === "reference" ? "active" : ""}" data-action="toggle-workbench-panel" aria-pressed="${active?.startsWith("workbench") || active === "reference" || false}">${icon("screen")}工作台</button>
        <button data-action="toast" data-message="感谢反馈">${icon("edit")}反馈</button>
      </div>
    </header>`;
}

const defaultArtifactDocumentContent = "2026 年，全球人工智能市场规模达到 3909 亿美元，中国人工智能核心产业规模突破 9000 亿元。\n\nAI Agent 细分市场以 49.6%的年复合增长率高速扩张，制造业应用大模型的企业比例在一年之内从 9.6% 跃升至 47.5%。这些数字背后，是一场深刻变革的加速到来。\n\n过去十年，人工智能的主旋律是技术供给侧的突飞猛进：从深度学习到大语言模型，从单一模态到多模态融合。然而，2025 年以来，行业正在经历一个意义深远的范式转换。\n\nScaling Law 的边际递减效应促使技术路线从“规模竞赛”回归“研究创新”，AI-Native 应用标志着人工智能从底层重构应用、产品乃至组织。\n\n本书以“技术—产业—治理”为主轴，构建了三篇十章的系统化分析框架，完整呈现了从应用层到物理层的技术演进脉络。";

function artifactTitle(artifact) {
  return artifact.name.replace(/\.[^.]+$/, "");
}

function artifactContent(artifact) {
  if (artifact.content) return artifact.content;
  return artifact.type === "PDF"
    ? defaultArtifactDocumentContent
    : "该产物已生成，可在当前会话中查看和继续编辑。";
}

function artifactKnowledgeButton(index, compact = false) {
  const added = appState.knowledgeArtifacts.includes(index);
  const label = added ? "已添加到知识库" : "添加到知识库";
  return `<button class="${compact ? "artifact-list-knowledge" : "artifact-knowledge-button"} ${added ? "added" : ""}" data-action="add-artifact-to-knowledge" data-artifact-index="${index}" aria-label="${label}" title="${label}">${icon(added ? "check" : "knowledge-book")}${compact ? "" : `<span>${label}</span>`}</button>`;
}

function artifactPanel() {
  const showingList = appState.workPanel === "artifact-list";
  const openedTabs = appState.openedArtifactTabs.filter(index => workArtifacts[index]);
  const artifact = workArtifacts[appState.selectedArtifact] || workArtifacts[0];
  const editing = appState.artifactEditDraft?.index === appState.selectedArtifact;
  const tabbar = `<div class="panel-tabbar"><button class="panel-kind panel-kind-button" data-action="open-artifact-list" aria-label="查看全部产物" title="查看全部产物" aria-pressed="${showingList}">${icon("folder")}</button>${showingList && !openedTabs.length ? `<strong class="panel-kind-label">产物</strong>` : ""}<div class="panel-tabs" role="tablist" aria-label="已打开的产物">${openedTabs.map(index => {
    const tabArtifact = workArtifacts[index];
    const tabName = artifactTitle(tabArtifact);
    const active = !showingList && index === appState.selectedArtifact;
    return `<span class="panel-tab ${active ? "active" : ""}" title="${escapeHtml(tabName)}" role="tab" aria-selected="${active}"><button class="panel-tab-label-button" data-action="activate-artifact-tab" data-artifact-index="${index}" tabindex="${active ? "0" : "-1"}"><span class="panel-tab-label">${escapeHtml(tabName)}</span></button><button class="panel-tab-close" data-action="close-artifact-tab" data-artifact-index="${index}" aria-label="关闭${escapeHtml(tabName)}">${icon("x")}</button></span>`;
  }).join("")}</div><button class="panel-close" data-action="close-work-panel" aria-label="关闭侧栏">${icon("x")}</button></div>`;
  if (showingList) {
    return `<aside class="conversation-panel artifact-list-panel">${panelResizeHandle("conversation", appState.conversationPanelListWidth, 280, 920, "调整对话与产物列表宽度")}${tabbar}<div class="artifact-list">${workArtifacts.map((item, index) => `<div class="artifact-list-item"><button class="artifact-list-open" data-action="open-artifact" data-artifact-index="${index}"><span class="artifact-type" style="--artifact-color:${item.color}">${item.type.slice(0, 1)}</span><span>${escapeHtml(item.name)}</span></button>${artifactKnowledgeButton(index, true)}</div>`).join("")}</div></aside>`;
  }
  if (editing) return `<aside class="conversation-panel artifact-detail-panel">${panelResizeHandle("conversation", appState.conversationPanelWidth || 620, 280, 920, "调整对话与产物详情宽度")}${tabbar}<div class="artifact-document">${artifactEditor(artifact)}</div></aside>`;
  return `<aside class="conversation-panel artifact-detail-panel">${panelResizeHandle("conversation", appState.conversationPanelWidth || 620, 280, 920, "调整对话与产物详情宽度")}${tabbar}<div class="artifact-document"><div class="artifact-detail-header"><div><h2>${escapeHtml(artifactTitle(artifact))}</h2><small>${escapeHtml(artifact.name)}</small></div><div class="artifact-detail-actions"><button class="artifact-edit-button" data-action="edit-artifact" data-artifact-index="${appState.selectedArtifact}">${icon("edit")}<span>编辑</span></button>${artifactKnowledgeButton(appState.selectedArtifact)}</div></div>${artifact.type === "PDF" ? artifactDocumentText(artifact) : `<div class="generic-artifact-preview"><span class="artifact-type large" style="--artifact-color:${artifact.color}">${artifact.type.slice(0, 1)}</span><h3>${escapeHtml(artifact.name)}</h3><p>${escapeHtml(artifactContent(artifact))}</p></div>`}</div></aside>`;
}

function artifactDocumentText(artifact) {
  return artifactContent(artifact).split(/\n{2,}/).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function artifactEditor(artifact) {
  const draft = appState.artifactEditDraft || { index: appState.selectedArtifact, name: artifact.name, content: artifactContent(artifact) };
  return `<div class="artifact-editor"><div class="artifact-editor-header"><div><span class="artifact-editor-kicker">产物详情</span><h2>编辑产物</h2></div>${artifactKnowledgeButton(appState.selectedArtifact)}</div><label class="artifact-editor-field"><span>文件名称</span><input data-artifact-field="name" value="${escapeHtml(draft.name)}" autocomplete="off" /></label><label class="artifact-editor-field"><span>内容</span><textarea data-artifact-field="content" spellcheck="false">${escapeHtml(draft.content)}</textarea></label><div class="artifact-editor-actions"><button class="artifact-cancel-button" data-action="cancel-edit-artifact">取消</button><button class="artifact-save-button" data-action="save-artifact">${icon("check")}保存</button></div></div>`;
}

function workbenchPanel() {
  if (appState.workPanel === "reference") return referenceDetailPanel();
  const tabs = ["综合", "研报", "纪要", "资讯", "公告", "数据", "图表"];
  const filtered = appState.workbenchTab === "综合" ? workReferences : workReferences.filter(item => item.type === appState.workbenchTab);
  const openedTabs = appState.openedReferenceTabs.filter(index => workReferences[index]);
  const tabbar = workbenchTabbar(true, openedTabs);
  return `<aside class="conversation-panel workbench-panel">${panelResizeHandle("conversation", appState.conversationPanelListWidth, 280, 920, "调整对话与工作台宽度")}${tabbar}<div class="workbench-body"><label class="workbench-search"><input type="search" placeholder="搜索资源" aria-label="搜索资源" />${icon("search")}</label><div class="workbench-tabs">${tabs.map(tab => `<button class="${appState.workbenchTab === tab ? "active" : ""}" data-workbench-tab="${tab}">${tab}</button>`).join("")}</div><div class="reference-list">${filtered.map(item => { const index = workReferences.indexOf(item); return `<button class="reference-item" data-action="open-reference" data-reference-index="${index}"><div class="reference-title"><span class="reference-tag ${item.color}">${item.type}</span><strong>${escapeHtml(item.title)}</strong></div><p>根据年报数据显示，宁德时代2024年公司营业收入约3011.27亿元，总营收超越去年，而且净利润高达136.31亿元，同比增长最快…</p><div class="reference-meta"><span>${escapeHtml(item.source)}</span><span>${escapeHtml(item.date)}</span></div>${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}</button>`; }).join("") || `<div class="reference-empty">暂无该类引用</div>`}</div></div></aside>`;
}

function workbenchTabbar(showingList, openedTabs = appState.openedReferenceTabs.filter(index => workReferences[index])) {
  return `<div class="panel-tabbar"><button class="panel-kind panel-kind-button" data-action="open-workbench" aria-label="查看工作台列表" title="查看工作台列表" aria-pressed="${showingList}">${icon("screen")}</button>${showingList && !openedTabs.length ? `<strong class="panel-kind-label">工作台</strong>` : ""}<div class="panel-tabs" role="tablist" aria-label="已打开的工作台引用">${openedTabs.map(index => {
    const reference = workReferences[index];
    const active = !showingList && index === appState.selectedReference;
    return `<span class="panel-tab ${active ? "active" : ""}" title="${escapeHtml(reference.title)}" role="tab" aria-selected="${active}"><button class="panel-tab-label-button" data-action="activate-reference-tab" data-reference-index="${index}" tabindex="${active ? "0" : "-1"}"><span class="panel-tab-label">${escapeHtml(reference.title)}</span></button><button class="panel-tab-close" data-action="close-reference-tab" data-reference-index="${index}" aria-label="关闭${escapeHtml(reference.title)}">${icon("x")}</button></span>`;
  }).join("")}</div><button class="panel-close" data-action="close-work-panel" aria-label="关闭工作台">${icon("x")}</button></div>`;
}

function referenceDetailPanel() {
  const reference = workReferences[appState.selectedReference] || workReferences[0];
  const isReport = appState.selectedReference === 4;
  return `<aside class="conversation-panel reference-detail-panel">${panelResizeHandle("conversation", appState.conversationPanelWidth || 620, 280, 920, "调整对话与引用详情宽度")}${workbenchTabbar(false)}<div class="reference-detail-body"><h2>${escapeHtml(reference.title)}</h2>${isReport ? `<div class="reference-report-view"><img src="${figmaAsset("reference/hsbc-toolbar.png")}" alt="研报工具栏" /><img src="${figmaAsset("reference/hsbc-page-top.png")}" alt="汇丰研报原文上半部" /><img src="${figmaAsset("reference/hsbc-page-bottom.png")}" alt="汇丰研报原文下半部" /></div>` : `<div class="reference-article"><span class="reference-tag ${reference.color}">${reference.type}</span><p>本文梳理了公司最新经营情况、行业格局与核心财务数据，重点分析收入、利润及长期增长动能。</p><p>根据已披露数据，公司的竞争优势主要来自技术积累、供应链整合与规模效应。未来仍需关注行业需求、价格变化与政策环境。</p><div class="reference-origin">${escapeHtml(reference.source)} · ${escapeHtml(reference.date)}</div></div>`}</div></aside>`;
}

function workConversationPage() {
  const panel = appState.workPanel;
  const panelMarkup = panel?.startsWith("artifact") ? artifactPanel() : panel ? workbenchPanel() : "";
  return `
    <section class="page work-conversation-page ${appState.workConversationStage === "thinking" ? "stage-thinking" : "stage-answer"} ${panel ? "has-panel" : ""} ${panel === "reference" ? "has-reference-panel" : ""}">
      <div class="conversation-main">
        ${workConversationHeader()}
        <div class="conversation-scroll">
          <div class="conversation-content">
            <div class="user-question">${escapeHtml(appState.workQuestion)}</div>
            ${appState.workConversationStage === "thinking" ? workThinkingView() : workAnswerView()}
          </div>
        </div>
        ${workConversationComposer()}
      </div>
      ${panelMarkup}
    </section>`;
}

function aiPage() {
  const tabs = ["推荐", "个股", "行业", "基金", "组合", "工具"];
  const visible = appState.skillTab === "推荐" ? aiSkills : aiSkills.filter((_, i) => i % 3 === tabs.indexOf(appState.skillTab) % 3);
  return `
    <section class="page home-page ai-page">
      <div class="figma-home-bg" aria-hidden="true"><img class="bg-one" src="${figmaAsset("bg-one.svg")}" alt="" /><img class="bg-two" src="${figmaAsset("bg-two.svg")}" alt="" /><img class="bg-three" src="${figmaAsset("bg-three.svg")}" alt="" /></div>
      <div class="home-inner">
        <img class="ai-title-art" src="${figmaAsset("ai-title.svg")}" alt="AI问答" />
        ${composer("ai")}
        <div class="skills-area">
          <div class="skills-head"><h2>常用技能</h2><div class="skill-tabs">${tabs.map(tab => `<button class="skill-tab ${appState.skillTab === tab ? "active" : ""}" data-skill-tab="${tab}">${tab}</button>`).join("")}</div></div>
          <div class="quick-skills">${quickCards(visible)}</div>
        </div>
      </div>
    </section>`;
}

function workPage() {
  if (appState.workConversationStage !== "home") return workConversationPage();
  return `
    <section class="page home-page work-page">
      <div class="figma-home-bg" aria-hidden="true"><img class="bg-one" src="${figmaAsset("bg-one.svg")}" alt="" /><img class="bg-two" src="${figmaAsset("bg-two.svg")}" alt="" /><img class="bg-three" src="${figmaAsset("bg-three.svg")}" alt="" /></div>
      <div class="home-inner">
        <img class="work-logo-art" src="${figmaAsset("robowork-logo.svg")}" alt="萝卜Work" />
        <p class="work-tagline">挖的是逻辑，拔的是<span class="blue">alpha</span></p>
        ${composer("work")}
        <div class="skills-area"><div class="quick-skills">${quickCards(workSkills)}</div></div>
      </div>
    </section>`;
}

function skillLibraryPage() {
  const tabs = [["系统内置", 23], ["我的技能", 6], ["技能广场", 0]];
  const query = appState.librarySearch.trim().toLowerCase();
  const filtered = librarySkills.filter(skill => !query || `${skill.name}${skill.desc}`.toLowerCase().includes(query));
  return `
    <section class="page workspace-page skill-page">
      <div class="page-header module-hero skill-hero" data-watermark="SKILL CENTER">
        <div class="module-heading">
          <div class="module-heading-copy"><h1>技能中心 <span class="warm">为 AI 投研精选编排</span></h1><p>覆盖深度研究、数据调用、报告生成与设计协作，让分析、写作与交付更快完成闭环。</p></div>
        </div>
        <div class="module-hero-aside module-hero-actions header-actions"><button class="button" data-action="refresh-skills">${icon("refresh")}刷新</button><button class="button" data-action="toast" data-message="技能导入入口已打开">${icon("download")}导入技能</button><button class="button primary" data-action="toast" data-message="创建技能向导已打开">${icon("plus")}创建技能</button></div>
      </div>
      <div class="skill-layout">
        <div class="skill-toolbar">
          <div class="wide-tabs skill-library-tabs">${tabs.map(([tab, count]) => `<button class="wide-tab ${appState.libraryTab === tab ? "active" : ""}" data-library-tab="${tab}">${tab}<strong>${count}</strong></button>`).join("")}</div>
          <label class="search-box">${icon("search")}<input id="library-search" type="search" value="${appState.librarySearch}" placeholder="搜索技能" /></label>
        </div>
        <div class="skill-group-title"><span>${appState.libraryTab === "系统内置" ? "萝卜官方 · 应用技能" : appState.libraryTab}</span><span class="skill-count">${filtered.length}</span></div>
        <div class="skill-library">
          ${librarySkills.map(skill => { const matches = !query || `${skill.name}${skill.desc}`.toLowerCase().includes(query); const heat = skillHeatLevel(skill); return `<article class="library-card ${matches ? "" : "is-filtered"}" data-skill-search="${escapeHtml(`${skill.name}${skill.desc}`.toLowerCase())}"><div class="library-icon" style="--card-color:${skill.color};--card-bg:${skill.bg}">${skill.short}</div><div class="library-body"><div class="library-title">${skill.name}${skill.version ? `<span class="library-version">· ${skill.version}</span>` : ""}</div><div class="library-desc">${skill.desc}</div></div><div class="library-side"><button class="switch on" data-action="toggle-skill" aria-label="启用 ${skill.name}" aria-pressed="true"></button><span class="usage heat-usage" aria-label="热度 ${heat}/5"><span class="heat-label">热度</span><span class="heat-bars" aria-hidden="true">${Array.from({ length: 5 }, (_, index) => `<i class="${index < heat ? "active" : ""}"></i>`).join("")}</span></span></div></article>`; }).join("")}
          <div class="empty-result ${filtered.length ? "is-hidden" : ""}">没有找到匹配的技能</div>
        </div>
      </div>
    </section>`;
}

function apiPage() {
  return `
    <section class="page workspace-page api-page">
      <div class="page-header module-hero api-page-header" data-watermark="API DATA CENTER">
        <div class="module-heading">
          <div class="module-heading-copy">
            <h1>API 数据中心</h1>
            <p>专为大模型友好设计的 API：语义检索、结构化返回、引用可溯。</p>
          </div>
        </div>
        <div class="module-hero-aside api-topline">
          <button class="api-guide-button" data-action="toast" data-message="使用说明已打开">${icon("book")}<span>使用说明</span></button>
          <div class="api-auth-state"><span class="token">Token 已授权</span></div>
          <button class="icon-button api-refresh-button" data-action="toast" data-message="Token 状态已刷新" aria-label="刷新授权" title="刷新授权">${icon("refresh")}</button>
        </div>
      </div>
      <div class="api-shell">
        <aside class="api-sidebar">
          <div class="api-side-title"><h2>分类与 API</h2><span><strong>241</strong> 个 API</span></div>
          <label class="search-box api-search">${icon("search")}<input id="api-search" type="search" placeholder="搜索目录或 API" /></label>
          <div class="api-tree">${apiCategories.map((cat, i) => `<div class="api-category ${i === 0 ? "open" : ""}" data-category="${cat.name}"><button class="api-category-button" data-action="toggle-category"><span class="category-arrow">›</span><span class="category-name">${cat.name}</span><span class="category-count">${cat.count}</span></button><div class="endpoint-list">${cat.endpoints.map((endpoint, j) => `<button class="endpoint ${appState.selectedEndpoint === endpoint ? "active" : ""}" data-endpoint="${endpoint}"><span class="method ${j === 0 && i === 0 ? "get" : ""}">${j === 0 && i === 0 ? "GET" : "POST"}</span><span>${endpoint}</span></button>`).join("")}</div></div>`).join("")}</div>
        </aside>
        ${apiDetail()}
      </div>
    </section>`;
}

function apiDetail() {
  const primary = appState.selectedEndpoint === "API目录与集合";
  const title = appState.selectedEndpoint;
  return `
    <article class="api-detail">
      <div class="api-detail-head"><div><div class="api-eyebrow">${primary ? "API集合" : "数据接口"}</div><h2>${title}</h2><div class="api-slug"><span class="code-pill">${primary ? "api_catalog" : title.toLowerCase().replaceAll(" ", "_")}</span><span>·</span><span>更新</span><span>·</span><span>创建</span></div></div><div class="header-actions"><button class="button primary" data-action="toast" data-message="在线调试器已打开">${icon("play")}调试</button><button class="icon-button" data-action="toast" data-message="代码示例已复制" aria-label="代码示例">${icon("code")}</button></div></div>
      <p class="api-description">${primary ? "按目录 ID 或目录名称获取 API 目录树及目录下接口清单，用于让智能体先发现可用 API 分类，再按目录或接口名称定位后续要调用的具体接口。" : `获取 ${title} 的结构化数据，支持智能体调用、语义参数解析与结果引用溯源。`}</p>
      <section class="api-section"><h3>接口地址</h3><div class="endpoint-address"><span class="method get">GET</span><code><span class="ghost">https://</span>gw.datayes.com/aladdin_llm_mgmt/web/whitelist/api/${primary ? "catalog/all" : "query"}</code><button class="icon-button" data-action="copy-api" aria-label="复制接口地址">${icon("copy")}</button></div></section>
      <section class="api-section"><h3>请求参数</h3><div class="param-list"><div class="param-card"><div class="param-main"><span class="param-name">目录ID</span><span class="code-pill">id</span><span class="optional">可选</span><span class="param-kind">Query · integer</span></div><div class="param-desc">说明 <strong>id 和 name 不能同时传</strong></div></div><div class="param-card"><div class="param-main"><span class="param-name">目录名称</span><span class="code-pill">name</span><span class="optional">可选</span><span class="param-kind">Query · string</span></div><div class="param-desc">默认值 <strong>公告API</strong></div></div></div></section>
      <section class="api-section"><h3>返回参数</h3><div class="param-list"><div class="param-card"><div class="param-main"><span class="param-name">状态码</span><span class="code-pill">code</span><span class="param-kind">Body · integer</span></div><div class="param-desc">说明 <strong>1代表成功</strong></div></div><div class="param-card"><div class="param-main"><span class="param-name">返回API目录列表</span><span class="code-pill">data</span><span class="param-kind">Body · array</span></div><div class="param-desc">说明 <strong>包含目录层级、接口名称与引用信息</strong></div></div></div></section>
    </article>`;
}

function panelResizeHandle(kind, width, min, max, label) {
  return `<div class="panel-resizer ${kind}-resizer" data-resize-handle="${kind}" role="separator" aria-orientation="vertical" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${Math.round(width)}" tabindex="0" title="拖动调整宽度"></div>`;
}

function moduleQaUi() {
  if (!["api", "skills"].includes(appState.page)) return "";
  const welcome = appState.page === "api"
    ? "可以帮你查找接口、理解参数，或把投研问题拆成可调用的数据步骤。"
    : "可以帮你挑选技能、组合工作流，或直接开始一项投研任务。";
  const suggestions = appState.page === "api"
    ? ["查找实时行情接口", "这个 API 需要哪些参数？"]
    : ["推荐一个公司研究技能", "帮我组合一套研究工作流"];
  return `
    <button class="module-qa-trigger ${appState.moduleQaOpen ? "is-open" : ""}" data-action="open-module-qa" aria-label="打开问答窗口" title="打开问答窗口">
      ${icon("chevron")}<span>问答</span>
    </button>
    ${appState.moduleQaOpen ? `<aside class="module-qa-panel" aria-label="问答窗口">
      ${panelResizeHandle("module-qa", appState.moduleQaWidth, 320, 720, "调整问答窗口宽度")}
      <header class="module-qa-header module-qa-header-minimal">
        <img class="module-qa-logo" src="${figmaAsset("robowork-logo.svg")}" alt="萝卜Work" />
        <button class="module-qa-close" data-action="close-module-qa" aria-label="关闭问答窗口" title="关闭问答窗口">${icon("x")}</button>
      </header>
      <div class="module-qa-messages">
        <div class="module-qa-welcome"><div><strong>你好，我是萝卜Work</strong><p>${welcome}</p></div></div>
        <div class="module-qa-suggestions">${suggestions.map(prompt => `<button data-action="use-module-qa-suggestion" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join("")}</div>
        ${appState.moduleQaMessages.map(message => message.role === "user"
          ? `<div class="module-qa-message user">${escapeHtml(message.text)}</div>`
          : `<div class="module-qa-message assistant"><span class="module-qa-message-mark">${icon("bot")}</span><p>${escapeHtml(message.text)}</p></div>`).join("")}
      </div>
      <div class="module-qa-home-composer module-qa-work-composer">${composer("work")}</div>
    </aside>` : ""}`;
}

function scheduleTimes(draft) {
  const source = Array.isArray(draft.times) && draft.times.length ? draft.times : [draft.time || "07:30"];
  return source.map(time => String(time).trim()).filter(Boolean);
}

function scheduleDaysOfMonth(draft) {
  const source = Array.isArray(draft.daysOfMonth) && draft.daysOfMonth.length
    ? draft.daysOfMonth
    : [draft.dayOfMonth || "1"];
  return source
    .map(day => Number(day))
    .filter(day => Number.isInteger(day) && day >= 1 && day <= 28)
    .sort((first, second) => first - second)
    .map(String);
}

function formatSchedule(draft) {
  const timeText = scheduleTimes(draft).join("、");
  if (draft.frequency === "一次") return `${draft.date} ${timeText}`;
  if (draft.frequency === "每天") return `每天 ${timeText}`;
  if (draft.frequency === "工作日") return `工作日 ${timeText}`;
  if (draft.frequency === "每周") return `每周${draft.weekdays.join("、")} ${timeText}`;
  if (draft.frequency === "每月") return `每月 ${scheduleDaysOfMonth(draft).map(day => `${day}日`).join("、")} ${timeText}`;
  return `Cron · ${draft.cron}`;
}

function nextRunFromDraft(draft) {
  const nextTime = scheduleTimes(draft)[0] || "--:--";
  if (draft.frequency === "一次") return `${draft.date} ${nextTime}`;
  if (draft.frequency === "每周") return `下周${draft.weekdays[0] || "一"} ${nextTime}`;
  if (draft.frequency === "每月") return `下月${scheduleDaysOfMonth(draft)[0] || "1"}日 ${nextTime}`;
  if (draft.frequency === "自定义") return "按 Cron 规则";
  return `明天 ${nextTime}`;
}

function schedulePage() {
  const query = appState.scheduleSearch.trim().toLowerCase();
  const filtered = scheduleTasks.filter(task => {
    const matchesSearch = !query || `${task.name}${task.description}${task.skills.join("")}${task.project}`.toLowerCase().includes(query);
    const matchesFilter = appState.scheduleFilter === "全部"
      || (appState.scheduleFilter === "运行中" && task.active)
      || (appState.scheduleFilter === "已暂停" && !task.active)
      || (appState.scheduleFilter === "异常" && task.status === "异常");
    return matchesSearch && matchesFilter;
  });
  const activeCount = scheduleTasks.filter(task => task.active).length;
  const pausedCount = scheduleTasks.filter(task => !task.active).length;
  const errorCount = scheduleTasks.filter(task => task.status === "异常").length;
  const nextTask = scheduleTasks.find(task => task.active && task.status !== "异常");
  const filters = [["全部", scheduleTasks.length], ["运行中", activeCount], ["已暂停", pausedCount], ["异常", errorCount]];
  const weeklyRhythm = [
    ["一", 5, 62], ["二", 7, 92], ["三", 4, 50], ["四", 6, 76], ["五", 8, 100], ["六", 2, 28], ["日", 1, 16],
  ];
  return `
    <section class="page workspace-page schedule-page">
      <div class="page-header module-hero schedule-header" data-watermark="AUTOMATIONS">
        <div class="module-heading">
          <div class="module-heading-copy"><div class="schedule-title-line"><h1>定时任务</h1><span class="automation-live"><i></i>自动化引擎运行中</span></div><p>按设定节奏自动执行研究任务、技能与项目交付。</p></div>
        </div>
        <div class="module-hero-aside module-hero-actions header-actions"><button class="button primary" data-action="open-schedule">${icon("plus")}新建定时任务</button></div>
      </div>
      <div class="schedule-summary">
        <div class="schedule-metrics">
          <div class="schedule-metric"><span class="metric-icon running">${icon("play")}</span><div><strong>${activeCount}</strong><span>运行中</span></div></div>
          <div class="schedule-metric"><span class="metric-icon pending">${icon("calendar")}</span><div><strong>3</strong><span>今日待执行</span></div></div>
          <div class="schedule-metric"><span class="metric-icon success">${icon("check")}</span><div><strong>96.8%</strong><span>近 7 日成功率</span></div></div>
        </div>
        <div class="schedule-rhythm"><div class="rhythm-head"><span>本周执行节奏</span><strong>33 次</strong></div><div class="rhythm-bars">${weeklyRhythm.map(([day, count, height], index) => `<div class="rhythm-day ${index === 1 ? "today" : ""}"><span class="rhythm-track"><i style="height:${height}%"></i></span><b>${day}</b><small>${count}</small></div>`).join("")}</div></div>
        <div class="next-execution"><div class="next-execution-icon">${icon("timer")}</div><div><span class="next-label">下一次执行</span><strong>${nextTask ? escapeHtml(nextTask.name) : "暂无任务"}</strong><span>${nextTask ? escapeHtml(nextTask.nextRun) : "--"}</span></div><span class="next-progress"><i></i></span></div>
      </div>
      <div class="schedule-toolbar">
        <div class="wide-tabs schedule-tabs">${filters.map(([filter, count]) => `<button class="wide-tab ${appState.scheduleFilter === filter ? "active" : ""}" data-schedule-filter="${filter}">${filter}<strong>${count}</strong></button>`).join("")}</div>
        <label class="search-box schedule-search">${icon("search")}<input id="schedule-search" type="search" value="${escapeHtml(appState.scheduleSearch)}" placeholder="搜索任务、技能或项目" /></label>
      </div>
      <div class="schedule-table-wrap">
        <div class="schedule-table">
          <div class="schedule-row schedule-table-head"><span>任务</span><span>触发规则</span><span>调用技能</span><span>最近执行</span><span>状态</span><span>操作</span></div>
          ${filtered.length ? filtered.map(scheduleTaskRow).join("") : `<div class="schedule-empty">${icon("timer")}<strong>没有匹配的定时任务</strong></div>`}
        </div>
      </div>
    </section>`;
}

function scheduleTaskRow(task) {
  const statusClass = task.status === "异常" ? "error" : task.status === "运行中" ? "working" : task.active ? "healthy" : "paused";
  const taskSkill = scheduleSkillOptions.find(skill => skill.name === task.skills[0]) || scheduleSkillOptions[0];
  return `
    <div class="schedule-row task-${statusClass}" style="--task-color:${taskSkill.color};--task-bg:${taskSkill.bg}" data-task-id="${task.id}">
      <div class="schedule-task-cell"><div><button class="schedule-name" data-action="edit-schedule" data-id="${task.id}">${escapeHtml(task.name)}</button><p>${escapeHtml(task.description)}</p><span class="schedule-project">${icon("folder")}${escapeHtml(task.project)}</span></div></div>
      <div class="schedule-rule"><div class="rule-line"><span>${icon("timer")}</span><strong>${escapeHtml(task.schedule)}</strong></div><span class="next-run-pill">${icon("calendar")}下次 ${escapeHtml(task.nextRun)}</span></div>
      <div class="schedule-skill-list">${task.skills.slice(0, 2).map((skill, index) => `<span class="schedule-skill"><i>${index + 1}</i>${escapeHtml(skill)}</span>`).join("")}${task.skills.length > 2 ? `<span class="schedule-skill-more">+${task.skills.length - 2}</span>` : ""}</div>
      <div class="last-run"><span class="last-run-mark ${statusClass}">${statusClass === "error" ? icon("alert") : icon("check")}</span><div><strong>${escapeHtml(task.lastRun.split(" · ")[0])}</strong><span>${escapeHtml(task.lastRun.split(" · ")[1] || "--")}</span></div></div>
      <div class="schedule-status"><span class="status-pill ${statusClass}"><i></i>${escapeHtml(task.status)}</span></div>
      <div class="schedule-actions"><button class="icon-button compact schedule-toggle ${task.active ? "is-active" : "is-paused"}" data-action="toggle-schedule" data-id="${task.id}" aria-label="${task.active ? "关闭" : "开启"}${escapeHtml(task.name)}" title="${task.active ? "关闭" : "开启"}">${icon(task.active ? "power-off" : "power")}</button><button class="icon-button compact" data-action="edit-schedule" data-id="${task.id}" aria-label="编辑" title="编辑">${icon("edit")}</button><button class="icon-button compact danger" data-action="delete-schedule" data-id="${task.id}" aria-label="删除" title="删除">${icon("trash")}</button></div>
    </div>`;
}

function scheduleModal({ updating = false } = {}) {
  const draft = appState.scheduleDraft || createScheduleDraft();
  const times = scheduleTimes(draft);
  const monthDays = scheduleDaysOfMonth(draft);
  const frequencies = [["一次", "单次"], ["每天", "每天"], ["每周", "每周"], ["每月", "每月"], ["自定义", "自定义"]];
  const weekdays = [["一", "周一"], ["二", "周二"], ["三", "周三"], ["四", "周四"], ["五", "周五"], ["六", "周六"], ["日", "周日"]];
  const editing = appState.editingScheduleId !== null;
  const frequencyFields = draft.frequency === "一次"
    ? `<label class="field schedule-date-field"><span>执行日期</span><input type="date" data-schedule-field="date" value="${escapeHtml(draft.date)}" /></label>`
    : draft.frequency === "每周"
      ? `<div class="field schedule-weekday-field"><div class="field-label-row"><span>执行日</span><label class="schedule-workday-toggle"><input type="checkbox" data-schedule-workdays ${draft.workdaysOnly ? "checked" : ""} /><span>仅工作日</span></label></div><div class="weekday-control">${weekdays.map(([value, label]) => `<button class="weekday ${draft.weekdays.includes(value) ? "active" : ""}" data-weekday="${value}">${label}</button>`).join("")}</div></div>`
      : draft.frequency === "每月"
        ? `<div class="field schedule-month-days-field"><div class="field-label-row"><span>执行日期</span><button class="add-time-button" data-action="add-schedule-month-day">+添加日期</button></div><div class="schedule-month-day-list">${monthDays.map((day, index) => `<div class="schedule-month-day-row ${monthDays.length === 1 ? "single" : ""}"><select data-schedule-month-day="${index}" aria-label="第 ${index + 1} 个执行日期">${Array.from({length: 28}, (_, i) => `<option value="${i + 1}" ${String(i + 1) === day ? "selected" : ""}>${i + 1} 日</option>`).join("")}</select><button class="remove-month-day-button" data-action="remove-schedule-month-day" data-month-day-index="${index}" aria-label="删除 ${day} 日" title="删除日期" ${monthDays.length === 1 ? "disabled" : ""}>${icon("trash")}</button></div>`).join("")}</div></div>`
        : draft.frequency === "自定义"
          ? `<label class="field schedule-cron-field"><span>Cron 表达式</span><input class="mono" data-schedule-field="cron" value="${escapeHtml(draft.cron)}" /></label>`
          : "";
  const timeField = draft.frequency !== "自定义"
    ? `<div class="field schedule-times-field ${times.length > 1 ? "has-multiple" : ""}"><div class="field-label-row"><span>执行时间</span><button class="add-time-button" data-action="add-schedule-time">+添加时间</button></div><div class="schedule-time-list">${times.map((time, index) => `<div class="schedule-time-row ${times.length === 1 ? "single" : ""}"><input type="time" data-schedule-time="${index}" value="${escapeHtml(time)}" aria-label="第 ${index + 1} 个执行时间" /><button class="remove-time-button" data-action="remove-schedule-time" data-time-index="${index}" aria-label="删除 ${escapeHtml(time)}" title="删除时间" ${times.length === 1 ? "disabled" : ""}>${icon("trash")}</button></div>`).join("")}</div></div>`
    : "";
  return `
    <div class="modal-overlay schedule-overlay ${updating ? "is-updating" : ""}" data-schedule-overlay>
      <section class="schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title">
        <header class="schedule-dialog-header"><h2 id="schedule-dialog-title">${editing ? "编辑定时任务" : "新建定时任务"}</h2><button class="schedule-dialog-close" data-action="close-schedule" aria-label="关闭">${icon("x")}</button></header>
        <div class="schedule-dialog-body">
          <div class="schedule-modal-fields">
            <label class="field"><span>任务名称</span><input id="schedule-name" data-schedule-field="name" value="${escapeHtml(draft.name)}" placeholder="输入任务名称" /></label>
            <div class="field schedule-requirements"><span>具体要求</span>
              <div class="schedule-task-composer">
                ${(draft.skills.length || draft.attachments?.length) ? `<div class="schedule-context-chips">${draft.skills.map(skill => `<span class="composer-context-chip"><span>${escapeHtml(skill)}</span><button data-action="remove-schedule-skill" data-skill="${escapeHtml(skill)}" aria-label="移除${escapeHtml(skill)}">${icon("x")}</button></span>`).join("")}${(draft.attachments || []).map((file, index) => `<span class="schedule-context-chip">${icon("paperclip")}<span>${escapeHtml(file.name)}</span><button data-action="remove-schedule-attachment" data-attachment-index="${index}" aria-label="移除${escapeHtml(file.name)}">${icon("x")}</button></span>`).join("")}</div>` : ""}
                <textarea data-schedule-field="description" placeholder="描述需要自动完成的研究、分析和交付内容">${escapeHtml(draft.description)}</textarea>
                <div class="schedule-composer-toolbar">
                  ${workSkillPicker({ schedule: true })}
                  <button class="schedule-attach-button" data-action="add-schedule-attachment" aria-label="添加附件" title="添加附件">${icon("paperclip")}</button><input id="schedule-attachment-input" type="file" multiple hidden />
                  <span class="schedule-composer-spacer"></span>
                  ${workModelPicker({ schedule: true })}
                </div>
              </div>
            </div>
            <label class="field schedule-project-field"><span>写入项目</span><span class="schedule-select-control"><select data-schedule-field="project">${orderedProjects().map(group => `<option value="${escapeHtml(group.name)}" ${draft.project === group.name ? "selected" : ""}>${escapeHtml(group.name)}</option>`).join("")}</select>${icon("chevron")}</span></label>
          </div>
          <section class="schedule-plan-block">
            <h3>执行计划</h3>
            <div class="schedule-plan-fields">
              <div class="field"><span>执行频率</span><div class="frequency-control">${frequencies.map(([value, label]) => `<button class="frequency-option ${draft.frequency === value ? "active" : ""}" data-frequency="${value}">${label}</button>`).join("")}</div></div>
              ${frequencyFields}
              ${timeField}
              <div class="schedule-preview"><div><span>执行规则</span><strong data-schedule-preview-rule>${escapeHtml(formatSchedule(draft))}</strong></div><div><span>预计下次</span><strong data-schedule-preview-next>${escapeHtml(nextRunFromDraft(draft))}</strong></div></div>
            </div>
          </section>
        </div>
        <footer class="schedule-dialog-footer"><button class="schedule-modal-button" data-action="close-schedule">取消</button><button class="schedule-modal-button primary" data-action="save-schedule">${editing ? "保存修改" : "创建任务"}</button></footer>
      </section>
    </div>`;
}

function projectMenu() {
  if (!appState.projectMenu) return "";
  const project = projectGroups.find(item => item.id === appState.projectMenu.id);
  if (!project) return "";
  const top = Math.min(appState.projectMenu.top, window.innerHeight - 142);
  return `
    <div class="project-menu" role="menu" aria-label="${escapeHtml(project.name)}项目操作" style="left:${appState.projectMenu.left}px;top:${Math.max(8, top)}px">
      <button role="menuitem" data-action="edit-project" data-id="${project.id}">${icon("folder")}<span>编辑</span></button>
      <button role="menuitem" data-action="pin-project" data-id="${project.id}">${icon("pin")}<span>${project.pinned ? "取消置顶" : "置顶"}</span></button>
      <div class="project-menu-separator"></div>
      <button class="danger" role="menuitem" data-action="confirm-delete-project" data-id="${project.id}">${icon("trash")}<span>删除</span></button>
    </div>`;
}

function getProjectTask(projectId, fileIndex) {
  const project = projectGroups.find(item => item.id === Number(projectId));
  const index = Number(fileIndex);
  if (!project || !Number.isInteger(index) || index < 0 || index >= project.files.length) return null;
  const name = project.files[index];
  return { project, index, name, pinned: (project.pinnedFiles || []).includes(name) };
}

function taskMenu() {
  if (!appState.taskMenu) return "";
  const task = getProjectTask(appState.taskMenu.projectId, appState.taskMenu.fileIndex);
  if (!task) return "";
  const top = Math.min(appState.taskMenu.top, window.innerHeight - 150);
  return `
    <div class="project-menu task-menu" role="menu" aria-label="${escapeHtml(task.name)}任务操作" style="left:${appState.taskMenu.left}px;top:${Math.max(8, top)}px">
      <button role="menuitem" data-action="rename-project-task" data-project-id="${task.project.id}" data-file-index="${task.index}">${icon("edit")}<span>重命名</span></button>
      <button role="menuitem" data-action="pin-project-task" data-project-id="${task.project.id}" data-file-index="${task.index}">${icon("pin")}<span>${task.pinned ? "取消置顶" : "置顶"}</span></button>
      <button role="menuitem" data-action="share-project-task" data-project-id="${task.project.id}" data-file-index="${task.index}">${icon("link")}<span>分享任务</span></button>
      <div class="project-menu-separator"></div>
      <button class="danger" role="menuitem" data-action="confirm-delete-project-task" data-project-id="${task.project.id}" data-file-index="${task.index}">${icon("trash")}<span>删除任务</span></button>
    </div>`;
}

function taskDialog() {
  if (!appState.taskDialogMode || !appState.editingTask) return "";
  const task = getProjectTask(appState.editingTask.projectId, appState.editingTask.fileIndex);
  if (!task) return "";
  const deleting = appState.taskDialogMode === "delete";
  return `
    <div class="modal-overlay project-overlay" data-task-overlay>
      <section class="project-dialog ${deleting ? "delete-dialog" : ""}" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <header class="project-dialog-header"><div><span class="project-dialog-icon ${deleting ? "danger" : ""}">${icon(deleting ? "trash" : "edit")}</span><div><h2 id="task-dialog-title">${deleting ? "删除任务" : "重命名任务"}</h2><p>${deleting ? "删除后将从项目中移除" : "更新任务在项目中的显示名称"}</p></div></div><button class="icon-button" data-action="close-task-dialog" aria-label="关闭">${icon("x")}</button></header>
        ${deleting ? `<div class="project-delete-body"><p>确定删除任务“<strong>${escapeHtml(task.name)}</strong>”吗？</p><span>该操作不能撤销。</span></div>` : `<div class="project-dialog-body"><label class="field"><span>任务名称</span><input id="task-name" data-task-field="name" maxlength="60" value="${escapeHtml(appState.taskDraftName)}" autocomplete="off" /></label></div>`}
        <footer class="project-dialog-footer"><button class="button" data-action="close-task-dialog">取消</button><button class="button ${deleting ? "danger-button" : "primary"}" data-action="${deleting ? "delete-project-task" : "save-project-task-name"}">${deleting ? "删除任务" : "保存"}</button></footer>
      </section>
    </div>`;
}

function projectDialog() {
  if (!appState.projectDialogMode) return "";
  const mode = appState.projectDialogMode;
  const draft = appState.projectDraft || { name: "", description: "" };
  const project = projectGroups.find(item => item.id === appState.editingProjectId);
  const deleting = mode === "delete";
  const title = deleting ? "删除项目" : mode === "edit" ? "编辑项目" : "创建项目";
  const subtitle = deleting ? "删除后项目将从侧栏移除" : mode === "edit" ? "更新项目名称和用途说明" : "创建文件夹来组织任务、资料与交付";
  return `
    <div class="modal-overlay project-overlay" data-project-overlay>
      <section class="project-dialog ${deleting ? "delete-dialog" : ""}" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
        <header class="project-dialog-header"><div><span class="project-dialog-icon ${deleting ? "danger" : ""}">${icon(deleting ? "trash" : mode === "create" ? "folder-plus" : "folder")}</span><div><h2 id="project-dialog-title">${title}</h2><p>${subtitle}</p></div></div><button class="icon-button" data-action="close-project-dialog" aria-label="关闭">${icon("x")}</button></header>
        ${deleting ? `<div class="project-delete-body"><p>确定删除项目“<strong>${escapeHtml(project?.name || "")}</strong>”吗？项目中的 <strong>${project?.files.length || 0}</strong> 个任务条目将无法从侧栏访问。</p><span>该操作不能撤销。</span></div>` : `<div class="project-dialog-body"><label class="field"><span>项目名称</span><input id="project-name" data-project-field="name" maxlength="30" value="${escapeHtml(draft.name)}" placeholder="例如：新能源行业研究" autocomplete="off" /></label><label class="field"><span>项目描述 <small>选填</small></span><textarea data-project-field="description" maxlength="120" placeholder="简要说明该项目的研究主题或工作目标">${escapeHtml(draft.description)}</textarea></label><div class="project-dialog-hint">${icon("folder")}创建后可将相关任务统一写入该项目</div></div>`}
        <footer class="project-dialog-footer"><button class="button" data-action="close-project-dialog">取消</button><button class="button ${deleting ? "danger-button" : "primary"}" data-action="${deleting ? "delete-project" : "save-project"}">${deleting ? "删除项目" : mode === "create" ? "创建项目" : "保存"}</button></footer>
      </section>
    </div>`;
}

function currentPage() {
  if (appState.page === "ai") return aiPage();
  if (appState.page === "work") return workPage();
  if (appState.page === "skills") return skillLibraryPage();
  if (appState.page === "api") return apiPage();
  if (appState.page === "schedule") return schedulePage();
  return workPage();
}

function layoutCssVariables() {
  const variables = [
    `--module-qa-width:${appState.moduleQaWidth}px`,
    `--conversation-panel-list-width:${appState.conversationPanelListWidth}px`,
  ];
  if (Number.isFinite(appState.conversationPanelWidth)) {
    variables.push(`--conversation-panel-width:${appState.conversationPanelWidth}px`);
  }
  return variables.join(";");
}

function render(options = {}) {
  if (activePanelResize) finishPanelResize(activePanelResize.pointerId);
  const preserveFocus = options.focus;
  const composerValue = options.composerValue;
  if (composerValue !== undefined) appState.composerText = composerValue;
  const viewport = options.preserveScroll ? { x: window.scrollX, y: window.scrollY } : null;
  const scheduleModalWasOpen = Boolean(document.querySelector(".schedule-dialog"));
  const scheduleScrollTop = options.scheduleScrollTop
    ?? document.querySelector(".schedule-dialog-body")?.scrollTop;
  const conversationScroll = document.querySelector(".conversation-scroll");
  const conversationScrollState = conversationScroll ? {
    top: conversationScroll.scrollTop,
    nearBottom: conversationScroll.scrollHeight - conversationScroll.clientHeight - conversationScroll.scrollTop < 90,
  } : null;
  const projectScrollTop = options.projectScrollTop ?? document.querySelector(".sidebar-scroll")?.scrollTop ?? 0;
  const isWorkConversation = appState.page === "work" && appState.workConversationStage !== "home";
  const moduleQaAvailable = ["api", "skills"].includes(appState.page);
  const shellClasses = ["app-shell", appState.sidebarCollapsed ? "sidebar-collapsed" : "", moduleQaAvailable ? "module-qa-available" : "", appState.moduleQaOpen ? "module-qa-open" : "", options.suppressPageAnimation || scheduleModalWasOpen ? "suppress-page-animation" : ""].filter(Boolean).join(" ");
  const collapsedSidebarControls = appState.sidebarCollapsed
    ? `${isWorkConversation ? "" : `<button class="sidebar-expand-button" data-action="expand-sidebar" aria-label="展开侧栏" title="展开侧栏"><img src="${figmaAsset("sidebar-collapse.svg")}" alt="" /></button>`}<button class="sidebar-edge-trigger" data-action="expand-sidebar" aria-label="预览并展开侧栏" title="展开侧栏"></button>`
    : "";
  document.querySelector("#app").innerHTML = `<div class="${shellClasses}" style="${layoutCssVariables()}">${topbar()}${collapsedSidebarControls}${sidebar()}<main class="main">${currentPage()}</main>${moduleQaUi()}${projectMenu()}${taskMenu()}${appState.scheduleModal ? scheduleModal({ updating: scheduleModalWasOpen }) : ""}${projectDialog()}${taskDialog()}</div>`;
  document.body.classList.toggle("modal-open", appState.scheduleModal || Boolean(appState.projectDialogMode) || Boolean(appState.taskDialogMode));
  const sidebarScroll = document.querySelector(".sidebar-scroll");
  if (sidebarScroll) sidebarScroll.scrollTop = projectScrollTop;
  const scheduleBody = document.querySelector(".schedule-dialog-body");
  if (scheduleBody && Number.isFinite(scheduleScrollTop)) scheduleBody.scrollTop = scheduleScrollTop;
  const nextConversationScroll = document.querySelector(".conversation-scroll");
  if (nextConversationScroll && conversationScrollState) {
    nextConversationScroll.scrollTop = options.conversationFollowBottom || conversationScrollState.nearBottom
      ? nextConversationScroll.scrollHeight
      : conversationScrollState.top;
  }
  if (preserveFocus) {
    const el = document.querySelector(preserveFocus);
    if (el) {
      el.focus({ preventScroll: Boolean(options.preventFocusScroll || scheduleModalWasOpen) });
      const len = el.value?.length ?? 0;
      if (["text", "search", "url", "tel", "password", "email"].includes(el.type) || el.tagName === "TEXTAREA") el.setSelectionRange?.(len, len);
    }
  }
  if (viewport) {
    window.scrollTo(viewport.x, viewport.y);
    requestAnimationFrame(() => window.scrollTo(viewport.x, viewport.y));
  }
  requestAnimationFrame(constrainVisiblePanelWidths);
}

let activePanelResize = null;

function clampPanelWidth(width, min, max) {
  return Math.min(max, Math.max(min, width));
}

function panelResizeConfig(handle) {
  const kind = handle.dataset.resizeHandle;
  const panel = kind === "module-qa"
    ? handle.closest(".module-qa-panel")
    : handle.closest(".conversation-panel");
  if (!panel) return null;

  if (kind === "module-qa") {
    const min = 320;
    const max = Math.max(min, Math.min(720, window.innerWidth - 360));
    return { kind, panel, stateKey: "moduleQaWidth", cssVariable: "--module-qa-width", min, max };
  }

  const pageWidth = panel.closest(".work-conversation-page")?.getBoundingClientRect().width || window.innerWidth;
  const min = 280;
  const max = Math.max(min, Math.min(920, pageWidth - 360));
  const isListPanel = panel.matches(".artifact-list-panel, .workbench-panel");
  return {
    kind,
    panel,
    stateKey: isListPanel ? "conversationPanelListWidth" : "conversationPanelWidth",
    cssVariable: isListPanel ? "--conversation-panel-list-width" : "--conversation-panel-width",
    min,
    max,
  };
}

function applyPanelWidth(config, width, handle = config.panel.querySelector("[data-resize-handle]")) {
  const nextWidth = Math.round(clampPanelWidth(width, config.min, config.max));
  appState[config.stateKey] = nextWidth;
  document.querySelector(".app-shell")?.style.setProperty(config.cssVariable, `${nextWidth}px`);
  if (handle) {
    handle.setAttribute("aria-valuemin", String(config.min));
    handle.setAttribute("aria-valuemax", String(config.max));
    handle.setAttribute("aria-valuenow", String(nextWidth));
  }
  return nextWidth;
}

function finishPanelResize(pointerId = null) {
  if (!activePanelResize) return;
  const { handle } = activePanelResize;
  if (pointerId !== null && handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId);
  activePanelResize = null;
  handle.classList.remove("is-dragging");
  document.body.classList.remove("is-resizing-panels");
}

document.addEventListener("pointerdown", event => {
  const handle = event.target.closest?.("[data-resize-handle]");
  if (!handle || (event.pointerType === "mouse" && event.button !== 0)) return;
  const config = panelResizeConfig(handle);
  if (!config) return;
  const startWidth = config.panel.getBoundingClientRect().width;
  activePanelResize = { ...config, handle, pointerId: event.pointerId, startX: event.clientX, startWidth };
  handle.setPointerCapture?.(event.pointerId);
  handle.classList.add("is-dragging");
  document.body.classList.add("is-resizing-panels");
  event.preventDefault();
});

document.addEventListener("pointermove", event => {
  if (!activePanelResize || activePanelResize.pointerId !== event.pointerId) return;
  const width = activePanelResize.startWidth - (event.clientX - activePanelResize.startX);
  applyPanelWidth(activePanelResize, width, activePanelResize.handle);
  event.preventDefault();
});

document.addEventListener("pointerup", event => {
  if (activePanelResize?.pointerId === event.pointerId) finishPanelResize(event.pointerId);
});

document.addEventListener("pointercancel", event => {
  if (activePanelResize?.pointerId === event.pointerId) finishPanelResize(event.pointerId);
});

window.addEventListener("blur", () => finishPanelResize());

function resizePanelFromKeyboard(event, handle) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return false;
  const config = panelResizeConfig(handle);
  if (!config) return false;
  const currentWidth = config.panel.getBoundingClientRect().width;
  const step = event.shiftKey ? 32 : 16;
  const nextWidth = event.key === "Home"
    ? config.min
    : event.key === "End"
      ? config.max
      : currentWidth + (event.key === "ArrowLeft" ? step : -step);
  applyPanelWidth(config, nextWidth, handle);
  event.preventDefault();
  return true;
}

function constrainVisiblePanelWidths() {
  document.querySelectorAll("[data-resize-handle]").forEach(handle => {
    if (getComputedStyle(handle).display === "none") return;
    const config = panelResizeConfig(handle);
    const storedWidth = config ? appState[config.stateKey] : null;
    if (!config) return;
    const width = Number.isFinite(storedWidth) ? storedWidth : config.panel.getBoundingClientRect().width;
    applyPanelWidth(config, width, handle);
  });
}

function clearWorkConversationTimers() {
  workConversationTimers.forEach(timer => clearTimeout(timer));
  workConversationTimers = [];
}

function queueWorkConversationStep(callback, delay) {
  const timer = setTimeout(() => {
    workConversationTimers = workConversationTimers.filter(item => item !== timer);
    callback();
  }, delay);
  workConversationTimers.push(timer);
}

function startWorkConversation(question) {
  clearWorkConversationTimers();
  appState.workQuestion = question;
  appState.workConversationTitle = "2026年人工智能医疗市场规模研究";
  appState.workConversationStage = "thinking";
  appState.workThinkingExpanded = true;
  appState.workThinkingStepsExpanded = [];
  appState.workThinkingProgress = 0;
  appState.workThinkingElapsed = 0;
  appState.workAnswerProgress = 0;
  appState.workPanel = null;
  appState.artifactEditDraft = null;
  appState.composerText = "";
  render({ suppressPageAnimation: true });
  [
    [1, 2],
    [2, 4],
    [3, 6],
    [4, 8],
  ].forEach(([progress, elapsed]) => queueWorkConversationStep(() => {
    if (appState.workConversationStage !== "thinking") return;
    appState.workThinkingProgress = progress;
    appState.workThinkingElapsed = elapsed;
    render({ suppressPageAnimation: true, conversationFollowBottom: true });
  }, elapsed * 1000));
  queueWorkConversationStep(() => {
    if (appState.workConversationStage !== "thinking") return;
    appState.workConversationStage = "streaming";
    appState.workThinkingExpanded = false;
    appState.workAnswerProgress = 1;
    render({ suppressPageAnimation: true, conversationFollowBottom: true });
  }, 10000);
  Array.from({ length: 20 }, (_, index) => index + 2).forEach((progress, index) => queueWorkConversationStep(() => {
    if (appState.workConversationStage !== "streaming") return;
    appState.workAnswerProgress = progress;
    if (progress === 21) appState.workConversationStage = "complete";
    render({ suppressPageAnimation: true, conversationFollowBottom: true });
  }, 10480 + index * 470));
}

function resetWorkConversation() {
  clearWorkConversationTimers();
  appState.workConversationStage = "home";
  appState.workConversationTitle = "";
  appState.workQuestion = "";
  appState.workThinkingExpanded = true;
  appState.workThinkingStepsExpanded = [];
  appState.workThinkingProgress = 0;
  appState.workThinkingElapsed = 0;
  appState.workAnswerProgress = 0;
  appState.workPanel = null;
  appState.artifactEditDraft = null;
  appState.composerText = "";
}

function openStoredWorkSession(task) {
  if (!task) return;
  clearWorkConversationTimers();
  appState.page = "work";
  window.history.replaceState(null, "", "#work");
  appState.workConversationTitle = task.name;
  appState.workQuestion = task.name;
  appState.workConversationStage = "complete";
  appState.workThinkingExpanded = false;
  appState.workThinkingStepsExpanded = [];
  appState.workThinkingProgress = 4;
  appState.workThinkingElapsed = 8;
  appState.workAnswerProgress = 21;
  appState.workPanel = null;
  appState.artifactEditDraft = null;
  appState.composerText = "";
  appState.projectMenu = null;
  appState.taskMenu = null;
  render({ focus: "#composer-input", suppressPageAnimation: true });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function openScheduleModal(id = null) {
  const task = id === null ? null : scheduleTasks.find(item => item.id === Number(id));
  appState.editingScheduleId = task?.id ?? null;
  appState.scheduleDraft = task
    ? {
        ...task,
        frequency: task.frequency === "工作日" ? "每周" : task.frequency,
        times: [...scheduleTimes(task)],
        weekdays: [...(task.weekdays || ["一", "二", "三", "四", "五"])],
        workdaysOnly: task.workdaysOnly ?? false,
        daysOfMonth: [...scheduleDaysOfMonth(task)],
        skills: [...(task.skills || [])],
        model: task.model || "Claude · Ultimate",
        attachments: [...(task.attachments || [])],
      }
    : createScheduleDraft();
  appState.scheduleSkillPickerOpen = false;
  appState.scheduleModelPickerOpen = false;
  appState.scheduleModal = true;
  render({ focus: "#schedule-name" });
}

function closeProjectDialog() {
  appState.projectDialogMode = null;
  appState.editingProjectId = null;
  appState.projectDraft = null;
  appState.projectMenu = null;
  appState.createProjectFromPicker = false;
  render();
}

function openProjectDialog(mode, id = null) {
  const project = id === null ? null : projectGroups.find(item => item.id === Number(id));
  appState.projectDialogMode = mode;
  appState.editingProjectId = project?.id ?? null;
  appState.projectDraft = project
    ? { name: project.name, description: project.description || "" }
    : { name: "", description: "" };
  appState.projectMenu = null;
  if (mode !== "create") appState.createProjectFromPicker = false;
  render({ focus: mode === "delete" ? null : "#project-name" });
}

function syncProjectDraft() {
  if (!appState.projectDraft) return;
  document.querySelectorAll("[data-project-field]").forEach(field => {
    appState.projectDraft[field.dataset.projectField] = field.value;
  });
}

function saveProject() {
  syncProjectDraft();
  const draft = appState.projectDraft;
  const name = draft.name.trim();
  if (!name) { document.querySelector("#project-name")?.focus(); showToast("请输入项目名称"); return; }
  const duplicate = projectGroups.some(project => project.name.toLowerCase() === name.toLowerCase() && project.id !== appState.editingProjectId);
  if (duplicate) { document.querySelector("#project-name")?.focus(); showToast("已存在同名项目"); return; }
  const existing = projectGroups.find(project => project.id === appState.editingProjectId);
  if (existing) {
    const oldName = existing.name;
    existing.name = name;
    existing.description = draft.description.trim();
    scheduleTasks.forEach(task => { if (task.project === oldName) task.project = name; });
  } else {
    const createdProject = { id: Date.now(), name, description: draft.description.trim(), files: [], pinned: false, expanded: true };
    projectGroups.unshift(createdProject);
    if (appState.createProjectFromPicker) rememberComposerProject(createdProject.id);
  }
  const message = existing ? "项目信息已更新" : "项目已创建";
  appState.projectDialogMode = null;
  appState.editingProjectId = null;
  appState.projectDraft = null;
  appState.createProjectFromPicker = false;
  render();
  showToast(message);
}

function deleteProject(id) {
  const project = projectGroups.find(item => item.id === Number(id));
  if (!project) return;
  projectGroups = projectGroups.filter(item => item.id !== project.id);
  const fallback = orderedProjects()[0]?.name || "";
  if (appState.composerProjectId === project.id) rememberComposerProject(defaultComposerProjectId);
  scheduleTasks.forEach(task => { if (task.project === project.name) task.project = fallback; });
  appState.projectDialogMode = null;
  appState.editingProjectId = null;
  appState.projectDraft = null;
  appState.projectMenu = null;
  appState.projectPickerOpen = false;
  render();
  showToast(`${project.name}已删除`);
}

function closeTaskDialog() {
  appState.taskDialogMode = null;
  appState.editingTask = null;
  appState.taskDraftName = "";
  appState.taskMenu = null;
  render();
}

function openTaskDialog(mode, projectId, fileIndex) {
  const task = getProjectTask(projectId, fileIndex);
  if (!task) return;
  appState.taskDialogMode = mode;
  appState.editingTask = { projectId: task.project.id, fileIndex: task.index };
  appState.taskDraftName = task.name;
  appState.taskMenu = null;
  render({ focus: mode === "rename" ? "#task-name" : null });
}

function saveProjectTaskName() {
  const task = getProjectTask(appState.editingTask?.projectId, appState.editingTask?.fileIndex);
  if (!task) { closeTaskDialog(); return; }
  const input = document.querySelector("#task-name");
  const name = (input?.value ?? appState.taskDraftName).trim();
  if (!name) { input?.focus(); showToast("请输入任务名称"); return; }
  if (task.project.files.some((file, index) => file === name && index !== task.index)) { input?.focus(); showToast("该项目中已存在同名任务"); return; }
  const wasPinned = task.pinned;
  if (wasPinned) task.project.pinnedFiles = (task.project.pinnedFiles || []).filter(file => file !== task.name);
  task.project.files[task.index] = name;
  if (wasPinned) task.project.pinnedFiles.push(name);
  appState.taskDialogMode = null;
  appState.editingTask = null;
  appState.taskDraftName = "";
  render();
  showToast("任务已重命名");
}

function deleteProjectTask() {
  const task = getProjectTask(appState.editingTask?.projectId, appState.editingTask?.fileIndex);
  if (!task) { closeTaskDialog(); return; }
  const name = task.name;
  task.project.pinnedFiles = (task.project.pinnedFiles || []).filter(file => file !== name);
  task.project.files.splice(task.index, 1);
  appState.taskDialogMode = null;
  appState.editingTask = null;
  appState.taskDraftName = "";
  render();
  showToast(`${name}已删除`);
}

function toggleProjectTaskPin(projectId, fileIndex) {
  const task = getProjectTask(projectId, fileIndex);
  if (!task) return;
  const pinnedFiles = task.project.pinnedFiles || [];
  task.project.pinnedFiles = task.pinned
    ? pinnedFiles.filter(file => file !== task.name)
    : [...pinnedFiles, task.name];
  appState.taskMenu = null;
  render();
  showToast(task.pinned ? "已取消置顶" : "任务已置顶");
}

async function shareProjectTask(projectId, fileIndex) {
  const task = getProjectTask(projectId, fileIndex);
  if (!task) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("project", String(task.project.id));
  shareUrl.searchParams.set("task", String(task.index));
  shareUrl.hash = "work";
  appState.taskMenu = null;
  document.querySelector(".task-menu")?.remove();
  document.querySelectorAll(".project-file-more[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
  try {
    await navigator.clipboard.writeText(shareUrl.href);
    showToast("任务分享链接已复制");
  } catch {
    showToast("复制失败，请检查剪贴板权限");
  }
}

function syncScheduleDraft() {
  if (!appState.scheduleDraft) return;
  document.querySelectorAll("[data-schedule-field]").forEach(field => {
    appState.scheduleDraft[field.dataset.scheduleField] = field.value;
  });
  const timeFields = [...document.querySelectorAll("[data-schedule-time]")];
  if (timeFields.length) {
    appState.scheduleDraft.times = timeFields.map(field => field.value);
    appState.scheduleDraft.time = appState.scheduleDraft.times[0];
  }
  const monthDayFields = [...document.querySelectorAll("[data-schedule-month-day]")];
  if (monthDayFields.length) {
    appState.scheduleDraft.daysOfMonth = monthDayFields.map(field => field.value);
    appState.scheduleDraft.dayOfMonth = appState.scheduleDraft.daysOfMonth[0];
  }
}

function nextScheduleTime(times) {
  const used = new Set(times);
  const [hours = 7, minutes = 30] = String(times.at(-1) || "07:30").split(":").map(Number);
  for (let offset = 1; offset <= 24; offset += 1) {
    const candidate = `${String((hours + offset) % 24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    if (!used.has(candidate)) return candidate;
  }
  return "12:00";
}

function nextScheduleMonthDay(days) {
  const used = new Set(days.map(String));
  const lastDay = Number(days.at(-1) || 0);
  for (let offset = 1; offset <= 28; offset += 1) {
    const candidate = String(((lastDay + offset - 1) % 28) + 1);
    if (!used.has(candidate)) return candidate;
  }
  return "1";
}

function updateSchedulePreview() {
  if (!appState.scheduleDraft) return;
  const rule = document.querySelector("[data-schedule-preview-rule]");
  const next = document.querySelector("[data-schedule-preview-next]");
  if (rule) rule.textContent = formatSchedule(appState.scheduleDraft);
  if (next) next.textContent = nextRunFromDraft(appState.scheduleDraft);
}

function saveSchedule() {
  syncScheduleDraft();
  const draft = appState.scheduleDraft;
  if (!draft.name.trim()) { document.querySelector("#schedule-name")?.focus(); showToast("请输入任务名称"); return; }
  if (!draft.description.trim()) { document.querySelector("[data-schedule-field='description']")?.focus(); showToast("请输入任务描述"); return; }
  if (draft.frequency === "每周" && !draft.weekdays.length) { showToast("请选择执行星期"); return; }
  if (draft.frequency === "每月") {
    draft.daysOfMonth = scheduleDaysOfMonth(draft);
    if (!draft.daysOfMonth.length) { showToast("请至少设置一个执行日期"); return; }
    if (new Set(draft.daysOfMonth).size !== draft.daysOfMonth.length) { showToast("执行日期不能重复"); return; }
    draft.dayOfMonth = draft.daysOfMonth[0];
  }
  if (draft.frequency !== "自定义") {
    draft.times = scheduleTimes(draft);
    if (!draft.times.length) { showToast("请至少设置一个执行时间"); return; }
    if (new Set(draft.times).size !== draft.times.length) { showToast("执行时间不能重复"); return; }
    draft.time = draft.times[0];
  }
  const existing = scheduleTasks.find(task => task.id === appState.editingScheduleId);
  const taskData = {
    ...draft,
    schedule: formatSchedule(draft),
    nextRun: nextRunFromDraft(draft),
  };
  if (existing) {
    Object.assign(existing, taskData);
    if (existing.status !== "异常") existing.status = existing.active ? "正常" : "已暂停";
  } else {
    scheduleTasks.unshift({ id: Date.now(), ...taskData, lastRun: "尚未执行 · --", active: true, status: "正常" });
  }
  appState.scheduleModal = false;
  appState.scheduleDraft = null;
  appState.scheduleSkillPickerOpen = false;
  appState.scheduleModelPickerOpen = false;
  appState.editingScheduleId = null;
  render();
  showToast(existing ? "定时任务已更新" : "定时任务已创建");
}

document.addEventListener("click", event => {
  if (event.target.matches("[data-schedule-overlay]")) {
    appState.scheduleModal = false;
    appState.scheduleDraft = null;
    appState.editingScheduleId = null;
    appState.scheduleSkillPickerOpen = false;
    appState.scheduleModelPickerOpen = false;
    render();
    return;
  }
  if (event.target.matches("[data-project-overlay]")) {
    closeProjectDialog();
    return;
  }
  if (event.target.matches("[data-task-overlay]")) {
    closeTaskDialog();
    return;
  }
  if (appState.projectMenu && !event.target.closest(".project-menu") && !event.target.closest("[data-action='toggle-project-menu']")) {
    appState.projectMenu = null;
    document.querySelector(".project-menu")?.remove();
    document.querySelectorAll(".project-more[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
  }
  if (appState.taskMenu && !event.target.closest(".task-menu") && !event.target.closest("[data-action='toggle-task-menu']")) {
    appState.taskMenu = null;
    document.querySelector(".task-menu")?.remove();
    document.querySelectorAll(".project-file-more[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
  }
  if (appState.scheduleSkillPickerOpen && !event.target.closest(".schedule-skill-picker")) {
    appState.scheduleSkillPickerOpen = false;
    document.querySelector(".schedule-skill-picker .composer-skill-menu")?.remove();
    document.querySelector("[data-action='toggle-schedule-skill-picker']")?.setAttribute("aria-expanded", "false");
  }
  if (appState.scheduleModelPickerOpen && !event.target.closest(".schedule-model-picker")) {
    appState.scheduleModelPickerOpen = false;
    document.querySelector(".schedule-model-picker .composer-model-menu")?.remove();
    document.querySelector("[data-action='toggle-schedule-model-picker']")?.setAttribute("aria-expanded", "false");
  }
  if (appState.composerSkillPickerOpen && !event.target.closest(".composer-skill-picker")) {
    appState.composerSkillPickerOpen = false;
    document.querySelector(".composer-skill-menu")?.remove();
    document.querySelector("[data-action='toggle-composer-skill-picker']")?.setAttribute("aria-expanded", "false");
  }
  if (appState.composerModelPickerOpen && !event.target.closest(".composer-model-picker")) {
    appState.composerModelPickerOpen = false;
    document.querySelector(".composer-model-menu")?.remove();
    document.querySelector("[data-action='toggle-composer-model-picker']")?.setAttribute("aria-expanded", "false");
  }
  if (appState.projectPickerOpen && !event.target.closest(".project-picker")) {
    appState.projectPickerOpen = false;
    document.querySelector(".project-picker-menu")?.remove();
    document.querySelector("[data-action='toggle-project-picker']")?.setAttribute("aria-expanded", "false");
  }
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    appState.projectMenu = null;
    appState.taskMenu = null;
    appState.projectPickerOpen = false;
    appState.composerSkillPickerOpen = false;
    appState.composerModelPickerOpen = false;
    if (!["api", "skills"].includes(pageButton.dataset.page)) {
      if (appState.moduleQaOpen && appState.moduleQaSidebarWasCollapsed !== null) appState.sidebarCollapsed = appState.moduleQaSidebarWasCollapsed;
      appState.moduleQaOpen = false;
      appState.moduleQaSidebarWasCollapsed = null;
    }
    appState.page = pageButton.dataset.page;
    window.history.replaceState(null, "", `#${appState.page}`);
    appState.mobileSidebar = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const skillTab = event.target.closest("[data-skill-tab]");
  if (skillTab) { appState.skillTab = skillTab.dataset.skillTab; render(); return; }
  const libraryTab = event.target.closest("[data-library-tab]");
  if (libraryTab) { appState.libraryTab = libraryTab.dataset.libraryTab; render({ preserveScroll: true, suppressPageAnimation: true }); return; }
  const endpoint = event.target.closest("[data-endpoint]");
  if (endpoint) { appState.selectedEndpoint = endpoint.dataset.endpoint; render(); return; }
  const scheduleFilter = event.target.closest("[data-schedule-filter]");
  if (scheduleFilter) { appState.scheduleFilter = scheduleFilter.dataset.scheduleFilter; render({ preserveScroll: true, suppressPageAnimation: true }); return; }
  const frequency = event.target.closest("[data-frequency]");
  if (frequency) {
    syncScheduleDraft();
    appState.scheduleDraft.frequency = frequency.dataset.frequency;
    if (frequency.dataset.frequency === "每天") appState.scheduleDraft.weekdays = ["一", "二", "三", "四", "五", "六", "日"];
    if (frequency.dataset.frequency === "每周" && !appState.scheduleDraft.weekdays.length) appState.scheduleDraft.weekdays = ["一", "二", "三", "四", "五"];
    if (frequency.dataset.frequency === "每月" && !scheduleDaysOfMonth(appState.scheduleDraft).length) appState.scheduleDraft.daysOfMonth = ["1"];
    appState.scheduleSkillPickerOpen = false;
    appState.scheduleModelPickerOpen = false;
    render();
    return;
  }
  const weekday = event.target.closest("[data-weekday]");
  if (weekday) {
    syncScheduleDraft();
    const day = weekday.dataset.weekday;
    const selected = appState.scheduleDraft.weekdays;
    appState.scheduleDraft.weekdays = selected.includes(day) ? selected.filter(item => item !== day) : [...selected, day];
    appState.scheduleDraft.workdaysOnly = false;
    render();
    return;
  }
  const scheduleSkill = event.target.closest("[data-schedule-skill]");
  if (scheduleSkill) {
    syncScheduleDraft();
    const skill = scheduleSkill.dataset.scheduleSkill;
    const selected = appState.scheduleDraft.skills;
    appState.scheduleDraft.skills = selected.includes(skill) ? selected.filter(item => item !== skill) : [...selected, skill];
    appState.scheduleSkillPickerOpen = false;
    render({ focus: "[data-schedule-field='description']" });
    showToast(selected.includes(skill) ? `已移除技能：${skill}` : `已添加技能：${skill}`);
    return;
  }
  const composerSkill = event.target.closest(".composer-skill-option[data-composer-skill]");
  if (composerSkill) {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    const skill = composerSkill.dataset.composerSkill;
    const selected = appState.selectedComposerSkills.includes(skill);
    appState.selectedComposerSkills = selected
      ? appState.selectedComposerSkills.filter(item => item !== skill)
      : [...appState.selectedComposerSkills, skill];
    appState.composerSkillPickerOpen = false;
    render({ focus: "#composer-input", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    showToast(selected ? `已移除技能：${skill}` : `已添加技能：${skill}`);
    return;
  }
  const modelOption = event.target.closest("[data-model-category][data-model-name]");
  if (modelOption) {
    const category = modelOption.dataset.modelCategory;
    const name = modelOption.dataset.modelName;
    if (modelOption.dataset.modelContext === "schedule") {
      syncScheduleDraft();
      appState.scheduleDraft.model = `${category} · ${name}`;
      appState.scheduleModelPickerOpen = false;
      render({ focus: "[data-schedule-field='description']" });
      showToast(name === "ChatGPT订阅" && !appState.chatGptLoggedIn ? "已选择 ChatGPT订阅，当前未登录" : `已选择模型：${category} · ${name}`);
      return;
    }
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.selectedComposerModel = { category, name };
    appState.composerModelPickerOpen = false;
    render({ focus: "#composer-input", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    showToast(name === "ChatGPT订阅" && !appState.chatGptLoggedIn ? "已选择 ChatGPT订阅，当前未登录" : `已选择模型：${category} · ${name}`);
    return;
  }
  const workbenchTab = event.target.closest("[data-workbench-tab]");
  if (workbenchTab) {
    appState.workbenchTab = workbenchTab.dataset.workbenchTab;
    render({ suppressPageAnimation: true });
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === "toggle-sidebar") {
    if (window.matchMedia("(max-width: 860px)").matches) appState.mobileSidebar = !appState.mobileSidebar;
    else appState.sidebarCollapsed = !appState.sidebarCollapsed;
    render();
  }
  if (action === "expand-sidebar") { appState.sidebarCollapsed = false; render(); }
  if (action === "open-module-qa") {
    if (appState.moduleQaSidebarWasCollapsed === null) appState.moduleQaSidebarWasCollapsed = appState.sidebarCollapsed;
    appState.moduleQaOpen = true;
    appState.composerText = "";
    appState.sidebarCollapsed = true;
    appState.mobileSidebar = false;
    render({ focus: "#composer-input", suppressPageAnimation: true });
    return;
  }
  if (action === "close-module-qa") {
    appState.moduleQaOpen = false;
    if (appState.moduleQaSidebarWasCollapsed !== null) appState.sidebarCollapsed = appState.moduleQaSidebarWasCollapsed;
    appState.moduleQaSidebarWasCollapsed = null;
    render({ suppressPageAnimation: true });
    return;
  }
  if (action === "use-module-qa-suggestion") {
    appState.composerText = actionTarget.dataset.prompt || "";
    render({ focus: "#composer-input", suppressPageAnimation: true });
    return;
  }
  if (action === "new-task") { appState.page = appState.page === "ai" ? "ai" : "work"; if (appState.page === "work") resetWorkConversation(); else appState.composerText = ""; appState.projectPickerOpen = false; appState.composerSkillPickerOpen = false; appState.composerModelPickerOpen = false; appState.selectedComposerSkills = []; render({ focus: "#composer-input" }); showToast(appState.page === "ai" ? "已新建会话" : "已新建任务"); }
  if (action === "remove-composer-skill") {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    const skill = actionTarget.dataset.composerSkill;
    appState.selectedComposerSkills = appState.selectedComposerSkills.filter(item => item !== skill);
    render({ focus: "#composer-input", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    showToast(`已移除技能：${skill}`);
    return;
  }
  if (action === "toggle-composer-skill-picker") {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.composerSkillPickerOpen = !appState.composerSkillPickerOpen;
    appState.composerModelPickerOpen = false;
    render({ focus: appState.composerSkillPickerOpen ? "#composer-skill-search" : "[data-action='toggle-composer-skill-picker']", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    return;
  }
  if (action === "create-skill") {
    if (actionTarget.dataset.skillContext === "schedule") {
      syncScheduleDraft();
      appState.scheduleSkillPickerOpen = false;
      render({ focus: "[data-schedule-field='description']" });
    } else {
      const composerValue = document.querySelector("#composer-input")?.value ?? "";
      appState.composerSkillPickerOpen = false;
      render({ focus: "#composer-input", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    }
    showToast("创建技能向导已打开");
    return;
  }
  if (action === "toggle-composer-model-picker") {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.composerModelPickerOpen = !appState.composerModelPickerOpen;
    appState.composerSkillPickerOpen = false;
    render({ focus: appState.composerModelPickerOpen ? ".composer-model-menu .composer-model-option" : "[data-action='toggle-composer-model-picker']", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    return;
  }
  if (action === "toggle-project-picker") {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.projectPickerOpen = !appState.projectPickerOpen;
    render({
      focus: appState.projectPickerOpen ? "#composer-project-search" : ".project-access-trigger",
      composerValue,
      preserveScroll: true,
      preventFocusScroll: true,
      suppressPageAnimation: true,
    });
  }
  if (action === "select-composer-project") {
    const project = projectGroups.find(item => item.id === Number(actionTarget.dataset.id));
    if (project) {
      const composerValue = document.querySelector("#composer-input")?.value ?? "";
      rememberComposerProject(project.id);
      appState.projectPickerOpen = false;
      render({ focus: ".project-access-trigger", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
      showToast(`已选择项目：${project.name}`);
    }
  }
  if (action === "new-project-from-picker") {
    appState.composerText = document.querySelector("#composer-input")?.value ?? appState.composerText;
    appState.projectPickerOpen = false;
    appState.createProjectFromPicker = true;
    openProjectDialog("create");
  }
  if (action === "open-schedule") openScheduleModal();
  if (action === "toggle-schedule-skill-picker") {
    syncScheduleDraft();
    appState.scheduleSkillPickerOpen = !appState.scheduleSkillPickerOpen;
    appState.scheduleModelPickerOpen = false;
    render({ focus: appState.scheduleSkillPickerOpen ? "#schedule-skill-search" : "[data-action='toggle-schedule-skill-picker']" });
  }
  if (action === "toggle-schedule-model-picker") {
    syncScheduleDraft();
    appState.scheduleModelPickerOpen = !appState.scheduleModelPickerOpen;
    appState.scheduleSkillPickerOpen = false;
    render({ focus: appState.scheduleModelPickerOpen ? ".schedule-model-picker .composer-model-option" : "[data-action='toggle-schedule-model-picker']" });
  }
  if (action === "add-schedule-attachment") document.querySelector("#schedule-attachment-input")?.click();
  if (action === "remove-schedule-attachment") {
    syncScheduleDraft();
    appState.scheduleDraft.attachments.splice(Number(actionTarget.dataset.attachmentIndex), 1);
    render();
  }
  if (action === "remove-schedule-skill") {
    syncScheduleDraft();
    appState.scheduleDraft.skills = appState.scheduleDraft.skills.filter(skill => skill !== actionTarget.dataset.skill);
    render();
  }
  if (action === "add-schedule-time") {
    const scheduleScrollTop = document.querySelector(".schedule-dialog-body")?.scrollTop ?? 0;
    syncScheduleDraft();
    const times = scheduleTimes(appState.scheduleDraft);
    if (times.length >= 8) { showToast("一天最多设置 8 个执行时间"); return; }
    appState.scheduleDraft.times = [...times, nextScheduleTime(times)];
    appState.scheduleDraft.time = appState.scheduleDraft.times[0];
    render({ focus: `[data-schedule-time="${appState.scheduleDraft.times.length - 1}"]`, scheduleScrollTop });
  }
  if (action === "remove-schedule-time") {
    const scheduleScrollTop = document.querySelector(".schedule-dialog-body")?.scrollTop ?? 0;
    syncScheduleDraft();
    const times = scheduleTimes(appState.scheduleDraft);
    if (times.length === 1) { showToast("至少保留一个执行时间"); return; }
    times.splice(Number(actionTarget.dataset.timeIndex), 1);
    appState.scheduleDraft.times = times;
    appState.scheduleDraft.time = times[0];
    render({ scheduleScrollTop });
  }
  if (action === "add-schedule-month-day") {
    const scheduleScrollTop = document.querySelector(".schedule-dialog-body")?.scrollTop ?? 0;
    syncScheduleDraft();
    const days = scheduleDaysOfMonth(appState.scheduleDraft);
    if (days.length >= 28) { showToast("每月最多设置 28 个执行日期"); return; }
    const nextDay = nextScheduleMonthDay(days);
    appState.scheduleDraft.daysOfMonth = [...days, nextDay].sort((first, second) => Number(first) - Number(second));
    appState.scheduleDraft.dayOfMonth = appState.scheduleDraft.daysOfMonth[0];
    render({ focus: `[data-schedule-month-day="${appState.scheduleDraft.daysOfMonth.indexOf(nextDay)}"]`, scheduleScrollTop });
  }
  if (action === "remove-schedule-month-day") {
    const scheduleScrollTop = document.querySelector(".schedule-dialog-body")?.scrollTop ?? 0;
    syncScheduleDraft();
    const days = scheduleDaysOfMonth(appState.scheduleDraft);
    if (days.length === 1) { showToast("至少保留一个执行日期"); return; }
    days.splice(Number(actionTarget.dataset.monthDayIndex), 1);
    appState.scheduleDraft.daysOfMonth = days;
    appState.scheduleDraft.dayOfMonth = days[0];
    render({ scheduleScrollTop });
  }
  if (action === "close-schedule") { appState.scheduleModal = false; appState.scheduleDraft = null; appState.editingScheduleId = null; appState.scheduleSkillPickerOpen = false; appState.scheduleModelPickerOpen = false; render(); }
  if (action === "save-schedule") saveSchedule();
  if (action === "edit-schedule") openScheduleModal(actionTarget.dataset.id);
  if (action === "delete-schedule") {
    const task = scheduleTasks.find(item => item.id === Number(actionTarget.dataset.id));
    scheduleTasks = scheduleTasks.filter(item => item.id !== Number(actionTarget.dataset.id));
    render();
    showToast(`${task?.name || "定时任务"}已删除`);
  }
  if (action === "toggle-schedule") {
    const task = scheduleTasks.find(item => item.id === Number(actionTarget.dataset.id));
    if (task) {
      task.active = !task.active;
      task.status = task.active ? "正常" : "已暂停";
      render();
      showToast(task.active ? "定时任务已开启" : "定时任务已关闭");
    }
  }
  if (action === "send") {
    const input = document.querySelector("#composer-input");
    if (!input?.value.trim()) { input?.focus(); showToast("请输入内容后发送"); return; }
    if (appState.page === "work") { startWorkConversation(input.value.trim()); return; }
    if (appState.moduleQaOpen && ["api", "skills"].includes(appState.page)) {
      const question = input.value.trim();
      const answer = appState.page === "api"
        ? "我可以根据你的问题筛选接口，并说明请求方式、参数和返回字段。你也可以直接告诉我想查的数据。"
        : "我可以按研究目标推荐技能，并把它们组合成一套可执行的投研工作流。";
      appState.moduleQaMessages = [...appState.moduleQaMessages, { role: "user", text: question }, { role: "assistant", text: answer }];
      appState.composerText = "";
      render({ focus: "#composer-input", suppressPageAnimation: true });
      requestAnimationFrame(() => {
        const messages = document.querySelector(".module-qa-messages");
        if (messages) messages.scrollTop = messages.scrollHeight;
      });
      return;
    }
    showToast("问题已提交");
    appState.composerText = "";
    input.value = "";
  }
  if (action === "toggle-thinking-summary") { appState.workThinkingExpanded = !appState.workThinkingExpanded; render({ suppressPageAnimation: true }); }
  if (action === "toggle-thinking-step") {
    const index = Number(actionTarget.dataset.thinkingStepIndex);
    appState.workThinkingStepsExpanded = appState.workThinkingStepsExpanded.includes(index)
      ? appState.workThinkingStepsExpanded.filter(item => item !== index)
      : [...appState.workThinkingStepsExpanded, index];
    render({ suppressPageAnimation: true });
  }
  if (action === "toggle-artifact-panel") {
    appState.workPanel = appState.workPanel?.startsWith("artifact") ? null : "artifact-list";
    appState.artifactEditDraft = null;
    render({ suppressPageAnimation: true });
  }
  if (action === "open-artifact-list") { appState.workPanel = "artifact-list"; appState.artifactEditDraft = null; render({ suppressPageAnimation: true }); }
  if (action === "open-artifact") {
    const index = Number(actionTarget.dataset.artifactIndex);
    appState.selectedArtifact = index;
    if (!appState.openedArtifactTabs.includes(index)) appState.openedArtifactTabs = [...appState.openedArtifactTabs, index];
    appState.workPanel = "artifact-detail";
    appState.artifactEditDraft = null;
    appState.sidebarCollapsed = true;
    render({ suppressPageAnimation: true });
  }
  if (action === "activate-artifact-tab") {
    appState.selectedArtifact = Number(actionTarget.dataset.artifactIndex);
    appState.workPanel = "artifact-detail";
    appState.artifactEditDraft = null;
    appState.sidebarCollapsed = true;
    render({ suppressPageAnimation: true });
  }
  if (action === "add-artifact-to-knowledge") {
    const index = Number(actionTarget.dataset.artifactIndex);
    if (!Number.isInteger(index) || !workArtifacts[index]) return;
    if (appState.knowledgeArtifacts.includes(index)) {
      showToast("产物已在知识库");
      return;
    }
    appState.knowledgeArtifacts = [...appState.knowledgeArtifacts, index];
    render({ suppressPageAnimation: true });
    showToast("产物已添加到知识库");
    return;
  }
  if (action === "edit-artifact") {
    const index = Number(actionTarget.dataset.artifactIndex);
    const artifact = workArtifacts[index];
    if (!artifact) return;
    appState.selectedArtifact = index;
    appState.workPanel = "artifact-detail";
    appState.artifactEditDraft = { index, name: artifact.name, content: artifactContent(artifact) };
    render({ focus: "[data-artifact-field='name']", suppressPageAnimation: true });
    return;
  }
  if (action === "cancel-edit-artifact") {
    appState.artifactEditDraft = null;
    render({ suppressPageAnimation: true });
    return;
  }
  if (action === "save-artifact") {
    const draft = appState.artifactEditDraft;
    const artifact = draft ? workArtifacts[draft.index] : null;
    if (!draft || !artifact) return;
    document.querySelectorAll("[data-artifact-field]").forEach(field => {
      draft[field.dataset.artifactField] = field.value;
    });
    const name = draft.name.trim();
    if (!name) {
      document.querySelector("[data-artifact-field='name']")?.focus();
      showToast("请输入文件名称");
      return;
    }
    artifact.name = name;
    artifact.content = draft.content.trim();
    appState.artifactEditDraft = null;
    render({ suppressPageAnimation: true });
    showToast("产物已保存");
    return;
  }
  if (action === "close-artifact-tab") {
    const index = Number(actionTarget.dataset.artifactIndex);
    const tabPosition = appState.openedArtifactTabs.indexOf(index);
    appState.openedArtifactTabs = appState.openedArtifactTabs.filter(item => item !== index);
    if (appState.selectedArtifact === index) {
      const nextIndex = appState.openedArtifactTabs[Math.min(tabPosition, appState.openedArtifactTabs.length - 1)];
      if (nextIndex === undefined) appState.workPanel = "artifact-list";
      else appState.selectedArtifact = nextIndex;
      appState.artifactEditDraft = null;
    }
    render({ suppressPageAnimation: true });
  }
  if (action === "activate-reference-tab") {
    appState.selectedReference = Number(actionTarget.dataset.referenceIndex);
    appState.workPanel = "reference";
    appState.sidebarCollapsed = true;
    render({ suppressPageAnimation: true });
  }
  if (action === "close-reference-tab") {
    const index = Number(actionTarget.dataset.referenceIndex);
    const tabPosition = appState.openedReferenceTabs.indexOf(index);
    appState.openedReferenceTabs = appState.openedReferenceTabs.filter(item => item !== index);
    if (appState.selectedReference === index) {
      const nextIndex = appState.openedReferenceTabs[Math.min(tabPosition, appState.openedReferenceTabs.length - 1)];
      if (nextIndex === undefined) appState.workPanel = "workbench";
      else appState.selectedReference = nextIndex;
    }
    render({ suppressPageAnimation: true });
  }
  if (action === "toggle-workbench-panel") {
    appState.workPanel = appState.workPanel === "workbench" || appState.workPanel === "reference" ? null : "workbench";
    render({ suppressPageAnimation: true });
  }
  if (action === "open-workbench") { appState.workPanel = "workbench"; render({ suppressPageAnimation: true }); }
  if (action === "open-reference") {
    const index = Number(actionTarget.dataset.referenceIndex);
    appState.selectedReference = index;
    if (!appState.openedReferenceTabs.includes(index)) appState.openedReferenceTabs = [...appState.openedReferenceTabs, index];
    appState.workPanel = "reference";
    appState.sidebarCollapsed = true;
    render({ suppressPageAnimation: true });
  }
  if (action === "close-work-panel") { appState.workPanel = null; appState.artifactEditDraft = null; render({ suppressPageAnimation: true }); }
  if (action === "select-skill") {
    const input = document.querySelector("#composer-input");
    const skill = actionTarget.dataset.skill;
    if (appState.page === "work") {
      const composerValue = input?.value ?? appState.composerText;
      const selected = appState.selectedComposerSkills.includes(skill);
      appState.selectedComposerSkills = selected
        ? appState.selectedComposerSkills.filter(item => item !== skill)
        : [...appState.selectedComposerSkills, skill];
      render({ focus: "#composer-input", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
      showToast(selected ? `已移除技能：${skill}` : `已添加技能：${skill}`);
      return;
    }
    if (input) {
      appState.composerText = `请使用${skill}帮我完成：`;
      input.value = appState.composerText;
      input.focus();
    }
  }
  if (action === "toggle-skill") { actionTarget.classList.toggle("on"); actionTarget.setAttribute("aria-pressed", actionTarget.classList.contains("on")); showToast(actionTarget.classList.contains("on") ? "技能已启用" : "技能已停用"); }
  if (action === "toggle-category") { actionTarget.closest(".api-category")?.classList.toggle("open"); }
  if (action === "copy-api") { navigator.clipboard?.writeText("https://gw.datayes.com/aladdin_llm_mgmt/web/whitelist/api/catalog/all"); showToast("接口地址已复制"); }
  if (action === "new-project") { appState.createProjectFromPicker = false; openProjectDialog("create"); }
  if (action === "toggle-project-menu") {
    const id = Number(actionTarget.dataset.id);
    if (appState.projectMenu?.id === id) { appState.projectMenu = null; render(); return; }
    const rect = actionTarget.getBoundingClientRect();
    const projectScrollTop = actionTarget.closest(".sidebar-scroll")?.scrollTop ?? 0;
    appState.taskMenu = null;
    appState.projectMenu = { id, left: Math.min(rect.right - 144, window.innerWidth - 152), top: rect.bottom + 4 };
    render({ focus: ".project-menu button", projectScrollTop });
  }
  if (action === "toggle-task-menu") {
    const projectId = Number(actionTarget.dataset.projectId);
    const fileIndex = Number(actionTarget.dataset.fileIndex);
    if (appState.taskMenu?.projectId === projectId && appState.taskMenu?.fileIndex === fileIndex) { appState.taskMenu = null; render(); return; }
    const rect = actionTarget.getBoundingClientRect();
    const projectScrollTop = actionTarget.closest(".sidebar-scroll")?.scrollTop ?? 0;
    appState.projectMenu = null;
    appState.taskMenu = { projectId, fileIndex, left: Math.min(rect.right - 144, window.innerWidth - 152), top: rect.bottom + 4 };
    render({ focus: ".task-menu button", projectScrollTop });
  }
  if (action === "open-project-task") {
    const task = getProjectTask(actionTarget.dataset.projectId, actionTarget.dataset.fileIndex);
    openStoredWorkSession(task);
  }
  if (action === "rename-project-task") openTaskDialog("rename", actionTarget.dataset.projectId, actionTarget.dataset.fileIndex);
  if (action === "pin-project-task") toggleProjectTaskPin(actionTarget.dataset.projectId, actionTarget.dataset.fileIndex);
  if (action === "share-project-task") shareProjectTask(actionTarget.dataset.projectId, actionTarget.dataset.fileIndex);
  if (action === "confirm-delete-project-task") openTaskDialog("delete", actionTarget.dataset.projectId, actionTarget.dataset.fileIndex);
  if (action === "close-task-dialog") closeTaskDialog();
  if (action === "save-project-task-name") saveProjectTaskName();
  if (action === "delete-project-task") deleteProjectTask();
  if (action === "edit-project") openProjectDialog("edit", actionTarget.dataset.id);
  if (action === "confirm-delete-project") openProjectDialog("delete", actionTarget.dataset.id);
  if (action === "close-project-dialog") closeProjectDialog();
  if (action === "save-project") saveProject();
  if (action === "delete-project") deleteProject(appState.editingProjectId);
  if (action === "pin-project") {
    const project = projectGroups.find(item => item.id === Number(actionTarget.dataset.id));
    if (project) { project.pinned = !project.pinned; appState.projectMenu = null; render(); showToast(project.pinned ? "项目已置顶" : "已取消置顶"); }
  }
  if (action === "refresh-skills") showToast("技能列表已刷新");
  if (action === "refresh-points") showToast("积分已刷新");
  if (action === "history") { appState.page = "ai"; render({ focus: "#composer-input" }); showToast("历史会话已载入"); }
  if (action === "project") {
    const project = projectGroups.find(item => item.id === Number(actionTarget.dataset.id));
    if (project) {
      const sidebarScroll = actionTarget.closest(".sidebar-scroll");
      const scrollTop = sidebarScroll?.scrollTop ?? 0;
      project.expanded = project.expanded === false;
      const group = actionTarget.closest(".project-group");
      group?.classList.toggle("collapsed", !project.expanded);
      actionTarget.setAttribute("aria-expanded", String(project.expanded));
      if (sidebarScroll) sidebarScroll.scrollTop = scrollTop;
    }
  }
  if (action === "top-link") { event.preventDefault(); showToast(`${actionTarget.textContent.trim()}页面入口`); }
  if (action === "toast") showToast(actionTarget.dataset.message || "操作已完成");
});

document.addEventListener("input", event => {
  if (event.target.id === "composer-input") appState.composerText = event.target.value;
  if (event.target.matches("[data-artifact-field]") && appState.artifactEditDraft) {
    appState.artifactEditDraft[event.target.dataset.artifactField] = event.target.value;
  }
  if (event.target.matches(".composer-skill-search input")) {
    const query = event.target.value.trim().toLocaleLowerCase("zh-CN");
    let visibleCount = 0;
    const picker = event.target.closest(".composer-skill-picker");
    picker?.querySelectorAll(".composer-skill-options .composer-skill-option").forEach(option => {
      const matches = !query || option.textContent.trim().toLocaleLowerCase("zh-CN").includes(query);
      option.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    const empty = picker?.querySelector(".composer-skill-empty");
    if (empty) empty.hidden = visibleCount > 0;
  }
  if (event.target.id === "composer-project-search") {
    const query = event.target.value.trim().toLocaleLowerCase("zh-CN");
    let visibleCount = 0;
    document.querySelectorAll(".project-picker-list .project-picker-option").forEach(option => {
      const matches = !query || option.textContent.trim().toLocaleLowerCase("zh-CN").includes(query);
      option.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    const empty = document.querySelector(".project-picker-empty");
    if (empty) empty.hidden = visibleCount > 0;
  }
  if (event.target.id === "library-search") {
    appState.librarySearch = event.target.value;
    const query = event.target.value.trim().toLowerCase();
    let visibleCount = 0;
    document.querySelectorAll(".library-card[data-skill-search]").forEach(card => {
      const matches = !query || card.dataset.skillSearch.includes(query);
      card.classList.toggle("is-filtered", !matches);
      if (matches) visibleCount += 1;
    });
    const count = document.querySelector(".skill-count");
    if (count) count.textContent = visibleCount;
    document.querySelector(".skill-library .empty-result")?.classList.toggle("is-hidden", visibleCount > 0);
  }
  if (event.target.id === "api-search") {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll(".api-category").forEach(category => {
      const match = category.textContent.toLowerCase().includes(query);
      category.style.display = match ? "block" : "none";
      if (query && match) category.classList.add("open");
    });
  }
  if (event.target.id === "schedule-search") {
    appState.scheduleSearch = event.target.value;
    render({ focus: "#schedule-search", preserveScroll: true, suppressPageAnimation: true });
  }
  if (event.target.matches("[data-schedule-field]") && appState.scheduleDraft) {
    appState.scheduleDraft[event.target.dataset.scheduleField] = event.target.value;
    updateSchedulePreview();
  }
  if (event.target.matches("[data-schedule-time]") && appState.scheduleDraft) {
    const index = Number(event.target.dataset.scheduleTime);
    const times = Array.isArray(appState.scheduleDraft.times) && appState.scheduleDraft.times.length
      ? [...appState.scheduleDraft.times]
      : [appState.scheduleDraft.time || "07:30"];
    times[index] = event.target.value;
    appState.scheduleDraft.times = times;
    appState.scheduleDraft.time = times[0];
    updateSchedulePreview();
  }
  if (event.target.matches("[data-schedule-month-day]") && appState.scheduleDraft) {
    const index = Number(event.target.dataset.scheduleMonthDay);
    const days = scheduleDaysOfMonth(appState.scheduleDraft);
    days[index] = event.target.value;
    appState.scheduleDraft.daysOfMonth = days;
    appState.scheduleDraft.dayOfMonth = days[0];
    updateSchedulePreview();
  }
  if (event.target.matches("[data-project-field]") && appState.projectDraft) {
    appState.projectDraft[event.target.dataset.projectField] = event.target.value;
  }
  if (event.target.matches("[data-task-field]") && appState.taskDialogMode === "rename") {
    appState.taskDraftName = event.target.value;
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-schedule-workdays]") && appState.scheduleDraft) {
    syncScheduleDraft();
    appState.scheduleDraft.workdaysOnly = event.target.checked;
    if (appState.scheduleDraft.workdaysOnly) appState.scheduleDraft.weekdays = ["一", "二", "三", "四", "五"];
    render();
    return;
  }
  if (event.target.id !== "schedule-attachment-input" || !appState.scheduleDraft) return;
  syncScheduleDraft();
  const current = appState.scheduleDraft.attachments || [];
  const additions = [...event.target.files].map(file => ({ name: file.name, size: file.size, type: file.type }));
  appState.scheduleDraft.attachments = [...current, ...additions.filter(file => !current.some(item => item.name === file.name))];
  render();
});

document.addEventListener("keydown", event => {
  const resizeHandle = event.target.closest?.("[data-resize-handle]");
  if (resizeHandle && resizePanelFromKeyboard(event, resizeHandle)) return;
  if (["ArrowDown", "ArrowUp"].includes(event.key) && document.activeElement?.closest(".composer-picker-menu")) {
    event.preventDefault();
    const menu = document.activeElement.closest(".composer-picker-menu");
    const items = [...menu.querySelectorAll("button:not([hidden])")];
    const current = items.indexOf(document.activeElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const next = current === -1
      ? (direction === 1 ? 0 : items.length - 1)
      : (current + direction + items.length) % items.length;
    items[next]?.focus({ preventScroll: false });
    return;
  }
  if (["ArrowDown", "ArrowUp"].includes(event.key) && document.activeElement?.closest(".project-picker-menu")) {
    event.preventDefault();
    const items = [...document.querySelectorAll(".project-picker-menu button:not([hidden])")];
    const current = items.indexOf(document.activeElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    items[(current + direction + items.length) % items.length]?.focus();
    return;
  }
  if (["ArrowDown", "ArrowUp"].includes(event.key) && document.activeElement?.closest(".project-menu")) {
    event.preventDefault();
    const items = [...document.querySelectorAll(".project-menu button")];
    const current = items.indexOf(document.activeElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    items[(current + direction + items.length) % items.length]?.focus();
    return;
  }
  if (event.key === "Enter" && event.target.id === "composer-input" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault();
    event.target.closest(".composer, .conversation-composer")?.querySelector("[data-action='send']")?.click();
    return;
  }
  if (event.key === "Enter" && document.activeElement?.id === "project-name" && appState.projectDialogMode && appState.projectDialogMode !== "delete") {
    event.preventDefault();
    saveProject();
    return;
  }
  if (event.key === "Enter" && document.activeElement?.id === "task-name" && appState.taskDialogMode === "rename") {
    event.preventDefault();
    saveProjectTaskName();
    return;
  }
  if (event.key === "Escape" && appState.taskDialogMode) { closeTaskDialog(); return; }
  if (event.key === "Escape" && appState.artifactEditDraft) { appState.artifactEditDraft = null; render({ suppressPageAnimation: true }); return; }
  if (event.key === "Escape" && appState.workPanel) { appState.workPanel = null; render({ suppressPageAnimation: true }); return; }
  if (event.key === "Escape" && appState.projectDialogMode) { closeProjectDialog(); return; }
  if (event.key === "Escape" && appState.composerSkillPickerOpen) {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.composerSkillPickerOpen = false;
    render({ focus: "[data-action='toggle-composer-skill-picker']", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    return;
  }
  if (event.key === "Escape" && appState.composerModelPickerOpen) {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.composerModelPickerOpen = false;
    render({ focus: "[data-action='toggle-composer-model-picker']", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    return;
  }
  if (event.key === "Escape" && appState.projectPickerOpen) {
    const composerValue = document.querySelector("#composer-input")?.value ?? "";
    appState.projectPickerOpen = false;
    render({ focus: ".project-access-trigger", composerValue, preserveScroll: true, preventFocusScroll: true, suppressPageAnimation: true });
    return;
  }
  if (event.key === "Escape" && appState.projectMenu) { appState.projectMenu = null; render(); return; }
  if (event.key === "Escape" && appState.taskMenu) { appState.taskMenu = null; render(); return; }
  if (event.key === "Escape" && appState.scheduleModelPickerOpen) { appState.scheduleModelPickerOpen = false; render({ focus: "[data-action='toggle-schedule-model-picker']" }); return; }
  if (event.key === "Escape" && appState.scheduleSkillPickerOpen) { appState.scheduleSkillPickerOpen = false; render({ focus: "[data-action='toggle-schedule-skill-picker']" }); return; }
  if (event.key === "Escape" && appState.scheduleModal) { appState.scheduleModal = false; appState.scheduleDraft = null; appState.editingScheduleId = null; appState.scheduleSkillPickerOpen = false; appState.scheduleModelPickerOpen = false; render(); return; }
  if (event.key === "Escape" && appState.mobileSidebar) { appState.mobileSidebar = false; render(); }
  if (event.key === "Escape" && appState.moduleQaOpen) {
    appState.moduleQaOpen = false;
    if (appState.moduleQaSidebarWasCollapsed !== null) appState.sidebarCollapsed = appState.moduleQaSidebarWasCollapsed;
    appState.moduleQaSidebarWasCollapsed = null;
    render({ suppressPageAnimation: true });
  }
});

window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1);
  if (pageIds.includes(page) && page !== appState.page) {
    appState.page = page;
    appState.projectMenu = null;
    appState.taskMenu = null;
    appState.composerSkillPickerOpen = false;
    appState.composerModelPickerOpen = false;
    appState.mobileSidebar = false;
    if (appState.moduleQaOpen && appState.moduleQaSidebarWasCollapsed !== null) appState.sidebarCollapsed = appState.moduleQaSidebarWasCollapsed;
    appState.moduleQaOpen = false;
    appState.moduleQaSidebarWasCollapsed = null;
    render();
  }
});

const dismissSidebarMenus = () => {
  if (!appState.projectMenu && !appState.taskMenu) return;
  appState.projectMenu = null;
  appState.taskMenu = null;
  document.querySelectorAll(".project-menu").forEach(menu => menu.remove());
  document.querySelectorAll(".project-more[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
  document.querySelectorAll(".project-file-more[aria-expanded='true']").forEach(button => button.setAttribute("aria-expanded", "false"));
};

const dismissComposerPickers = event => {
  if (event?.target?.closest?.(".composer-picker-menu")) return;
  if (!appState.composerSkillPickerOpen && !appState.composerModelPickerOpen) return;
  appState.composerSkillPickerOpen = false;
  appState.composerModelPickerOpen = false;
  document.querySelectorAll(".composer-picker-menu").forEach(menu => menu.remove());
  document.querySelectorAll("[data-action='toggle-composer-skill-picker'], [data-action='toggle-composer-model-picker']").forEach(button => button.setAttribute("aria-expanded", "false"));
};

document.addEventListener("scroll", event => { dismissSidebarMenus(); dismissComposerPickers(event); }, true);
window.addEventListener("resize", () => {
  finishPanelResize();
  constrainVisiblePanelWidths();
  dismissSidebarMenus();
  dismissComposerPickers();
});

render();

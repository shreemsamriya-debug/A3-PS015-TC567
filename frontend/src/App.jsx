
import { useEffect, useState } from "react";

const NAV = [
  ["overview", "Overview", "▦"],
  ["diagnostics", "Live Diagnostics", "⌁"],
  ["connection", "Connection Analysis", "◎"],
  ["diagnosis", "Explainable Diagnosis", "✧"],
  ["recommendations", "Recommendations", "↗"],
  ["reports", "Reports & History", "▤"],
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  font-family:'DM Sans',sans-serif;
  color:#1a2c42;
  background:#f3f6fa;
  font-synthesis:none;
  text-rendering:optimizeLegibility;
  -webkit-font-smoothing:antialiased;
  --navy:#10243e;
  --teal:#11a99a;
  --muted:#8493a5;
  --border:#e7edf3;
  --green:#159b72;
  --red:#d94e5b;
}
*{box-sizing:border-box}
body{margin:0;min-width:320px;background:#f3f6fa}
button{font:inherit;cursor:pointer}
button:disabled{opacity:.6;cursor:not-allowed}
.app{display:flex;min-height:100vh}
.sidebar{width:252px;min-width:252px;background:#10243e;color:white;padding:27px 17px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;z-index:5}
.brand{display:flex;align-items:center;gap:12px;padding:0 9px 37px}
.brand-icon{width:43px;height:43px;display:grid;place-items:center;border-radius:13px;background:linear-gradient(135deg,#24cbb6,#078779);font-size:24px;font-weight:800;box-shadow:0 5px 16px #0c827a55}
.brand-name{font-family:Manrope,sans-serif;font-size:18px;font-weight:800;letter-spacing:-.5px}
.brand-sub{font-size:9px;letter-spacing:2px;color:#8fa9bd;margin-top:3px;font-weight:700}
.nav-label{font-size:10px;letter-spacing:1.7px;color:#8298ad;padding:0 12px;margin-bottom:13px;font-weight:800}
.nav-list{display:flex;flex-direction:column;gap:7px}
.nav-btn{border:0;background:transparent;color:#b9c8d7;padding:13px 13px;border-radius:10px;text-align:left;display:flex;align-items:center;gap:13px;font-size:12px;font-weight:600;transition:.2s}
.nav-btn:hover{background:#ffffff10;color:white}
.nav-btn.active{background:linear-gradient(100deg,#147c7d,#176b76);color:white;box-shadow:0 5px 15px #071d2b44}
.nav-icon{font-size:18px;width:21px;text-align:center}
.side-bottom{margin-top:auto;border-top:1px solid #ffffff20;padding:20px 8px 3px;display:flex;gap:10px;align-items:center}
.green-dot{height:8px;width:8px;border-radius:50%;background:#2bd4a3;box-shadow:0 0 10px #2bd4a388}
.side-bottom strong{font-size:11px;display:block}
.side-bottom span{font-size:10px;color:#91a6b9}
.main{flex:1;min-width:0}
.topbar{height:72px;background:white;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 38px;position:sticky;top:0;z-index:4}
.breadcrumb{font-size:12px;color:#8a99aa}
.breadcrumb strong{color:#20364c}
.top-right{display:flex;align-items:center;gap:9px;color:#718397;font-size:11px}
.top-content{max-width:1600px;margin:auto;padding:30px 38px 45px}
.hero{padding:35px 38px;border-radius:17px;background:radial-gradient(circle at 85% 15%,#27bcae44,transparent 30%),linear-gradient(110deg,#102b48,#17485b 65%,#117d78);color:white;display:flex;justify-content:space-between;align-items:center;gap:25px;margin-bottom:23px;min-height:215px;box-shadow:0 12px 30px #102b481b}
.hero-copy{max-width:700px}
.eyebrow{font-size:9px;font-weight:800;letter-spacing:1.8px;color:#0b9b8e;margin-bottom:10px;text-transform:uppercase}
.hero .eyebrow{color:#62ddcb}
.hero h1{font-family:Manrope,sans-serif;font-size:clamp(27px,3vw,38px);line-height:1.22;letter-spacing:-1.2px;margin:0;color:white;font-weight:800}
.hero p{font-size:12px;line-height:1.8;color:#c5d9e4;max-width:590px;margin:13px 0 0}
.btn{border:0;border-radius:9px;padding:12px 18px;font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:.2s;white-space:nowrap}
.btn-primary{background:#12aa99;color:white;box-shadow:0 5px 15px #12aa9930}
.btn-primary:hover:not(:disabled){background:#078b80;transform:translateY(-2px)}
.hero .btn-primary{background:white;color:#116f70;min-height:46px}
.btn-light{background:#eaf7f5;color:#087e75;border:1px solid #d4eeea}
.btn-light:hover{background:#d9f1ed}
.status{background:white;border:1px solid var(--border);border-radius:11px;padding:15px 19px;display:flex;align-items:center;gap:13px;margin-bottom:28px;box-shadow:0 4px 18px #1a36500a}
.status-icon{height:34px;width:34px;border-radius:10px;background:#e5f7ef;color:#139b72;display:grid;place-items:center;font-weight:800}
.status.good{border-left:4px solid #159b72}
.status.bad{border-left:4px solid #d94e5b}
.status.bad .status-icon{background:#fff0f1;color:#d94e5b}
.status strong{font-size:12px;display:block}
.status p{font-size:10px;color:var(--muted);margin:4px 0 0}
.heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin:26px 0 17px}
.heading h2{font-family:Manrope,sans-serif;font-size:20px;letter-spacing:-.5px;color:#182f48;margin:0;font-weight:800}
.heading p{font-size:11px;color:var(--muted);margin:6px 0 0;line-height:1.6}
.heading .eyebrow{margin-bottom:7px}
.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:22px}
.metric{background:white;border:1px solid var(--border);border-radius:13px;padding:19px;min-height:140px;box-shadow:0 5px 22px #1a36500a;position:relative;overflow:hidden;transition:.2s}
.metric:hover{transform:translateY(-3px);box-shadow:0 10px 25px #1a365012}
.metric:after{content:"";height:3px;position:absolute;bottom:0;left:0;right:0;background:linear-gradient(90deg,#0d968c,#65d7c3)}
.metric-top{display:flex;align-items:center;gap:10px;color:#72849a;font-size:11px;font-weight:700}
.metric-icon{width:32px;height:32px;border-radius:9px;background:#e9f8f5;color:#0a9b8e;display:grid;place-items:center;font-size:17px}
.metric-value{font-family:Manrope,sans-serif;font-size:27px;font-weight:800;letter-spacing:-.8px;color:#18324b;margin-top:16px}
.metric-desc{font-size:9px;color:#9aa7b5;margin-top:5px}
.panel{background:white;border:1px solid var(--border);border-radius:14px;padding:23px;margin-bottom:19px;box-shadow:0 5px 22px #1a36500a;min-width:0}
.panel-title{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:20px}
.panel-title h3{font-size:14px;color:#203850;margin:0;font-weight:800}
.panel-title p{font-size:10px;color:#94a1b0;margin:6px 0 0}
.two-col{display:grid;grid-template-columns:1.35fr .85fr;gap:18px;margin-bottom:19px}
.two-col .panel{margin-bottom:0}
.chart-wrap{width:100%;min-width:0}
.chart-svg{width:100%;height:auto;display:block;overflow:visible}
.chart-legend{display:flex;gap:14px;align-items:center;flex-wrap:wrap;color:#8493a5;font-size:9px;margin-top:9px}
.legend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}
.confidence-wrap{display:flex;align-items:center;justify-content:center;padding:4px 0 15px}
.confidence-ring{width:145px;height:145px;position:relative}
.confidence-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.confidence-ring circle{fill:none;stroke-width:9}
.ring-value{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center}
.ring-value strong{font-family:Manrope,sans-serif;font-size:30px;color:#173b4d}
.ring-value span{font-size:10px;color:#8b9aaa}
.confidence-list{display:grid;gap:0}
.confidence-line{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #edf1f5;font-size:10px;color:#8291a1}
.confidence-line strong{color:#213c53}
.health-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
.health-item{display:flex;align-items:center;gap:11px;padding:14px;border-radius:10px;background:#f8fafc;border:1px solid #edf1f5;min-width:0}
.health-icon{width:31px;height:31px;min-width:31px;border-radius:9px;background:#e5f7ef;color:#139b72;display:grid;place-items:center;font-weight:800}
.health-icon.wait{background:#fff5e5;color:#bd852d}
.health-copy{min-width:0;flex:1}
.health-copy strong{font-size:10px;color:#294158;display:block}
.health-copy span{font-size:9px;color:#94a1b0;display:block;margin-top:4px;overflow-wrap:anywhere}
.health-state{font-size:9px;font-weight:800;color:#159b72;white-space:nowrap}
.health-state.wait{color:#bd852d}
.workflow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.workflow-item{padding:15px;background:#f7fafc;border:1px solid #edf1f5;border-radius:10px}
.workflow-item b{font-family:Manrope,sans-serif;color:#0c9c91;font-size:18px}
.workflow-item h4{font-size:12px;color:#1c354e;margin:9px 0 5px}
.workflow-item p{font-size:9px;line-height:1.6;color:#8493a5;margin:0}
.detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.detail-card{padding:16px;border:1px solid #edf1f5;background:#f8fafc;border-radius:10px;min-width:0}
.detail-label{font-size:9px;text-transform:uppercase;letter-spacing:.7px;font-weight:800;color:#8493a5;margin-bottom:9px}
.detail-value{font-family:Manrope,sans-serif;font-size:18px;font-weight:800;color:#1c3851;overflow-wrap:anywhere}
.detail-desc{font-size:9px;color:#9aa7b5;margin-top:6px;line-height:1.5}
.data-list{display:grid;gap:8px}
.data-row{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border:1px solid #edf1f5;background:#fafcfe;border-radius:9px;color:#52677d;font-size:11px;line-height:1.65}
.data-number{color:#0b9b8e;font-weight:800;font-size:10px;min-width:17px}
.empty{padding:22px;text-align:center;color:#9aa7b5;background:#f8fafc;border-radius:9px;font-size:11px}
.diagnosis-box{display:flex;gap:15px;padding:19px;background:#f0faf8;border:1px solid #dcefeb;border-radius:11px;margin-bottom:16px}
.diagnosis-icon{height:42px;width:42px;min-width:42px;border-radius:11px;background:#dff4ef;color:#0b998b;display:grid;place-items:center;font-size:22px}
.diagnosis-box h3{font-size:14px;color:#1d4050;margin:0 0 7px}
.diagnosis-box p{font-size:10px;color:#708b94;line-height:1.7;margin:0}
.raw{background:#10243e;color:#c5e7e5;padding:17px;border-radius:10px;font:10px/1.7 Consolas,monospace;white-space:pre-wrap;overflow:auto;max-height:400px;word-break:break-word}
.history-table{width:100%;overflow-x:auto}
.table-head,.table-row{min-width:640px;display:grid;grid-template-columns:1.15fr .65fr 2fr .6fr;gap:12px;padding:13px;align-items:center}
.table-head{background:#f2f6f9;border-radius:8px;color:#687d91;font-size:9px;font-weight:800;text-transform:uppercase}
.table-row{border-bottom:1px solid #edf1f5;color:#65798e;font-size:10px}
.timeline{display:grid;gap:0}
.timeline-item{padding:13px 0;border-bottom:1px solid #edf1f5;display:flex;gap:12px}
.timeline-dot{height:9px;width:9px;min-width:9px;background:#16aa91;border-radius:50%;margin-top:5px;box-shadow:0 0 0 4px #e5f6f1}
.timeline-item strong{font-size:11px;color:#294158}
.timeline-item p{font-size:9px;color:#98a5b2;margin:5px 0}
.timeline-item span{font-size:10px;color:#708397;line-height:1.6}
.error{padding:13px 16px;border-radius:9px;background:#fff1f2;border:1px solid #f4d4d7;color:#b93f4c;font-size:11px;margin-bottom:17px;line-height:1.6}
.footer{border-top:1px solid #e5ebf1;margin-top:25px;padding:20px 2px 4px;display:flex;justify-content:space-between;gap:12px;color:#9aa7b5;font-size:9px}
.subtle{font-size:10px;color:#97a5b3;line-height:1.6}
@media(max-width:1150px){.sidebar{width:220px;min-width:220px}.top-content{padding:25px}.topbar{padding:0 25px}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.two-col{grid-template-columns:1fr}.detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.app{display:block}.sidebar{position:relative;width:100%;height:auto;min-height:auto;padding:15px}.brand{padding:0 5px 15px}.nav-label,.side-bottom{display:none}.nav-list{flex-direction:row;overflow-x:auto;padding-bottom:5px}.nav-btn{white-space:nowrap;padding:10px 12px;font-size:10px}.nav-icon{display:none}.topbar{height:55px;padding:0 15px;position:relative}.top-content{padding:18px 13px}.hero{padding:25px 20px;flex-direction:column;align-items:flex-start}.hero h1{font-size:27px}.hero .btn{width:100%}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.metric{padding:13px;min-height:125px}.metric-value{font-size:22px}.panel{padding:16px}.workflow{grid-template-columns:repeat(2,minmax(0,1fr))}.detail-grid{grid-template-columns:1fr}.health-grid{grid-template-columns:1fr}.heading{align-items:flex-start;flex-direction:column}.footer{flex-direction:column}.table-head,.table-row{min-width:610px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;

function obj(value) {
  if (!value) return {};
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return {}; }
  }
  return value;
}

function unwrap(item) {
  let value = obj(item);
  return obj(value.report_json || value.report || value.result || value.diagnostic_data || value);
}

function historyArray(data) {
  if (Array.isArray(data)) return data;
  return data?.history || data?.records || data?.data || [];
}

function metricsOf(raw = {}) {
  const d = unwrap(raw);
  const q = d.network_quality || {};
  const s = d.internet_speed || {};
  const l = d.local_network || {};
  const fp = d.network_fingerprint || {};
  const m = fp.metrics || {};

  return {
    latency: q.average_latency_ms ?? m.latency_ms ?? l.average_latency_ms ?? null,
    jitter: q.jitter_ms ?? m.jitter_ms ?? s.jitter_ms ?? null,
    download: s.download_mbps ?? m.download_mbps ?? null,
    upload: s.upload_mbps ?? m.upload_mbps ?? null,
    packetLoss: q.packet_loss_percent ?? m.packet_loss_percent ?? null,
    dns: d.dns_test?.resolution_time_ms ?? null,
    gateway: l.average_latency_ms ?? null,
  };
}

function statusOf(raw = {}) {
  const d = unwrap(raw);
  const fp = d.network_fingerprint?.status;
  if (fp === "within_baseline") return "Good";
  if (fp === "anomaly_detected") return "Anomaly";
  if (d.network_quality?.status === "success" && d.dns_test?.status === "success") return "Good";
  return "Unknown";
}

function recommendationsOf(d = {}) {
  const r = unwrap(d).recommendations;
  if (Array.isArray(r)) return r;
  return typeof r === "string" ? [r] : [];
}

function diagnosisOf(d = {}) {
  const result = unwrap(d).diagnosis;
  if (Array.isArray(result)) return result;
  return result ? [String(result)] : [];
}

function timestampOf(d = {}) {
  const raw = unwrap(d);
  return raw.timestamp || raw.createdAt || raw.date || null;
}

function metricValue(d, key) {
  return metricsOf(d)[key];
}

function fmt(value, unit = "") {
  if (value === null || value === undefined || value === "") return "--";
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(2)}${unit ? ` ${unit}` : ""}` : "--";
}

function saveJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ icon, label, value, unit, description }) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        {label}
      </div>
      <div className="metric-value">{fmt(value, unit)}</div>
      <div className="metric-desc">{description}</div>
    </div>
  );
}

function MetricGrid({ diagnostics }) {
  const m = metricsOf(diagnostics || {});
  return (
    <div className="metric-grid">
      <MetricCard icon="◷" label="Latency" value={m.latency} unit="ms" description="Average external response time" />
      <MetricCard icon="⌁" label="Jitter" value={m.jitter} unit="ms" description="Variation in response time" />
      <MetricCard icon="↓" label="Download speed" value={m.download} unit="Mbps" description="Inbound throughput" />
      <MetricCard icon="◉" label="Packet loss" value={m.packetLoss} unit="%" description="Unsuccessful packets" />
    </div>
  );
}

function StatusBanner({ diagnostics }) {
  const status = diagnostics ? statusOf(diagnostics) : "Awaiting test";
  const good = status === "Good";
  const bad = status === "Anomaly";
  return (
    <div className={`status ${good ? "good" : bad ? "bad" : ""}`}>
      <div className="status-icon">{good ? "✓" : bad ? "!" : "○"}</div>
      <div>
        <strong>Network status: {status}</strong>
        <p>{diagnostics ? (good ? "Current measurements are within the learned historical baseline." : "Review the diagnostic results for more information.") : "Run a diagnostic test to evaluate your connection."}</p>
      </div>
    </div>
  );
}

function LineChart({ title, description, points, color, unit, emptyText }) {
  const valid = points.filter(p => Number.isFinite(Number(p.value)));
  const width = 600;
  const height = 190;
  const left = 48;
  const right = 15;
  const top = 16;
  const bottom = 34;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const values = valid.map(p => Number(p.value));
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const spread = max - min || Math.max(Math.abs(max) * 0.15, 1);
  const low = Math.max(0, min - spread * 0.2);
  const high = max + spread * 0.2;
  const x = i => left + (valid.length <= 1 ? plotW / 2 : i * plotW / (valid.length - 1));
  const y = v => top + (high - Number(v)) / (high - low) * plotH;
  const path = valid.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");
  const area = valid.length > 1 ? `${path} L ${x(valid.length - 1)} ${top + plotH} L ${x(0)} ${top + plotH} Z` : "";

  return (
    <div className="panel">
      <div className="panel-title">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="subtle">{valid.length} samples</span>
      </div>
      {valid.length === 0 ? (
        <div className="empty">{emptyText || "Run a diagnostic test to generate chart data."}</div>
      ) : (
        <div className="chart-wrap">
          <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
            {[0, 1, 2, 3].map(i => {
              const yy = top + i * plotH / 3;
              const val = high - i * (high - low) / 3;
              return (
                <g key={i}>
                  <line x1={left} y1={yy} x2={width - right} y2={yy} stroke="#e9eff4" strokeDasharray="4 5" />
                  <text x={left - 9} y={yy + 3} fontSize="9" textAnchor="end" fill="#95a3b2">{val.toFixed(1)}</text>
                </g>
              );
            })}
            {area && <path d={area} fill={color} opacity=".09" />}
            {valid.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {valid.map((p, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(p.value)} r="4" fill="white" stroke={color} strokeWidth="2.5" />
                <text x={x(i)} y={height - 10} fontSize="8" fill="#91a0af" textAnchor="middle">{p.label}</text>
              </g>
            ))}
            {valid.length === 1 && <text x={x(0)} y={y(valid[0].value) - 12} textAnchor="middle" fontSize="10" fill={color}>{Number(valid[0].value).toFixed(2)} {unit}</text>}
          </svg>
          <div className="chart-legend"><span><i className="legend-dot" style={{ background: color }} /> {title} ({unit})</span></div>
        </div>
      )}
    </div>
  );
}

function ConfidenceCard({ diagnostics }) {
  const c = unwrap(diagnostics || {}).confidence_assessment || {};
  const fp = unwrap(diagnostics || {}).network_fingerprint || {};
  const score = Math.max(0, Math.min(100, Number(c.score || 0)));
  const circumference = 2 * Math.PI * 44;

  return (
    <div className="panel">
      <div className="panel-title">
        <div><h3>Diagnostic confidence</h3><p>Coverage of available diagnostic evidence</p></div>
      </div>
      <div className="confidence-wrap">
        <div className="confidence-ring">
          <svg viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="44" stroke="#e9eff4" />
            <circle cx="55" cy="55" r="44" stroke="#12aa99" strokeDasharray={`${score / 100 * circumference} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div className="ring-value"><strong>{score}%</strong><span>Coverage</span></div>
        </div>
      </div>
      <div className="confidence-list">
        <div className="confidence-line"><span>Completed checks</span><strong>{c.completed_checks ?? 0}/{c.total_checks ?? 0}</strong></div>
        <div className="confidence-line"><span>Confidence level</span><strong>{c.level || "--"}</strong></div>
        <div className="confidence-line"><span>Baseline samples</span><strong>{fp.historical_samples_used ?? 0}</strong></div>
        <div className="confidence-line"><span>Detected anomalies</span><strong>{fp.anomaly_count ?? 0}</strong></div>
      </div>
      <p className="subtle">Evidence coverage is not a probability that the identified root cause is correct.</p>
    </div>
  );
}

function BaselineChart({ diagnostics }) {
  const d = unwrap(diagnostics || {});
  const fp = d.network_fingerprint || {};
  const metrics = fp.metrics || {};
  const baselines = fp.baselines || {};
  const rows = [
    ["Latency", "latency_ms", "ms"],
    ["Jitter", "jitter_ms", "ms"],
    ["Download", "download_mbps", "Mbps"],
    ["Upload", "upload_mbps", "Mbps"],
    ["Packet loss", "packet_loss_percent", "%"],
  ];

  return (
    <div className="panel">
      <div className="panel-title">
        <div><h3>Current vs historical baseline</h3><p>Comparison with the median of previous measurements</p></div>
      </div>
      {rows.map(([label, key, unit]) => {
        const current = Number(metrics[key]);
        const baseline = Number(baselines[key]?.median);
        const hasCurrent = Number.isFinite(current);
        const hasBaseline = Number.isFinite(baseline);
        const max = Math.max(hasCurrent ? current : 0, hasBaseline ? baseline : 0, .0001);
        return (
          <div key={key} style={{ marginBottom: 17 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 7, fontSize: 10, color: "#61768b" }}>
              <strong>{label}</strong>
              <span>{hasCurrent ? current.toFixed(2) : "--"} {unit} / {hasBaseline ? baseline.toFixed(2) : "--"} {unit}</span>
            </div>
            <div style={{ height: 8, background: "#edf2f6", borderRadius: 10, overflow: "hidden", marginBottom: 5 }}>
              <div style={{ height: "100%", width: hasCurrent ? `${current / max * 100}%` : "0%", background: "linear-gradient(90deg,#0d968c,#55d0b7)", borderRadius: 10 }} />
            </div>
            <div style={{ height: 8, background: "#edf2f6", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: hasBaseline ? `${baseline / max * 100}%` : "0%", background: "#a9b9c9", borderRadius: 10 }} />
            </div>
          </div>
        );
      })}
      <div className="chart-legend">
        <span><i className="legend-dot" style={{ background: "#13aa98" }} /> Current</span>
        <span><i className="legend-dot" style={{ background: "#a9b9c9" }} /> Historical median</span>
      </div>
      {!fp.baseline_ready && <p className="subtle">Historical baseline is not ready yet. More diagnostic runs may be required.</p>}
    </div>
  );
}

function HealthPanel({ diagnostics }) {
  const d = unwrap(diagnostics || {});
  const items = [
    ["Gateway connectivity", d.local_network?.status, d.local_network?.gateway || "Gateway test"],
    ["DNS resolution", d.dns_test?.status, d.dns_test?.hostname || "DNS test"],
    ["Internet speed test", d.internet_speed?.status, d.internet_speed?.provider || "Speed test"],
    ["Historical monitoring", d.network_fingerprint?.baseline_ready ? "success" : "pending", `${d.network_fingerprint?.historical_samples_used ?? 0} historical samples`],
  ];

  return (
    <div className="panel">
      <div className="panel-title"><div><h3>Network health overview</h3><p>Status of the major diagnostic components</p></div></div>
      <div className="health-grid">
        {items.map(([name, state, detail]) => {
          const ok = state === "success";
          return (
            <div className="health-item" key={name}>
              <div className={`health-icon ${ok ? "" : "wait"}`}>{ok ? "✓" : "○"}</div>
              <div className="health-copy"><strong>{name}</strong><span>{detail || "Not available"}</span></div>
              <span className={`health-state ${ok ? "" : "wait"}`}>{ok ? "Operational" : "Check"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataList({ items, empty = "No information available." }) {
  if (!items || !items.length) return <div className="empty">{empty}</div>;
  return <div className="data-list">{items.map((item, i) => (
    <div className="data-row" key={i}><span className="data-number">{String(i + 1).padStart(2, "0")}</span><span>{typeof item === "string" ? item : JSON.stringify(item)}</span></div>
  ))}</div>;
}

function DetailGrid({ items }) {
  return <div className="detail-grid">{items.map(([label, value, desc]) => (
    <div className="detail-card" key={label}><div className="detail-label">{label}</div><div className="detail-value">{value ?? "--"}</div>{desc && <div className="detail-desc">{desc}</div>}</div>
  ))}</div>;
}

function Overview({ diagnostics, onRun, running, history }) {
  const m = metricsOf(diagnostics || {});
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">NETWORK INTELLIGENCE PLATFORM</div>
          <h1>Understand your connection.<br />Solve problems with clarity.</h1>
          <p>Measure network performance, identify connectivity issues and understand the reasons behind diagnostic results.</p>
        </div>
        <button className="btn btn-primary" onClick={onRun} disabled={running}>{running ? "Running diagnosis..." : "Run network diagnosis"} <span>→</span></button>
      </section>
      <StatusBanner diagnostics={diagnostics} />
      <SectionTitle eyebrow="LIVE NETWORK INDICATORS" title="Connection performance" description="Latest measurements collected by the diagnostic engine." />
      <MetricGrid diagnostics={diagnostics} />
      <div className="two-col">
        <LineChart title="Latency trend" description="Historical round-trip response time" points={chartPoints(history, diagnostics, "latency")} color="#0d9e91" unit="ms" />
        <LineChart title="Download speed trend" description="Historical download throughput" points={chartPoints(history, diagnostics, "download")} color="#387fc3" unit="Mbps" />
      </div>
      <div className="two-col">
        <BaselineChart diagnostics={diagnostics} />
        <ConfidenceCard diagnostics={diagnostics} />
      </div>
      <HealthPanel diagnostics={diagnostics} />
      <div className="panel">
        <SectionTitle eyebrow="WORKFLOW" title="How NetSense AI works" description="A structured process from measurements to recommendations." />
        <div className="workflow">
          {[["01", "Measure", "Collect network performance metrics."], ["02", "Analyse", "Examine measurements and network behaviour."], ["03", "Diagnose", "Identify possible connectivity issues."], ["04", "Recommend", "Generate evidence-based corrective actions."]].map(([n, t, p]) => (
            <div className="workflow-item" key={n}><b>{n}</b><h4>{t}</h4><p>{p}</p></div>
          ))}
        </div>
      </div>
      {diagnostics && (
        <div className="panel">
          <SectionTitle title="Latest diagnostic findings" description="Explanation generated by your diagnostic engine." />
          <DataList items={diagnosisOf(diagnostics)} empty="No diagnostic findings were returned." />
        </div>
      )}
    </>
  );
}

function chartPoints(history, current, key) {
  const records = [...(history || [])].reverse().map(unwrap);
  if (current) {
    const last = records[records.length - 1];
    const currentTime = timestampOf(current);
    if (!last || timestampOf(last) !== currentTime) records.push(unwrap(current));
  }
  return records.map((d, i) => ({
    value: metricValue(d, key),
    label: timestampOf(d) ? new Date(timestampOf(d)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : `#${i + 1}`,
  })).filter(p => p.value !== null && p.value !== undefined);
}

function DiagnosticsPage({ diagnostics, onRun, running }) {
  const m = metricsOf(diagnostics || {});
  const d = unwrap(diagnostics || {});
  return (
    <>
      <SectionTitle eyebrow="MEASUREMENT CENTRE" title="Live Diagnostics" description="Run a fresh network test and inspect the results." action={<button className="btn btn-primary" onClick={onRun} disabled={running}>{running ? "Testing..." : "Run test"}</button>} />
      <StatusBanner diagnostics={diagnostics} />
      <MetricGrid diagnostics={diagnostics} />
      <div className="panel">
        <SectionTitle title="Detailed measurements" description="Values returned by the diagnostic engine." />
        <DetailGrid items={[
          ["Latency", fmt(m.latency, "ms")], ["Jitter", fmt(m.jitter, "ms")],
          ["Download speed", fmt(m.download, "Mbps")], ["Upload speed", fmt(m.upload, "Mbps")],
          ["Packet loss", fmt(m.packetLoss, "%")], ["DNS resolution", fmt(m.dns, "ms")],
          ["Gateway latency", fmt(m.gateway, "ms")], ["ISP", d.internet_speed?.isp || "--"],
          ["Speed test provider", d.internet_speed?.provider || "--"],
        ]} />
      </div>
      <div className="panel">
        <SectionTitle title="Raw diagnostic response" description="Complete JSON response from the backend." />
        <pre className="raw">{diagnostics ? JSON.stringify(diagnostics, null, 2) : "Run a test to display diagnostic information."}</pre>
      </div>
    </>
  );
}

function ConnectionPage({ diagnostics, history }) {
  const d = unwrap(diagnostics || {});
  const m = metricsOf(d);
  const fp = d.network_fingerprint || {};
  const baselines = fp.baselines || {};
  return (
    <>
      <SectionTitle eyebrow="PERFORMANCE PROFILE" title="Connection Analysis" description="Detailed network performance and historical behaviour." />
      <MetricGrid diagnostics={diagnostics} />
      <div className="two-col">
        <LineChart title="Latency trend" description="Historical latency measurements" points={chartPoints(history, diagnostics, "latency")} color="#0d9e91" unit="ms" />
        <LineChart title="Download trend" description="Historical download measurements" points={chartPoints(history, diagnostics, "download")} color="#387fc3" unit="Mbps" />
      </div>
      <div className="panel">
        <SectionTitle title="Network information" description="Connection and internet service information." />
        <DetailGrid items={[
          ["Operating system", d.operating_system || "--"],
          ["Gateway", d.local_network?.gateway || "--"],
          ["Internet provider", d.internet_speed?.isp || "--"],
          ["Speed test server", d.internet_speed?.server?.name || "--"],
          ["Server location", d.internet_speed?.server?.location || "--"],
          ["DNS hostname", d.dns_test?.hostname || "--"],
          ["DNS resolution", fmt(m.dns, "ms")],
          ["Gateway response", fmt(m.gateway, "ms")],
          ["Fingerprint status", fp.status || "--"],
        ]} />
      </div>
      <BaselineChart diagnostics={diagnostics} />
      <div className="panel">
        <SectionTitle title="Historical baseline values" description="Median and median absolute deviation (MAD) from previous samples." />
        <DetailGrid items={Object.entries(baselines).map(([key, v]) => [
          key.replaceAll("_", " "),
          `Median: ${v.median ?? "--"}`,
          `MAD: ${v.mad ?? "--"} · Samples: ${v.count ?? 0}`,
        ])} />
      </div>
    </>
  );
}

function DiagnosisPage({ diagnostics }) {
  const d = unwrap(diagnostics || {});
  const fp = d.network_fingerprint || {};
  const c = d.confidence_assessment || {};
  return (
    <>
      <SectionTitle eyebrow="TRANSPARENT ANALYSIS" title="Explainable Diagnosis" description="Understand what was measured and why the system reached its findings." />
      <div className="panel">
        <div className="diagnosis-box"><div className="diagnosis-icon">✧</div><div><h3>Diagnostic findings</h3><p>Findings are based on measured gateway response, external latency, jitter, packet loss, DNS resolution, speed test and historical comparison.</p></div></div>
        <DataList items={diagnosisOf(diagnostics || {})} empty="Run a diagnostic test to generate findings." />
      </div>
      <div className="panel">
        <SectionTitle title="Possible causes" description="Potential causes identified by the diagnostic engine." />
        <DataList items={d.possible_causes || []} empty="No specific network fault was established from the available measurements." />
      </div>
      <div className="two-col">
        <ConfidenceCard diagnostics={diagnostics} />
        <div className="panel">
          <SectionTitle title="Anomaly assessment" description="Comparison with the learned historical baseline." />
          <DetailGrid items={[
            ["Fingerprint status", fp.status || "--"],
            ["Anomaly count", fp.anomaly_count ?? 0],
            ["Historical samples", fp.historical_samples_used ?? 0],
            ["Baseline ready", fp.baseline_ready ? "Yes" : "No"],
          ]} />
        </div>
      </div>
      <div className="panel">
        <SectionTitle title="Evidence coverage" description="Availability of the individual diagnostic checks." />
        <DetailGrid items={Object.entries(c.checks || {}).map(([key, value]) => [key.replaceAll("_", " "), value ? "Completed" : "Unavailable"])} />
        <p className="subtle">{c.explanation || "Confidence describes evidence coverage, not the probability of a correct root cause."}</p>
      </div>
    </>
  );
}

function RecommendationsPage({ diagnostics }) {
  const d = unwrap(diagnostics || {});
  return (
    <>
      <SectionTitle eyebrow="ACTIONABLE GUIDANCE" title="Recommendations" description="Practical actions based on measured network conditions." />
      <div className="panel">
        <SectionTitle title="Suggested actions" description="Recommendations returned by the diagnostic engine." />
        <DataList items={recommendationsOf(diagnostics || {})} empty="Run a diagnostic test to generate recommendations." />
      </div>
      <div className="panel">
        <SectionTitle title="Diagnostic context" description="Measurements that informed the recommendations." />
        <DetailGrid items={[
          ["Network status", statusOf(diagnostics || {})],
          ["Fingerprint", d.network_fingerprint?.status || "--"],
          ["Anomalies", d.network_fingerprint?.anomaly_count ?? 0],
          ["Confidence coverage", `${d.confidence_assessment?.coverage_percent ?? 0}%`],
        ]} />
      </div>
      <div className="panel"><strong style={{ color: "#087e75", fontSize: 12 }}>Important</strong><p className="subtle">Recommendations are based on available measurements. If the issue continues, contact your internet service provider.</p></div>
    </>
  );
}

function ReportsPage({ history, diagnostics }) {
  return (
    <>
      <SectionTitle eyebrow="RECORDS & INSIGHTS" title="Reports & History" description="Review saved diagnostic runs and export reports." action={<button className="btn btn-light" disabled={!diagnostics} onClick={() => saveJson("NetSense_AI_Report.json", diagnostics)}>Download latest report ↓</button>} />
      <div className="panel">
        <SectionTitle title="History overview" description="Summary of saved diagnostic records." />
        <DetailGrid items={[
          ["Total runs", history.length],
          ["Good connections", history.filter(x => statusOf(x) === "Good").length],
          ["Anomaly records", history.filter(x => statusOf(x) === "Anomaly").length],
        ]} />
      </div>
      <div className="two-col">
        <LineChart title="Historical latency" description="Saved latency measurements" points={chartPoints(history, diagnostics, "latency")} color="#0d9e91" unit="ms" />
        <LineChart title="Historical download" description="Saved download measurements" points={chartPoints(history, diagnostics, "download")} color="#387fc3" unit="Mbps" />
      </div>
      <div className="panel">
        <SectionTitle title="Diagnostic history" description="Records stored by the backend in SQLite." />
        {history.length === 0 ? <div className="empty">No saved diagnostic history found.</div> : (
          <div className="history-table">
            <div className="table-head"><span>Date and time</span><span>Status</span><span>Diagnosis</span><span>Report</span></div>
            {history.slice().reverse().map((item, i) => (
              <div className="table-row" key={item.id || i}>
                <span>{timestampOf(item) ? new Date(timestampOf(item)).toLocaleString() : `Record ${i + 1}`}</span>
                <span>{statusOf(item)}</span>
                <span>{diagnosisOf(item).slice(0, 2).join(" ") || "Diagnostic record"}</span>
                <button className="btn btn-light" onClick={() => saveJson(`NetSense_AI_History_${i + 1}.json`, unwrap(item))}>Download</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  const [page, setPage] = useState("overview");
  const [diagnostics, setDiagnostics] = useState(null);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const [backend, setBackend] = useState("Checking");

  async function loadHistory() {
    try {
      const response = await fetch("/api/diagnostics/history", { cache: "no-store" });
      if (!response.ok) throw new Error(`History request: HTTP ${response.status}`);
      const data = await response.json();
      setHistory(historyArray(data));
      setBackend("Connected");
    } catch (e) {
      setBackend("Unavailable");
      setError(e.message || "Could not load diagnostic history.");
    }
  }

  useEffect(() => {
    let active = true;
    async function initialLoad() {
      try {
        const response = await fetch("/api/diagnostics/history", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (active) {
          setHistory(historyArray(data));
          setBackend("Connected");
          setError("");
        }
      } catch (e) {
        if (active) {
          setBackend("Unavailable");
          setError("Backend connection unavailable. Check that Java is running on port 8080.");
        }
      }
    }
    initialLoad();
    return () => { active = false; };
  }, []);

  async function runDiagnosis() {
    setRunning(true);
    setError("");
    try {
      const response = await fetch("/api/diagnostics/run", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Diagnostic failed with HTTP ${response.status}`);
      }
      const result = await response.json();
      setDiagnostics(result);
      setUpdated(new Date());
      setPage("overview");
      await loadHistory();
    } catch (e) {
      console.error(e);
      setError(e.message || "Unable to run diagnostic. Check the Java backend.");
    } finally {
      setRunning(false);
    }
  }

  const active = NAV.find(x => x[0] === page);
  let content;

  if (page === "overview") content = <Overview diagnostics={diagnostics} onRun={runDiagnosis} running={running} history={history} />;
  else if (page === "diagnostics") content = <DiagnosticsPage diagnostics={diagnostics} onRun={runDiagnosis} running={running} />;
  else if (page === "connection") content = <ConnectionPage diagnostics={diagnostics} history={history} />;
  else if (page === "diagnosis") content = <DiagnosisPage diagnostics={diagnostics} />;
  else if (page === "recommendations") content = <RecommendationsPage diagnostics={diagnostics} />;
  else content = <ReportsPage history={history} diagnostics={diagnostics} />;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">N</div>
            <div><div className="brand-name">NetSense AI</div><div className="brand-sub">NETWORK INTELLIGENCE</div></div>
          </div>
          <div className="nav-label">WORKSPACE</div>
          <nav className="nav-list">
            {NAV.map(([id, label, icon]) => (
              <button key={id} className={`nav-btn ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setError(""); }}>
                <span className="nav-icon">{icon}</span>{label}
              </button>
            ))}
          </nav>
          <div className="side-bottom"><span className="green-dot" /><div><strong>Local system</strong><span>{backend === "Connected" ? "Backend connected" : backend}</span></div></div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="breadcrumb">NetSense AI &nbsp; / &nbsp; <strong>{active?.[1] || "Overview"}</strong></div>
            <div className="top-right"><span className="green-dot" /> Local dashboard · {backend}</div>
          </header>

          <div className="top-content">
            {error && <div className="error"><strong>Notice:</strong> {error}</div>}
            {updated && diagnostics && <div className="subtle" style={{ textAlign: "right", marginBottom: 10 }}>Last diagnostic: {updated.toLocaleTimeString()}</div>}
            {content}
            <footer className="footer"><span>NetSense AI · Explainable Home & Last-Mile Connectivity Diagnosis</span><span>Local Prototype · Version 1.0</span></footer>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

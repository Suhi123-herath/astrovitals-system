import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceArea, ReferenceLine, CartesianGrid,
} from 'recharts';
import { IND, KEYS, baseline } from '../engine.js';

const RANGES = [
  { days: 7, label: 'Week' },
  { days: 30, label: 'Month' },
  { days: 90, label: '3 months' },
];

export default function Charts({ rows = [] }) {
  const [days, setDays] = useState(30);
  const data = useMemo(() => {
    if (!rows.length) return [];
    const end = new Date(`${rows[rows.length - 1].date}T00:00:00`);
    end.setDate(end.getDate() - days + 1);
    const start = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
    return rows.filter((row) => row.date >= start);
  }, [rows, days]);

  const renderChart = (key, label, unit, referenceBand, showBaseline = true) => {
    const values = data.map((row) => row[key]).filter((value) => value != null && Number.isFinite(Number(value)));
    const latest = [...rows].reverse().find((row) => row[key] != null)?.[key];
    const personal = showBaseline ? baseline(rows, key) : null;
    const low = Math.min(...values, referenceBand?.[0] ?? Infinity, personal ? personal.m - 2 * personal.sd : Infinity);
    const high = Math.max(...values, referenceBand ? Math.min(referenceBand[1], Math.max(...values, referenceBand[0]) * 1.2) : -Infinity, personal ? personal.m + 2 * personal.sd : -Infinity);
    const padding = (high - low) * 0.12 || 1;

    return (
      <figure key={key} className="trend-card">
        <div className="trend-card-head">
          <figcaption>{label} <span>({unit || 'count'})</span></figcaption>
          <strong>{latest == null ? '—' : `${latest} ${unit}`}</strong>
        </div>
        {values.length === 0 ? (
          <div className="chart-empty"><span>—</span><b>No measurements in this period</b><small>Record this indicator in your daily check-in to see its trend.</small></div>
        ) : (
          <ResponsiveContainer width="100%" height={172}>
            <LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#2b3e59" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} fontSize={10} minTickGap={24} tick={{ fill: '#aebed5' }} axisLine={{ stroke: '#435672' }} tickLine={{ stroke: '#435672' }} />
              <YAxis domain={[low - padding, high + padding]} fontSize={10} tick={{ fill: '#aebed5' }} axisLine={{ stroke: '#435672' }} tickLine={{ stroke: '#435672' }} />
              {referenceBand && <ReferenceArea y1={referenceBand[0]} y2={referenceBand[1]} fill="#1f9d6b" fillOpacity={0.10} />}
              {personal && <ReferenceArea y1={personal.m - 2 * personal.sd} y2={personal.m + 2 * personal.sd} fill="#4287ff" fillOpacity={0.08} />}
              {personal && <ReferenceLine y={personal.m} stroke="#8ab8ff" strokeDasharray="5 4" label={{ value: 'Personal baseline', fill: '#a9caff', fontSize: 10, position: 'insideTopRight' }} />}
              <Tooltip contentStyle={{ background: '#142139', border: '1px solid #435672', borderRadius: 8, color: '#e8eef9' }} labelStyle={{ color: '#aebed5' }} formatter={(value) => [`${value} ${unit}`, label]} />
              <Line type="monotone" dataKey={key} name={label} stroke="#80b7ff" strokeWidth={2.3} dot={{ r: 2.5, fill: '#b7d8ff' }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive animationDuration={1100} animationEasing="ease-out" />
            </LineChart>
          </ResponsiveContainer>
        )}
        {personal && <small className="chart-baseline-note">Your first-week average: {personal.m.toFixed(1)} {unit}</small>}
      </figure>
    );
  };

  const extra = [
    ['stress', 'Self-reported stress', '/5'],
    ['spo2', 'Oxygen saturation (SpO₂)', '%'],
    ['hydrationMl', 'Water intake', 'mL'],
    ['radiationDoseUsv', 'Recorded radiation dose', 'µSv'],
    ['cabinCo2Ppm', 'Cabin CO₂', 'ppm'],
    ['cabinTemperatureC', 'Cabin temperature', '°C'],
  ];

  return (
    <section className="box" id="trends" aria-label="Health trends">
      <div className="row between trend-heading">
        <div><p className="eyebrow">PERSONAL HEALTH HISTORY</p><h2>Health trends</h2></div>
        <div className="tabs range-tabs" aria-label="Chart time range">
          {RANGES.map((range) => <button key={range.days} className={days === range.days ? 'on' : ''} aria-pressed={days === range.days} onClick={() => setDays(range.days)}>{range.label}</button>)}
        </div>
      </div>
      <p className="muted">Compare recent measurements with your own first-week baseline. Green shading is an illustrative demo band, not a clinical astronaut threshold. A personal baseline is context, not a diagnosis.</p>
      {!rows.length ? (
        <div className="chart-empty chart-empty-wide"><span>▤</span><b>No health history yet</b><small>Complete a daily check-in to populate your charts. Missing values are left blank, never estimated.</small></div>
      ) : (
        <>
          <div className="chart-legend"><span><i className="legend-current" /> Recorded measurements</span><span><i className="legend-baseline" /> Personal baseline</span><span><i className="legend-band" /> Illustrative reference band</span></div>
          <div className="charts">
            {KEYS.map((key) => renderChart(key, IND[key].label, IND[key].unit, IND[key].g, true))}
            {extra.filter(([key]) => rows.some((row) => row[key] != null)).map(([key, label, unit]) => renderChart(key, label, unit, null, false))}
          </div>
        </>
      )}
    </section>
  );
}

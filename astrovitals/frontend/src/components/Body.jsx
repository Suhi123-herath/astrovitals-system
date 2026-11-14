

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { REGIONS, TABS, RESEARCH } from '../content.js';
import { IND, LEVELS } from '../engine.js';

const STATUS_COLORS = { 0: '#35c99a', 1: '#f5bd4f', 2: '#ff875c', 3: '#ff5578', x: '#536780' };

function Part({
  position,
  scale,
  region,
  selected,
  onSelect,
  healthLevel = 'x',
  color = '#75b9d8',
  geometry = 'sphere',
  rotation = [0, 0, 0]
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(region);
      }}
    >
      {geometry === 'capsule' ? (
        <capsuleGeometry args={[0.5, 1, 8, 24]} />
      ) : geometry === 'cylinder' ? (
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      ) : (
        <sphereGeometry args={[1, 40, 40]} />
      )}

      <meshStandardMaterial
        color={healthLevel === 'x' ? color : STATUS_COLORS[healthLevel]}
        emissive={selected ? '#087ca0' : (healthLevel === 'x' ? color : STATUS_COLORS[healthLevel])}
        emissiveIntensity={selected ? 0.48 : (healthLevel === 'x' ? 0.18 : 0.22)}
        roughness={0.32}
        metalness={0.25}
      />
    </mesh>
  );
}

function HumanBody({ selected, onSelect, levels }) {
  return (
    <group position={[0, -0.1, 0]}>

      {/* HEAD */}
      <Part
        region="brain"
        healthLevel={levels.brain}
        position={[0, 2.35, 0]}
        scale={[0.38, 0.45, 0.34]}
        selected={selected === 'brain'}
        onSelect={onSelect}
        color="#d2a58f"
      />

      {/* EYES: clickable pair, linked to vision / SANS education */}
      <Part
        region="eyes"
        healthLevel={levels.eyes}
        position={[-0.14, 2.43, 0.36]}
        scale={[0.085, 0.06, 0.055]}
        selected={selected === 'eyes'}
        onSelect={onSelect}
        color="#8bdcff"
      />
      <Part
        region="eyes"
        healthLevel={levels.eyes}
        position={[0.14, 2.43, 0.36]}
        scale={[0.085, 0.06, 0.055]}
        selected={selected === 'eyes'}
        onSelect={onSelect}
        color="#8bdcff"
      />

      {/* NECK */}
      <Part
        region="skin"
        healthLevel={levels.skin}
        position={[0, 1.83, 0]}
        scale={[0.15, 0.22, 0.15]}
        geometry="cylinder"
        selected={selected === 'skin'}
        onSelect={onSelect}
        color="#d2a58f"
      />

      {/* TORSO */}
      <Part
        region="skin"
        healthLevel={levels.skin}
        position={[0, 1.05, 0]}
        scale={[0.57, 0.85, 0.31]}
        selected={selected === 'skin'}
        onSelect={onSelect}
        color="#b8d5e5"
      />

      {/* LUNGS: two distinct clickable lobes */}
      <Part
        region="lungs"
        healthLevel={levels.lungs}
        position={[-0.22, 1.39, 0.35]}
        scale={[0.19, 0.31, 0.105]}
        selected={selected === 'lungs'}
        onSelect={onSelect}
        color="#e87991"
      />
      <Part
        region="lungs"
        healthLevel={levels.lungs}
        position={[0.22, 1.39, 0.35]}
        scale={[0.19, 0.31, 0.105]}
        selected={selected === 'lungs'}
        onSelect={onSelect}
        color="#e87991"
      />

      {/* HEART */}
      <Part
        region="heart"
        healthLevel={levels.heart}
        position={[0.02, 1.12, 0.34]}
        scale={[0.13, 0.17, 0.11]}
        selected={selected === 'heart'}
        onSelect={onSelect}
        color="#ff405f"
      />

      {/* STOMACH */}
      <Part
        region="stomach"
        healthLevel={levels.stomach}
        position={[0, 0.55, 0.28]}
        scale={[0.24, 0.22, 0.12]}
        selected={selected === 'stomach'}
        onSelect={onSelect}
        color="#efa75c"
      />

      {/* LEFT ARM */}
      <Part
        region="blood"
        healthLevel={levels.blood}
        position={[-0.79, 0.95, 0]}
        scale={[0.17, 0.68, 0.17]}
        geometry="capsule"
        rotation={[0, 0, -0.12]}
        selected={selected === 'blood'}
        onSelect={onSelect}
      />

      {/* RIGHT ARM */}
      <Part
        region="blood"
        healthLevel={levels.blood}
        position={[0.79, 0.95, 0]}
        scale={[0.17, 0.68, 0.17]}
        geometry="capsule"
        rotation={[0, 0, 0.12]}
        selected={selected === 'blood'}
        onSelect={onSelect}
      />

      {/* PELVIS */}
      <Part
        region="bones"
        healthLevel={levels.bones}
        position={[0, -0.02, 0]}
        scale={[0.43, 0.3, 0.28]}
        selected={selected === 'bones'}
        onSelect={onSelect}
        color="#d0dce7"
      />

      {/* LEFT LEG */}
      <Part
        region="bones"
        healthLevel={levels.bones}
        position={[-0.24, -0.85, 0]}
        scale={[0.19, 0.9, 0.2]}
        geometry="capsule"
        selected={selected === 'bones'}
        onSelect={onSelect}
        color="#d0dce7"
      />

      {/* RIGHT LEG */}
      <Part
        region="bones"
        healthLevel={levels.bones}
        position={[0.24, -0.85, 0]}
        scale={[0.19, 0.9, 0.2]}
        geometry="capsule"
        selected={selected === 'bones'}
        onSelect={onSelect}
        color="#d0dce7"
      />

      {/* LEFT FOOT */}
      <Part
        region="bones"
        healthLevel={levels.bones}
        position={[-0.24, -1.78, 0.12]}
        scale={[0.2, 0.12, 0.34]}
        selected={selected === 'bones'}
        onSelect={onSelect}
        color="#d0dce7"
      />

      {/* RIGHT FOOT */}
      <Part
        region="bones"
        healthLevel={levels.bones}
        position={[0.24, -1.78, 0.12]}
        scale={[0.2, 0.12, 0.34]}
        selected={selected === 'bones'}
        onSelect={onSelect}
        color="#d0dce7"
      />

    </group>
  );
}

export default function Body({ ev, rows = [] }) {
  const [selected, setSelected] = useState('heart');
  const [tab, setTab] = useState('measure');

  const region = REGIONS.find((r) => r.id === selected);
  const levels = Object.fromEntries(REGIONS.map((r) => {
    const found = r.inds.map((key) => ev?.res?.[key]?.lvl).filter((level) => level != null);
    return [r.id, found.length ? Math.max(...found) : 'x'];
  }));
  const selectedLevel = levels[selected];
  const last = rows[rows.length - 1] || {};
  const reportedSymptoms = Array.isArray(last.symptoms) ? last.symptoms : (typeof last.symptoms === 'string' ? last.symptoms.split('|').filter(Boolean) : []);
  const regionSymptoms = (region?.symptoms || []).filter((symptom) => reportedSymptoms.includes(symptom));

  if (!region) return null;

  return (
    <section className="box figure" id="body-map">

      <h2>3D Astronaut Health Map</h2>

      <p className="muted">
        Select a body region to explore astronaut health indicators.
      </p>

      <div className="body3d-stage">
        <Canvas
          camera={{ position: [0, 0.4, 7], fov: 38 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#08182b']} />

          <ambientLight intensity={1.5} />

          <directionalLight
            position={[3, 5, 5]}
            intensity={2.5}
          />

          <pointLight
            position={[-3, 2, 3]}
            color="#38bdf8"
            intensity={2}
          />

          <HumanBody
            selected={selected}
            onSelect={setSelected}
            levels={levels}
          />

          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={4}
            maxDistance={10}
            minPolarAngle={0.4}
            maxPolarAngle={2.5}
            autoRotate
            autoRotateSpeed={3.8}
          />
        </Canvas>
      </div>

      <p className="body3d-hint">
        Drag to rotate · Scroll to zoom · Click to select
      </p>
      <div className="body-status-legend" aria-label="Body map status legend">
        <span><i className="lv0" />No flag</span><span><i className="lv1" />Watch</span><span><i className="lv2" />Report</span><span><i className="lv3" />Urgent</span><span><i className="lvx" />No data</span>
      </div>

      <div className="body-region-buttons">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            className={selected === r.id ? 'selected-region' : ''}
            onClick={() => setSelected(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="row between body-region-heading"><h3>{region.name}</h3><span className={`body-status ${regionSymptoms.length ? 'symptom-reported' : `lv${selectedLevel}`}`}>{regionSymptoms.length ? 'Symptom reported' : selectedLevel === 'x' ? 'No direct assessment' : LEVELS[selectedLevel].n}</span></div>
        <p className="muted">A highlighted region links to educational guidance. The model is illustrative and does not diagnose or directly examine body organs.</p>
        <div className="body-indicators">
          {region.inds.map((key) => {
            const result = ev?.res?.[key];
            return (
              <span key={key} className={`pill lv${result ? result.lvl : 'x'}`}>
                {IND[key].label}: {result ? `${result.v} ${IND[key].unit}` : 'No data'}
              </span>
            );
          })}
          {(region.measurements || []).map((metric) => (
            <span key={metric.key} className="pill lvx">
              {metric.label}: {last[metric.key] == null ? 'Not recorded' : `${last[metric.key]} ${metric.unit}`} · no app threshold
            </span>
          ))}
        </div>
        {regionSymptoms.length > 0 && <p className="body-symptom-note">Reported in latest check-in: {regionSymptoms.join(', ')}</p>}
        {region.symptoms?.length > 0 && regionSymptoms.length === 0 && <p className="micro-note">Symptoms to record if present: {region.symptoms.join(', ')}. No symptom reported in the latest check-in.</p>}

        <div className="tabs">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? 'on' : ''}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="tabtext">
          {region.tabs[tab]}
        </p>
        {region.sources?.length > 0 && (
          <div className="body-evidence">
            <small>Evidence references</small>
            <div>{region.sources.map((id) => RESEARCH.find((source) => source.id === id)).filter(Boolean).map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.agency}: {source.title} ↗</a>
            ))}</div>
          </div>
        )}
      </div>

    </section>
  );
}

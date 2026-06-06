'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Activity, ShieldAlert, Check } from 'lucide-react';

interface ProfileMorphologyFormProps {
  userId: string;
  initialHeight: number | null;
  initialWeight: number | null;
  initialObjective: string | null;
  initialMedicalHistory: string | null;
  initialSportsHistory: string | null;
}

const OBJECTIVES = [
  { value: 'prise_de_masse', label: 'Prise de masse 💪' },
  { value: 'perte_de_poids', label: 'Perte de poids / Sèche 🎯' },
  { value: 'maintien', label: 'Maintien & Recomposition ⚖️' },
  { value: 'sante', label: 'Remise en forme / Santé 🌱' }
];

export default function ProfileMorphologyForm({
  userId,
  initialHeight,
  initialWeight,
  initialObjective,
  initialMedicalHistory,
  initialSportsHistory
}: ProfileMorphologyFormProps) {
  const supabase = createClient();
  const [height, setHeight] = useState<string>(initialHeight ? initialHeight.toString() : '');
  const [weight, setWeight] = useState<string>(initialWeight ? initialWeight.toString() : '');
  const [objective, setObjective] = useState<string>(initialObjective || '');
  const [medicalHistory, setMedicalHistory] = useState<string>(initialMedicalHistory || '');
  const [sportsHistory, setSportsHistory] = useState<string>(initialSportsHistory || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if profile is complete (essential info filled)
  const isComplete = height && weight && objective;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setErrorMsg(null);

    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      setErrorMsg("Veuillez entrer une taille valide.");
      setSaving(false);
      return;
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setErrorMsg("Veuillez entrer un poids valide.");
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          height: parsedHeight,
          weight: parsedWeight,
          objective: objective || null,
          medical_history: medicalHistory || null,
          sports_history: sportsHistory || null
        })
        .eq('id', userId);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(null), 3000);
      
      // Optionally trigger reload to refresh layout server components
      window.location.reload();
    } catch (err: any) {
      console.error("Error saving morphological data:", err);
      setErrorMsg(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-glass animate-fadeInUp animate-delay-300" style={{ padding: 'clamp(24px, 4vw, 32px)', marginTop: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255, 45, 120, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-pink)' }}>
          <Activity size={20} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white', margin: 0 }}>
          Profil Morphologique & Objectifs
        </h2>
      </div>

      {/* Completion Alerts */}
      {!isComplete ? (
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(255, 10, 94, 0.08)',
          border: '1px solid rgba(255, 10, 94, 0.25)',
          color: 'var(--miami-pink)',
          fontSize: '0.8rem',
          lineHeight: 1.4,
          marginBottom: 24,
          alignItems: 'center'
        }}>
          <ShieldAlert size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Action requise :</strong> Veuillez renseigner votre taille, poids et objectif afin de permettre à votre coach de concevoir des programmes sur mesure.
          </span>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(0, 245, 255, 0.05)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          color: 'var(--miami-cyan)',
          fontSize: '0.8rem',
          lineHeight: 1.4,
          marginBottom: 24,
          alignItems: 'center'
        }}>
          <Check size={20} style={{ flexShrink: 0 }} />
          <span>Votre profil morphologique est complet et à jour. Il est accessible par votre coach.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {/* Height */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>
              Taille (en cm)
            </label>
            <input
              type="number"
              className="input-miami"
              placeholder="Ex : 178"
              value={height}
              onChange={e => setHeight(e.target.value)}
              required
              min="1"
              max="300"
              style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Weight */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>
              Poids (en kg)
            </label>
            <input
              type="number"
              step="0.1"
              className="input-miami"
              placeholder="Ex : 74.5"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              required
              min="1"
              max="500"
              style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Objective */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>
              Objectif Principal
            </label>
            <select
              className="input-miami"
              value={objective}
              onChange={e => setObjective(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.85rem',
                background: 'rgba(7, 6, 26, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#F5F0FF',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled style={{ background: 'rgba(7, 6, 26, 0.98)' }}>Sélectionner...</option>
              {OBJECTIVES.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: 'rgba(7, 6, 26, 0.98)', color: '#F5F0FF' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>
            Antécédents médicaux / Blessures / Limitations
          </label>
          <textarea
            className="input-miami"
            placeholder="Ex : Douleur épaule droite sur le développé couché, opération genou en 2024..."
            value={medicalHistory}
            onChange={e => setMedicalHistory(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '12px 14px', fontSize: '0.85rem', resize: 'vertical' }}
          />
        </div>

        {/* Sports History */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>
            Antécédents sportifs / Expérience de musculation
          </label>
          <textarea
            className="input-miami"
            placeholder="Ex : 2 ans de musculation en salle, pratique le football en club..."
            value={sportsHistory}
            onChange={e => setSportsHistory(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '12px 14px', fontSize: '0.85rem', resize: 'vertical' }}
          />
        </div>

        {/* Messaging Feedback */}
        {errorMsg && (
          <div style={{ color: '#FF2D78', fontSize: '0.85rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}
        {success && (
          <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            Profil sauvegardé avec succès !
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
          style={{
            alignSelf: 'flex-end',
            padding: '10px 24px',
            fontSize: '0.85rem',
            background: 'var(--miami-pink)'
          }}
        >
          {saving ? 'Enregistrement...' : 'Sauvegarder le profil'}
        </button>
      </form>
    </div>
  );
}

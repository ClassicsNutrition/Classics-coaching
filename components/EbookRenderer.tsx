'use client';

import { Block } from '@/lib/blocks';
import { Download } from 'lucide-react';

interface EbookRendererProps {
  blocks: Block[];
  pdfUrl?: string | null;
  themePrimary?: string;
  themeAccent?: string;
}

export default function EbookRenderer({ blocks, pdfUrl, themePrimary = '#FF2D78', themeAccent = '#00F5FF' }: EbookRendererProps) {
  if (pdfUrl && (!blocks || blocks.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>📄</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>
          Ce contenu est disponible en PDF
        </h3>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', background: `linear-gradient(135deg, ${themePrimary}, ${themeAccent})` }}>
          <Download size={18} /> Télécharger le PDF
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3';
            const sizes = { 1: '2rem', 2: '1.5rem', 3: '1.2rem' };
            return (
              <Tag key={block.id} style={{
                fontFamily: 'var(--font-display)',
                fontSize: sizes[block.level],
                fontWeight: 800,
                color: block.level === 1 ? themePrimary : block.level === 2 ? 'white' : themeAccent,
                lineHeight: 1.2,
                marginBottom: 4,
                borderLeft: block.level === 2 ? `4px solid ${themePrimary}` : 'none',
                paddingLeft: block.level === 2 ? 16 : 0,
              }}>
                {block.content}
              </Tag>
            );
          }

          case 'text':
            return (
              <p key={block.id} style={{
                color: 'rgba(226,232,240,0.8)',
                lineHeight: 1.8,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
              }}>
                {block.content}
              </p>
            );

          case 'exercise':
            return (
              <div key={block.id} style={{
                display: 'grid',
                gridTemplateColumns: block.gifUrl ? (block.imageAlign === 'left' ? '280px 1fr' : '1fr 280px') : '1fr',
                gap: 28,
                alignItems: 'start',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${themePrimary}25`,
                borderRadius: 16,
                padding: 28,
              }}>
                {block.imageAlign === 'left' && block.gifUrl && (
                  <img src={block.gifUrl} alt={block.name} style={{ width: '100%', borderRadius: 12, border: `1px solid ${themePrimary}20` }} />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>
                      {block.name}
                    </h3>
                    {block.muscleGroup && (
                      <span style={{
                        background: `${themePrimary}20`, color: themePrimary,
                        border: `1px solid ${themePrimary}30`,
                        borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
                      }}>
                        {block.muscleGroup}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[
                      { label: 'Séries', value: block.sets },
                      { label: 'Rép.', value: block.reps },
                      { label: 'Repos', value: block.restTime },
                    ].map(s => (
                      <div key={s.label} style={{
                        textAlign: 'center', padding: '10px 16px',
                        background: `${themeAccent}10`, border: `1px solid ${themeAccent}20`,
                        borderRadius: 10,
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: themeAccent }}>{s.value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {block.description && (
                    <p style={{ color: 'rgba(226,232,240,0.65)', lineHeight: 1.7, fontSize: '0.9rem' }}>{block.description}</p>
                  )}
                </div>
                {block.imageAlign === 'right' && block.gifUrl && (
                  <img src={block.gifUrl} alt={block.name} style={{ width: '100%', borderRadius: 12, border: `1px solid ${themePrimary}20` }} />
                )}
              </div>
            );

          case 'table':
            return (
              <div key={block.id} style={{ overflowX: 'auto', borderRadius: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      {block.headers.map((h, i) => (
                        <th key={i} style={{
                          padding: '12px 16px',
                          background: `${themePrimary}20`,
                          color: themePrimary,
                          fontWeight: 700,
                          textAlign: 'left',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          borderBottom: `2px solid ${themePrimary}30`,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{
                            padding: '12px 16px',
                            color: 'rgba(226,232,240,0.8)',
                            background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'callout': {
            const calloutColors: Record<string, { bg: string; border: string; title: string }> = {
              pink: { bg: 'rgba(255,45,120,0.08)', border: 'rgba(255,45,120,0.2)', title: '#FF6BA3' },
              cyan: { bg: 'rgba(0,245,255,0.08)', border: 'rgba(0,245,255,0.2)', title: '#00F5FF' },
              purple: { bg: 'rgba(123,47,190,0.1)', border: 'rgba(123,47,190,0.25)', title: '#A855F7' },
              yellow: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)', title: '#FACC15' },
            };
            const c = calloutColors[block.color] || calloutColors.cyan;
            return (
              <div key={block.id} style={{
                background: c.bg, border: `1px solid ${c.border}`,
                borderLeft: `4px solid ${c.border.replace('0.2)', '0.8)')}`,
                borderRadius: 12, padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.3rem' }}>{block.emoji}</span>
                  <strong style={{ color: c.title, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{block.title}</strong>
                </div>
                <p style={{ color: 'rgba(226,232,240,0.75)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>{block.content}</p>
              </div>
            );
          }

          case 'divider':
            return (
              <hr key={block.id} className="divider-miami" />
            );

          default:
            return null;
        }
      })}

      {pdfUrl && blocks.length > 0 && (
        <div style={{ paddingTop: 24, textAlign: 'center' }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Download size={15} /> Télécharger en PDF
          </a>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ProfileAvatarEditorProps {
  currentAvatarUrl?: string | null;
  userId: string;
  displayName: string;
}

const PRESET_AVATARS = Array.from({ length: 12 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

export default function ProfileAvatarEditor({ currentAvatarUrl, userId, displayName }: ProfileAvatarEditorProps) {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setSelectedAvatar(null); // deselect preset
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setUploading(true);
    let finalAvatarUrl = selectedAvatar;

    try {
      if (customFile) {
        // Try uploading to Supabase Storage bucket 'avatars'
        const fileExt = customFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log("Attempting to upload file to storage bucket...");
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, customFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          finalAvatarUrl = publicUrl;
          console.log("Storage upload successful. Public URL:", publicUrl);
        } else {
          console.warn("Storage upload failed, falling back to Base64 saving:", uploadError?.message);
          // Fallback to Base64 string directly in the database
          if (customPreview) {
            finalAvatarUrl = customPreview;
          } else {
            throw new Error("Impossible de lire l'aperçu du fichier.");
          }
        }
      }

      // Update database profile
      console.log("Updating profile in database with avatar URL:", finalAvatarUrl ? finalAvatarUrl.slice(0, 100) + '...' : null);
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: finalAvatarUrl })
        .eq('id', userId);

      if (dbError) throw dbError;

      // Close modal and refresh page to show new state
      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to save avatar:", err);
      alert(`Erreur lors de la sauvegarde de l'avatar : ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Avatar Container with Hover Overlay */}
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          width: 80, height: 80, borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(255,45,120,0.4)',
          border: '2px solid var(--miami-pink)',
          flexShrink: 0
        }}
        className="group"
      >
        {currentAvatarUrl ? (
          <img 
            src={currentAvatarUrl} 
            alt={displayName} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #FF2D78, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          zIndex: 5
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
        >
          <Camera size={20} style={{ color: 'white' }} />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(4, 3, 16, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 1200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}>
          <div className="card-glass" style={{
            width: '100%', maxWidth: 550,
            padding: 32, position: 'relative',
            border: '1px solid rgba(255, 10, 94, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 10, 94, 0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer',
                borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,10,94,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: 24 }}>
              Modifier ma photo de profil
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Preset Avatars Section */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.6)', marginBottom: 12, fontWeight: 600 }}>
                  Sélectionnez un avatar Classics Coaching
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {PRESET_AVATARS.map((avatar, i) => {
                    const isSelected = selectedAvatar === avatar;
                    return (
                      <div 
                        key={avatar}
                        onClick={() => {
                          setSelectedAvatar(avatar);
                          setCustomFile(null);
                          setCustomPreview(null);
                        }}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: `2px solid ${isSelected ? 'var(--miami-pink)' : 'transparent'}`,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 12px var(--miami-pink)' : 'none',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                        onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = 'rgba(255, 10, 94, 0.4)')}
                        onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = 'transparent')}
                      >
                        <img src={avatar} alt={`Avatar ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isSelected && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(255, 10, 94, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white'
                          }}>
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(245, 240, 255, 0.3)' }}>OU</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Custom Upload Section */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.6)', marginBottom: 12, fontWeight: 600 }}>
                  Importez une image de votre galerie
                </h3>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                    style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                  >
                    <Upload size={16} /> Choisir une image
                  </button>

                  {customPreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: '50%',
                        overflow: 'hidden', border: '2px solid var(--miami-pink)',
                        boxShadow: '0 0 10px rgba(255, 10, 94, 0.3)'
                      }}>
                        <img src={customPreview} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--miami-cyan)' }}>Fichier sélectionné</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button 
                  onClick={handleSave} 
                  disabled={uploading || (!selectedAvatar && !customFile)}
                  className="btn-primary" 
                  style={{ flex: 1, fontSize: '0.9rem', padding: '12px 0' }}
                >
                  {uploading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={uploading}
                  className="btn-ghost" 
                  style={{ flex: 1, fontSize: '0.9rem', padding: '12px 0' }}
                >
                  Annuler
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

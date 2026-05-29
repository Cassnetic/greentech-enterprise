'use client';

import { useRef, useState } from 'react';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { BookingDTO } from '@/lib/constants';
import { gtFormatMoney } from '@/lib/format';

interface Props {
  booking: BookingDTO;
  onClose: () => void;
  onUploaded: (proofUrl: string) => void;
}

export function UploadProofModal({ booking, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
  };

  const submit = async () => {
    if (!file) return;
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/bookings/${booking.id}/proof`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Upload failed');
      }
      const { proofUrl } = await res.json();
      onUploaded(proofUrl);
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  };

  return (
    <div className="gt-modal-back" onClick={onClose}>
      <div
        className="gt-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
            color: 'var(--gt-ink-3)',
          }}
        >
          <Icon name="x" size={18} />
        </button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Upload payment proof</h2>
        <p style={{ fontSize: 13, color: 'var(--gt-ink-3)', marginTop: 4, marginBottom: 18 }}>
          Screenshot or PDF of your bank transfer. We&apos;ll verify within 1 working day.
        </p>

        <div className="gt-card gt-card--soft" style={{ padding: 14, marginBottom: 16 }}>
          <Row k="Bank" v={<span className="gt-mono">Maybank · 5141 2233 7788</span>} />
          <Row k="Beneficiary" v="GreenTech Enterprise Sdn Bhd" />
          <Row k="Reference" v={<span className="gt-mono">{booking.id}</span>} />
          <Row
            k="Amount"
            v={
              <span className="gt-mono" style={{ fontWeight: 600 }}>
                {gtFormatMoney(booking.total)}
              </span>
            }
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />

        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '28px 16px',
              border: '2px dashed ' + (dragOver ? 'var(--gt-accent)' : 'var(--gt-line-2)'),
              borderRadius: 'var(--gt-radius)',
              background: dragOver ? 'var(--gt-accent-soft)' : 'var(--gt-bg)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background .12s ease, border-color .12s ease',
            }}
          >
            <Icon name="upload" size={28} color="var(--gt-ink-3)" />
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>
              Drop file here, or click to choose
            </div>
            <div style={{ fontSize: 12, color: 'var(--gt-ink-3)', marginTop: 2 }}>
              PNG, JPG or PDF · max 10 MB
            </div>
          </div>
        ) : (
          <div className="gt-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                background: 'var(--gt-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={20} color="var(--gt-accent)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gt-ink-3)' }}>
                {(file.size / 1024).toFixed(0)} KB · ready to upload
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gt-ink-3)',
                padding: 6,
              }}
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        )}

        {error && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--gt-warn)' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!file || submitting} onClick={submit}>
            {submitting ? 'Uploading…' : 'Submit proof'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
      <span style={{ color: 'var(--gt-ink-3)' }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

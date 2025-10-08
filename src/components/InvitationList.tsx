import { useState, useEffect } from 'react';
import { Trash2, CreditCard as Edit2, Eye, Copy, Check, X } from 'lucide-react';
import { supabase, Invitation } from '../lib/supabase';
import { normalizeDriveLink } from '../lib/drive';
import avatar from '../images/avatar.jpg';

interface InvitationListProps {
  onRefresh?: () => void;
}

export function InvitationList({ onRefresh }: InvitationListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState<string>('');
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thư mời này?')) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvitations(invitations.filter(inv => inv.id !== id));
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      alert('Có lỗi xảy ra khi xóa thư mời.');
    }
  };

  const handleEdit = (invitation: Invitation) => {
    setEditingId(invitation.id);
    setEditName(invitation.recipient_name);
    setEditPhotoUrl(invitation.photo_url || null);
    setEditRelation(invitation.relation || '');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      // Normalize Drive links (accepts standard share links and converts to direct viewable link)
      let photoToSave = editPhotoUrl;
      if (photoToSave) {
        // Try to normalize; if normalization returns null (e.g., unrecognized but user pasted a drive link),
        // fall back to storing the original value so the UI can at least attempt to load it and user sees what they entered.
        const normalized = normalizeDriveLink(photoToSave);
        photoToSave = normalized ?? photoToSave;
      }

      // Save relation too (store null if empty)
      const relationToSave = editRelation.trim() ? editRelation.trim() : null;

      const { error } = await supabase
        .from('invitations')
        .update({ recipient_name: editName, photo_url: photoToSave, relation: relationToSave, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setInvitations(invitations.map(inv =>
        inv.id === id ? { ...inv, recipient_name: editName, photo_url: photoToSave, relation: relationToSave } : inv
      ));
      setEditingId(null);
      setEditPhotoUrl(null);
      setEditRelation('');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating invitation:', error);
      // If Supabase returned an error object, show its message to help debugging (e.g., missing column)
      const msg = (error && (error as any).message) ? (error as any).message : 'Có lỗi xảy ra khi cập nhật thư mời.';
      alert(msg);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPhotoUrl(null);
  };

  // Compute preview URL from editPhotoUrl (use normalized if possible)
  const previewUrl = editPhotoUrl ? (normalizeDriveLink(editPhotoUrl) ?? editPhotoUrl) : null;

  // Using shared normalizeDriveLink from src/lib/drive.ts

  const handleCopyLink = async (shareCode: string) => {
    const link = `${window.location.origin}${window.location.pathname}?code=${shareCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(shareCode);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleViewInvitation = (shareCode: string) => {
    const link = `${window.location.origin}${window.location.pathname}?code=${shareCode}`;
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 rounded-full border-white/30 border-t-white animate-spin"></div>
        <p className="mt-4 text-white">Đang tải...</p>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-white">Chưa có thư mời nào được tạo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-6 text-2xl font-bold text-white">Danh Sách Thư Mời ({invitations.length})</h2>

      <div className="grid gap-6 space-y-3 lg:grid-cols-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="p-5 transition-all border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20 hover:bg-white/15"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Name Section */}
              <div className="flex-1 min-w-0">
                {editingId === invitation.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-4 py-2 text-white border-2 rounded-lg bg-white/20 border-white/30 placeholder-white/50 focus:outline-none focus:border-yellow-400"
                        placeholder="Tên người nhận"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(invitation.id)}
                        className="p-2 text-white transition-all bg-green-500 rounded-lg hover:bg-green-600"
                        title="Lưu"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-white transition-all bg-red-500 rounded-lg hover:bg-red-600"
                        title="Hủy"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editPhotoUrl || ''}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      className="w-full px-4 py-2 text-white border-2 rounded-lg bg-white/20 border-white/30 placeholder-white/50 focus:outline-none focus:border-yellow-400"
                      placeholder="Link ảnh từ Google Drive (tùy chọn)"
                    />

                    <input
                      type="text"
                      value={editRelation}
                      onChange={(e) => setEditRelation(e.target.value)}
                      className="w-full px-4 py-2 mt-2 text-white border-2 rounded-lg bg-white/20 border-white/30 placeholder-white/50 focus:outline-none focus:border-yellow-400"
                      placeholder="Quan hệ (ví dụ: Ba mẹ, anh, chị, bạn, em) (tùy chọn)"
                    />

                    {/* Live preview */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-20 h-20 overflow-hidden border rounded-lg bg-white/10 border-white/20">
                        <img
                          src={previewUrl ?? avatar}
                          alt="Preview"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatar; }}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">
                      {invitation.recipient_name}
                    </h3>
                    {invitation.relation && (
                      <div className="mt-1 text-sm text-yellow-200">{invitation.relation}</div>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-blue-200">
                      <span>Lượt xem: {invitation.views_count}</span>
                      <span>•</span>
                      <span>{new Date(invitation.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {editingId !== invitation.id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewInvitation(invitation.share_code)}
                    className="p-2 text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-600"
                    title="Xem thư mời"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCopyLink(invitation.share_code)}
                    className="p-2 text-white transition-all bg-yellow-500 rounded-lg hover:bg-yellow-600"
                    title="Copy link"
                  >
                    {copiedId === invitation.share_code ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(invitation)}
                    className="p-2 text-white transition-all bg-green-500 rounded-lg hover:bg-green-600"
                    title="Sửa"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(invitation.id)}
                    className="p-2 text-white transition-all bg-red-500 rounded-lg hover:bg-red-600"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

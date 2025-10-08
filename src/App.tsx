import { useState, useEffect } from 'react';
import { GraduationCap, Sparkles, Link as LinkIcon, Copy, Check, List } from 'lucide-react';
import { supabase, Invitation } from './lib/supabase';
import { Cloud3D } from './components/Cloud3D';
import { InvitationView } from './components/InvitationView';
import { InvitationList } from './components/InvitationList';

function App() {
  const [recipientName, setRecipientName] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewingInvitation, setViewingInvitation] = useState<Invitation | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setIsAnimating(true);

    // Check if we're viewing a shared invitation
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('code');

    if (shareCode) {
      loadInvitation(shareCode);
    }
  }, []);

  const loadInvitation = async (shareCode: string) => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('share_code', shareCode)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setViewingInvitation(data);

        // Increment view count
        await supabase
          .from('invitations')
          .update({ views_count: data.views_count + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error loading invitation:', error);
    }
  };

  const generateShareCode = () => {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  };

  const handleGenerateInvitation = async () => {
    if (!recipientName.trim()) return;

    setIsGenerating(true);
    try {
      const shareCode = generateShareCode();

      const response = await supabase
        .from('invitations')
        .insert([
          {
            recipient_name: recipientName,
            share_code: shareCode,
            views_count: 0
          }
        ]);

      // Log full response for debugging (data, error, status)
      // Supabase client returns { data, error } for most queries
      // but including the whole response object helps during debugging.
      // eslint-disable-next-line no-console
      console.debug('Supabase insert response:', response);

      if (response.error) {
        // include status if present
        const statusInfo = (response as any).status ? ` (status: ${(response as any).status})` : '';
        throw new Error(`${response.error.message}${statusInfo}`);
      }

      const link = `${window.location.origin}${window.location.pathname}?code=${shareCode}`;
      setShareLink(link);
    } catch (error: any) {
      // Try to extract helpful info from Supabase or generic Error
      // Supabase error shape: { message, details, hint, code }
      const supabaseErr = error?.error || error;
      const message = supabaseErr?.message || supabaseErr?.details || String(error) || 'Unknown error';
      // Log full error for debugging
      // eslint-disable-next-line no-console
      console.error('Error creating invitation (detailed):', error);
      alert(`Không thể tạo thư mời: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleReset = () => {
    setRecipientName('');
    setShareLink('');
    setViewingInvitation(null);
    setShowList(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleShowList = () => {
    setShowList(true);
    setShareLink('');
    setRecipientName('');
  };

  const handleBackToCreate = () => {
    setShowList(false);
  };

  if (viewingInvitation) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 ">
        {/* 3D Clouds */}
        <Cloud3D delay={0} duration={25} size="large" startPosition={{ x: -20, y: 10 }} />
        <Cloud3D delay={5} duration={30} size="medium" startPosition={{ x: -20, y: 40 }} />
        <Cloud3D delay={10} duration={28} size="small" startPosition={{ x: -20, y: 70 }} />
        <Cloud3D delay={15} duration={32} size="medium" startPosition={{ x: -20, y: 25 }} />
        <Cloud3D delay={20} duration={27} size="large" startPosition={{ x: -20, y: 55 }} />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}

        <div className="container relative z-10 px-4 py-12 mx-auto">
          <InvitationView invitation={viewingInvitation} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 ">
      {/* 3D Clouds */}
      <Cloud3D delay={0} duration={25} size="large" startPosition={{ x: -20, y: 10 }} />
      <Cloud3D delay={5} duration={30} size="medium" startPosition={{ x: -20, y: 40 }} />
      <Cloud3D delay={10} duration={28} size="small" startPosition={{ x: -20, y: 70 }} />
      <Cloud3D delay={15} duration={32} size="medium" startPosition={{ x: -20, y: 25 }} />
      <Cloud3D delay={20} duration={27} size="large" startPosition={{ x: -20, y: 55 }} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 rounded-full top-1/2 left-1/2 bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        ></div>
      ))}

      <div className="container relative z-10 px-4 py-12 mx-auto">
        {showList ? (
          /* Invitation List View */
          <div className="mx-auto max-w-[100%]">
            <div className="p-2 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20 lg:p-8">
              <InvitationList onRefresh={() => {}} />
              <button
                onClick={handleBackToCreate}
                className="w-full px-6 py-3 mt-6 font-bold text-white transition-all border bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 border-white/30"
              >
                Quay Lại Tạo Thư Mới
              </button>
            </div>
          </div>
        ) : !shareLink ? (
          /* Input Form */
          <div className={`max-w-2xl mx-auto transition-all duration-1000 transform ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="mb-12 text-center">
              <div className="relative inline-block mb-6">
                <GraduationCap className="w-24 h-24 text-yellow-400 animate-bounce" />
                <Sparkles className="absolute w-8 h-8 text-yellow-300 -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
                Lễ Tốt Nghiệp
              </h1>
              <p className="text-xl text-blue-200">Tạo thư mời cá nhân hóa</p>
            </div>

            <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20">
              <label className="block mb-4 text-lg font-medium text-white">
                Nhập tên người nhận:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateInvitation()}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-6 py-4 text-lg text-white transition-all border-2 rounded-xl bg-white/20 backdrop-blur-sm border-white/30 placeholder-white/50 focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={handleGenerateInvitation}
                disabled={!recipientName.trim() || isGenerating}
                className="w-full px-8 py-4 mt-6 text-lg font-bold transition-all duration-300 transform shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isGenerating ? 'Đang tạo...' : 'Tạo Thư Mời'}
              </button>
              <button
                onClick={handleShowList}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 mt-3 font-bold text-white transition-all border bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 border-white/30"
              >
                <List className="w-5 h-5" />
                Xem Danh Sách Thư Mời
              </button>
            </div>
          </div>
        ) : (
          /* Share Link Display */
          <div className="max-w-2xl mx-auto">
            <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20">
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-white">Thư mời đã được tạo!</h2>
                <p className="text-blue-200">Chia sẻ link này với người nhận</p>
              </div>

              <div className="p-4 mb-6 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="flex items-center space-x-3">
                  <LinkIcon className="flex-shrink-0 w-5 h-5 text-yellow-400" />
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 text-sm text-white bg-transparent md:text-base focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 p-2 transition-all bg-yellow-400 rounded-lg hover:bg-yellow-500 text-slate-900"
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 font-bold text-center text-white transition-all bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800"
                >
                  Xem Thử Thư Mời
                </a>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 font-bold text-white transition-all border bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 border-white/30"
                >
                  Tạo Thư Mời Mới
                </button>
                <button
                  onClick={handleShowList}
                  className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition-all border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border-white/20"
                >
                  <List className="w-5 h-5" />
                  Xem Tất Cả Thư Mời
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

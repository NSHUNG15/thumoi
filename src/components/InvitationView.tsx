import { GraduationCap, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { Invitation } from '../lib/supabase';
import { normalizeDriveLink } from '../lib/drive';
import avatar from '../images/avatar.jpg';


interface InvitationViewProps {
  invitation: Invitation;
}

export function InvitationView({ invitation }: InvitationViewProps) {

  const relation = (invitation.relation ?? 'Bạn') as string;

    // Derive how the sender should refer to themself based on recipient relation.
    // - Parents / family (ba, mẹ, gia đình, etc.) => 'Con' or 'Cháu'
    // - Anh / Chị => 'Em'
    // - Bạn / Em (friends or 'em' as a relation) => 'Tôi'
    // Default to 'Em' to preserve previous behavior.
    const senderPronoun = (() => {
      const r = (relation || '').toLowerCase();
      if (/ông|bà/.test(r)) return 'Cháu';
      if (/\b(ba|bố|mẹ|gia ?đình|gia đình)\b/.test(r)) return 'Con';
      if (/\b(anh|chị)\b/.test(r)) return 'Em';
      if (/\b(bạn|bạn bè|ban be|bè|be)\b/.test(r)) return 'Tôi';
      if (r === 'em') return 'Tôi';
      return 'Em';
    })();
    const timelineEvents = [
    { time: '13:30 - 14:00', title: 'Đón tiếp khách mời', description: 'Đăng ký và nhận tài liệu' },
    { time: '14:00 - 14:30', title: 'Nghi thức chào cờ', description: 'Hát quốc ca và chào cờ tổ quốc' },
    { time: '14:30 - 16:00', title: 'Lễ trao bằng tốt nghiệp', description: 'Trao bằng tốt nghiệp cho sinh viên' },
    { time: '16:00 - 16:30', title: 'Phát biểu của sinh viên', description: 'Đại diện sinh viên phát biểu cảm nghĩ' },
    { time: '16:30 - 17:00', title: 'Chụp ảnh lưu niệm', description: 'Chụp ảnh tập thể và gia đình' },
    // { time: '17:00 - 18:00', title: 'Tiệc mừng tốt nghiệp', description: 'Giao lưu và dùng bữa trưa' }
    ];
  // Convert photo_url (possibly null) into an image URL usable in <img />
  const getImageUrl = (photoUrl?: string | null) => {
    if (!photoUrl) return avatar;
    try {
      const normalized = normalizeDriveLink(photoUrl);
      // If normalization returns null for non-file drive links, prefer the original value (it might be a direct URL)
      return normalized ?? photoUrl ?? avatar;
    } catch (e) {
      return avatar;
    }
  };
  return (
      <div className="max-w-6xl mx-auto">
        {/* Main Card */}
        <div className="overflow-hidden bg-white shadow-2xl backdrop-blur-xl rounded-3xl">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden h-80 bg-gradient-to-br from-amber-900 via-orange-800 via-red-800 to-rose-900 ">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute rounded-full top-10 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 mix-blend-overlay filter blur-3xl animate-pulse"></div>
              <div className="absolute delay-700 rounded-full bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-amber-300 to-orange-400 mix-blend-overlay filter blur-3xl animate-pulse"></div>
              <div className="absolute w-64 h-64 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-pink-400 to-rose-400 mix-blend-overlay filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/40"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-white">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-60 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 blur-2xl group-hover:opacity-90 animate-pulse" />
                  <div className="relative p-8 transition-all duration-500 transform rounded-full shadow-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                    <GraduationCap className="w-24 h-24 text-white drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <h1 className="mb-3 text-5xl font-bold tracking-tight drop-shadow-lg md:text-6xl">THƯ MỜI</h1>
              <div className="flex items-center gap-2 text-amber-200">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <p className="text-xl font-normal tracking-wide ">Lễ Tốt Nghiệp 2025</p>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid gap-6 p-8 md:p-12 md:grid-cols-2">
            
            {/* Photo Section */}
            <div className="relative col-span-1 lg:mb-12">
              <div className="absolute inset-0 transform scale-95 rounded-2xl blur-xl opacity-30 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"></div>
              <div className="relative flex items-center justify-center lg:h-[40rem] overflow-hidden rounded-2xl group ">
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 group-hover:opacity-100"></div>
              <div className="z-10 text-center">
                  <img
                    src={getImageUrl(invitation.photo_url ?? undefined)}
                    alt="Personal Photo"
                    className="object-cover w-full h-full transition-transform duration-500 rounded-2xl group-hover:scale-105"
                  />
                </div>  
              </div>
            </div>

            {/* Details Section */}
            <div className="items-center justify-center col-span-1 my-auto">
              {/* Recipient Name */}
              <div className="mb-8 text-center">
                <p className="mb-2 text-xl text-gray-600">Thân gửi:</p>
                <h3 className="h-auto mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text">{invitation.recipient_name}</h3>
                {relation && (
                <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-700">
                  {senderPronoun} rất vui mừng được mời {relation} tham dự buổi lễ tốt nghiệp trang trọng,
                  đánh dấu cột mốc quan trọng trong hành trình học vấn của {senderPronoun.toLowerCase()}.
                </p>
                )}
              </div>

              {/* Event Details */}
              <div className="grid gap-6 mb-8 md:grid-cols-2">
                <div className="relative p-6 overflow-hidden transition-all duration-300 transform border border-transparent rounded-2xl hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 opacity-80"></div>
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 group-hover:opacity-100"></div>
                  <div className="relative flex items-start space-x-4">
                    <div className="p-3 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="mb-1 text-xl font-bold text-transparent bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text">Thời gian</p>
                      <p className="text-gray-700">13:30 - 17:00</p>
                      <p className="text-gray-700">Ngày 16 tháng 10 năm 2025</p>
                    </div>
                  </div>
                </div>

                <div className="relative p-6 overflow-hidden transition-all duration-300 transform border border-transparent rounded-2xl hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 opacity-80"></div>
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-pink-200 via-rose-200 to-amber-200 group-hover:opacity-100"></div>
                  <div className="relative flex items-start space-x-4">
                    <div className="p-3 shadow-lg rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <p className="mb-1 text-xl font-bold text-transparent bg-gradient-to-r from-pink-800 to-rose-800 bg-clip-text">Địa điểm</p>
                      <p className="text-gray-700">Hội trường tầng 4</p>
                      <p className="text-gray-700">03 Quang Trung</p>
                      <p className="text-gray-700">Đà Nẵng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <section className="relative px-4 py-4 mb-4 bg-gradient-to-b from-transparent via-purple-50/30 to-white/50">
            <div className="max-w-5xl mx-auto">
              <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 mb-4 border rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-amber-200/50">
                  <Clock className="w-6 h-6 text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text" />
                  <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-indigo-700 via-purple-700 via-fuchsia-700 to-pink-700 bg-clip-text">
                    Chương Trình Lễ Tốt Nghiệp
                  </h2>
                </div>
              </div>

              <div className="relative mb-4">
                {/* Timeline Line */}
                <div className="absolute top-0 bottom-0 w-1 rounded-full shadow-lg left-8 md:left-1/2 bg-gradient-to-b from-indigo-400 via-purple-400 via-fuchsia-400 via-pink-400 to-amber-400" />

                {/* Timeline Events */}
                <div className="space-y-3 md:space-y-0">
                  {timelineEvents.map((event, index) => {
                    const colors = [
                      { from: 'from-indigo-500', to: 'to-purple-500', bg: 'from-indigo-100 to-purple-100', text: 'text-indigo-700', hover: 'group-hover:text-indigo-600' },
                      { from: 'from-purple-500', to: 'to-fuchsia-500', bg: 'from-purple-100 to-fuchsia-100', text: 'text-purple-700', hover: 'group-hover:text-purple-600' },
                      { from: 'from-fuchsia-500', to: 'to-pink-500', bg: 'from-fuchsia-100 to-pink-100', text: 'text-fuchsia-700', hover: 'group-hover:text-fuchsia-600' },
                      { from: 'from-pink-500', to: 'to-rose-500', bg: 'from-pink-100 to-rose-100', text: 'text-pink-700', hover: 'group-hover:text-pink-600' },
                      { from: 'from-rose-500', to: 'to-orange-500', bg: 'from-rose-100 to-orange-100', text: 'text-rose-700', hover: 'group-hover:text-rose-600' },
                      { from: 'from-orange-500', to: 'to-amber-500', bg: 'from-orange-100 to-amber-100', text: 'text-orange-700', hover: 'group-hover:text-orange-600' }
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div
                        key={index}
                        className={`relative flex items-center gap-8 ${
                          index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                      >
                        {/* Timeline Dot */}
                        <div className={`absolute z-10 w-6 h-6 -translate-x-1/2 border-4 border-white rounded-full shadow-lg left-8 md:left-1/2 bg-gradient-to-br ${color.from} ${color.to} animate-pulse`} />

                        {/* Event Card */}
                        <div className={`w-full md:w-[calc(50%-3rem)] ml-20 md:ml-0 ${
                          index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'
                        }`}>
                          <div className="relative p-6 overflow-hidden transition-all duration-300 transform bg-white border-2 border-transparent shadow-xl rounded-2xl hover:scale-105 hover:shadow-2xl group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-40 transition-opacity duration-300 group-hover:opacity-60`}></div>
                            <div className="relative">
                              <div className="flex items-center justify-start gap-3 mb-3 md:justify-start">
                                <div className={`px-4 py-2 rounded-full bg-gradient-to-br ${color.bg} shadow-md`}>
                                  <p className={`text-sm font-bold ${color.text}`}>{event.time}</p>
                                </div>
                              </div>
                              <h3 className={`mb-2 text-xl font-bold text-gray-800 transition-colors ${color.hover}`}>
                                {event.title}
                              </h3>
                              <p className="leading-relaxed text-gray-600">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Message */}
          <div className="relative p-6 m-8 overflow-hidden text-center border-2 shadow-lg rounded-2xl border-amber-200">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 via-rose-50 to-amber-50 opacity-70"></div>
            <div className="relative">
              <p className="text-xl italic text-gray-700">
                Sự hiện diện của Gia đình, Quý Anh, Chị, bạn bè và những người yêu thương sẽ là niềm vinh hạnh của em.<br />
                Xin cảm ơn vì đã dành thời gian quý báu để cùng em lưu giữ những khoảnh khắc đáng nhớ.
              </p>
              <p className="mt-2 font-bold text-transparent bg-gradient-to-r from-purple-700 via-pink-700 to-amber-700 bg-clip-text">Trân trọng thân mời!</p>
            </div>
          </div>
        </div>
      </div>
  );
}

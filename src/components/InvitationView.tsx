import { GraduationCap, MapPin, Calendar, Clock, Sparkles, Phone, AlarmClock, ArrowUp } from 'lucide-react';
import { Invitation } from '../lib/supabase';
import { normalizeDriveLink } from '../lib/drive';
import avatar from '../images/avatar.jpg';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvitationViewProps {
  invitation: Invitation;
}

export function InvitationView({ invitation }: InvitationViewProps) {
  const relation = (invitation.relation ?? 'Bạn') as string;

  const senderPronoun = (() => {
    const r = (relation || '').toLowerCase();
    if (/ông|bà/.test(r)) return 'Cháu';
    if (/\b(ba|bố|mẹ|gia ?đình|gia đình)\b/.test(r)) return 'Con';
    if (/\b(anh|chị)\b/.test(r)) return 'Em';
    if (/\b(bạn|bạn bè|ban be|bè|be)\b/.test(r)) return 'Tôi';
    if (r === 'em') return 'Tôi';
    return 'Tôi';
  })();

  const timelineEvents = [
    { time: '13:30 - 14:00', title: 'Đón tiếp khách mời', description: 'Đăng ký và nhận tài liệu' },
    { time: '14:00 - 14:30', title: 'Nghi thức chào cờ', description: 'Hát quốc ca và chào cờ tổ quốc' },
    { time: '14:30 - 16:00', title: 'Lễ trao bằng tốt nghiệp', description: 'Trao bằng tốt nghiệp cho sinh viên' },
    { time: '16:00 - 16:30', title: 'Phát biểu của sinh viên', description: 'Đại diện sinh viên phát biểu cảm nghĩ' },
    { time: '16:30 - 17:00', title: 'Chụp ảnh lưu niệm', description: 'Chụp ảnh tập thể và gia đình' },
  ];

  const getImageUrl = (photoUrl?: string | null) => {
    if (!photoUrl) return avatar;
    try {
      const normalized = normalizeDriveLink(photoUrl);
      return normalized ?? photoUrl ?? avatar;
    } catch (e) {
      return avatar;
    }
  };

  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const timelineRef = useRef<HTMLElement>(null);

  const handleTimelineClick = () => {
    const wasVisible = isTimelineVisible;
    setIsTimelineVisible(!isTimelineVisible);

    if (!wasVisible) {
      setTimeout(() => {
        if (timelineRef.current) {
          const element = timelineRef.current;
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.scrollY;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

          window.scrollTo({
            top: middle,
            behavior: 'smooth',
          });
        }
      }, 500);
    }
  };

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsTimelineVisible(false); // Hide timeline when scrolling to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants for timeline section
  const timelineVariants = {
    hidden: { opacity: 0, height: 0, y: 50 },
    visible: { opacity: 1, height: 'auto', y: 0 },
    exit: { opacity: 0, height: 0, y: -50 },
  };

  // Animation variants for individual timeline events
  const eventVariants = {
    hidden: (custom: number) => ({
      opacity: 0,
      x: custom % 2 === 0 ? -100 : 100,
      scale: 0.8,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (custom: number) => ({
      opacity: 0,
      x: custom % 2 === 0 ? -100 : 100,
      scale: 0.8,
    }),
  };

  return (
    <div className="max-w-6xl mx-auto font-crimson">
      {/* Main Card */}
      <div className="overflow-hidden bg-white shadow-2xl backdrop-blur-xl rounded-3xl">
        {/* Hero Section */}
        <div className="relative overflow-hidden h-80 bg-gradient-to-br from-amber-900 via-orange-800 via-red-800 to-rose-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute rounded-full top-10 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute delay-700 rounded-full bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-amber-300 to-orange-400 mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div
              className="absolute rounded-full w-50 h-50 top-1/2 left-1/2 bg-gradient-to-r from-pink-400 to-rose-400 mix-blend-overlay filter blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>

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
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-white">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 transition-opacity duration-500 rounded-full opacity-60 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 blur-2xl group-hover:opacity-90 animate-pulse" />
                <div className="relative p-8 transition-all duration-500 transform rounded-full shadow-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rotate-12 group-hover:rotate-0 group-hover:scale-110">
                  <GraduationCap className="w-20 h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl">THƯ MỜI</h1>
            <div className="items-center gap-2 text-amber-200">
              <div className='flex'>
                <Sparkles className="w-5 h-5 animate-pulse" />
                <p className="text-xl font-normal tracking-wide">Duy Tân University</p>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <p className='flex justify-center'>Lễ Tốt Nghiệp 2025</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid gap-6 px-8 pt-8 md:px-12 md:grid-cols-2">
          {/* Photo Section */}
          <div className="relative col-span-1 mb-8">
            <div className="absolute inset-0 transform scale-95 rounded-2xl blur-xl opacity-30 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"></div>
            <div className="relative flex items-center justify-center lg:h-[40rem] overflow-hidden rounded-2xl group">
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
            <div className="mb-8 text-center">
              <p className="mb-2 text-xl text-gray-900">Thân gửi:</p>
              <h3 className="h-auto mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text">
                {invitation.recipient_name}
              </h3>
              {relation && (
                <p className="max-w-2xl mx-auto text-xl italic font-medium leading-relaxed text-gray-900">
                  {senderPronoun} rất vui mừng được mời <b>{relation}</b> tham dự buổi lễ tốt nghiệp trang trọng,
                  đánh dấu cột mốc quan trọng trong hành trình học vấn của {senderPronoun.toLowerCase()}.
                </p>
              )}
            </div>

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
                    <p className="text-lg font-semibold text-gray-900">13:30 - 17:00</p>
                    <p className="text-lg font-semibold text-gray-900">Ngày 17 tháng 10 năm 2025</p>
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
                    <p className="text-lg font-semibold text-gray-900">Hội trường tầng 4</p>
                    <p className="text-lg font-semibold text-gray-900">03 Quang Trung</p>
                    <p className="text-lg font-semibold text-gray-900">Đà Nẵng</p>
                  </div>
                </div>
              </div>
              <div className="relative p-6 overflow-hidden transition-all duration-300 transform border border-transparent rounded-2xl hover:scale-105 group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100 opacity-80"></div>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-pink-200 via-rose-200 to-amber-200 group-hover:opacity-100"></div>
                <div className="relative flex items-start space-x-4">
                  <div className="p-3 shadow-lg rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="mb-1 text-xl font-bold text-transparent bg-gradient-to-r from-pink-800 to-rose-800 bg-clip-text">Liên hệ</p>
                    <p className="text-lg font-semibold text-gray-900">Nguyễn Sinh Hùng</p>
                    <p className="text-lg font-semibold text-gray-900">SĐT: 0857000163</p>
                  </div>
                </div>
              </div>
              <div
                onClick={handleTimelineClick}
                className="relative p-6 overflow-hidden transition-all duration-300 transform border border-transparent rounded-2xl hover:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 opacity-80"></div>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 group-hover:opacity-100"></div>
                <div className="relative flex items-start space-x-4">
                  <div className="p-3 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <AlarmClock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="mb-1 text-xl font-bold text-transparent bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text">Chi tiết thời gian buổi lễ</p>
                    <p className="text-lg font-semibold text-gray-900">{isTimelineVisible ? 'Ẩn chi tiết' : 'Ấn Xem chi tiết'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <AnimatePresence>
          {isTimelineVisible && (
            <motion.section
              ref={timelineRef}
              id="timeline-section"
              variants={timelineVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 }}
              className="relative px-4 overflow-hidden bg-gradient-to-b from-transparent via-purple-50/30 to-white/50"
            >
              <div className="max-w-5xl mx-auto">
                <div className="mb-5 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 mb-4 border rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-amber-200/50">
                    <Clock className="w-6 h-6 text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text" />
                    <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-indigo-700 via-purple-700 via-fuchsia-700 to-pink-700 bg-clip-text">
                      Chương Trình Lễ Tốt Nghiệp
                    </h2>
                  </div>
                </div>

                <div className="relative mb-4">
                  <div className="absolute top-0 bottom-0 w-1 rounded-full shadow-lg left-8 md:left-1/2 bg-gradient-to-b from-indigo-400 via-purple-400 via-fuchsia-400 via-pink-400 to-amber-400" />

                  <div className="space-y-3 md:space-y-0">
                    {timelineEvents.map((event, index) => {
                      const colors = [
                        { from: 'from-indigo-500', to: 'to-purple-500', bg: 'from-indigo-100 to-purple-100', text: 'text-indigo-700', hover: 'group-hover:text-indigo-600' },
                        { from: 'from-purple-500', to: 'to-fuchsia-500', bg: 'from-purple-100 to-fuchsia-100', text: 'text-purple-700', hover: 'group-hover:text-purple-600' },
                        { from: 'from-fuchsia-500', to: 'to-pink-500', bg: 'from-fuchsia-100 to-pink-100', text: 'text-fuchsia-700', hover: 'group-hover:text-fuchsia-600' },
                        { from: 'from-pink-500', to: 'to-rose-500', bg: 'from-pink-100 to-rose-100', text: 'text-pink-700', hover: 'group-hover:text-pink-600' },
                        { from: 'from-rose-500', to: 'to-orange-500', bg: 'from-rose-100 to-orange-100', text: 'text-rose-700', hover: 'group-hover:text-rose-600' },
                        { from: 'from-orange-500', to: 'to-amber-500', bg: 'from-orange-100 to-amber-100', text: 'text-orange-700', hover: 'group-hover:text-orange-600' },
                      ];
                      const color = colors[index % colors.length];

                      return (
                        <motion.div
                          key={index}
                          variants={eventVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
                          className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                          <div
                            className={`absolute z-10 w-6 h-6 -translate-x-1/2 border-4 border-white rounded-full shadow-lg left-8 md:left-1/2 bg-gradient-to-br ${color.from} ${color.to} animate-pulse`}
                          />
                          <div
                            className={`w-full md:w-[calc(50%-3rem)] ml-20 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}
                          >
                            <div className="relative p-6 overflow-hidden transition-all duration-300 transform bg-white border-2 border-transparent shadow-xl rounded-2xl hover:scale-105 hover:shadow-2xl group">
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-40 transition-opacity duration-300 group-hover:opacity-60`}
                              ></div>
                              <div className="relative">
                                <div className="flex items-center justify-start gap-3 mb-3 md:justify-start">
                                  <div className={`px-4 py-2 rounded-full bg-gradient-to-br ${color.bg} shadow-md`}>
                                    <p className={`text-sm font-bold ${color.text}`}>{event.time}</p>
                                  </div>
                                </div>
                                <h3 className={`mb-2 text-xl font-bold text-gray-800 transition-colors ${color.hover}`}>
                                  {event.title}
                                </h3>
                                <p className="leading-relaxed text-gray-900">{event.description}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer Message */}
        <div className="relative p-6 m-8 overflow-hidden text-center border-2 shadow-lg rounded-2xl border-amber-200">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 via-rose-50 to-amber-50 opacity-70"></div>
          <div className="relative">
            <p className="text-xl italic text-gray-900">
              Sự hiện diện của Gia đình, Quý Anh, Chị, bạn bè và những người yêu thương sẽ là niềm vinh hạnh của em.<br />
              Xin cảm ơn vì đã dành thời gian quý báu để cùng em lưu giữ những khoảnh khắc đáng nhớ.
            </p>
            <p className="mt-2 text-xl font-bold text-transparent bg-gradient-to-r from-purple-700 via-pink-700 to-amber-700 bg-clip-text">
              Trân trọng thân mời!
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 ${
          showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}
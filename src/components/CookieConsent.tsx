import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent } from '../lib/consent';
import { initAnalytics } from '../lib/analytics';

// Banner shown until the user makes a cookie choice. Accepting loads GA;
// rejecting leaves analytics off. The choice is remembered in localStorage.
export default function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null);

  if (!visible) return null;

  const accept = () => {
    setConsent('accepted');
    initAnalytics();
    setVisible(false);
  };

  const reject = () => {
    setConsent('rejected');
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-[640px] rounded-3xl bg-white shadow-[0_12px_40px_-12px_rgba(27,58,107,0.45)] ring-1 ring-navy/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">🍪</span>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-extrabold text-navy">
              เราใช้คุกกี้
            </h2>
            <p className="mt-1 text-sm text-navy/70 leading-relaxed">
              เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งาน (Google Analytics)
              ช่วยให้เราพัฒนาเนื้อหาให้ดียิ่งขึ้น คุณเลือกได้ว่าจะยอมรับหรือไม่
              อ่านเพิ่มเติมที่{' '}
              <Link to="/privacy" className="font-bold text-teal underline">
                นโยบายความเป็นส่วนตัว
              </Link>{' '}
              และ{' '}
              <Link to="/terms" className="font-bold text-teal underline">
                ข้อกำหนดการใช้งาน
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={reject}
            className="tap order-2 sm:order-1 rounded-full px-5 py-2.5 text-sm font-extrabold text-navy/70 bg-navy/5 hover:bg-navy/10 transition-colors"
          >
            ปฏิเสธ
          </button>
          <button
            type="button"
            onClick={accept}
            className="tap order-1 sm:order-2 rounded-full px-6 py-2.5 text-sm font-extrabold text-white bg-grass shadow-card hover:brightness-105 transition"
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
}

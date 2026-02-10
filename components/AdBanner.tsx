
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
}

/**
 * AdSense Compliant Banner Component
 * Includes "Advertisement" label as required by some AdSense guidelines
 * to differentiate ads from content.
 */
const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', responsive = true }) => {
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    if (!adRef.current) {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
        adRef.current = true;
      } catch (e) {
        console.warn("AdSense push error:", e);
      }
    }
  }, [slot]);

  return (
    <div 
      className="w-full flex flex-col items-center my-10 overflow-hidden"
      style={{ clear: 'both' }}
    >
      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-700 mb-2">Advertisement</span>
      <div className="w-full bg-zinc-50/30 dark:bg-zinc-900/10 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex justify-center min-h-[100px] py-4">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            minWidth: '250px', 
            minHeight: '100px' 
          }}
          data-ad-client="ca-pub-8722682185198272"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default AdBanner;

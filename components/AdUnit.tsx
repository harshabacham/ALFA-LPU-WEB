import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  client = "ca-pub-9077289968849050",
  slot = "auto",
  format = "auto",
  responsive = true,
  className = "",
  label = "Sponsored Content"
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        (window as any).adsbygoogle = adsbygoogle;
        pushedRef.current = true;
      }
    } catch (err) {
      // Ignore initial render errors if adblocker or script loading delay
      console.log('AdSense script initialization notice:', err);
    }
  }, []);

  return (
    <div className={`my-8 w-full overflow-hidden text-center rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 p-3 border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs ${className}`}>
      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
        {label}
      </div>
      <div className="min-h-[90px] flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default AdUnit;

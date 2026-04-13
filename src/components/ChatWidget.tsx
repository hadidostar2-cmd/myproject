import React, { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': any;
    }
  }
}

export default function ChatWidget() {
  useEffect(() => {
    const scriptId = 'elevenlabs-widget-script';
    if (document.getElementById(scriptId) || customElements.get('elevenlabs-convai')) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.setAttribute('crossorigin', 'anonymous');
    
    script.onerror = () => {
      console.error('Failed to load ElevenLabs widget script');
    };

    document.body.appendChild(script);

    // Do not remove the script on cleanup to prevent CustomElementRegistry re-definition errors
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {/* The ElevenLabs Widget */}
      <div 
        className="relative"
        dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_0701knz1q7yafwpbahyq4vnetfr9"></elevenlabs-convai>' }}
      />
    </div>
  );
}

import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    const scriptId = 'elevenlabs-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      script.onerror = () => console.error('Failed to load ElevenLabs widget script');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <elevenlabs-convai agent-id="agent_0701knz1q7yafwpbahyq4vnetfr9"></elevenlabs-convai>
    </div>
  );
}


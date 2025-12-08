import { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 'agent-id': string },
        HTMLElement
      >;
    }
  }
}

const AGENT_ID = 'agent_7401kbztejrbf3bv8jandebyk2r8';

export function ElevenLabsWidget() {
  return <elevenlabs-convai agent-id={AGENT_ID} />;
}

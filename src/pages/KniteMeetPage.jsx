import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const KniteMeetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const room = searchParams.get('room');
  const name = searchParams.get('name') || 'Knite User';
  const role = searchParams.get('role') || 'client';

  useEffect(() => {
    if (!room) {
      alert("Missing meeting room parameter.");
      navigate(role === 'admin' ? '/admin' : '/portal');
      return;
    }

    let apiInstance = null;
    let script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      setLoading(false);
      const domain = "meet.jit.si";
      const options = {
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#knite-meet-page-container'),
        userInfo: {
          displayName: name
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          logoClickUrl: 'https://kniteinfotech.com',
          hideConferenceSubject: true,
          ...(role === 'client' ? {
            readOnlyName: true,
            disableProfile: true,
            disableSettings: true,
            remoteVideoMenu: {
              disableKick: true,
              disableGrantModerator: true
            }
          } : {})
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#0f172a',
          DEFAULT_LOCAL_DISPLAY_NAME: name,
          TOOLBAR_BUTTONS: role === 'admin' ? [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'settings', 'raisehand',
            'videoquality', 'tileview', 'videobackgroundblur'
          ] : [
            'microphone', 'camera', 'fullscreen', 'hangup', 'chat', 'raisehand', 'tileview'
          ]
        }
      };

      if (window.JitsiMeetExternalAPI) {
        apiInstance = new window.JitsiMeetExternalAPI(domain, options);
        apiInstance.addEventListener('videoConferenceLeft', () => {
          navigate(role === 'admin' ? '/admin' : '/portal');
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (apiInstance) {
        apiInstance.dispose();
      }
      script.remove();
    };
  }, [room, name, role, navigate]);

  const handleExit = () => {
    navigate(role === 'admin' ? `/admin/client/${room.split('-')[1]}` : '/portal');
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      <Helmet>
        <title>Knite Meet - Secure Video Conferencing</title>
        <meta name="description" content="Secure, high-performance video conferencing for Knite Infotech clients." />
        <link rel="canonical" href="https://kniteinfotech.in/meet" />
      </Helmet>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-wide">Knite Meet</h2>
          <p className="text-sm text-slate-400 mt-2">Establishing secure WebRTC connection...</p>
        </div>
      )}

      {/* Top Header Panel */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse"></span>
          <h1 className="text-sm font-extrabold tracking-wide text-white uppercase">Knite Meet Live</h1>
        </div>

        <button
          onClick={handleExit}
          className="bg-red-600 hover:bg-red-750 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Disconnect & Return
        </button>
      </header>

      {/* Meeting iframe Container */}
      <div className="flex-grow w-full relative bg-slate-900">
        <div id="knite-meet-page-container" className="w-full h-full absolute inset-0"></div>
      </div>
    </div>
  );
};

export default KniteMeetPage;

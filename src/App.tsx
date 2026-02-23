import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Scene } from './Scene';

export default function App() {
  // CRITICAL FIX: Replaced showLetter with activeCard state
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (entered) {
      const timer = setTimeout(() => setIntroFinished(true), 12000);
      return () => clearTimeout(timer);
    }
  }, [entered]);

  return (
    <div className="bg-[#0c0812] overflow-hidden" style={{ width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0 }}>
      {!entered && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0812]">
          <h1 className="text-[#ffb3ff] font-serif text-3xl mb-8 tracking-widest opacity-80">A Gift For You</h1>
          <button 
            onClick={() => setEntered(true)}
            className="px-8 py-4 bg-transparent border border-[#ff69b4] text-[#ff69b4] rounded-full hover:bg-[#ff69b4] hover:text-white transition-all duration-500 font-serif text-xl tracking-widest shadow-[0_0_15px_rgba(255,105,180,0.5)] hover:shadow-[0_0_30px_rgba(255,105,180,0.8)]"
          >
            Enter Universe
          </button>
        </div>
      )}

      {entered && (
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 12, 25]} fov={50} />
          
          <Suspense fallback={
            <Html center>
              <div className="text-[#ff77ff] font-sans whitespace-nowrap text-xl tracking-widest animate-pulse">
                Loading Universe...
              </div>
            </Html>
          }>
            {/* CRITICAL FIX: Updating state based on the clicked card number */}
            <Scene onCardClick={(cardNumber) => setActiveCard(cardNumber)} />
          </Suspense>

          {introFinished && (
            <OrbitControls 
              makeDefault 
              enablePan={false} 
              minDistance={5} 
              maxDistance={20}
              maxPolarAngle={Math.PI / 2 - 0.1} 
              target={[0, 0, 0]}
              enabled={activeCard === null} // Disables movement when letter is open
            />
          )}
        </Canvas>
      )}
      
      {entered && (
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10 animate-fade-in" style={{ animationDelay: '12s', animationFillMode: 'both' }}>
          <p className="text-white/50 font-sans text-sm tracking-widest uppercase">
            Drag to explore the universe • Click a card to read
          </p>
        </div>
      )}

      {/* The Letter Overlay */}
      {activeCard !== null && (
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-500"
          onClick={() => setActiveCard(null)}
        >
          <div 
            className="bg-[#fff0f5] p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(255,182,193,0.3)] max-w-2xl w-full border border-[#ffb3e6] animate-in fade-in zoom-in duration-300" 
            onClick={e => e.stopPropagation()}
          >
            
            {activeCard === 1 && (
              <>
                <h2 className="text-5xl text-[#ff007f] mb-6 font-['Dancing_Script'] font-bold text-left">
                  My Emnhiiuuu,
                </h2>
                <p className="text-[#800040] text-lg leading-relaxed font-['Lora'] whitespace-pre-line text-left">
                  {`Hôm nay là ngày 24/2/2026,

Anh chúc em iu của anh mãi luôn xinh đẹp. Chúc em luôn rạng rỡ nụ cười trên môi và sẽ tỏa sáng hết mình trong năm tuổi thứ 21 này nhé em.

Anh mong em iu của anh sẽ phát triển hơn nữa, sẽ luôn khỏe mạnh, vui tươi. Mong em sẽ luôn cố gắng theo đuổi và làm những gì em muốn, không bị ràng buộc bởi gì cả.

Anh vẫn sẽ ở bên cạnh em dõi theo em từng bước trong năm em 21 này, sẽ đồng hành cùng em để giúp đỡ em bằng mọi thứ trong khả năng của anh.

Chúc em iu của anh mọi thứ tuyệt vời nhất trên đời!!`}
                </p>
                <div className="mt-8 text-right text-[#800040]">
                  <p className="font-['Lora'] text-lg italic mb-1">Yêu em,</p>
                  <p className="font-['Dancing_Script'] font-bold text-4xl">VKB</p>
                </div>
              </>
            )}

            {activeCard === 2 && (
              <>
                <h2 className="text-5xl text-[#ff007f] mb-6 font-['Dancing_Script'] font-bold text-left">
                  To the Stars and Back...
                </h2>
                <p className="text-[#800040] text-lg leading-relaxed font-['Lora'] whitespace-pre-line text-left">
                  {`Gửi em iu của anh, 

Năm 21 này của em, mong là chúng mình sẽ còn đồng hành với nhau càng dài lâu hơn nữa. 

Anh xin lỗi vì những gì đã gây ra cho em vào những thời gian qua. Anh thực sự xin lỗi vì những sai lầm, những lần anh nóng nảy, những hành động vô tâm của anh. 

Tuy nhiên, có một điều anh luôn chắc chắn, rằng anh luôn cố gắng vì em, vì hai đứa mình, vì cả tương lai của cả hai. 

Hôm nay là sinh nhật em, anh chỉ muốn nói rằng, anh yêu em nhiều lắm. Anh cảm ơn em đã ở bên anh trong những thời gian qua. 

Anh sẽ luôn chiều chuộng, yêu thương em. Vì vậy, mong em hãy luôn ở bên anh em nhé. 
`}
                </p>
                <div className="mt-8 text-right text-[#800040]">
                  <p className="font-['Lora'] text-lg italic mb-1">Anh yêu em nhiều lắm,</p>
                  <p className="font-['Dancing_Script'] font-bold text-4xl">VKB</p>
                </div>
              </>
            )}

            <div className="mt-10 flex justify-center">
              <button 
                className="px-10 py-3 bg-[#ff007f] text-white rounded-full hover:bg-[#cc0066] transition-all font-sans tracking-widest uppercase text-xs shadow-lg active:scale-95"
                onClick={() => setActiveCard(null)}
              >
                Close Letter
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

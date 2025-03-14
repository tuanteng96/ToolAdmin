import React, { useContext, useEffect, useRef, useState } from "react";
import { ReportContext } from "src/app/_ezs/contexts";

import AudioPlayer from "react-h5-audio-player";
import { AnimatePresence, motion } from "framer-motion";

function Player(props) {
  const playerRef = useRef();

  const { currentMusic, setCurrentMusic } = useContext(ReportContext);

  return (
    <AnimatePresence>
      <div className="fixed z-[125001] inset-0 flex justify-end flex-col">
        <motion.div
          className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() =>
            setCurrentMusic((prevState) => ({
              ...prevState,
              src: "",
            }))
          }
        ></motion.div>
        <motion.div
          className="relative flex flex-col z-20 bg-white rounded-t-[var(--f7-sheet-border-radius)] max-h-[80%]"
          initial={{ opacity: 0, translateY: "100%" }}
          animate={{ opacity: 1, translateY: "0%" }}
          exit={{ opacity: 0, translateY: "100%" }}
        >
          {currentMusic.src && (
            <>
              <AudioPlayer
                ref={playerRef}
                autoPlay
                src={currentMusic.src}
                preload="auto"
                //onPlay={(e) => console.log("onPlay")}
              />
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default Player;

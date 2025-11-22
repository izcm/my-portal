import { useState } from "react";
import { isAddress } from "viem";

import { Modal } from "../../../shared/components/Modal";
import { ColorWheel } from "../../../shared/components/ColorWheel";
import blushSvgText from "/icons/miniNFT/default_mini.svg?raw";

type NFTModalProps = {
  open: boolean;
  mode: any;
  modeKey: string;
  onClose: () => void;
  onConfirm: (payload: any) => void;
};

export const NFTModal = ({
  open,
  mode,
  modeKey,
  onClose,
  onConfirm,
}: NFTModalProps) => {
  // inputs
  const [color, setColor] = useState("#ffffff");
  const [readArgument, setReadArgument] = useState("");

  // input validation
  const validInput = (() => {
    if (modeKey === "balanceOf" || modeKey === "transfer") {
      return isAddress(readArgument);
    }
    if (modeKey === "ownerOf") {
      return /^\d+$/.test(readArgument);
    }
    return false;
  })();

  const handleConfirm = () => {
    onConfirm({
      key: modeKey,
      argument: readArgument,
      color,
    });
    handleClose();
  };

  const handleClose = () => {
    setReadArgument("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        {modeKey === "mint" || modeKey === "color" ? (
          <div className="flex items-center gap-4 p-4 bg-black/10">
            <div className="flex flex-col gap-4">
              <div
                className="w-45 bg-black/30 rounded-lg"
                dangerouslySetInnerHTML={{
                  __html: blushSvgText.replace(
                    /stroke='[^']*'/g,
                    `stroke='${color}'`,
                  ),
                }}
              />

              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    //setActiveTx(modeKey); // safe
                    // make action do the stuff in parent
                    handleConfirm();
                  }}
                >
                  {mode.confirm}
                </button>

                <button onClick={handleClose} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-50 mb-4">
              <p className="text-muted tracking-wide uppercase mb-2">
                Choose color
              </p>
              <ColorWheel onChange={setColor} size={160} />
            </div>
          </div>
        ) : (
          /* OTHER MODAL */
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="flex flex-col gap-4 self-stretch mx-4 my-2">
              <span>{mode.title}</span>

              <input
                autoFocus
                placeholder={mode.placeholder}
                onChange={(e) => setReadArgument(e.target.value.toLowerCase())}
                className="
                  border border-[var(--border-default)] rounded-lg p-2 
                  bg-[var(--bg-surface)]
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)]
                  transition-all duration-200
                  hover:border-[color-mix(in_oklab,var(--accent)_15%,var(--border-default)_85%)]
                  hover:bg-[color-mix(in_oklab,var(--bg-surface)_95%,var(--accent)_5%)]
                "
              />
            </div>

            <button
              disabled={!validInput}
              onClick={async () => {
                handleConfirm();
              }}
              className={`btn btn-secondary ${
                !validInput ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {mode.confirm}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

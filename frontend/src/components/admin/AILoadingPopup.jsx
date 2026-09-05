import Popup from "reactjs-popup";
import LazyLottie from "../common/LazyLottie";

function AILoadingPopup({ open }) {
  return (
    <Popup
      open={open}
      modal
      nested
      closeOnDocumentClick={false}
      closeOnEscape={false}
    >
      <div className="wine-popup">

        <h2>Generating AI Profiles</h2>

        <LazyLottie src="/animations/ai-loading.json" />

        <p>
          Please wait while the wine profiles are being generated.
        </p>

      </div>
    </Popup>
  );
}

export default AILoadingPopup;
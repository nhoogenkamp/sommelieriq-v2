import Popup from "reactjs-popup";
import LazyLottie from "../common/LazyLottie";

//https://www.geeksforgeeks.org/reactjs/how-to-create-popup-box-in-reactjs/
// https://react-popup.elazizi.com/component-api#closeondocumentclick
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
          Please wait while the profiles are being generated.
        </p>

      </div>
    </Popup>
  );
}

export default AILoadingPopup;
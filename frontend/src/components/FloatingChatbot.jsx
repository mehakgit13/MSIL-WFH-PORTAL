import SmartToyIcon from "@mui/icons-material/SmartToy";

function FloatingChatbot() {
  return (
    <button
      className="
      fixed
      bottom-8
      right-8
      w-16
      h-16
      rounded-full
      bg-blue-900
      text-white
      shadow-xl
      hover:scale-105
      transition
      flex
      items-center
      justify-center
      "
    >
      <SmartToyIcon />
    </button>
  );
}

export default FloatingChatbot;
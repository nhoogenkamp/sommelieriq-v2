import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function LazyLottie({ src }) {
  const container = useRef(null);

  useEffect(() => {
    let anim;

    fetch(src)
      .then(res => res.json())
      .then(data => {
        anim = lottie.loadAnimation({
          container: container.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data,
        });
      });

    return () => anim?.destroy();

  }, [src]);

  return <div ref={container} />;
}
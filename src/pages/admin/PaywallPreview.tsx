import { useNavigate } from "react-router-dom";
import { Paywall } from "@/components/Paywall";

export default function PaywallPreview() {
  const navigate = useNavigate();
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));
  return <Paywall onUnlocked={back} onClose={back} />;
}

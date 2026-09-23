import {
  FaBalanceScale,
  FaBookOpen,
  FaBullhorn,
  FaBullseye,
  FaCogs,
  FaDatabase,
  FaExclamationTriangle,
  FaEye,
  FaGavel,
  FaGlobe,
  FaGlobeAmericas,
  FaHandsHelping,
  FaLeaf,
  FaLightbulb,
  FaMicrophoneAlt,
  FaMicroscope,
  FaMountain,
  FaPaintBrush,
  FaPenFancy,
  FaPeopleArrows,
  FaPeopleCarry,
  FaTemperatureHigh,
  FaTractor,
  FaUsers,
  FaWater,
} from "react-icons/fa";
import { FiAward, FiDatabase, FiEdit3, FiGlobe, FiSearch, FiShield, FiZap } from "react-icons/fi";

// Editors pick icons by name from a dropdown in WordPress. The names are
// listed in wordpress/mu-plugins/tvgf-core/schemas/icons.json — add a name
// there and a component here to offer a new icon.
const ICONS = {
  "award-outline": FiAward,
  balance: FaBalanceScale,
  book: FaBookOpen,
  bullhorn: FaBullhorn,
  bullseye: FaBullseye,
  cogs: FaCogs,
  database: FaDatabase,
  "database-outline": FiDatabase,
  "edit-outline": FiEdit3,
  eye: FaEye,
  gavel: FaGavel,
  globe: FaGlobe,
  "globe-americas": FaGlobeAmericas,
  "globe-outline": FiGlobe,
  "hands-helping": FaHandsHelping,
  leaf: FaLeaf,
  lightbulb: FaLightbulb,
  microphone: FaMicrophoneAlt,
  microscope: FaMicroscope,
  mountain: FaMountain,
  paintbrush: FaPaintBrush,
  pen: FaPenFancy,
  "people-arrows": FaPeopleArrows,
  "people-carry": FaPeopleCarry,
  "search-outline": FiSearch,
  "shield-outline": FiShield,
  temperature: FaTemperatureHigh,
  tractor: FaTractor,
  users: FaUsers,
  warning: FaExclamationTriangle,
  water: FaWater,
  "zap-outline": FiZap,
};

export function Icon({ name, ...props }) {
  const Component = ICONS[name] || FaMountain;
  return <Component {...props} />;
}

import { HiOutlineLogin, HiOutlineLogout, HiOutlineUsers, HiOutlineQuestionMarkCircle } from "react-icons/hi";

export default function StatCard({ title, value, description, variant }) {
  const getIcon = () => {
    switch (variant) {
      case "entries":
        return <HiOutlineLogin size={22} />;
      case "exits":
        return <HiOutlineLogout size={22} />;
      case "attendees":
        return <HiOutlineUsers size={22} />;
      default:
        return <HiOutlineQuestionMarkCircle size={22} />;
    }
  };

  const getSubtext = () => {
    switch (variant) {
      case "entries":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap text-in-green bg-emerald-50">
            &uarr; 3.4% <span className="font-normal text-gray-400">vs yesterday</span>
          </span>
        );
      case "exits":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap text-out-orange bg-orange-50">
            &uarr; 1.2% <span className="font-normal text-gray-400">vs yesterday</span>
          </span>
        );
      case "attendees":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap text-brand-purple bg-purple-50">
            &bull; Live <span className="font-normal text-gray-400">occupancy status</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "entries":
        return {
          border: "border-l-4 border-l-in-green",
          iconBg: "bg-emerald-50 text-in-green"
        };
      case "exits":
        return {
          border: "border-l-4 border-l-out-orange",
          iconBg: "bg-orange-50 text-out-orange"
        };
      case "attendees":
        return {
          border: "border-l-4 border-l-attendees-purple",
          iconBg: "bg-purple-50 text-attendees-purple"
        };
      default:
        return {
          border: "border-l-4 border-l-gray-300",
          iconBg: "bg-gray-100 text-gray-500"
        };
    }
  };

  const variantStyles = getVariantClasses();

  return (
    <div className={`bg-white p-6 rounded-xl border border-border-soft flex justify-between items-center relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm group ${variantStyles.border}`}>
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-3xl font-extrabold text-black font-display tracking-tight">{value}</h3>
          {getSubtext()}
        </div>
      </div>
      <div className={`w-11 h-11 flex items-center justify-center rounded-full ${variantStyles.iconBg}`}>
        {getIcon()}
      </div>

      {description && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 translate-y-1 w-max max-w-[220px] bg-black text-white text-[11px] px-2.5 py-1.5 text-center rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-10 shadow-lg border border-neutral-800 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-solid after:border-t-black after:border-x-transparent after:border-b-transparent">
          {description}
        </div>
      )}
    </div>
  );
}

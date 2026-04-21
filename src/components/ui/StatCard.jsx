// StatCard.jsx
const StatCard = ({ title, value, description, icon: Icon, smallValue = false }) => {
  return (
    <div className="card w-full shadow-md bg-base transition-shadow duration-300 hover:shadow-lg rounded-xl cursor-pointer hover:scale-[1.01]">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-base-content/70">{title}</p>
            <p
              className={`font-bold text-base-content break-words whitespace-normal ${
                smallValue ? "text-xl" : "text-3xl"
              }`}
            >
              {value}
            </p>

            {description && (
              <p className="text-xs text-base-content/60 mt-1">{description}</p>
            )}
          </div>

          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <div className="flex items-center justify-center h-6 w-6">
              <Icon className="h-6 w-6"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

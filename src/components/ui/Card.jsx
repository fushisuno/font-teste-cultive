// Card.jsx
const Card = ({ children, className = "" }) => (
  <div
    className={`card bg-base-100 shadow-xl border border-base-300 rounded-2xl ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`card-body pb-2 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h2
    className={`card-title text-base-content text-xl font-semibold ${className}`}
  >
    {children}
  </h2>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-base-content/70 text-sm ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`card-body pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`card-actions p-6 pt-0 flex items-center ${className}`}>
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

const Tabs = ({ children, className = "", ...props }) => {
  return (
    <div className={`tabs ${className}`} {...props}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className = "", boxed, ...props }) => {
  return (
    <div
      className={`tabs ${boxed ? "tabs-boxed" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, className = "", active, ...props }) => {
  return (
    <button
      className={`tab ${active ? "tab-active" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, className = "", active, ...props }) => {
  return active ? (
    <div className={`p-4 bg-base-100 rounded-lg mt-2 ${className}`} {...props}>
      {children}
    </div>
  ) : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

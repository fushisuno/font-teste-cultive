import { useId } from "react";

const Accordion = ({ className = "", children, ...props }) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const AccordionItem = ({
  className = "",
  name = "default-accordion",
  title,
  children,
  ...props
}) => {
  const uniqueId = useId();

  return (
    <div
      className={`collapse collapse-arrow bg-base-200 ${className}`}
      {...props}
    >
      <input type="radio" name={name} id={uniqueId} />
      <div className="collapse-title text-base-content font-medium">
        {title}
      </div>
      <div className="collapse-content text-base-content/80">{children}</div>
    </div>
  );
};
Accordion.Item = AccordionItem;
AccordionItem.displayName = "AccordionItem";

export { Accordion, AccordionItem };

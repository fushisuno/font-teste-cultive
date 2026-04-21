const Progress = ({
  className = "",
  value = 0,
  variant = "primary",
  ...props
}) => {
  return (
    <progress
      className={`progress progress-${variant} ${className}`}
      value={value}
      max="100"
      {...props}
    />
  );
};
Progress.displayName = "Progress";

export { Progress };

export function CBadge({ value, backgroundColor, icon }) {
  return (
    <span
      className="rounded-md cursor-pointer font-weight-400 d-inline-block color-grey-800 border-radius-sm text-transform-capitalize"
      style={{
        backgroundColor: backgroundColor,
        padding: "2px 6px",
      }}
    >
      {value}
      {icon}
    </span>
  );
}

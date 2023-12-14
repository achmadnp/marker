export const ExpandedForm = ({ pid }) => {
  const handleCreateExpanded = async () => {
    // create expanded
    const res = await assignExpanded({ pid });
  };

  return (
    <div className="flex w-full h-full">
      <div className="m-auto">
        <div>Can&apos;t find referenced data.</div>
        <button onClick={handleCreateExpanded}>Create One</button>
      </div>
    </div>
  );
};

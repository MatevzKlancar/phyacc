interface PillProps {
  label?: string;
  value?: string | number;
  children?: React.ReactNode;
}

export function Pill({ value, label }: PillProps) {
  return (
    <div 
      className="relative flex items-center justify-between px-6 py-4" 
      style={{
        width: '270px',
        height: '70px',
        backgroundColor: '#202B3A',
        borderRadius: '19px'
      }}
    >
      <div className="flex flex-col">
        <span style={{ color: '#ADBFD8' }}>{value}</span>
        <span style={{ color: '#8199BA' }}>{label}</span>
      </div>
    </div>
  );
}

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
        borderRadius: '19px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          bottom: '-7px',
          right: 0,
          width: '70px',
          height: '100%',
          backgroundImage: label?.toLowerCase().includes('raised') 
            ? 'url(/coins.svg)' 
            : 'url(/project.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom',
          opacity: 0.02
        }}
      />
      <div className="flex flex-col">
        <span className="font-bold" style={{ color: '#ADBFD8', fontSize: '1.2em' }}>{value}</span>
        <span style={{ color: '#8199BA', fontSize: '1em', fontWeight: '700' }}>{label}</span>
      </div>
    </div>
  );
}

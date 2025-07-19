import { useState } from 'react'

interface Team {
  id: number;
  name: string;
  color: string;
  message: string;
}

function App() {
  const initialTeams: Team[] = [
    { id: 1, name: 'Équipe 1', color: '#ff6b6b', message: '🎉 Équipe 1 QR code 1' },
    { id: 2, name: 'Équipe 2', color: '#4ecdc4', message: '⚡ Équipe 2 QR code 2' },
    { id: 3, name: 'Équipe 3', color: '#45b7d1', message: '🔥 Équipe 3 QR code 4' },
    { id: 4, name: 'Équipe 4', color: '#f9ca24', message: '🌟 Équipe 4 QR code 3' }
  ];

  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning || teams.length === 0) return;

    setIsSpinning(true);
    setSelectedTeam(null);

    // Generate random rotation (multiple full rotations + random angle)
    const randomRotation = 360 * 5 + Math.random() * 360;
    const newRotation = rotation + randomRotation;
    setRotation(newRotation);

    // Calculate which team is selected based on final angle
    setTimeout(() => {
      const finalAngle = newRotation % 360;
      const sectionAngle = 360 / teams.length;
      const selectedIndex = Math.floor((360 - finalAngle) / sectionAngle) % teams.length;

      const selected = teams[selectedIndex];
      setSelectedTeam(selected);

      // Remove selected team from the wheel
      setTimeout(() => {
        setTeams(prevTeams => prevTeams.filter(team => team.id !== selected.id));
        setIsSpinning(false);
      }, 2000);
    }, 3000);
  };

  const resetWheel = () => {
    setTeams(initialTeams);
    setSelectedTeam(null);
    setRotation(0);
  };

  const renderWheelSections = () => {
    if (teams.length === 0) return null;

    const sectionAngle = 360 / teams.length;

    return teams.map((team, index) => {
      const startAngle = index * sectionAngle;
      const endAngle = (index + 1) * sectionAngle;

      // Calculate path for SVG sector
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = 150 + 140 * Math.cos(startAngleRad);
      const y1 = 150 + 140 * Math.sin(startAngleRad);
      const x2 = 150 + 140 * Math.cos(endAngleRad);
      const y2 = 150 + 140 * Math.sin(endAngleRad);

      const largeArc = sectionAngle > 180 ? 1 : 0;

      const pathData = [
        `M 150 150`,
        `L ${x1} ${y1}`,
        `A 140 140 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Calculate text position
      const textAngle = startAngle + sectionAngle / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textX = 150 + 90 * Math.cos(textAngleRad);
      const textY = 150 + 90 * Math.sin(textAngleRad);

      return (
        <g key={team.id}>
          <path
            d={pathData}
            fill={team.color}
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="16"
            fontWeight="bold"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            {team.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen box-border overflow-y-auto gap-6">
      <div className="flex flex-col items-center gap-4">
        {teams.length > 0 ? (
          <>
            <div className="relative flex items-center justify-center">
              <svg
                width="250"
                height="250"
                className={`md:w-[300px] md:h-[300px] rounded-full shadow-2xl transition-transform duration-[3000ms] cubic-bezier-[0.23,1,0.32,1] ${isSpinning ? '' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
                viewBox="0 0 300 300"
              >
                {renderWheelSections()}
              </svg>
              <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-gray-800 z-10"></div>
            </div>

            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-bold rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? 'Tourne...' : 'Tourner la roue!'}
            </button>
          </>
        ) : (
          <div className="text-center p-8 md:p-12 text-gray-600">
            <h2 className="mb-6 md:mb-8 text-gray-800 text-xl md:text-2xl">Toutes les équipes sont sélectionnées!</h2>
            <button
              className="bg-gradient-to-r from-red-400 to-red-600 text-white border-none px-6 py-3 text-base font-bold rounded-full cursor-pointer transition-all duration-300 shadow-md hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              onClick={resetWheel}
            >
              Recommencer
            </button>
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="text-center mt-4 animate-fade-in w-full max-w-md px-4">
          <div
            className="p-4 md:p-6 rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: selectedTeam.color }}
          >
            <h3 className="m-0 mb-2 text-xl md:text-2xl font-bold">{selectedTeam.name}</h3>
            <p className="m-0 text-base md:text-lg">{selectedTeam.message}</p>
          </div>
        </div>
      )}

      {teams.length > 0 && (
        <div className="text-center mt-4 text-gray-600">
          <button
            className="bg-gradient-to-r from-red-400 to-red-600 text-white border-none px-6 py-3 text-base font-bold rounded-full cursor-pointer transition-all duration-300 shadow-md hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            onClick={resetWheel}
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  )
}

export default App

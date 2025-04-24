function CommunityPage({ vents }) {
    const navigate = useNavigate();
  
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Community Vents</h1>
        
        {vents.map(vent => (
          <div 
            key={vent.id} 
            className="bg-white rounded-lg shadow p-6 mb-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/vent/${vent.id}`)}
          >
            <p>{vent.text}</p>
          </div>
        ))}
      </div>
    );
  }
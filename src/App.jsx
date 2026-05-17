import { useState, useEffect } from 'react';

function App() {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCharacters = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setCharacters([]);
        setInfo({});
      } else {
        setCharacters(data.results);
        setInfo(data.info);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los personajes:", error);
      setCharacters([]);
      setInfo({});
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const url = `https://rickandmortyapi.com/api/character/?name=${searchTerm}`;
      fetchCharacters(url);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); 

  return (
    // Fondo oscuro profundo para toda la pantalla
    <div className="bg-gray-950 min-h-screen text-gray-100 font-sans antialiased selection:bg-green-500 selection:text-black">
      <div className="max-w-7xl mx-auto p-8 text-center">
        
        {/* Título mejorado con estilo de portal interdimensional */}
        <div className="mb-10 pt-4">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            RICK AND MORTY
          </h1>
          <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mt-3">
            Explorador del Multiverso - API Oficial de Personajes
          </p>
        </div>
        
        {/* Barra de búsqueda adaptada para modo oscuro */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Buscar en todo el multiverso..."
            className="w-full max-w-md px-5 py-3 border border-gray-800 rounded-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-900 text-white placeholder-gray-500 transition-all text-center"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="my-20 space-y-4">
            <p className="text-2xl text-emerald-400 font-mono animate-pulse">CONECTANDO CON EL PORTAL...</p>
            <p className="text-sm text-gray-500">Descargando datos de la dimensión actual</p>
          </div>
        ) : (
          <>
            {/* Cuadrícula de tarjetas oscuras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {characters.length > 0 ? (
                characters.map((character) => (
                  <div key={character.id} className="flex flex-col border border-gray-800 rounded-2xl overflow-hidden shadow-2xl bg-gray-900 text-gray-100 transition-all duration-300 hover:scale-105 hover:border-green-500/50 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]">
                    
                    {/* Contenedor de la Imagen */}
                    <div className="relative overflow-hidden group">
                      <img src={character.image} alt={character.name} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" />
                      
                      {/* Estado Dinámico */}
                      <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full text-white shadow-md backdrop-blur-sm ${
                        character.status === 'Alive' ? 'bg-green-500/80 border border-green-400' : 
                        character.status === 'Dead' ? 'bg-red-500/80 border border-red-400' : 'bg-gray-600/80 border border-gray-500'
                      }`}>
                        {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                      </span>
                    </div>

                    {/* Información interna de la tarjeta */}
                    <div className="p-5 text-left flex-1 flex flex-col justify-between bg-gradient-to-b from-gray-900 to-gray-950">
                      <div>
                        <h3 className="text-lg font-extrabold text-white mb-3 truncate hover:text-green-400 transition-colors" title={character.name}>
                          {character.name}
                        </h3>
                        
                        {/* Cuadrícula técnica interna */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                          <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                            <span className="block text-gray-500 font-medium">Especie</span>
                            <span className="font-bold text-gray-300 truncate block">{character.species}</span>
                          </div>
                          <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                            <span className="block text-gray-500 font-medium">Género</span>
                            <span className="font-bold text-gray-300 truncate block">
                              {character.gender === 'Male' ? 'Masculino' : 
                               character.gender === 'Female' ? 'Femenino' : 
                               character.gender === 'Genderless' ? 'Sin Género' : 'Desconocido'}
                            </span>
                          </div>
                        </div>

                        {/* Detalles de localización */}
                        <div className="space-y-2 text-xs border-t border-gray-800/60 pt-3">
                          <p>
                            <strong className="text-gray-500 block font-medium">Subtipo/Especialidad:</strong>
                            <span className="text-gray-300 font-semibold">{character.type || 'Ninguno'}</span>
                          </p>
                          <p>
                            <strong className="text-gray-500 block font-medium">Origen conocido:</strong>
                            <span className="text-gray-300 font-semibold truncate block" title={character.origin.name}>
                              {character.origin.name}
                            </span>
                          </p>
                          <p>
                            <strong className="text-gray-500 block font-medium">Última ubicación vista:</strong>
                            <span className="text-gray-300 font-semibold truncate block" title={character.location.name}>
                              {character.location.name}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Contador de episodios con color de portal */}
                      <div className="mt-4 pt-3 border-t border-gray-800/60 text-xs text-center bg-emerald-950/30 text-emerald-400 p-2 rounded-lg font-mono border border-emerald-900/30">
                        APARICIONES: {character.episode.length} {character.episode.length === 1 ? 'EPISODIO' : 'EPISODIOS'}
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-xl text-gray-500 font-mono my-10">
                  ⚠️ No se detectan firmas biológicas con ese nombre en este cuadrante.
                </p>
              )}
            </div>

            {/* Paginación estilo Cyberpunk */}
            {(info.next || info.prev) && (
              <div className="flex justify-center items-center gap-4 mt-12 pb-6">
                <button 
                  onClick={() => fetchCharacters(info.prev)} 
                  disabled={!info.prev || loading}
                  className="px-6 py-2 bg-gray-900 text-gray-300 font-mono text-sm border border-gray-800 rounded-lg shadow-md hover:bg-gray-800 hover:text-white disabled:bg-gray-950 disabled:text-gray-700 disabled:border-gray-900 disabled:cursor-not-allowed transition-all"
                >
                  &lt; ANTERIOR
                </button>
                
                <button 
                  onClick={() => fetchCharacters(info.next)} 
                  disabled={!info.next || loading}
                  className="px-6 py-2 bg-emerald-600 text-white font-mono text-sm rounded-lg shadow-md hover:bg-emerald-500 shadow-emerald-900/20 disabled:bg-gray-950 disabled:text-gray-700 disabled:border-gray-900 disabled:cursor-not-allowed transition-all"
                >
                  SIGUIENTE &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
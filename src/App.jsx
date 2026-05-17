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
    <div className="max-w-7xl mx-auto p-8 text-center font-sans bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Enciclopedia Rick and Morty</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar en todo el universo..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-2xl text-gray-600 font-semibold my-10">Cargando datos del multiverso...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.length > 0 ? (
              characters.map((character) => (
                <div key={character.id} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white text-gray-800 transition-all hover:scale-105 hover:shadow-2xl">
                  
                  {/* Contenedor de la Imagen */}
                  <div className="relative">
                    <img src={character.image} alt={character.name} className="w-full h-auto object-cover" />
                    
                    {/* Badge Dinámico de Estado (Vivo/Muerto/Desconocido) */}
                    <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full text-white shadow-md ${
                      character.status === 'Alive' ? 'bg-green-500' : 
                      character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Muerto' : 'Desconocido'}
                    </span>
                  </div>

                  {/* Contenido de la Tarjeta con toda la información */}
                  <div className="p-5 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-3 truncate" title={character.name}>
                        {character.name}
                      </h3>
                      
                      {/* Información Básica en cuadrícula pequeña */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <span className="block text-gray-500 font-medium">Especie</span>
                          <span className="font-bold text-gray-700 truncate block">{character.species}</span>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-md">
                          <span className="block text-gray-500 font-medium">Género</span>
                          <span className="font-bold text-gray-700 truncate block">
                            {character.gender === 'Male' ? 'Masculino' : 
                             character.gender === 'Female' ? 'Femenino' : 
                             character.gender === 'Genderless' ? 'Sin Género' : 'Desconocido'}
                          </span>
                        </div>
                      </div>

                      {/* Detalles de Ubicación y Origen */}
                      <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                        <p className="text-xs">
                          <strong className="text-gray-500 block font-medium">Subtipo/Especialidad:</strong>
                          <span className="text-gray-800 font-semibold">{character.type || 'Ninguno'}</span>
                        </p>
                        <p className="text-xs">
                          <strong className="text-gray-500 block font-medium">Origen conocido:</strong>
                          <span className="text-gray-800 font-semibold truncate block" title={character.origin.name}>
                            {character.origin.name}
                          </span>
                        </p>
                        <p className="text-xs">
                          <strong className="text-gray-500 block font-medium">Última ubicación vista:</strong>
                          <span className="text-gray-800 font-semibold truncate block" title={character.location.name}>
                            {character.location.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Estadísticas de Episodios al fondo de la tarjeta */}
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-center bg-blue-50 text-blue-700 p-2 rounded-lg font-bold">
                      Aparece en {character.episode.length} {character.episode.length === 1 ? 'episodio' : 'episodios'}
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-xl text-gray-500">No se encontraron personajes con ese nombre en todo el universo.</p>
            )}
          </div>

          {(info.next || info.prev) && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button 
                onClick={() => fetchCharacters(info.prev)} 
                disabled={!info.prev || loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <button 
                onClick={() => fetchCharacters(info.next)} 
                disabled={!info.next || loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
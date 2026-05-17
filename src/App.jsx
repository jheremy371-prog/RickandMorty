import { useState, useEffect } from 'react';

function App() {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCharacters = async (url) => {
    setLoading(true); // 1. Iniciamos la carga. Los botones se desactivarán.
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
      setLoading(false); // 2. Finalizamos la carga. Los botones vuelven a funcionar.
    } catch (error) {
      console.error("Error al obtener los personajes:", error);
      setCharacters([]);
      setInfo({});
      setLoading(false);
    }
  };

  useEffect(() => {
    // 3. TECNICA DEBOUCE: Creamos un temporizador
    const delayDebounceFn = setTimeout(() => {
      const url = `https://rickandmortyapi.com/api/character/?name=${searchTerm}`;
      fetchCharacters(url);
    }, 500); // Espera 500 milisegundos

    // 4. Limpieza: Si el usuario teclea otra letra ANTES de los 500ms, borramos el temporizador anterior
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); 

  return (
    <div className="max-w-6xl mx-auto p-8 text-center font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Personajes de Rick and Morty</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar en todo el universo..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-2xl text-gray-600 font-semibold my-10">Cargando personajes...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.length > 0 ? (
              characters.map((character) => (
                <div key={character.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white text-gray-800 transition-transform hover:scale-105">
                  <img src={character.image} alt={character.name} className="w-full h-auto object-cover" />
                  <div className="p-5 text-left">
                    <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                    <p><span className="font-semibold text-gray-600">Especie:</span> {character.species}</p>
                    <p><span className="font-semibold text-gray-600">Estado:</span> {character.status}</p>
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
                // 5. BLOQUEO: Desactivar si no hay página anterior O si está cargando
                disabled={!info.prev || loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <button 
                onClick={() => fetchCharacters(info.next)} 
                // 6. BLOQUEO: Desactivar si no hay página siguiente O si está cargando
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
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import qs from 'qs'

function App() {

  const [busqueda, setBusqueda] = useState('');
  const [lista, setLista] =useState([])
  const [token, setToken] = useState('')

  useEffect(()=>{
    if(busqueda.trim() === '') return null;
    const consultaAPI = async () =>{

      const data = qs.stringify({
        grant_type: 'client_credentials',
        client_id: '95af16705d5a442190f2e27294e3c645',
        client_secret: '00bdc5fb7f7545a391d03b0acff42e59'
      });
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const createToken = await axios.post(
        'https://accounts.spotify.com/api/token',
        data,
        headers
      )
      setToken(createToken.data.access_token)
      

      const instance = axios.create({
        baseURL: 'https://api.spotify.com/v1/',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      instance.get(`/search?q=${busqueda}&type=track&market=ar&limit=10`)
      .then(response => {
        setLista(response.data.tracks.items);
        console.log(response.data.tracks.items);
      })
    }
    consultaAPI()
  }, [busqueda, token])

  return (
    <>
      <div className="container">
        <div className="text-center">
        <h1>Spotify Search</h1>
        <input 
        value={busqueda}
        onChange={e=>setBusqueda(e.target.value)}
        type="text"/>
        </div>
        {busqueda.trim()==='' ? null : 
          <div className="row">
          {lista.map(list =>(
            <div className="col-12 col-md-4 my-3" key={list.id}>
              <div class="card">
                <img class="card-img-top" src={list.album.images[0].url} alt={list.name} />
                <div class="card-body">
                  <h5 class="card-title">{list.name}</h5>
                  {list.artists.map(artista=>(
                    <p>{artista.name}</p>
                  ))}
                  <a href={list.external_urls.spotify} class="btn btn-primary">Escucha tu canción</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        }
      
      </div>
    </>
  );
}

export default App;

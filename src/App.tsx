import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import './App.css';

type charactersType = {
  id: number
  name: string
  image: string
}

type responseType = {
  info: {
    count: number
    pages: number
    next: string,
    prev: string
  }
  results: charactersType[]
}
const baseUrl = "https://rickandmortyapi.com/api/character"

function App() {
  const [inputValue, setInputValue] = useState("")
  const [filteredUrl, setFilteredUrl] = useState(baseUrl)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<responseType>()
  const [characters, setCharacters] = useState<charactersType[]>()

  const changePage = (next: boolean) => {
    const newPage = page + (next ? 1 : -1)
    console.log(newPage)
    setPage(newPage)
    setFilteredUrl(`${baseUrl}/?name=${inputValue}&page=${newPage}`)
  }

  const handleSearchByName = (name: string) => {
    setPage(1)
    setFilteredUrl(`${baseUrl}/?name=${name}&page=1`)
  }

  const getCharacters = useCallback( async () => {
    try {
      const response = await axios.get(filteredUrl)

      const data: responseType = response.data

      setData(data)
      setCharacters(data.results)
    } catch (error) {
      window.alert(error)
    }
  }, [filteredUrl])
  
  useEffect(() => {
    getCharacters()
  },[getCharacters]);

  return (
    <div className="App">
      <div>
        <h1>{data?.info.pages}</h1>
        <input type="" placeholder='Nome' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={() => handleSearchByName(inputValue)} >
          Search
        </button>
      </div>
      <ul>
        {
          characters?.map((character) => (
            <li key={character.id}>
              <div><p>{character.name}</p></div>
              <div><img src={character.image} alt={character.name} /></div>
            </li>
          ))
        }
      </ul>
      <button onClick={() => changePage(false)} disabled={page <= 1} >
          Previous
      </button>
      <button onClick={() => changePage(true)} disabled={data && page >= data.info.pages}>
          Next
      </button>
    </div>
  );
}

export default App;

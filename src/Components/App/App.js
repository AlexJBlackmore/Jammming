import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../Util/Spotify';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName:'New Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(element => {
      return element.uri;
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  addTrack(track) {
    let playlistTracks = this.state.playlistTracks;

    const alreadyInPlaylist = playlistTracks.some(element => 
      element.id === track.id
    );

    if(!alreadyInPlaylist) {
      playlistTracks.push(track);
      this.setState({
        playlistTracks: playlistTracks
      });
    } else {
      return;
    }
  } 

  changePlaylistName(playlistName) {
    this.setState({
      playlistName: playlistName
    });
  }

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;

    const index = playlistTracks.findIndex(element => 
      element.id === track.id
    );

    playlistTracks.splice(index, 1);

    this.setState({
      playlistTracks: playlistTracks
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onSave={this.savePlaylist} onRemove={this.removeTrack} onNameChange={this.changePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

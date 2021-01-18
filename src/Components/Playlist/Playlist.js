import React from 'react';
import './Playlist.css';
import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {

    constructor(props) {
        super(props);
        
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(e) {
        const value = e.target.value;
        this.onNameChange(value);
    }

    render () {
        return (
            <div className="Playlist">
                <input defaultValue={'New Playlist'} value={this.props.playlistName} onNameChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}
/* Notes: 

Context: used when data needs to be accessible by many components at different nesting levels 
Provider: allows components to subscribe to context changes 

*/

import React from "react"
import { PlayerStore } from './PlayerStore'

// defines type
type PlayerContextValue = {
    playerStore: PlayerStore
}

// defines context 
const PlayerContext = React.createContext<PlayerContextValue>({} as PlayerContextValue)

// initialize store
const playerStore = new PlayerStore() 

// exports context provider 
export const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    return (
        <PlayerContext.Provider value ={{ playerStore }}>
            {children}
        </PlayerContext.Provider>
    );
};

// defines helper hook
export const usePlayerStore = () => React.useContext(PlayerContext)

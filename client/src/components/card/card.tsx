import React from "react"
import { CardStore } from './CardStore'

// define type for context value
type CardContextValue = {
    cardStore: CardStore
}

// define context 
const CardContext = React.createContext<CardContextValue>({} as CardContextValue)

// initialize store
const cardStore = new CardStore() 

// export context provider 
export const CardProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    return (
        <CardContext.Provider value ={{ cardStore }}>
            {children}
        </CardContext.Provider>
    );
};

// define helper hook
export const useCardStore = () => React.useContext(CardContext)
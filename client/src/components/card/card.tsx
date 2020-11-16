/* Notes: 

Context: used when data needs to be accessible by many components at different nesting levels 
Provider: allows components to subscribe to context changes 

*/

import React from "react"
import { CardStore } from './CardStore'

// defines type for context value 
// note: typescript allows classes as types
type CardContextValue = {
    cardStore: CardStore
}

// defines context with React.createContext
// pass in type argument and default value {}
const CardContext = React.createContext<CardContextValue>({} as CardContextValue)

// initialize store
const cardStore = new CardStore() 

// exports context provider 
/* A Note on Syntax: 
    - we are annotating function type: "This variable holds a function: React Functional Component"
    - child is of type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
*/
export const CardProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    return (
        <CardContext.Provider value ={{ cardStore }}>
            {children}
        </CardContext.Provider>
    );
};

// defines helper hook
/*
useContext: 
    - accepts a context object (the value returned from React.createContext) 
    - returns current context value for that context
    - current context value is determined by the value prop of the nearest 
      <MyContext.Provider> above the calling component in the tree

When the nearest <MyContext.Provider> above the component updates, 
this Hook will trigger a rerender with the latest context value passed to that 
MyContext provider. 
*/
export const useCardStore = () => React.useContext(CardContext)
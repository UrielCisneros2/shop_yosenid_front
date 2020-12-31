import React, { useState } from 'react';

const StepsContext = React.createContext([() => {}]);

const StepsProvider = props => {
    //define el state inicial
    const [ disabled, setDisabled ] = useState(true)

    return (
        <StepsContext.Provider value={[disabled, setDisabled]}>
            {props.children}
        </StepsContext.Provider>
    )
}
export { StepsContext, StepsProvider };
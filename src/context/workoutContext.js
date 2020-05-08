import React from 'react';

const WorkoutContext = React.createContext({});

export const WorkoutProvider = WorkoutContext.Provider;
export const WorkoutConsumer = WorkoutContext.Consumer;
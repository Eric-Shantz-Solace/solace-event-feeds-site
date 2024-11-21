import React, { createContext, useState } from 'react';

// Create the context object to hold the Solace Session
export const SessionContext = createContext();

// Create a Provider component to wrap the app and provide the context values
export const SolaceSession = ({ children }) => {
  const [session, setSession] = useState(null);
  const [sessionProperties, setSessionProperties] = useState({});
  const [isAnyEventRunning, setIsAnyEventRunning] = useState(false);
  const [streamedEvents, setStreamedEvents] = useState([]);
  const [subscribedTopicString, setSubscribedTopicString] = useState("");
  const [publishedTopicString, setPublishedTopicString] = useState("");
  const [activeTab, setActivetab] = useState(localStorage.getItem("LastActiveTab") ? JSON.parse(localStorage.getItem("LastActiveTab"))  : "demo" );
  const [activeDataChip, setActiveDataChip] = useState(localStorage.getItem("LastActiveDataChip") ? JSON.parse(localStorage.getItem("LastActiveDataChip"))  : "car_maker" );
  const [columnData, setColumnData] = useState([]);
  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        sessionProperties,
        setSessionProperties,
        isAnyEventRunning,
        setIsAnyEventRunning,
        streamedEvents,
        setStreamedEvents,
        subscribedTopicString,
        setSubscribedTopicString,
        publishedTopicString,
        setPublishedTopicString,
        activeTab,
        setActivetab,
        activeDataChip,
        setActiveDataChip,
        columnData,
        setColumnData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

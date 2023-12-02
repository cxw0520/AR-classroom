import React from 'react'
import { Routes, Route, useMatch  } from "react-router-dom";

import PendingQuestionRoute from './PendingQuestionRoute';
import QuestionResultsRoute from './QuestionResultsRoute';
import FinalResultsRoute from './FinalResultsRoute';
import CurrentQuestionRoute from './CurrentQuestionRoute';


const HostRoute = () => {
  let { url, path } = useMatch();
  
  return (
    <Routes base>
      <Route path={`${path}/questions/pending`} element={<PendingQuestionRoute/>} parentUrl={url}/>
      <Route path={`${path}/questions/current`} element={<CurrentQuestionRoute />} parentUrl={url}/>
      <Route path={`${path}/results/final`} element={<FinalResultsRoute />} parentUrl={url}/>
      <Route path={`${path}/results/:questionId`} element={<QuestionResultsRoute />} parentUrl={url}/>
    </Routes>
  );
}

export default HostRoute

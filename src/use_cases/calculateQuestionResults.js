import GameStore from '../store/GameStore';
import AnswerStore from '../store/AnswerStore';

const calculateQuestionResults = (gameId, questionId, gameStore = new GameStore(), answerStore = new AnswerStore()) => {
  gameStore.update(gameId, { state: 'showingQuestionResults' });
  return answerStore
    .list({ gameId, questionId })
    .then(answers => {
      
      let results = { 'A': [], 'B': [], 'C': [], 'D': []};

      const latestAnswers = answers.reduce((acc, answer) => {
        if (!acc[answer.playerName] || answer.timestamp > acc[answer.playerName].timestamp) {
          acc[answer.playerName] = answer;
        }
        return acc;
      }, {});

      Object.values(latestAnswers).forEach(answer => {
        results[answer.choice] = results[answer.choice].concat(answer.playerName);
      });

      return results;
    });
}

export default calculateQuestionResults;

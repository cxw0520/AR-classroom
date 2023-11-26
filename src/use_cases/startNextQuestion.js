import GameStore from '../store/GameStore';
import QuestionStore from '../store/QuestionStore';

const startNextQuestion = async (gameId, currentQuestionIndex = 0) => {
  const gameStore = new GameStore();
  const questionStore = new QuestionStore();

  let game;
  try {
    game = await gameStore.get(gameId);
  } catch (error) {
    // Handle error
  }

  if (game) {
    gameStore.update(gameId, { state: 'pendingQuestion' });

    if ('currentQuestion' in game) {
      return questionStore.get(game.currentQuestion);
    } else {
      const questionArray = await questionStore.list({
        gameId,
        from: currentQuestionIndex,
        limit: 1,
      });
      var question = questionArray[0];

      if (question) {
        gameStore.update(gameId, { currentQuestionId: question.id, currentQuestionIndex: currentQuestionIndex + 1 });
      } else {
        // No more questions, reset the current question index and start over
        gameStore.update(gameId, { currentQuestionIndex: 0 });
        currentQuestionIndex = 0;
        question = await startNextQuestion(gameId, currentQuestionIndex);
      }
      

      return question;
    }
  } else {
    return;
  }
};

export default startNextQuestion;
import AnswerStore from '../store/AnswerStore';

/**
 * Calculates the final scores for a game, considering only the most recent answer
 * per question for each player. Each player's score is the sum of correct answers
 * from their most recent attempt for each question.
 *
 * @param {string} gameId - The ID of the game.
 * @returns {Promise<Object>} - An object mapping player names to their scores.
 */
const calculateFinalResults = (gameId) => {
  const answerStore = new AnswerStore();

  return answerStore.list({ gameId })
    .then(answers => {
      // Reduce the answers to the most recent answer per player per question
      const mostRecentAnswers = answers.reduce((acc, answer) => {
        const playerRef = answer.player.path; // Assuming the player reference has a path property
        const questionRef = answer.question.path; // Assuming the question reference has a path property
        const key = `${playerRef}-${questionRef}`;

        if (!acc[key] || acc[key].timestamp < answer.timestamp) {
          acc[key] = answer;
        }

        return acc;
      }, {});

      // Calculate the final scores using the most recent answers
      const finalScores = {};

      Object.values(mostRecentAnswers).forEach(answer => {
        // Extract playerName from the answer object. Replace 'playerName' with the actual property name if different.
        const playerName = answer.playerName;

        if (!finalScores[playerName]) {
          finalScores[playerName] = 0;
        }

        if (answer.isCorrect) {
          finalScores[playerName]++;
        }
      });

      return finalScores;
    });
};

export default calculateFinalResults;

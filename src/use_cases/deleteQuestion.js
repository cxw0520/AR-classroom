import { doc, deleteDoc } from "firebase/firestore";
import firebase from "../utils/firebase";


const deleteQuestion = async (questionId, gameId) => {
    
    const db = firebase.firestore();
    
    try {
        await deleteDoc(doc(db, 'games', gameId, 'questions', questionId))
        window.location.reload();
    } catch (error) {
        throw new Error('Error deleting question: ' + error.message);
    }
};

export default deleteQuestion;

import { doc, deleteDoc } from "firebase/firestore";
import firebase from "../utils/firebase";
import { useParams } from "react-router-dom"


const lastParam = window.location.href.lastIndexOf("/") + 1;
const gameId =  window.location.href.substring(lastParam);
//console.log("gameId:", gameId);
const deleteQuestion = async (questionId) => {

    const db = firebase.firestore();
    
    try {
        await deleteDoc(doc(db, 'games', gameId, 'questions', questionId))
        window.location.reload();
    } catch (error) {
        throw new Error('Error deleting question: ' + error.message);
    }
};

export default deleteQuestion;

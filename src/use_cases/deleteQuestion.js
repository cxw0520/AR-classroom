import { doc, deleteDoc } from "firebase/firestore";
import firebase from "../utils/firebase";

const currentUrl = window.location.href;
//console.log("u:", currentUrl);
const parsedURL = new URL(currentUrl);
const path = parsedURL.pathname;
const segments = path.split('/');
const gameId = segments[segments.length - 1];
console.log("gameId:", gameId);

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

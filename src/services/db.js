import { getFirestore, collection, addDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export const registerChild = async (childData) => {
    try {
        const docRef = await addDoc(collection(db, "registrations"), {
            ...childData,
            createdAt: new Date()
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

export const deleteChild = async (id) => {
    try {
        await deleteDoc(doc(db, "registrations", id));
        return { success: true };
    } catch (e) {
        console.error("Error deleting document: ", e);
        return { success: false, error: e };
    }
};

export const addAnimator = async (animatorData) => {
    try {
        const docRef = await addDoc(collection(db, "animators"), {
            ...animatorData,
            createdAt: new Date()
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding animator: ", e);
        return { success: false, error: e };
    }
};

export const deleteAnimator = async (id) => {
    try {
        await deleteDoc(doc(db, "animators", id));
        return { success: true };
    } catch (e) {
        console.error("Error deleting animator: ", e);
        return { success: false, error: e };
    }
};

export const getByCollection = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data };
    } catch (e) {
        console.error(`Error getting ${collectionName}: `, e);
        return { success: false, error: e };
    }
};

export const addGroup = async (groupData) => {
    try {
        const docRef = await addDoc(collection(db, "groups"), {
            ...groupData,
            createdAt: new Date()
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding group: ", e);
        return { success: false, error: e };
    }
};

export const deleteGroup = async (id) => {
    try {
        await deleteDoc(doc(db, "groups", id));
        return { success: true };
    } catch (e) {
        console.error("Error deleting group: ", e);
        return { success: false, error: e };
    }
};

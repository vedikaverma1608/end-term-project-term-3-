import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";

const eventsCollection = collection(db, "events");

export const createEvent = async (eventData) => {
  const docRef = await addDoc(eventsCollection, {
    ...eventData,
    createdAt: new Date(),
    attendees: []
  });
  return docRef.id;
};

export const updateEvent = async (id, eventData) => {
  const eventRef = doc(db, "events", id);
  await updateDoc(eventRef, eventData);
};

export const deleteEvent = async (id) => {
  const eventRef = doc(db, "events", id);
  await deleteDoc(eventRef);
};

export const getEvents = async (filters = {}) => {
  let q = query(eventsCollection, orderBy("createdAt", "desc"));
  
  if (filters.category) {
    q = query(q, where("category", "==", filters.category));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEvent = async (id) => {
  const eventRef = doc(db, "events", id);
  const snapshot = await getDoc(eventRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const joinEvent = async (eventId, userId) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    attendees: arrayUnion(userId)
  });
};

export const leaveEvent = async (eventId, userId) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    attendees: arrayRemove(userId)
  });
};

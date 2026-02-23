// addRating.js
import { db } from "../../mockData/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ratingsRef = collection(db, "platformRatings");

type PlatformRatingType = {
  rating: number;
  userId: string;
};
// CREATE
export async function createRating(data: PlatformRatingType) {
  //console.log("Alo");
  const res = await addDoc(ratingsRef, {
    ...data,
    createdAt: new Date(),
  });
  //console.log("Response: ", res);
  return res.id;
}

// READ
export async function getAllRatings() {
  const snapshot = await getDocs(ratingsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// UPDATE
export async function updateRating(id: string, data: PlatformRatingType) {
  const ratingDoc = doc(db, "platformRatings", id);
  await updateDoc(ratingDoc, data);
}

// DELETE
export async function deleteRating(id: string) {
  const ratingDoc = doc(db, "platformRatings", id);
  await deleteDoc(ratingDoc);
}

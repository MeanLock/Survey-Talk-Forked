// // addRating.js
// import type { CreateRatingType, RatingType } from "@/core/types";
// import { db } from "../../mockData/firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";

// const ratingsRef = collection(db, "ratings");

// // CREATE
// export async function createRating(data: CreateRatingType) {
//   const res = await addDoc(ratingsRef, {
//     ...data,
//     createdAt: new Date(),
//   });
//   return res.id;
// }

// // READ
// export async function getAllRatings() {
//   const snapshot = await getDocs(ratingsRef);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// // UPDATE
// export async function updateRating(id: string, data: RatingType) {
//   const ratingDoc = doc(db, "ratings", id);
//   await updateDoc(ratingDoc, data);
// }

// // DELETE
// export async function deleteRating(id: string) {
//   const ratingDoc = doc(db, "ratings", id);
//   await deleteDoc(ratingDoc);
// }

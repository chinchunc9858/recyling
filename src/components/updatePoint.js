// src/components/updatePoint.js
import { db } from "./firebase"; // Import the initialized db
import { addDoc, collection, getDocs } from "firebase/firestore";

// Function to update points
const updatePoints = async (isRecyclable, description) => {
  try {
    let points = 0; // Assign points if recyclable
    console.log(isRecyclable);
    if (isRecyclable) {
        points = 10;
        console.log("ran");
    }
    
    console.log(points);
    // Store new entry in Firestore
    await addDoc(collection(db, "users"), {
      timestamp: new Date(),
      points: points
    });

    console.log("Points updated successfully:", points);
  } catch (error) {
    console.error("Error updating points:", error);
  }
};

// Function to get total points
const getTotalPoints = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    let totalPoints = 0;
    querySnapshot.forEach((doc) => {
      totalPoints += doc.data().points || 0;
    });

    return totalPoints;
  } catch (error) {
    console.error("Error fetching total points:", error);
    return 0;
  }
};

export { updatePoints, getTotalPoints };
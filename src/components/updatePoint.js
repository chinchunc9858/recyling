// src/components/updatePoint.js
import { db } from "./firebase"; // Import the initialized db
import { addDoc, collection, getDocs } from "firebase/firestore";

// Function to update points
const updatePoints = async (isRecyclable, description, optionChosen) => {
  console.log(description);
  if (isRecyclable != optionChosen) {
    console.log("incorrect");
    const audio = new Audio('/sfx/Incorrect.mp3');
    audio.play();
    return;
  }

  try {
    let points = 10;
    
    console.log(points);
    
    await addDoc(collection(db, "users"), {
      timestamp: new Date(),
      points: points
    });

    const audio = new Audio('/sfx/Correct.mp3');
    audio.play();

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
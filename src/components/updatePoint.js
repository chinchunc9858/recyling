let score = 0;
 function updateScore(isRecyclable){
    if (isRecyclable){
        score += 10;
    }
    else {
        console.log("This item is not recyclable");
    }
 }
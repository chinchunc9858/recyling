
let points = 0;

function updatePoints(props){
    const [isRecyclable, Description] = props;
    if (isRecyclable){
        points += 10;
        console.log(points);
    }
    else {
        console.log("This item is not recyclable");
    }
}
export default updatePoints
const modal = document.querySelector(".modal");
document.getElementById("open_modal").addEventListener("click", ()=> {
    // var question = document.getElementById("question").value;
    // var answer = document.getElementById("answer").value;
    // var difficulty = document.getElementById("difficulty").value;
    // var category = document.getElementById("category").value;
    // var data = {
    //     "question": question,
    //     "answer": answer,
    //     "difficulty": difficulty,
    //     "category": category
    // };
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "/api/questions", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify(data));
    // xhr.onload = function() {
    //     if (xhr.status != 201) {
    //         alert(`Error ${xhr.status}: ${xhr.statusText}`);
    //     } else {
    //         alert(`Added question: ${xhr.responseText}`);
    //     }
    // };
    // console.log(data);
    modal.showModal();
});
document.getElementById("close_modal").addEventListener("click", ()=> {
    modal.close();
})
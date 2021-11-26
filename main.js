function init() {
    document.querySelector('.game').innerHTML = ""
    let random_image = Math.ceil(Math.random() * 10) //for image sets
    let random_box = []

    while (random_box.length < 9) {
        let random_order = Math.ceil(Math.random() * 9)
        if (!random_box.includes(random_order)) {
            random_box.push(random_order)
        }
    }
    random_box.forEach((i, index) => {
        document.querySelector('.game').innerHTML += `
        <img class="piece" data-order="${i}" style="order: ${i}" src="./assets/${random_image}/image_part_00${index + 1}.png" alt="${index + 1}"> `;
    })
}
init()
// game algorithm
let step = 0;
let isMuted = false;
document.querySelector('#mute').addEventListener("click", (e) => {
    isMuted = isMuted ? false : true;
    e.target.classList.toggle("active")
});
document.querySelector(".game").addEventListener("click", (e)=>{
    if(e.target.classList.contains("piece")){
        let selected = document.querySelector('.selected')
        ++step
        if (!selected) {
            e.target.classList.add("selected")
        } else {
            let prev = Number(selected.getAttribute("data-order"));
            let current = Number(e.target.getAttribute("data-order"));
        
            let top = (prev > 3) && (prev - 3); //1,2,3 emas
            let bottom = (prev < 7) && (prev + 3); //7,8,9 emas
            let left = (prev !== 7 && prev !== 4 && prev !== 1) && (prev - 1) //7,4,1 emas
            let right = (prev !== 3 && prev !== 6 && prev !== 9) && (prev + 1) //3,6,9 emas
        
            // console.log(prev, current, top, right, bottom, left);
            if (current === top || current === bottom || current === left || current === right) {
                selected.setAttribute("data-order", current)
                selected.style.order = `${current}`
                selected.classList.remove("selected")
                e.target.setAttribute("data-order", prev)
                e.target.style.order = `${prev}`;
                if (!isMuted) {
                    let audio = new Audio('./assets/sounds/correct.mp3');
                    audio.play();
                }
            } else {
                if (!isMuted) {
                    let audio = new Audio('./assets/sounds/no.mp3');
                    audio.play();
                }
            }
            if (chech_win()) {
                document.querySelector('#try').innerHTML = step;
                step = 0;
                document.querySelector('.win_modal').classList.add("active");//show modal
                let audio = new Audio('./assets/sounds/win.wav');
                audio.play();
            }
        }
    }
});

function chech_win() {
    let answer = true;
    document.querySelectorAll('.piece').forEach((item) => {
        if (Number(item.alt) !== Number(item.style.order)) {
            answer = false
        }
    })
    return answer
}
// show original
document.querySelector('#original').addEventListener("mouseenter", (e) => {
    document.querySelectorAll('.piece').forEach((item) => {
        item.classList.add("original")
    });
    e.target.classList.add("active")
});
document.querySelector('#original').addEventListener("mouseleave", (e) => {
    document.querySelectorAll('.piece').forEach((item) => {
        item.classList.remove("original")
    });
    e.target.classList.remove("active")
});
// close modal
document.querySelector('#close_modal').addEventListener("click", () => {
    document.querySelector('.win_modal').classList.remove("active");
});
// next round
document.querySelector('#next').addEventListener("click", () => {
    init()
});
// 26.11.2021
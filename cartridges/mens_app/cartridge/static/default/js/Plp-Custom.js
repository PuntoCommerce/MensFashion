

/** PLP */

const filterToggle = (toggle) => {
    if (toggle === true) {
        refinementBar.classList.add('refinement-bar--show');
    } else {
        refinementBar.classList.remove('refinement-bar--show');
    }
}


const filters = $C("#filter");
const refinementBar = $C('#refinement-bar');
const closeRefinementBar = $C('#close-refinement-bar');
filters.onclick = () => {
    let toggle = true;
    filterToggle(toggle);
}
closeRefinementBar.onclick = () => {
    let toggle = false;
    filterToggle(toggle);
}